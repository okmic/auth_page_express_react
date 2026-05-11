import { NextFunction, Request, Response } from "express"
import { logger } from "../../modules/logger/logger.service"

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {

  logger.info('Incoming request', {
    method: req.method,
    url: req.originalUrl || req.url,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    date: new Date(),
  })

  next()
}