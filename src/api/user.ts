import { ResponseError } from "../utils/error"
import { userModule } from "../store/user"

export async function login(code: string, state: string, scope: string) {
    return fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/auth/login`, {
        method: "POST",
        body: new URLSearchParams({ code, state, scope })
    }).then(res => res.json()).then(res => {
        if (res.error) throw new ResponseError(res)
        return res
    })
}

export async function refreshToken() {
    return fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/auth/refresh_token`, {
        method: "POST",
        headers: { 'Authorization': `Bearer ${userModule.getAccessToken}` }
    }).then(res => res.json()).then(res => {
        if (res.error) throw new ResponseError(res)
        return res
    })
}

export async function getUser() {
    return fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/twitch/me`, {
        headers: { 'Authorization': `Bearer ${userModule.getAccessToken}` }
    }).then(res => res.json()).then(res => {
        if (res.error) throw new ResponseError(res)
        return res
    })
}

export async function getFollows() {
    return fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/twitch/follows`, {
        headers: { 'Authorization': `Bearer ${userModule.getAccessToken}` }
    }).then(res => res.json()).then(res => {
        if (res.error) throw new ResponseError(res)
        return res
    })
}