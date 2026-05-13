import axios, { type AxiosInstance } from 'axios'
import appconfig from '../../appconfig'
import store from '../../store/store'
import { authStatus } from '../../store/slices/auth.slice'
import { handlerError } from './api.util'

class ApiAuthService {
    private axiosInstance: AxiosInstance
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: appconfig.backendUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
    async signin(payload: { email: string, psw: string }) {
        return await this.axiosInstance.post<any>(
            `/api/signin`,
            payload,
        ).then(r => {
            store.dispatch(
                authStatus({ status: "loading", user: r.data.data.user })
            )
            localStorage.setItem('token', r.data.data.accessToken)
            return r.data
        })
        .catch(e => handlerError(e))
    }
    async signup(payload: { name: string, email: string, psw: string, role: "Admin" | "User"}) {
        return await this.axiosInstance.post<any>(
            `/api/signup`,
            { ...payload }
        ).then(r => {
            store.dispatch(
                authStatus({ status: "loading", user: r.data.data.user })
            )
            localStorage.setItem('token', r.data.data.token)
        })
            .catch(e => handlerError(e))
    }
}

export default new ApiAuthService()
