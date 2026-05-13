import { IUser, User } from '../../../models/user.model'
import { ErrorBadRequest } from '../../../utils/errors'

class SignAdminService {
  
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
}

export default new SignAdminService()
