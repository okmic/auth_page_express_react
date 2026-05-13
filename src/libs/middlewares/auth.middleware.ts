import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import appConfig from "../config/appConfig"
import { sendError } from "../../utils/response"

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return sendError(res, "No token provided", 401);
        }
        jwt.verify(token, appConfig.jwtSecret) as any

        return next()
    } catch (e) {
        return sendError(res, "Forbidden", 403)
    }
};
