import { promisify } from 'util';
import redis from 'redis';

import redisConfig from '../../config/RedisConfig';
import { logger } from '../Logger';

/**
 * Redis Accessor Helper - Manage all comunication through app and Redis and provide async methods
 * to handle Redis data.
 * @author Leonardo Otoni
 */
export default class RedisCache {
  /**
   * Set a value into a hash
   * @param hash - Hash name
   * @param key - Hash key
   * @param value - hash value
   */
  protected hsetAsync: (hash: string, key: string, value: string) => Promise<number>;

  /**
   * Gest a value from a hash
   * @param hash - Hash name
   * @param key - hash key
   * @returns  hash value
   */
  protected hgetAsync: (hash: string, key: string) => Promise<string>;

  /**
   * Query for values on a given hash according to a pattern.
   * E.G.: 'auth', '0', 'MATCH', `${idUser}:*${resource}`
   * @param hash - hash name
   * @param cursor
   * @param query
   * @param string
   */
  protected hscanAsync: (
    hash: string,
    cursor: string,
    query: string,
    string: string
  ) => Promise<[string, string[]]>;

  /**
   * Destroy a element from a Redis instance based on the key
   * @param element
   */
  protected delAsync: (element: string) => Promise<number>;

  constructor() {
    try {
      const client = redis.createClient(redisConfig.port, redisConfig.host);
      this.hsetAsync = promisify(client.hset).bind(client);
      this.hgetAsync = promisify(client.hget).bind(client);
      this.hscanAsync = promisify(client.hscan).bind(client);
      this.delAsync = promisify(client.del).bind(client);
    } catch (error) {
      logger.fatal(error);
      throw new Error('Fail to connect Redis');
    }
  }
}
