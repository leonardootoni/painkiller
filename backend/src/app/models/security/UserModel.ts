import { getConnection } from 'typeorm';
import bcrypt from 'bcryptjs';
import UserRepository from '../../repository/UserRepository';
import User from '../../entity/User';
import { UserData, UserQueryData } from '../../util/interfaces/User';
import { logger } from '../../../services/Logger';

/**
 * User Business Model
 * @author Leonardo Otoni
 */
class UserModel {
  /**
   * Return a paginated list of users
   * @param limit - The max number of records
   * @param offset - The amount of records to skip
   */
  public async listUsers(userQueryData: UserQueryData): Promise<object> {
    const userRepository = getConnection().getCustomRepository(UserRepository);
    return userRepository.listUsers(userQueryData);
  }

  /**
   * Fetch a single user by id
   * @param id User id
   */
  public async getUser(id: number): Promise<object> {
    const user = await getConnection()
      .createQueryBuilder()
      .select(['u.id', 'u.name', 'u.email', 'u.blocked'])
      .from(User, 'u')
      .where('u.id= :id', { id })
      .getOne();

    if (!user) {
      throw new Error('User not found');
    }

    return { user };
  }

  /**
   * Create a new user object with a encrypted password.
   * A new user is always created having blocked status = false
   * @param userData
   */
  public async createNewUser(userData: UserData): Promise<number> {
    const userRepository = getConnection().getCustomRepository(UserRepository);
    const user = new User();
    user.name = userData.name;
    user.email = userData.email;
    user.blocked = false;
    user.hash = await this.createPasswordHash(userData.password || '');
    await userRepository.insert(user);
    logger.debug(`User ${user.email} sucessfully created`);

    return user.id;
  }

  /**
   * Encrypt the user password
   * @param password
   */
  private async createPasswordHash(password: string): Promise<string> {
    return bcrypt.hash(password || '', 8);
  }

  /**
   * Update a existing user
   * @param id - User Id
   * @param userData - User data to update
   */
  public async updateUser(id: number, userData: UserData): Promise<void> {
    const userRepository = getConnection().getCustomRepository(UserRepository);
    const user = new User();
    user.name = userData.name;
    user.email = userData.email;
    user.blocked = userData.blocked;
    if (userData.password) {
      user.hash = await this.createPasswordHash(userData.password || '');
    }

    logger.debug(`Will update user:`, [user]);
    await userRepository.update(id, user);
    logger.debug(`User successfully updated.`);
  }

  /**
   * Delete a user
   * @param id User id to be deleted
   */
  public async deleteUser(id: number): Promise<void> {
    const userRepository = getConnection().getCustomRepository(UserRepository);
    await userRepository.delete(id);
  }
}

export default new UserModel();
