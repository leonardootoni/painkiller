import { Request, Response } from 'express';

import { Login } from '../../util/interfaces/Session';
import User from '../../entity/User';
import SessionModel from '../../models/security/SessionModel';
import { logger } from '../../../services/Logger';

/**
 * Authentication Controller Class
 * @author Leonardo Otoni
 */
class SessionController {
  /**
   * Perform the User authentication. If the credentials are valid, It will create and return a
   * JSON Web Token having userId as JWT Payload and User{id, name, email} as response.
   * @param req
   * @param res
   */
  public async store(req: Request, res: Response): Promise<Response> {
    const userLogin = { ...(req.body as Login) };

    let user: User;
    try {
      const sm = new SessionModel();
      user = await sm.signUp(userLogin);
    } catch (error) {
      logger.error(error);
      return res.status(400).json({ errors: ['Invalid credentials.'] });
    }

    const { id, name, email, token, permissions } = user;
    return res.json({ data: { user: { id, name, email, permissions }, token } });
  }
}

export default new SessionController();
