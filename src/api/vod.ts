import { ResponseError } from '../utils/error'
import { userModule } from '../store/user'

export async function verifyVodId(vod_id: string|number) {
    return fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/m3u8/${vod_id}/check`).then(res => res.json()).then(res => {
        if (res.error) throw new ResponseError(res)
        return res
    })
}

export async function getPlaylist(vod_id: string|number) {
    return fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/m3u8/${vod_id}/playlist/`, {
        headers: { 'Authorization': `Bearer ${userModule.getAccessToken}` }
    }).then(res => {
        if (!res.ok) return res.json()
        return res.text()
    }).then(res => {
        if (res.error) throw new ResponseError(res)
        return res
    })
}

export async function getVideos({ login, next, first, filter }: { login: string, next?: string, first?: number, filter?: string}) {
    const url = new URL(`${import.meta.env.VITE_SERVER_BASE_URL}/api/twitch/videos/${login}`)
    url.search = new URLSearchParams(JSON.parse(JSON.stringify({ next, first, filter }))).toString()
    return fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${userModule.getAccessToken}` }
    }).then(res => res.json()).then(res => {
        if (res.error) throw new ResponseError(res)
        return res
    })
}

export async function getHistory() {
    return fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/history`, {
        headers: { 'Authorization': `Bearer ${userModule.getAccessToken}` }
    }).then(res => res.json()).then(res => {
        if (res.error) throw new ResponseError(res)
        return res
    })
}

export async function toggleHistory(value: boolean) {
    return fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/history/toggle`, {
        headers: { 'Authorization': `Bearer ${userModule.getAccessToken}` },
        method: "POST",
        body: new URLSearchParams({ value: String(value) })
    }).then(res => res.json()).then(res => {
        if (res.error) throw new ResponseError(res)
        return res
    })
}

export async function setWatchtime({ vod, start }: { vod: string|number, start: number }) {
    const url = new URL(`${import.meta.env.VITE_SERVER_BASE_URL}/api/history/watchtime`)
    url.search = new URLSearchParams(JSON.parse(JSON.stringify({ vod, start }))).toString()
    return fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${userModule.getAccessToken}` },
        method: "PUT"
    })
}

export function getPlaylistApiUrl(vod_id?: number|string) { return `${import.meta.env.VITE_SERVER_BASE_URL}/api/m3u8/${vod_id}/playlist/` }