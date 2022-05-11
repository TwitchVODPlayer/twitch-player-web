interface LoginPayload {
    code: string
    state: string
    scope: string
}

interface User {
    id: string
    login: string
    display_name: string
    description: string
    profile_image_url: string
}

interface FollowsResponse {
    follows: Array<User>
    next: string
}

interface Video {
    id: string
    title: string
    duration: string
    view_count: number
    published_at: string
    thumbnail_url: string
}

interface VideosResponse {
    videos: Array<Video>
    next: string
}

interface Option {
    value: string|number
    label: any
}

interface VODHistory {
    vod_id: string|number
    start: number
}

interface HistoryResponse {
    history: Array<VODHistory>|null
}