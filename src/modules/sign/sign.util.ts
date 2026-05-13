import jwt from "jsonwebtoken"
import { Token } from "../../models/token.model"

class SignUtil {

    generateTokens(userId: string, role: string) {
        const accessToken = jwt.sign(
            { id: userId, role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: "30d" }
        )
        const refreshToken = jwt.sign(
            { id: userId },
            process.env.JWT_REFRESH_SECRET || 'refresh_secret',
            { expiresIn: "69d" }
        )
        return { accessToken, refreshToken }
    }

    async saveRefreshToken(token: string): Promise<void> {
        await Token.create({ token })
    }

    getCookieOptions() {
        return {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            path: '/',
            maxAge: 30 * 24 * 60 * 60 * 1000
        }
    }
}

export default new SignUtil()