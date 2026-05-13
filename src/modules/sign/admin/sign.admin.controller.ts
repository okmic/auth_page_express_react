import { NextFunction, Request, Response } from "express"
import { sendSuccess } from "../../../utils/response"
import signAdminService from "./sign.admin.service"
import signUtil from "../sign.util"
import { authAdminSign } from "./sign.admin.util"

class SignAdminController {

    async signup(req: Request, res: Response, _: NextFunction) {
        authAdminSign(req, res, _)
        const { name, email, psw, role } = req.body
        if (!name || !email || !psw || !role) throw new Error("Missing required fields")

        const user = await signAdminService.registration({ name, email, psw, role })
        const tokens = signUtil.generateTokens(user._id, user.role)

        await signUtil.saveRefreshToken(tokens.refreshToken)
        res.cookie('refreshToken', tokens.refreshToken, signUtil.getCookieOptions())

        return sendSuccess(res, {
            ...tokens,
            user: { id: user._id, email: user.email, name: user.name, role: user.role }
        }, "User registered successfully")
    }
}

export default new SignAdminController()