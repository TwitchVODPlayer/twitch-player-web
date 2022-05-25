<script setup lang="ts">
import { computed, Ref, ref } from 'vue'
import moment from 'moment'

import { videoModule } from '../store/video'
import { historyModule } from '../store/history'
import { success } from '../utils/popup'
import { getPlaylistApiUrl } from '../api/vod'

import Icon from './Icon.vue'
import Dropdown from './Dropdown.vue'


const DEFAULT_PREVIEW_URL = "https://vod-secure.twitch.tv/_404/404_processing_320x180.png"
moment.updateLocale('en-US', {
    relativeTime: {
        s: "a few seconds ago",
        ss: "%d seconds ago",
        m: "1 minute ago",
        mm: "%d minutes ago",
        h: "an hour ago",
        hh: "%d hours ago",
        d: "Yesterday",
        dd: "%d days ago",
        M: "Last month",
        MM: "%d months ago",
        y: "Last year",
        yy: "%d years ago"
    }
})

const props = defineProps<{
    video: Video
}>()

const m3u8Url: Ref<string> = ref('')
const m3u8List: Ref<Array<m3u8Url>> = ref([])
const loadingDropdown: Ref<boolean> = ref(true)

const isInHistory = computed((): boolean => historyModule.isInHistory(Number(props.video.id)))
const isInWatchLater = computed((): boolean => historyModule.isInWatchLater(Number(props.video.id)))
const qualityOptions = computed((): Array<DropdownItem> => {
    const items = [{
        label: `${isInWatchLater.value ? 'Remove from' : 'Save to'} Watch Later`,
        icon: 'watch',
        action: () => historyModule.addWatchLater(Number(props.video.id))
    },
    {
        label: 'Copy url',
        icon: 'copy',
        children: [
            {
                label: 'Auto',
                action: () => copyString(m3u8Url.value)
            },
            ...m3u8List.value.map(m3u8 => ({
                label: m3u8.quality,
                action: () => copyString(m3u8.url)
            })).reverse()
        ]
    }]
    if (isInHistory.value) items.unshift({
        label: 'Remove from History',
        icon: 'history',
        action: () => historyModule.setWatchtime({ vod_id: Number(props.video.id), start: 0 })
    })
    return items
})

const copyString = function(str: string) {
    navigator.clipboard.writeText(str)
    success('Copied to clipboard!')
}

const loadPlaylist = function(vod_id: number) {
    m3u8Url.value = getPlaylistApiUrl(vod_id)
    videoModule.getPlaylistM3U8(vod_id).then(m3u8 => {
        m3u8List.value = parsem3u8(m3u8)
        loadingDropdown.value = false
    })
}

const parsem3u8 = function(m3u8: string): Array<m3u8Url> {
    return m3u8.match(/http(.*)\//g)?.map(url => ({
        quality: (url.match(/([^\/]+)\/$/)?.[1]?.replace('chunked', 'Source').replace('audio_only', 'Audio only') || ''),
        url: url
    })) || []
}

const videoPercent = function(video: Video): number {
    const durations = video.duration.split(/h|m|s/).filter(e => e != '').reverse().reduce((t, d, i) => t + (Number(d) * 60**i), 0)
    return historyModule.getVodStart(Number(video.id)) / Number(durations) * 100
}

const getThumbnail = function(url: string, width: number, height: number): string {
    if (!url) return DEFAULT_PREVIEW_URL
    return url.replace('%{width}', String(width)).replace('%{height}', String(height))
}

const getLongDate = function(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {dateStyle: 'long'})
}

const getDuration = function(duration: string): string {
    duration = duration.replace('s', '')
    if (!duration.match(/h|m/g)) return `0:${duration.padStart(2, '0')}`
    const splits = duration.split(/h|m/g)
    const hours = splits.splice(0, 1)
    return `${hours}:${splits.map(s => s.padStart(2, '0')).join(':')}`
}

const getViewsString = function(views: number): string {
    if (views < 2) return `${views} view`
    const splits = (new Intl.NumberFormat().format(views)).split(/\s/g)
    if (splits.length > 1) return `${splits[0]}.${String(Math.round(Number(splits[1])/100))[0]}${splits.length < 3 ? 'K' : 'M'} views`
    return `${views} views`
}

const getDateAgo = function(date: string): string {
    return moment(new Date(date)).from(Date.now(), true)
}

const setWatchLater = function(event: Event) {
    event.preventDefault()
    historyModule.addWatchLater(Number(props.video.id))
}
</script>

<template>
    <div class="video">
        <router-link :to="`/vod/${props.video.id}`" :title="getLongDate(props.video.published_at)">
            <div class="previews">
                <div class="top"></div>
                <div class="left"></div>
                <div class="bottom"></div>
                <div class="right"></div>
                <div class="preview">
                    <img :src="getThumbnail(props.video.thumbnail_url, 320, 180)">
                    <div class="watchlater" :title="isInWatchLater ? 'Added' : 'Watch Later'">
                        <span>
                            <Icon v-if="isInWatchLater" name="checked" class="icon" @click="setWatchLater" />
                            <Icon v-else name="watch" class="icon" @click="setWatchLater" />
                        </span>
                    </div>
                    <div class="duration">
                        <span>{{getDuration(props.video.duration)}}</span>
                    </div>
                    <div v-if="props.video.view_count" class="views">
                        <span>{{getViewsString(props.video.view_count)}}</span>
                    </div>
                    <div class="date">
                        <span>{{getDateAgo(props.video.published_at)}}</span>
                    </div>
                    <div class="progress" v-if="videoPercent(video) > 0">
                        <div class="bar" :style="{ width: `${videoPercent(video)}%` }"></div>
                    </div>
                </div>
            </div>
        </router-link>
        <div class="infos">
            <!-- <router-link :to="`/videos/${videoModule.getUser?.login}`" :title="videoModule.getUser?.display_name">
                <img class="profile-image" :src="videoModule.getUser?.profile_image_url">
            </router-link> -->
            <router-link :to="`/vod/${props.video.id}`" :title="props.video.title">
                <p class="title">{{props.video.title}}</p>
            </router-link>
            <Dropdown :options="qualityOptions" @open="loadPlaylist(Number(props.video.id))" :loading="loadingDropdown">
                <template #trigger>
                    <Icon name="dots" class="icon" />
                </template>
            </Dropdown>
        </div>
    </div>
</template>

<style>
.video .preview {
    position: relative;
    transition-property: transform;
    transition-timing-function: ease;
    transition-duration: 100ms;
    transition-delay: 75ms;
}
.video .previews:hover .preview {
    transform: translate3d(.4rem, -.4rem, 0);
}
.video, .video .previews {
    position: relative;
}
.video .previews .top {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    border-top: .4rem solid transparent;
    border-bottom: .4rem solid transparent;
    border-right: .4rem solid var(--primary-color);
    transform-origin: left center;
    transform: translateY(-.4rem) scale(0);
    transition-property: transform;
    transition-timing-function: ease;
    transition-duration: 100ms;
    transition-delay: 75ms;
}
.video .previews:hover .top {
    transform: translateY(-.4rem) scale(1);
    transition-delay: 75ms;
}
.video .previews .right {
    position: absolute;
    bottom: .25rem;
    right: 0;
    width: 0;
    height: 0;
    border-left: .4rem solid transparent;
    border-right: .4rem solid transparent;
    border-top: .4rem solid var(--primary-color);
    transform-origin: center bottom;
    transform: translateX(.4rem) scale(0);
    transition-property: transform;
    transition-timing-function: ease;
    transition-duration: 100ms;
    transition-delay: 75ms;
}
.video .previews:hover .right {
    transform: translateX(.4rem) scale(1);
    transition-delay: 75ms;
}
.video .previews .left {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    background: var(--primary-color);
    transform-origin: 0 100%;
    width: .4rem;
    height: 98%;
    transform: scaleX(0);
    transition-property: transform;
    transition-timing-function: ease;
    transition-duration: 100ms;
    transition-delay: 75ms;
}
.video .previews:hover .left {
    transform: scaleX(1);
    transition-delay: 75ms;
}
.video .previews .bottom {
    position: absolute;
    bottom: .25rem;
    left: 0;
    right: 0;
    background: var(--primary-color);
    transform-origin: 0 100%;
    height: .4rem;
    transform: scaleY(0);
    transition-property: transform;
    transition-timing-function: ease;
    transition-duration: 100ms;
    transition-delay: 75ms;
}
.video .previews:hover .bottom {
    transform: scaleY(1);
    transition-delay: 75ms;
}
.video .preview .watchlater {
    position: absolute;
    top: 0;
    right: 0;
    margin: .6rem;
}
.video .preview .watchlater .icon {
    width: 1.5rem;
    height: auto;
}
.video .preview .duration {
    position: absolute;
    top: 0;
    left: 0;
    margin: .6rem;
}
.video .preview .views {
    position: absolute;
    bottom: .25rem;
    left: 0;
    margin: .6rem;
}
.video .preview .date {
    position: absolute;
    bottom: .25rem;
    right: 0;
    margin: .6rem;
}
.video .preview .watchlater > span, .video .preview .duration > span, .video .preview .views > span, .video .preview .date > span {
    display: flex;
    padding: .15rem;
    align-items: center;
    justify-content: center;
    background: var(--overlay-background-color);
    font-size: .8rem;
    border-radius: 0.1rem;
}
.video .infos {
    margin-top: .5rem;
    display: grid;
    grid-template-columns: auto 2rem;
    gap: .7rem
}
.video .infos .profile-image {
    width: 3rem;
}
.video .infos .title {
    margin: 0;
    font-size: .9rem;
    text-align: start;
}
.video .previews img {
    width: 100%;
}
.show-more {
    margin-top: 2rem;
}
a > .previews span {
    color: var(--text-color);
}
.video .preview .progress {
    pointer-events: none;
    position: absolute;
    bottom: .25rem;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    height: 0.3rem;
    background: #00000066;
}
.video .preview .progress .bar {
    max-width: 100%;
    height: 100%;
    background: var(--primary-color);
    animation-timing-function: linear;
    animation-fill-mode: both;
}
</style>