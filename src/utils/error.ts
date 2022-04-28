import { getModule } from "vuex-module-decorators"
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

export function errorHandler(err: Error): Error|undefined {
    if (err instanceof ResponseError === false) return err

    switch ((err as ResponseError).status) {
        case 401: userModule.refreshToken().then(() => userModule.loadUser()); return err // refresh token
        case 429: // rate-limit
        case 404: return
    }

    return err
}