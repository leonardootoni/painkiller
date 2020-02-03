import { Router, Request, Response } from 'express';

import Security from '../middlewares/Security';
import Authorization from '../middlewares/Authorization';

import Pagination from '../middlewares/Pagination';

import SessionValidator from '../middlewares/validators/security/SessionValidator';
import SessionController from '../controllers/security/SessionController';

import UserValidator from '../middlewares/validators/security/UserValidator';
import UserController from '../controllers/security/UserController';

import GroupValidator from '../middlewares/validators/security/GroupValidator';
import GroupController from '../controllers/security/GroupController';

import ResourceValidator from '../middlewares/validators/security/ResourceValidator';
import ResourceController from '../controllers/security/ResourceController';

/**
 * Application Routes Declaration
 * @author Leonardo Otoni
 */
class ApplicationRoutes {
  private routes: Router;

  constructor() {
    this.routes = Router();
  }

  public async getRoutes(): Promise<Router> {
    await this.registerUnprotectedRoutes();
    await this.registerRouterMiddlewares();
    await this.registerProtectedRoutes();
    await this.registerFinalMiddlewares();
    return this.routes;
  }

  private async registerUnprotectedRoutes(): Promise<void> {
    this.routes.post('/session', SessionValidator.store, SessionController.store);
  }

  private async registerRouterMiddlewares(): Promise<void> {
    this.routes.use(Security.checkCredentials);
    this.routes.use(Authorization.authorize);
    this.routes.use(Pagination);
  }

  private async registerProtectedRoutes(): Promise<void> {
    this.routes.get('/users', UserValidator.index, UserController.index);
    this.routes.get('/users/:id', UserValidator.read, UserController.read);
    this.routes.post('/users', UserValidator.store, UserController.store);
    this.routes.put('/users/:id', UserValidator.update, UserController.update);
    this.routes.delete('/users/:id', UserValidator.delete, UserController.delete);

    this.routes.get('/groups', GroupValidator.index, GroupController.index);
    this.routes.get('/groups/:id', GroupValidator.read, GroupController.read);
    this.routes.post('/groups', GroupValidator.store, GroupController.store);
    this.routes.put('/groups/:id', GroupValidator.update, GroupController.update);
    this.routes.delete('/groups/:id', GroupValidator.delete, GroupController.delete);

    this.routes.get('/resources', ResourceValidator.index, ResourceController.index);
  }

  private async registerFinalMiddlewares(): Promise<void> {
    /**
     * Default 404 Route
     */
    this.routes.use(async (req: Request, res: Response) => {
      res.status(404).send({ message: 'Route Not Found.' });
    });
  }
}

export default new ApplicationRoutes().getRoutes();
