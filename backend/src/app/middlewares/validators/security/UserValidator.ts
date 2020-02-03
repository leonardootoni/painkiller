import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';

import { getConnection } from 'typeorm';
import { UserData, UserQueryData, UserQuery } from '../../../util/interfaces/User';
import UserRepository from '../../../repository/UserRepository';
import { logger } from '../../../../services/Logger';

const indexSchema: Yup.ObjectSchema<UserQueryData> = Yup.object().shape<UserQueryData>({
  id: Yup.number(),
  name: Yup.string().min(3),
  email: Yup.string().min(3),
  limit: Yup.number()
    .required()
    .max(20),
  offset: Yup.number().required(),
});

const readSchema: Yup.ObjectSchema<UserQuery> = Yup.object().shape<UserQuery>({
  id: Yup.number().required(),
});

const storeSchema: Yup.ObjectSchema<UserData> = Yup.object().shape<UserData>({
  name: Yup.string()
    .required()
    .max(50),
  email: Yup.string()
    .required()
    .email()
    .max(50),
  password: Yup.string()
    .required()
    .min(8)
    .max(20),
  confirmPassword: Yup.string()
    .min(8)
    .max(20)
    .oneOf([Yup.ref('password')], 'Password and Password Confirmation fields do not match.'),
  blocked: Yup.boolean().required(),
});

/**
 * Do not consider user password because it is already encrypted into the database.
 * Password will be changed only through forgotPassword or changePassword Controllers.
 */
const updateSchema: Yup.ObjectSchema<UserData> = Yup.object().shape<UserData>({
  id: Yup.number().required(),
  name: Yup.string()
    .required()
    .max(50),
  email: Yup.string()
    .required()
    .email()
    .max(50),
  password: Yup.string().max(20),
  confirmPassword: Yup.string().when('password', {
    is: password => password !== undefined && password !== '',
    then: Yup.string()
      .required()
      .min(8)
      .max(20)
      .oneOf([Yup.ref('password')], 'Password field does not match with Confirmation Password.'),
  }),
  blocked: Yup.boolean().required(),
});

const deleteSchema: Yup.ObjectSchema = Yup.object().shape({
  id: Yup.number().required(),
});

/**
 * User APIs Validator
 *
 * @method index  - Validate Get Requests to list paginated data
 * @method read   - Validate Get Requests to fetch an entity or associated data
 * @method store  - Validate Post Requests to create new data
 * @method update - Validate Pust Requests to update an existing data
 * @method delete - Validate Delete Requests to delete an existing data
 *
 * @author Leonardo Otoni
 */
class UserValidator {
  public async index(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const userData: UserQueryData = { ...(req.query as UserQueryData) };

    try {
      await indexSchema.validate(userData, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    return next();
  }

  public async read(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      await readSchema.validate(req.params, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    return next();
  }

  /**
   * [Post] /users Validator
   * @param req
   * @param res
   * @param next
   */
  public async store(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const userData: UserData = { ...(req.body as UserData) };
    userData.blocked = false; // Always considers a new user as blocked=false

    try {
      await storeSchema.validate(userData, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    const userExists = await getConnection()
      .getCustomRepository(UserRepository)
      .doesUserEmailExists(userData.email);
    if (userExists) {
      return res.status(400).json({ errors: ['User email is alredy in use.'] });
    }

    return next();
  }

  /**
   * [Update] /users Validator
   * @param req
   * @param res
   * @param next
   */
  public async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    logger.debug(`Will validate user update`);
    const userData = { ...(req.body as UserData) };
    try {
      userData.id = parseInt(req.params.id, 10);
      await updateSchema.validate(userData, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ errors: error.errors });
    }

    if (
      await getConnection()
        .getCustomRepository(UserRepository)
        .doesUserEmailExists(userData.email, userData.id)
    ) {
      return res.status(400).json({ errors: ['Email already exists'] });
    }

    return next();
  }

  /**
   * [Delete] /users Validator
   * @param req
   * @param res
   * @param next
   */
  public async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    logger.debug('[Delete] /users - Validator');

    try {
      await deleteSchema.validate(req.params);
    } catch (error) {
      return res.status(400).json({ errors: [error.message] });
    }

    return next();
  }
}

export default new UserValidator();
