import { getConnection } from 'typeorm';
import { logger } from './Logger';
import { Permission, ResourcePermission } from '../app/util/interfaces/User';
import RedisCache from './util/RedisCache';
import UserRepository from '../app/repository/UserRepository';

/**
 * Application Cache Service.
 * @author Leonardo Otoni
 */
class AuthorizationCache extends RedisCache {
  private readonly cacheKey = 'auth';

  /**
   * Extract all database user roles and save them into a Redis Cache instance.
   */
  public async loadAuthorizationRoles(): Promise<void> {
    logger.debug('Loading authorization roles into cache...');

    const permissions: Permission[] = await getConnection()
      .getCustomRepository(UserRepository)
      .getUsersPermissions();

    await this.delAsync(this.cacheKey);
    permissions.forEach(permission => {
      const { idUser, resource, groupId, write, update, del } = permission;
      this.hsetAsync(
        this.cacheKey,
        `${idUser}:${groupId}:${resource}`,
        JSON.stringify({ write, update, del })
      ).catch(error => {
        logger.error(error);
        throw new Error('Failed to load Authorization into Cache.');
      });
    });

    logger.debug(`${permissions.length} authorization roles successfully cached.`);
  }

  /**
   * Fetch User Role from Redis Instance for a given URL. It returns null if no roles are found.
   * Otherwise, returns a Permission object with all User Permissions for a given Resource.
   * @param idUser - User Id
   * @param resource - URL requested, /users etc.
   */
  public async getUserRolesFromResource(
    idUser: number,
    resource: string
  ): Promise<ResourcePermission | null> {
    /**
     * Returns an array[n] where:
     *  [n0] => "1:1:/groups",
     *  [n1] => "{\"write\":true,\"update\":true,\"del\":true}"
     */
    const [, data] = await this.hscanAsync(this.cacheKey, '0', 'MATCH', `${idUser}:*${resource}`);
    if (data.length === 0) {
      return null;
    }

    // User can have permissions from different groups for a given resource.
    const permissions = data
      .filter((row, index) => index % 2 !== 0) // ignore all Permission keys
      .map<ResourcePermission>(row => JSON.parse(row));

    const permission: ResourcePermission = {
      resource,
      write: permissions.some(p => p.write),
      update: permissions.some(p => p.update),
      del: permissions.some(p => p.del),
    };

    return permission;
  }

  /**
   * Fetch all user permissions grouped by Resources.
   * In situations where a given user have different permissions from many different groups for
   * a same resource, just one true permission wil prevail against all others.
   *
   * From cache:
   * [
   *    {group: 1, resource: '/users', write: true, update: false, del: false},
   *    {group: 2, resource: '/users', write: false, update: true, del: false},
   *    {group: 3, resource: '/users', write: false, update: false, del: true},
   * ]
   *
   * Will return ResourcePermission[{resource: '/users', write: true, update: true, del: true}]
   * @param idUser
   */
  public async getUserRolesByResources(idUser: number): Promise<ResourcePermission[]> {
    const [, data] = await this.hscanAsync(this.cacheKey, '0', 'MATCH', `${idUser}:*:*`);

    /**
     * Create a transformed Map of Permissions. It can have multiple entries for each resource
     * due to the user can be assigned to multiple groups
     */
    const dataMap = new Map<string, ResourcePermission>();
    data.forEach((rowData: string, index: number, dataRef: string[]) => {
      if (index % 2 === 0) {
        // an url can contain parameters like /users/:id/edit
        const resource = rowData.substring(rowData.indexOf('/'));
        const autorization = JSON.parse(dataRef[index + 1]);
        const permission: ResourcePermission = {
          resource,
          write: autorization.write,
          update: autorization.update,
          del: autorization.del,
        };

        if (!dataMap.has(resource)) {
          dataMap.set(resource, permission);
        } else {
          const previousPermission = dataMap.get(resource);
          if (previousPermission) {
            // If a user has any permission = true, they will prevail
            permission.write = permission.write || previousPermission.write;
            permission.update = permission.update || previousPermission.update;
            permission.del = permission.del || previousPermission.del;
          }

          dataMap.set(resource, permission);
        }
      }
    });

    const permissions: ResourcePermission[] = [];
    dataMap.forEach(permission => {
      permissions.push(permission);
    });

    return permissions;
  }
}

export default new AuthorizationCache();
