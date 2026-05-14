import { NextFunction, Request, Response } from "express";
import { getJwtPayload } from "../../utils/jwt.util";
import userService from "./user.service";
import { sendSuccess } from "../../utils/response";
import { ErrorBadRequest, ErrorForbidden } from "../../utils/errors";

class UserController {

    async getMe(req: Request, res: Response, _: NextFunction) {
        const { id } = getJwtPayload(req)
        let user
        if(id === "Admin") {
            user = { id: "Admin", email: "admin@admin.admin", name: "Admin", role: "Admin", isActive: true }
        } else user = await userService.getMe(id)

        return sendSuccess(res, { user })
    }

    async getList(req: Request, res: Response, _: NextFunction) {
        const { role } = getJwtPayload(req)

        if(role !== "Admin") throw new ErrorForbidden()
        
        const users = await userService.getList()

        return sendSuccess(res, { users })
    }

    async updateStatus(req: Request, res: Response) {
        const { role } = getJwtPayload(req)
        if(role !== "Admin") throw new ErrorForbidden()
        const { id } = req.params
        const { status } = req.body

        if(!id) {
            throw new ErrorBadRequest()
        }
        
        const result = userService.updateStatus(id as string, status || false)
        return sendSuccess(res, { result })
    }
}

export default new UserController()
