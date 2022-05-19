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

interface SelectOption {
    label: string|number
    value: string|number
}

interface DropdownItem {
    label: string|number
    icon?: string
    action?: Function
    children?: Array<DropdownItem>
}

interface VODHistory {
    vod_id: string|number
    start: number
}

interface HistoryResponse {
    history: Array<VODHistory>|null
}

interface m3u8Url {
    quality: string
    url: string
}