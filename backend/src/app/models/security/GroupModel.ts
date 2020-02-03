import { getConnection, getManager } from 'typeorm';
import {
  GroupQueryData,
  GroupData,
  GroupResourceOperation,
  GroupResourceData,
  GroupUserData,
  GroupResourcePermissionsData,
  GroupUserOperation,
} from '../../util/interfaces/Group';

import Group from '../../entity/Group';
import GroupUser from '../../entity/GroupUser';

import { logger } from '../../../services/Logger';
import User from '../../entity/User';
import GroupResource from '../../entity/GroupResource';
import Resource from '../../entity/Resource';
import AuthorizationCache from '../../../services/AuthorizationCache';
/**
 * Group Business Model.
 */
class GroupModel {
  /**
   * List and count all data
   * @param groupData - Group filter criteria
   */
  public async listGroups(groupData: GroupQueryData): Promise<[Group[], number]> {
    let filter = '';
    const params: { [k: string]: string | boolean } = {};
    const { name, blocked, limit, offset } = groupData;

    if (name) {
      filter += 'lower(g.name) like :name';
      params.name = `${String(name).toLocaleLowerCase()}%`;
    }

    if (blocked !== undefined) {
      filter += filter !== '' ? ' and blocked=:blocked' : 'blocked= :blocked';
      params.blocked = blocked;
    }

    const data = await getConnection()
      .createQueryBuilder()
      .select(['g.id', 'g.name', 'g.blocked'])
      .from(Group, 'g')
      .take(limit)
      .skip(offset)
      .where(filter, params)
      .getManyAndCount();

    logger.debug(`Fetched: ${data[0].length} from ${data[1]} groups`);
    return data;
  }

  /**
   * Fetch a group and their associations (Users & Resources )
   * @param id
   */
  public async fetchGroupById(id: number): Promise<GroupData> {
    const group = await getConnection()
      .getRepository(Group)
      .createQueryBuilder('g')
      .select([
        'g.id',
        'g.name',
        'g.blocked',
        'g.description',
        'u.id',
        'u.name',
        'u.email',
        'gr.id',
        'gr.write',
        'gr.update',
        'gr.delete',
        'r.id',
        'r.name',
      ])
      .leftJoinAndSelect('g.groupUsers', 'gu')
      .leftJoin('gu.user', 'u')
      .leftJoin('g.groupResources', 'gr')
      .leftJoin('gr.resource', 'r')
      .where('g.id= :id', { id })
      .getOne();

    if (!group) {
      throw new Error('Impossible to fetch group data.');
    }

    return this.groupDataBuilder(group);
  }

  /**
   * Build a GroupData Object from a fetched Group and their associations
   * @param group
   */
  private async groupDataBuilder(group: Group): Promise<GroupData> {
    // Build response object
    const users = group.groupUsers.map(gu => {
      const { id, name, email } = gu.user;
      const user: GroupUserData = {
        id,
        name,
        email,
      };
      return user;
    });

    const resources = group.groupResources.map(gr => {
      const permissions: GroupResourcePermissionsData = {
        write: gr.write,
        update: gr.update,
        del: gr.delete,
      };

      const resource: GroupResourceData = {
        id: gr.resource.id,
        name: gr.resource.name,
        permissions,
      };
      return resource;
    });

    const groupData: GroupData = {
      id: group.id,
      name: group.name,
      blocked: group.blocked,
      description: group.description,
      users,
      resources,
    };

    return groupData;
  }

  /**
   * Validate incoming data for update operations.
   * @param groupData
   */
  public async validateUpdateOperation(groupData: GroupData): Promise<[boolean, string | null]> {
    const group = await getConnection()
      .getRepository(Group)
      .findOneOrFail(groupData.id);

    if (groupData.name !== group.name) {
      const [nameAlreadyInUse, message] = await this.groupNameExists(groupData.name);
      if (nameAlreadyInUse) {
        logger.debug(`Group name ${groupData.name} is already in use.`);
        return [false, message];
      }
    }

    // const { users, resources } = groupData;
    // if (users) {
    //   const usersToInsert = users.filter(user => !user.del).map(user => user.id);
    //   if (usersToInsert.length > 0) {
    //     const existingUsers = await getConnection()
    //       .getRepository(GroupUser)
    //       .createQueryBuilder()
    //       .select('user_id')
    //       .where('group_id=:groupId and user_id in (:...userIds)', {
    //         groupId: groupData.id,
    //         userIds: usersToInsert,
    //       })
    //       .getCount();

    //     if (existingUsers > 0) {
    //       logger.debug(
    //         `Group Validation failed - ${existingUsers} already exists in group ${groupData.name}.`
    //       );
    //       return [
    //         false,
    //         'One or more users are already associated with this group. Operation aborted.',
    //       ];
    //     }
    //   }
    // }

    // Validation rules passed
    return [true, null];
  }

  /**
   * Verifies whether a given group name is already in use or not.
   * It will return true in case of a group name have been used.
   * @param groupName
   * @returns boolean informing that a group exists or not
   * @returns string having a message text or
   * null when a group do not exists.
   */
  public async groupNameExists(groupName: string): Promise<[boolean, string | null]> {
    const group = await getConnection()
      .getRepository(Group)
      .count({ name: groupName });
    const message = group > 0 ? 'Group name alredy in use. Choose another one.' : null;
    return [group > 0, message];
  }

  /**
   * Create a new Security group and their associations.
   * @param groupData
   * @returns Group with generated id.
   */
  public async createGroup(groupData: GroupData): Promise<Group> {
    const group = new Group();
    group.name = groupData.name;
    group.blocked = groupData.blocked || false;
    group.description = groupData.description;

    await getManager().transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(group);

      const { users } = groupData;
      if (users && users.length > 0) {
        // Create user's associations.
        const groupUser = users.map(gu => {
          const user = new User();
          user.id = gu.id;
          return {
            user,
            group,
          };
        });

        // Performs user's bulk insert
        await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into(GroupUser)
          .values(groupUser)
          .execute();
      }

      const { resources } = groupData;
      if (resources && resources.length > 0) {
        // Create Resource's associations
        const groupResources = resources.map(r => {
          const groupResource = new GroupResource();
          const resource = new Resource();
          resource.id = r.id;
          groupResource.group = group;
          groupResource.resource = resource;
          groupResource.write = r.permissions.write;
          groupResource.update = r.permissions.update;
          groupResource.delete = r.permissions.del;
          return groupResource;
        });

        // Performs GroupResource's bulk insert
        await transactionalEntityManager
          .createQueryBuilder()
          .insert()
          .into(GroupResource)
          .values(groupResources)
          .execute();
      }
    });

    /**
     * Group create operation: Must update Authorization cache if resources or users are manipulated
     * along with this transaction
     */
    if (groupData.users && groupData.resources) {
      await AuthorizationCache.loadAuthorizationRoles();
      logger.debug('Authorization Cache updated.');
    }

    logger.debug(`Group ${group.name} successfully created.`);
    return group;
  }

  /**
   * Update a group and their respective associations when informed.
   * @param groupData
   * @returns [true, null] if the update process was done ok, otherwise [false, string] containing
   * a validation error message
   */
  public async updateGroup(groupData: GroupData): Promise<void> {
    // Aux group, to help in the GroupUser composistion
    const group = await getConnection()
      .getRepository(Group)
      .findOneOrFail({ where: { id: groupData.id } });
    group.name = groupData.name;
    group.blocked = groupData.blocked || false;
    group.description = groupData.description;

    const [newUsers, delUsers] = groupData.users
      ? await this.extractUserOperationsFromGroupData(group, groupData.users)
      : [[], []];

    const [newResources, updateResources, delResources] = groupData.resources
      ? await this.extractResourcesOperationsFromGroupData(group, groupData.resources)
      : [[], [], []];

    // Start a new DB Transaction before execute all db operations.
    await getManager().transaction(async transationEntityManager => {
      // Perform db operations for groups users associations
      if (delUsers.length > 0) {
        await transationEntityManager
          .createQueryBuilder()
          .delete()
          .from(GroupUser)
          .where('user_id in (:...ids)', { ids: [...delUsers] })
          .execute();
      }

      if (newUsers.length > 0) {
        await transationEntityManager
          .createQueryBuilder()
          .insert()
          .into(GroupUser)
          .values(newUsers)
          .execute();
      }

      if (newResources.length > 0) {
        await transationEntityManager
          .createQueryBuilder()
          .insert()
          .into(GroupResource)
          .values(newResources)
          .execute();
      }

      if (updateResources.length > 0) {
        updateResources.forEach(async r => {
          await transationEntityManager
            .createQueryBuilder()
            .update(GroupResource)
            .set({
              write: r.permissions.write,
              update: r.permissions.update,
              delete: r.permissions.del,
            })
            .where('group_id=:groupId and resource_id=:resourceId', {
              groupId: group.id,
              resourceId: r.id,
            })
            .execute();
        });
      }

      if (delResources.length > 0) {
        await transationEntityManager
          .createQueryBuilder()
          .delete()
          .from(GroupResource)
          .where('group_id = :groupId and resource_id in (:...resourceIds)', {
            groupId: group.id,
            resourceIds: delResources,
          })
          .execute();
      }

      await transationEntityManager.getRepository(Group).save(group);
    });

    /**
     * Group update operation: Must update Authorization cache if resources or users are manipulated
     * in a group update operation
     */
    if (groupData.users || groupData.resources) {
      await AuthorizationCache.loadAuthorizationRoles();
      logger.debug('Authorization Cache updated.');
    }
  }

  /**
   * Helper method to extract logical GroupResource, GroupResourceData and number[] data in order to
   * support Insert, Update and delete operations of GroupResource
   * @param group - Group Entity to be assiated within GroupUser Entities
   * @param resources - GroupResourceData[] having GroupResource data
   * @returns GroupResource[] having all new associations to be created, GroupResourceData[] having
   * all filtered data to be updated and number[] havig all GroupResource ids to be deleted.
   */
  private async extractResourcesOperationsFromGroupData(
    group: Group,
    resources: GroupResourceData[]
  ): Promise<[GroupResource[], GroupResourceData[], number[]]> {
    const newResources = resources
      .filter(r => r.operation === GroupResourceOperation.Create)
      .map(r => {
        const resource = new Resource();
        resource.id = r.id;
        const groupResource = new GroupResource();
        groupResource.group = group;
        groupResource.resource = resource;
        groupResource.write = r.permissions.write;
        groupResource.update = r.permissions.update;
        groupResource.delete = r.permissions.del;
        return groupResource;
      });

    const updateResources = resources.filter(r => r.operation === GroupResourceOperation.Update);

    const delResources = resources
      .filter(r => r.operation === GroupResourceOperation.Delete && r.id)
      .map(r => r.id || 0);

    return [newResources, updateResources, delResources];
  }

  /**
   * Helper method to extract logical GroupUser data in order to support Insert and delete
   * operations of Users into GroupUser
   * @param group - Group Entity to be assiated within GroupUser Entities
   * @param users - GroupUserData[] having GroupUser data
   * @returns An array of GroupUser having all new users to be associated with a given group and a
   * list of userId to be removed from a Group
   */
  private async extractUserOperationsFromGroupData(
    group: Group,
    users: GroupUserData[]
  ): Promise<[GroupUser[], number[]]> {
    const newUsers = users
      .filter(user => user.operation === GroupUserOperation.Create)
      .map<GroupUser>(user => {
        const newUser = new User();
        newUser.id = user.id;
        const gu = new GroupUser();
        gu.group = group;
        gu.user = newUser;
        return gu;
      });

    const delUsers = users
      .filter(user => user.operation === GroupUserOperation.Delete)
      .map(user => user.id);

    return [newUsers, delUsers];
  }

  /**
   * Delete a group from Database including its all associations.
   * @param id - Security Group Id
   */
  public async deleteGroupById(id: number): Promise<void> {
    await getManager().transaction(async transactionEntityManager => {
      await Promise.all([
        // Step1 - Remove GroupUser associations
        transactionEntityManager
          .getRepository(GroupUser)
          .createQueryBuilder()
          .delete()
          .where('group_id=:id', { id })
          .execute(),
        // Step2 - Remove GroupResource associations
        transactionEntityManager
          .getRepository(GroupResource)
          .createQueryBuilder()
          .delete()
          .where('group_id=:id', { id })
          .execute(),
      ]);

      // Step3 - Remove Group
      await transactionEntityManager
        .getRepository(Group)
        .createQueryBuilder()
        .delete()
        .where('id=:id', { id })
        .execute();
    });

    logger.debug(`Group ${id} successfully deleted.`);

    /**
     * Group delete operation: Must update Authorization cache if resources or users are deleted.
     */
    await AuthorizationCache.loadAuthorizationRoles();
    logger.debug('Authorization Cache updated.');
  }
}

export default new GroupModel();
