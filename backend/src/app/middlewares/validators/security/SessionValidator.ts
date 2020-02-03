import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';

import { Login } from '../../../util/interfaces/Session';

const schema: Yup.ObjectSchema<Login> = Yup.object().shape<Login>({
  email: Yup.string()
    .required()
    .email(),
  password: Yup.string()
    .required()
    .min(6),
});

/**
 * Session Request entry point validator. It follows the same naming convention from Controller
 * classes.
 * @author Leonardo Otoni
 */
class SessionValidator {
  public async store(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    const userData: Login = { ...req.body };

    try {
      await schema.validate(userData, { abortEarly: false });
    } catch (error) {
      return res.status(400).json(error.errors);
    }

    return next();
  }
}

export default new SessionValidator();
