import { Request, Response, NextFunction } from 'express';
import { logger } from '../../services/Logger';

import AuthorizationCache from '../../services/AuthorizationCache';

/**
 * Authorization Middleware
 * Security layer that authorize or not a user request.
 * @author Leonardo Otoni
 */
class Authorization {
  public async authorize(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { userId } = req;

    // Consider urls like /v1/users/4 like /v1/users
    const path =
      req.path.lastIndexOf('/') > 0 ? req.path.substr(0, req.path.lastIndexOf('/')) : req.path;

    const permission = await AuthorizationCache.getUserRolesFromResource(userId, path);
    if (!permission) {
      return res.status(403).json('Forbidden.');
    }

    let authorized: boolean;
    switch (req.method) {
      case 'GET':
        authorized = true; // If has any permission on the cache, so it can be visualized
        break;
      case 'POST':
        authorized = permission.write;
        break;
      case 'PUT':
        authorized = permission.update;
        break;
      case 'PATCH':
        authorized = permission.update;
        break;
      case 'DELETE':
        authorized = permission.del;
        break;
      default:
        authorized = false;
        break;
    }

    if (!authorized) {
      logger.debug(`[${req.method}] Authorization denied to user ${userId} on resource: ${path}`);
      return res.status(403).json('Forbidden.');
    }

    // User is authorized.
    return next();
  }
}

export default new Authorization();
