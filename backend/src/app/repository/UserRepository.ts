import { EntityRepository, Repository } from 'typeorm';

import User from '../entity/User';
import { logger } from '../../services/Logger';
import { Permission, UserQueryData } from '../util/interfaces/User';

/**
 * User Repository Class
 * @author Leonardo Otoni
 */
@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  /**
   * Fetch a user data by email. This method is strictly used by the authentication process,
   * returning user hash, login atempts and lastLogin date.
   * @param email
   */
  public async getUserLoginData(email: string): Promise<User | undefined> {
    const user = await this.createQueryBuilder()
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.hash',
        'user.attempts',
        'user.lastLoginAttempt',
      ])
      .from(User, 'user')
      .where('user.email = :email and user.blocked=false', { email })
      .getOne();

    return user;
  }

  /**
   * Fetch all users permissions.
   * This method is strictly consumed by Authorization process in order to provide all System's
   * Authorization roles. Users or Groups set as 'Blocked' are automatically excluded.
   */
  public async getUsersPermissions(): Promise<Permission[]> {
    const permissions = (await this.createQueryBuilder()
      .select([
        'u.id as "idUser"',
        'r.name as resource',
        'g.id as "groupId"',
        'gr.write as write',
        'gr.update as update',
        'gr.delete as del',
      ])
      .distinct()
      .from('User', 'u')
      .innerJoin('u.groupsUser', 'gu')
      .innerJoin('gu.group', 'g')
      .innerJoin('g.groupResources', 'gr')
      .innerJoin('gr.resource', 'r')
      .where('u.blocked=false and g.blocked=false')
      .getRawMany()) as Permission[];

    return permissions;
  }

  /**
   * Verify if a given email is already in use
   * Returns true if email alredy exists for a given user. Otherwise, return false.
   * @param email
   * @param userId
   */
  public async doesUserEmailExists(email: string, userId = 0): Promise<boolean> {
    const user = await this.createQueryBuilder()
      .select(['user.email'])
      .from(User, 'user')
      .where('user.email = :email and user.id <> :userId', { email, userId })
      .getOne();

    return user !== undefined;
  }

  /**
   * List users from database
   * @param params
   */
  public async listUsers(userQueryData: UserQueryData): Promise<object> {
    let whereClause = '';

    if (userQueryData.name) {
      whereClause = `lower(name) like '${String(userQueryData.name).toLocaleLowerCase()}%'`;
    }

    if (userQueryData.email) {
      const email = `lower(email) like '${String(userQueryData.email).toLocaleLowerCase()}%'`;
      whereClause += whereClause.length === 0 ? email : ` and ${email}`;
    }

    logger.debug(
      `UserRepository - listUsers: Offset:${userQueryData.offset} - Limit ${userQueryData.limit}`
    );

    const [users, count] = await this.findAndCount({
      select: ['id', 'name', 'email'],
      skip: userQueryData.offset,
      take: userQueryData.limit,
      where: whereClause,
    });
    logger.debug(`Query returned ${users.length} records:`, users);
    return { users, count };
  }

  /**
   * Verifies if a given userId exists in the database
   * @param userId
   */
  public async isUserExist(userId: number): Promise<boolean> {
    const user = await this.createQueryBuilder()
      .select('user.id')
      .from(User, 'user')
      .where('user.id = :userId', { userId })
      .getOne();
    return user !== undefined;
  }
}
