import { NextFunction, Request, Response } from "express";
import { getJwtPayload } from "../../utils/jwt.util";
import userService from "./user.service";
import { sendSuccess } from "../../utils/response";
import { ErrorForbidden } from "../../utils/errors";

class UserController {

    async getMe(req: Request, res: Response, _: NextFunction) {
        const { id } = getJwtPayload(req)
        const user = await userService.getMe(id)

        return sendSuccess(res, { user })
    }

    async getList(req: Request, res: Response, _: NextFunction) {
        const { role } = getJwtPayload(req)

        if(role !== "Admin") throw new ErrorForbidden()
        
        const users = await userService.getList()

        return sendSuccess(res, { users })
    }
}

export default new UserController()