import { User, type IUser } from "../../models/user.model"
import { ErrorBadRequest, ErrorNotAuth } from '../../utils/errors'

class SignService {
  
  async registration(data: {
     name: string, email: string, psw: string, role: IUser["role"]
  }): Promise<IUser> {
   
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
}

export default new SignService()
