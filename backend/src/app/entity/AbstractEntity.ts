import { BeforeInsert, BeforeUpdate } from 'typeorm';
import { validateOrReject } from 'class-validator';
import { logger } from '../../services/Logger';

export enum Blocked {
  true = 'true',
  false = 'false',
}

export default abstract class AbstractEntity {
  /**
   * Default Entity validation.
   * To be fired, a Repository.insert or Repository.save has to be invoked for insert/update operations.
   * P.S: Repository.update will not fire @BeforeUpdate hook.
   */
  @BeforeInsert()
  @BeforeUpdate()
  async validateEntity(): Promise<void> {
    try {
      await validateOrReject(this);
    } catch (error) {
      logger.fatal(error);
    }
  }
}
