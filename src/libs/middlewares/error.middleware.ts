import appConfig from "../config/appConfig";
import { Request, Response, NextFunction } from 'express';
import {sendError} from "../../utils/response";

export default function errorMiddleware (err: any, req: Request, res: Response, next: NextFunction) {
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Something went wrong';

    if (appConfig.mode === 'development') {
        console.error(err.stack);
    }
    return sendError(res, message, statusCode);
};
