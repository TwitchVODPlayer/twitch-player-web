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

export async function getFollows({ next = '', first }: { next?: string, first: number }) {
    const url = new URL(`${import.meta.env.VITE_SERVER_BASE_URL}/api/twitch/follows`)
    url.search = new URLSearchParams(JSON.parse(JSON.stringify({ next, first }))).toString()
    return fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${userModule.getAccessToken}` }
    }).then(res => res.json()).then(res => {
        if (res.error) throw new ResponseError(res)
        return res
    })
}