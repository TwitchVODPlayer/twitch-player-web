import { ResponseError } from '../utils/error'
import { userModule } from '../store/user'

export async function verifyVodId(vod_id: string|number) {
    return fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/m3u8/${vod_id}/check`, {
        method: "GET"
    }).then(res => res.json()).then(res => {
        if (res.error) throw new ResponseError(res)
        return res
    })
}

export async function getVideos(login: string, next?: string, filter?: string) {
    const url = new URL(`${import.meta.env.VITE_SERVER_BASE_URL}/api/twitch/videos/${login}`)
    url.search = new URLSearchParams(JSON.parse(JSON.stringify({ next, filter }))).toString()
    return fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${userModule.getAccessToken}` }
    }).then(res => res.json()).then(res => {
        if (res.error) throw new ResponseError(res)
        return res
    })
}

export function getPlaylistApiUrl(vod_id?: number|string) { return `${import.meta.env.VITE_SERVER_BASE_URL}/api/m3u8/${vod_id}/playlist/` }