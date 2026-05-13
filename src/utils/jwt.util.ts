import { Request } from "express";
import jwt from "jsonwebtoken"
import appConfig from "../libs/config/appConfig"
import { IUser } from "../models/user.model"
import { ErrorForbidden, ErrorNotAuth } from "./errors"

export function getJwtPayload(req: Request) {
    const token = req.headers.authorization?.split(' ')[1];
    if(!token) throw new ErrorNotAuth()
    const payload = jwt.verify(token, appConfig.jwtSecret) as { id: string, role: IUser["role"]} | undefined
    if(!payload) throw new ErrorNotAuth()

    return payload
}