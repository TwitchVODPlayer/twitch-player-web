import { ResponseError } from '../utils/error'
import { userModule } from '../store/user'

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

export async function getUser(login?: string) {
    return fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/twitch/users/${login || 'me'}`, {
        headers: { 'Authorization': `Bearer ${userModule.getAccessToken}` }
    }).then(res => res.json()).then(res => {
        if (res.error) throw new ResponseError(res)
        return res
    })
}

export async function getFollows(next: string = '') {
    const query = next ? `?next=${next}` : ''
    return fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/twitch/follows${query}`, {
        headers: { 'Authorization': `Bearer ${userModule.getAccessToken}` }
    }).then(res => res.json()).then(res => {
        if (res.error) throw new ResponseError(res)
        return res
    })
}