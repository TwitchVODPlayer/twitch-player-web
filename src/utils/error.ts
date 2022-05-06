import router from "../router"
import { mainModule } from "../store/main"
import { userModule } from "../store/user"

interface ApiError {
    error: string
    status: number
    message: string
    needRefresh?: boolean
}

export class ResponseError extends Error {
    error?: string
    status?: number
    needRefresh?: boolean

    constructor(err: ApiError|string) {
        const message = typeof err === "string" ? err : err.message
        super(message)
        this.name = this.constructor.name

        if (typeof err !== "string") {
            this.error = err.error
            this.status = err.status
            this.needRefresh = err.needRefresh
        }
    }
}

export function errorHandler(err: Error|ResponseError): Error|undefined {
    if (err instanceof ResponseError === false) return err

    // refresh token
    if ((err as ResponseError).needRefresh) {
        if (!userModule.isRefreshingToken)
            mainModule.reset()
            .then(() => userModule.refreshToken())
            .then(() => router.replace({ name: "Reload" }))
        return
    }

    // invalid token
    if (err.message === "Invalid token") {
        userModule.logout().then(() => router.replace({ name: "Dashboard" }))
        return err
    }    

    // rate-limit
    if ((err as ResponseError).status === 429) return

    return err
}