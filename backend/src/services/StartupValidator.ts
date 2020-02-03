import * as Yup from 'yup';

import { serverLogger as logger } from './Logger';

/**
 * Define all the environment variables to be validated
 */
type EnvProperties = {
  nodeEnv: string | undefined;
  logPath: string | undefined;
  dbType: string | undefined;
  dbHost: string | undefined;
  dbPort: string | undefined;
  dbName: string | undefined;
  dbUsername: string | undefined;
  dbPassword: string | undefined;
  dbLogging: boolean | undefined;
  serverKey: string | undefined;
  redisHost: string | undefined;
  redisPort: string | undefined;
};

enum Env {
  Development = 'development',
  Production = 'production',
}

/**
 * Execute validation in all environment properties necessary to do a correct system initialization.
 * @author Leonardo Otoni
 */
class StartupValidator {
  private schema: Yup.ObjectSchema<EnvProperties> = Yup.object().shape({
    nodeEnv: Yup.string()
      .required()
      .oneOf([Env.Development, Env.Production]),
    logPath: Yup.string().required('Environment var LOG_PATH not defined.'),
    dbType: Yup.string()
      .required('Environment var DB_TYPE not defined.')
      .oneOf(['postgres', 'mysql']),
    dbHost: Yup.string().required('Environment var DB_HOST not defined.'),
    dbPort: Yup.string()
      .required('Environment var DB_PORT not defined.')
      .matches(/^[1-9]\d*$/, 'Environment var DB_PORT has to be a positive number.'),
    dbName: Yup.string().required('Environment var DB_NAME not defined.'),
    dbUsername: Yup.string().required('Environment var DB_USERNAME not defined.'),
    dbPassword: Yup.string().required('Environment var DB_PASSWORD not defined.'),
    dbLogging: Yup.boolean().required('Environment var DB_LOGGING not defined.'),
    serverKey: Yup.string()
      .required('Environment var SERVER_KEY not defined')
      .min(32, 'Environment var SERVER_KEY needs min 32 characters length.'),
    redisHost: Yup.string().required('Environment var REDIS_HOST not defined'),
    redisPort: Yup.string()
      .required('Environment var REDIS_PORT not defined')
      .matches(/^[1-9]\d*$/, 'Environment var REDIS_PORT has to be a positive number.'),
  });

  /**
   * Validate all application env vars
   */
  public async isValid(): Promise<boolean> {
    // Create an schema instance to validate.
    const envVars: EnvProperties = {
      nodeEnv: process.env.NODE_ENV,
      logPath: process.env.LOG_PATH,
      dbType: process.env.DB_TYPE,
      dbHost: process.env.DB_HOST,
      dbPort: process.env.DB_PORT,
      dbName: process.env.DB_NAME,
      dbUsername: process.env.DB_USERNAME,
      dbPassword: process.env.DB_PASSWORD,
      dbLogging: Boolean(process.env.DB_LOGGING),
      serverKey: process.env.SERVER_KEY,
      redisHost: process.env.REDIS_HOST,
      redisPort: process.env.REDIS_PORT,
    };

    try {
      logger.info('Validating environment variables...');
      await this.schema.validate(envVars, { abortEarly: false });
      return true;
    } catch (error) {
      error.errors.forEach((e: string) => {
        logger.error(e);
      });
    }

    return false;
  }
}

export default new StartupValidator();
