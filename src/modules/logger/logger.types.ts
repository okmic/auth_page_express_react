export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  DEBUG = 'debug'
}

export interface LoggerConfig {
  level: LogLevel
  enableConsole: boolean
  enableFile: boolean
  logDir?: string
  serviceName?: string
  enableJsonFormat?: boolean
}

export interface LogContext {
  requestId?: string
  userId?: string
  path?: string
  method?: string
  ip?: string
  userAgent?: string
  duration?: number
  [key: string]: any
}
