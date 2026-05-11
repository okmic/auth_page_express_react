import winston, { Logger, format, transports } from 'winston'
import { LogContext, LoggerConfig } from './logger.types'
import { DEFAULT_CONFIG } from './logger.constant'
import * as os from 'os'

export interface ExtendedLoggerConfig extends LoggerConfig {
  source?: string
  environment?: string
}

class LoggerService {
  private logger: Logger
  private config: ExtendedLoggerConfig

  constructor(config: Partial<ExtendedLoggerConfig> = {}) {
    this.config = {
      ...DEFAULT_CONFIG,
      environment: process.env.NODE_ENV || 'development',
      source: os.hostname(),
      ...config
    }
    this.logger = this.createLogger()
  }

  private createLogger(): Logger {
    const { combine, timestamp, errors, printf, colorize } = format

    const consoleFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
      let log = `${timestamp} [${level}]: ${message}`

      if (stack) {
        log += `\n${stack}`
      }

      if (Object.keys(meta).length > 0) {
        log += `\n${JSON.stringify(meta, null, 2)}`
      }

      return log
    })

    return winston.createLogger({
      level: this.config.level,
      defaultMeta: {
        service: this.config.serviceName,
        environment: this.config.environment
      },
      transports: [
        new transports.Console({
          format: combine(
            colorize(),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            errors({ stack: true }),
            consoleFormat
          )
        })
      ]
    })
  }

  public error(message: string, error?: Error | any, context?: LogContext): void {
    const meta: any = { ...context }

    if (error) {
      meta.error = {
        message: error.message || error,
        stack: error.stack
      }
    }

    this.logger.error(message, meta)
  }

  public warn(message: string, context?: LogContext): void {
    this.logger.warn(message, context)
  }

  public info(message: string, context?: LogContext): void {
    this.logger.info(message, context)
  }

  public log(message: string, context?: LogContext): void {
    this.logger.info(message, context)
  }

  public debug(message: string, context?: LogContext): void {
    this.logger.debug(message, context)
  }

  public getWinstonLogger(): Logger {
    return this.logger
  }
}

export const logger = new LoggerService({
  serviceName: 'service_auth',
  environment: process.env.NODE_ENV || 'development'
})

export default LoggerService
