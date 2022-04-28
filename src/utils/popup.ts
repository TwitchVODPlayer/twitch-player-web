import { errorHandler } from './error'
import app from '../main'

export function error(err: Error|string) {
    if (typeof err !== "string") {
        const error = errorHandler(err)
        if (!error) return
        err = err.message
    }
    app.config.globalProperties.$toast.error(err, {
        duration: 5 * 1000
    })
}

export function success(msg: string) {
    app.config.globalProperties.$toast.success(msg, {
        duration: 2 * 1000
    })
}

export function info(msg: string) {
    app.config.globalProperties.$toast.info(msg, {
        duration: 2 * 1000
    })
}

export function warning(msg: string) {
    app.config.globalProperties.$toast.warning(msg, {
        duration: 5 * 1000
    })
}