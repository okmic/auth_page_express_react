import { Schema, model, Model } from 'mongoose'

export type UserRoleEnum = "Admin" | "User"

export interface IUser extends Document {
    createdAt: Date
    _id: string
    name: string
    email: string
    psw: string
    role: UserRoleEnum
    isActive: boolean
}


const UserSchema = new Schema<IUser>({
  createdAt: { type: Date, default: Date.now },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  psw: { type: String, required: true },
  role: { type: String, enum: ["Admin", "User"], default: "User" },
  isActive: { type: Boolean, default: true },
})

interface IUserModel extends Model<IUser> {
}

export const User = model<IUser, IUserModel>(
  'User',
  UserSchema
)
