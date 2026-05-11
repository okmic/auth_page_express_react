import { Request, Response, NextFunction } from "express"
import { sendSuccess } from "../../utils/response"
import { signService } from "./sign.service"

class SignController {

    async signin(req: Request, res: Response, next: NextFunction) {
        const { email, psw } = req.body
        if (!email || !psw) throw new Error("Invalid credentials")

        const user = await signService.login(email, psw)
        const tokens = signService.generateTokens(user._id, user.role)

        await signService.saveRefreshToken(tokens.refreshToken)
        res.cookie('refreshToken', tokens.refreshToken, signService.getCookieOptions())

        return sendSuccess(res, {
            ...tokens,
            user: { id: user._id, email: user.email, name: user.name, role: user.role }
        })
    }

    async signup(req: Request, res: Response, next: NextFunction) {
        const { name, email, psw, role, rootSecret } = req.body
        if (!name || !email || !psw) throw new Error("Missing required fields")

        const user = await signService.registration({ name, email, psw, role: role || "User" }, { userId: req.user?.userId, })
        const tokens = signService.generateTokens(user._id, user.role)

        await signService.saveRefreshToken(tokens.refreshToken)
        res.cookie('refreshToken', tokens.refreshToken, signService.getCookieOptions())

        return sendSuccess(res, {
            ...tokens,
            user: { id: user._id, email: user.email, name: user.name, role: user.role }
        }, "User registered successfully")
    }
}

export default new SignController()