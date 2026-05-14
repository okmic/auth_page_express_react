import bcrypt from 'bcrypt'
import { User, type IUser } from "../../models/user.model"
import { ErrorBadRequest, ErrorNotAuth } from '../../utils/errors'

class SignService {
  
  async registration(data: {
     name: string, email: string, psw: string, role: IUser["role"]
  }): Promise<IUser> {
   
    const existingUser = await User.findOne({ email: data.email })
    if (existingUser) throw new ErrorBadRequest("User already exists")
    
    const hashedPassword = await bcrypt.hash(data.psw, 12)
    
    return await User.create({
      ...data,
      psw: hashedPassword,
      isActive: true,
    })
  }

  async login(email: string, psw: string): Promise<IUser> {
    const user = await User.findOne({ email })
    if (!user) throw new ErrorNotAuth("Invalid email or password")
    
    const isPasswordValid = await bcrypt.compare(psw, user.psw)
    if (!isPasswordValid) throw new ErrorNotAuth("Invalid email or password")
    
    return user
  }
}

export default new SignService()