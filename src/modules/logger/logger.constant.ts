import { LoggerConfig, LogLevel } from "./logger.types";

export const DEFAULT_CONFIG: LoggerConfig = {
  level: LogLevel.INFO,
  enableConsole: true,
  enableFile: true,
  logDir: 'logs',
  serviceName: 'service_auth',
  enableJsonFormat: false
}
