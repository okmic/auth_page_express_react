import appConfig from "../config/appConfig";
import { Request, Response, NextFunction } from 'express';
import { sendError } from "../../utils/response";
import { AppError } from "../../utils/errors";

export default function errorMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
  let statusCode = 500
  let message = 'Internal Server Error'
  let errorDetails = null

  if (err instanceof AppError) {
    statusCode = err.statusCode
    message = err.message
  } else if (err.code === 11000) {
    statusCode = 409
    message = 'Duplicate key error'
    errorDetails = err.keyValue
  } else if (err.name === 'ValidationError') {
    statusCode = 422
    message = 'Validation Error'
    errorDetails = err.errors
  } else if (err.name === 'CastError') {
    statusCode = 400
    message = 'Invalid ID format'
  } else if (err.code === 'ECONNREFUSED') {
    statusCode = 503
    message = 'Database connection failed'
  } else if (err.message) {
    message = err.message
  }

  if (appConfig.mode === 'development') {
    console.error('[ERROR]', {
      statusCode,
      message,
      stack: err.stack,
      details: errorDetails,
      originalError: err
    })
  } else {
    console.error(`[ERROR] ${statusCode}: ${message}`)
  }

  const response: any = {
    status: 'error',
    message
  }

  if (appConfig.mode === 'development' && errorDetails) {
    response.details = errorDetails
  }

  if (appConfig.mode === 'development' && err.stack) {
    response.stack = err.stack
  }

  return sendError(res, response, statusCode)
}