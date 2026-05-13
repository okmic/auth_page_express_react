export interface IUser {
    id: number
    role: "Admin" | "User"
    email: string
    password?: string | null
}