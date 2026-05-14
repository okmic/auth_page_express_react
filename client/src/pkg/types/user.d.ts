export interface IUser {
    _id: string
    role: "Admin" | "User"
    name: string
    email: string
    psw?: string | null
    isActive: boolean
}