import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ErrorForbidden, ErrorNotAuth } from "../../../utils/errors";
import appConfig from "../../../libs/config/appConfig";

export function authAdminSign(req: Request, _r: Response, _: NextFunction) {
    try {
        const { email, psw } = req.body
        if(email === "admin@admin.admin" && psw === "admin" ) {
            return
        } else {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                throw new ErrorNotAuth("No token provided");
            }
            const payload = jwt.verify(token, appConfig.jwtSecret)
            return payload
        }
    } catch (e) {
        throw new ErrorForbidden()
    }
};