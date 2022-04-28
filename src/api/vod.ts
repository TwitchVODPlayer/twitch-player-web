import { ResponseError } from "../utils/error"

export async function verifyVodId(vod_id: string|number) {
    return fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/api/m3u8/${vod_id}/check`, {
        method: "GET"
    }).then(res => res.json()).then(res => {
        if (res.error) throw new ResponseError(res)
        return res
    })
}

export function getPlaylistApiUrl(vod_id?: number|string) { return `${import.meta.env.VITE_SERVER_BASE_URL}/api/m3u8/${vod_id}/playlist/` }