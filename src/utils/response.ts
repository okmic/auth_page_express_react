import { Response } from 'express';

export const sendSuccess = (res: Response, data: any = null, message: string = 'OK', statusCode: number = 200) => {
    return res.status(statusCode).json({
        success: true,
        statusCode,
        message,
        data,
        timestamp: new Date().toISOString()
    });
};

export const sendError = (res: Response, message: string = 'Internal Server Error', statusCode: number = 500) => {
    const response = {
        success: false,
        statusCode,
        message,
        timestamp: new Date().toISOString()
    };

    return res.status(statusCode).json(response);
};
