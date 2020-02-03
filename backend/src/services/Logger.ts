import { Logger, getLogger, configure } from 'log4js';

enum Appender {
  Development = 'development',
  Production = 'production',
  Server = 'server',
}

enum LogLevel {
  debug = 'debug',
  error = 'error',
  info = 'info',
}

/**
 * Application Local Logger config.
 * It makes use of Log4js logger lib.
 * @author Leonardo Otoni
 */
class AppLogger {
  private appender: Appender;

  /**
   * It considers a default log file anyways just because this class is instantiated before the
   * bootstrap validation.
   */
  private static readonly logFileName = process.env.LOG_PATH || 'application.log';

  constructor() {
    this.appender =
      process.env.NODE_ENV === Appender.Production ? Appender.Production : Appender.Development;
    AppLogger.configureAppender();
  }

  /**
   * Define the logger appender accordingly to the ennvironment.
   * Production: Log.Level == error, Development: Log.Level == debug
   */
  private static configureAppender(): void {
    configure({
      appenders: {
        fileAppender: {
          type: 'file',
          filename: AppLogger.logFileName,
          keepFileExt: true,
          maxLogSize: 30000,
          backups: 5,
          layout: { type: 'pattern', pattern: '%[[%d] [%p] %f{1}%] %m' },
        },
        console: {
          type: 'console',
          layout: { type: 'pattern', pattern: '%[[%d] [%p] %f{1}%] %m' },
        },
      },
      categories: {
        default: {
          appenders: ['console', 'fileAppender'],
          level: LogLevel.debug,
          enableCallStack: true,
        },
        server: {
          appenders: ['console', 'fileAppender'],
          level: LogLevel.info,
          enableCallStack: true,
        },
        production: { appenders: ['fileAppender'], level: LogLevel.error },
      },
    });
  }

  /**
   * Returns a application logger
   * @param category - Optional - Alllows to select the Appender category directly.
   */
  public getAppLogger(category?: string): Logger {
    if (category && category === Appender.Server) {
      return getLogger(Appender.Server);
    }

    if (this.appender === Appender.Production) {
      return getLogger(Appender.Production);
    }

    return getLogger(); // default appender
  }
}

const appLogger = new AppLogger();
const serverLogger = appLogger.getAppLogger(Appender.Server);
const logger = appLogger.getAppLogger();
export { logger, serverLogger };
