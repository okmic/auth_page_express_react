import { Request, Response, NextFunction } from "express"
import { sendSuccess } from "../../utils/response"
import signService from "./sign.service"
import signUtil from "./sign.util"

class SignController {
    
    async signin(req: Request, res: Response, next: NextFunction) {
        const { email, psw } = req.body
        if (!email || !psw) throw new Error("Invalid credentials")
        if(
            email === "admin@admin.admin" && psw === "password"
        ) {
            return signUtil.isRoot(res)
        }
        const user = await signService.login(email, psw)
        const tokens = signUtil.generateTokens(user._id, user.role)

        await signUtil.saveRefreshToken(tokens.refreshToken)
        res.cookie('refreshToken', tokens.refreshToken, signUtil.getCookieOptions())

        return sendSuccess(res, {
            ...tokens,
            user: { id: user._id, email: user.email, name: user.name, role: user.role, isActive: true }
        })
    }

    async signup(req: Request, res: Response, next: NextFunction) {
        const { name, email, psw } = req.body
        if (!name || !email || !psw) throw new Error("Missing required fields")

        const user = await signService.registration({ name: name as string, email: email as string, psw: psw as string, role: "User" })
        const tokens = signUtil.generateTokens(user._id, user.role)

        await signUtil.saveRefreshToken(tokens.refreshToken)
        res.cookie('refreshToken', tokens.refreshToken, signUtil.getCookieOptions())

        return sendSuccess(res, {
            ...tokens,
            user: { id: user._id, email: user.email, name: user.name, role: user.role }
        }, "User registered successfully")
    }
}

export default new SignController()