export class AppError extends Error {
  public statusCode: number
  public status: string
  public isOperational: boolean

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ErrorBadRequest extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400)
  }
}

export class ErrorNotAuth extends AppError {
  constructor(message = 'Not Authenticated') {
    super(message, 401)
  }
}

export class ErrorForbidden extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403)
  }
}

export class ErrorNotFound extends AppError {
  constructor(message = 'Not Found') {
    super(message, 404)
  }
}

export class ErrorConflict extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409)
  }
}

export class ErrorValidation extends AppError {
  constructor(message = 'Validation Error') {
    super(message, 422)
  }
}

export class ErrorTooManyRequests extends AppError {
  constructor(message = 'Too Many Requests') {
    super(message, 429)
  }
}

export class ErrorInternalServer extends AppError {
  constructor(message = 'Internal Server Error') {
    super(message, 500)
    this.isOperational = false
  }
}