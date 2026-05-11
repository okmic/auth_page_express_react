import jwt from 'jsonwebtoken'
import { User, type IUser } from "../../models/user.model"
import { Token } from "../../models/token.model"
import appConfig from '../../libs/config/appConfig'
import { ErrorBadRequest, ErrorForbidden, ErrorNotAuth } from '../../utils/errors'

export default class SignService {
  async registration(data: {
     name: string, email: string, psw: string, role: IUser["role"]
  }, payload: { rootSecret?: string, userId: string }): Promise<IUser> {
   
    if (data.role && data.role === "Admin") {
      const user = await User.findById(payload.userId)

      if(
        (!user || user.role !== "Admin")
        && appConfig.rootSecret !== payload.rootSecret
      ) throw new ErrorForbidden()
    }

    const existingUser = await User.findOne({ email: data.email })
    if (existingUser) throw new ErrorBadRequest("User already exists")
    
    return await User.create({
      ...data,
      isActive: true,
    })
  }

  async login(email: string, psw: string): Promise<IUser> {
    const user = await User.findOne({ email, isActive: true })
    if (!user || user.psw !== psw) throw new ErrorNotAuth("Invalid email or password")
    return user
  }

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

export const signService = new SignService()
