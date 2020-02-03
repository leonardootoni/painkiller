import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import helmet from 'helmet';
import cors from 'cors';

import log4js from 'log4js';
// import { serverLogger as logger } from './services/Logger';
import Environment from './services/StartupValidator';
import Database from './database';

import AuthorizationCache from './services/AuthorizationCache';
import appRoutes from './app/routes';

/**
 * Application Bootstrap class
 * @author Leonardo Otoni
 */
class App1 {
  private instance: express.Application;

  public constructor() {
    this.instance = express();
  }

  public async startupApp(port: number): Promise<this | undefined> {
    // logger.info('Starting Application...');

    if (!(await Environment.isValid())) {
      this.shutdownApp();
    }

    try {
      await Database.connect();
      await this.loadMiddlewares();
      await AuthorizationCache.loadAuthorizationRoles();

      // logger.info('Loading routes...');
      this.instance.use(await appRoutes);

      this.defaultExceptionHandler();
      this.listen(port);
    } catch (error) {
      // logger.error(error);
      this.shutdownApp();
    }

    return this;
  }

  private shutdownApp(): void {
    // logger.fatal('Server environment is not configured appropriately.');
    // logger.fatal('System halted.');
    log4js.shutdown();
    process.exit(1);
  }

  private async loadMiddlewares(): Promise<void> {
    // logger.info('Loading Security Middlewares...');
    this.instance.use(cors());
    this.instance.use(helmet());
    this.instance.use(express.json());
  }

  /**
   * General Server Exception Handler.
   * WARNING: It has to be declared before all routes and all middlewares.
   */
  private defaultExceptionHandler(): void {
    this.instance.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
      // logger.error('Internal Error: ', err);
      return res.status(500).json({ message: 'Internal Server error.' });
    });
  }

  private listen(port: number): void {
    this.instance.listen(port);
    // logger.info(`Application listen on port ${port}`);
  }
}

export default App1;
