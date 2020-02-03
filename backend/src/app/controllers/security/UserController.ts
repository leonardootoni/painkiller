import { Request, Response } from 'express';
import { UserData, UserQueryData } from '../../util/interfaces/User';
import UserModel from '../../models/security/UserModel';
import { logger } from '../../../services/Logger';
import { ApiControl } from '../../util/interfaces/Application';

/**
 * Controller Class to manage all the application login users.
 * @author: Leonardo Otoni
 */
class UserController implements ApiControl {
  /**
   * List Users Route
   * @param req
   * @param res
   */
  public async index(req: Request, res: Response): Promise<Response> {
    const data: object = await UserModel.listUsers({ ...(req.query as UserQueryData) });
    return res.json({ data });
  }

  public async read(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);

    try {
      const user = await UserModel.getUser(id);
      return res.json({ data: { ...user } });
    } catch (error) {
      return res.status(400).json({ errors: [`User ${id} not found in the Database.`] });
    }
  }

  /**
   * Create new User
   * @param req
   * @param res
   */
  public async store(req: Request, res: Response): Promise<Response> {
    const id: number = await UserModel.createNewUser({ ...(req.body as UserData) });
    return res.json({ data: { user: { id } } });
  }

  /**
   * Update a existing User
   * @param req
   * @param res
   */
  public async update(req: Request, res: Response): Promise<Response> {
    logger.debug('Update User ');
    const userData = { ...(req.body as UserData) };
    const { id } = req.params;
    await UserModel.updateUser(parseInt(id, 10), userData);
    return res.json();
  }

  /**
   * Delete a user
   * @param req
   * @param res
   */
  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    UserModel.deleteUser(parseInt(id, 10));
    return res.json();
  }
}

export default new UserController();
