import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { serverLogger as logger } from '../services/Logger';

import connectionOptions from '../config/ormConfig';
/**
 * Default Database Connection.
 * @author Leonardo Otoni
 */
class Database {
  /**
   * Create a Database Connection Pool with the database
   */
  public async connect(): Promise<void> {
    logger.info('Connecting to the database...');
    await createConnection(connectionOptions)
      .then(() => logger.info('Connection susccessfully stablished.'))
      .catch(error => {
        throw error;
      });
  }
}

export default new Database();
