import { getCustomRepository } from 'typeorm';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import User from '../../entity/User';
import { logger } from '../../../services/Logger';

import { Login } from '../../util/interfaces/Session';
import { ResourcePermission } from '../../util/interfaces/User';

import UserRepository from '../../repository/UserRepository';
import TokenConfig from '../../../config/AuthConfig';

import AuthorizationCache from '../../../services/AuthorizationCache';

/**
 * Session Business Model
 * @author Leonardo Otoni
 */
export default class SessionModel {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = getCustomRepository(UserRepository);
  }

  /**
   * Authenticate a user against a database record. It will throw an error whether a user is not
   * found or password is not valid.
   * @param userLogin - User email and password credentials
   */
  public async signUp(userLogin: Login): Promise<User> {
    const { email, password } = userLogin;
    const user = await this.userRepository.getUserLoginData(email);
    if (!user) {
      logger.debug(`Signup refused: User ${email} does not exist.`);
      throw new Error('User does not exists');
    }

    if (!(await bcrypt.compare(password, user.hash))) {
      logger.debug(`Signup refused: Invalid password for user ${email}`);
      this.computeInvalidLoginAttempt(user);
      throw new Error('Invalid Password');
    }

    if (user.attempts) {
      this.clearPastInvalidAttempts(user.id);
    }

    try {
      const { id } = user;
      // TODO: Change jwt.sigin() to async
      user.token = jwt.sign({ id }, TokenConfig.secret, { expiresIn: TokenConfig.expiresIn });
    } catch (error) {
      logger.error(`Failed to generate JWT Token to user ${email}`, error);
      throw error;
    }

    const listPermissions: ResourcePermission[] = await AuthorizationCache.getUserRolesByResources(
      user.id
    );
    user.permissions = listPermissions;
    return user;
  }

  /**
   * Register an invalid login attempt. More then 4 attempts will block a user for future logins.
   * @param user - User object with id, email and attempts data.
   */
  private async computeInvalidLoginAttempt(userData: User): Promise<void> {
    logger.debug('Invalid login attempt');
    const { id } = userData;
    const attempts = userData.attempts !== null ? userData.attempts + 1 : 1;
    const blocked = !!(attempts && attempts > 4);
    const lastLoginAttempt = new Date();

    this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ attempts, blocked, lastLoginAttempt })
      .where('id= :id', { id })
      .execute();
  }

  /**
   * Clear previous login attempts and lasLoginAttempt
   * @param userId.
   */
  private async clearPastInvalidAttempts(userId: number): Promise<void> {
    this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ attempts: null, lastLoginAttempt: null })
      .where('id= :id', { id: userId })
      .execute();
  }
}
