<script setup lang="ts">
import { computed, onBeforeMount, Ref, ref } from 'vue'
import { videoModule } from '../store/video'
import { useRouter } from 'vue-router'
import moment from 'moment'

import Logo from '../assets/img/logo.svg'
import Button from '../components/Button.vue'
import Select from '../components/Select.vue'

const DEFAULT_PREVIEW_URL = "https://vod-secure.twitch.tv/_404/404_processing_320x180.png"

const router = useRouter()
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

const props = defineProps({
    login: String
})

const filterOptions: Ref<Array<Option>> = ref([
    { label: "Recent", value: 'time' },
    { label: "Trending", value: 'trending' },
    { label: "Views", value: 'views' }
])

const videos = computed(() => videoModule.getVideos)

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
    return `${splits[0]}:${splits[1].padStart(2, '0')}:${splits[2].padStart(2, '0')}`
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

const showMore = function(first: number) {
    if (!props.login) return router.replace({ name: 'Dashboard' })
    if (videoModule.isLoading) return
    videoModule.loadMoreVideos({ login: props.login, first })
}

const changeFilter = function(filter: number|string) {
    if (!props.login) return
    videoModule.loadVideos({
        login: props.login,
        filter: String(filter)
    },)
}

onBeforeMount(() => {
    if (!props.login) return router.replace({ name: 'Dashboard' })
    videoModule.loadVideos({
        login: props.login,
        first: 20
    })
})
</script>

<template>
    <div class="content">
        <div class="title">
            <h2>Recent videos</h2>
            <Select
                v-if="videos?.length"
                label="Filter by"
                :options="filterOptions"
                @select="changeFilter"
            />
        </div>
        <Logo v-if="!videoModule.getVideos" class="loading" />
        <div v-else>
            <p v-if="!videos?.length">No videos found.</p>
            <div v-else class="videos">
                <div
                    v-for="(video, i) in videos"
                    :key="i"
                    class="video"
                >
                    <router-link :to="`/vod/${video.id}`" :title="getLongDate(video.published_at)">
                        <div class="previews">
                            <div class="top"></div>
                            <div class="left"></div>
                            <div class="bottom"></div>
                            <div class="right"></div>
                            <div class="preview">
                                <img :src="getThumbnail(video.thumbnail_url, 320, 180)">
                                <div class="duration">
                                    <span>{{getDuration(video.duration)}}</span>
                                </div>
                                <div v-if="video.view_count" class="views">
                                    <span>{{getViewsString(video.view_count)}}</span>
                                </div>
                                <div class="date">
                                    <span>{{getDateAgo(video.published_at)}}</span>
                                </div>
                            </div>
                        </div>
                    </router-link>
                    <div class="infos">
                        <router-link :to="`/videos/${videoModule.getUser?.login}`" :title="videoModule.getUser?.display_name">
                            <img class="profile-image" :src="videoModule.getUser?.profile_image_url">
                        </router-link>
                        <router-link :to="`/vod/${video.id}`" :title="video.title">
                            <p class="title">{{video.title}}</p>
                        </router-link>
                    </div>
                </div>
            </div>
            <Logo v-if="videoModule.isLoading" class="loading small" />
            <Button v-if="videoModule.getNext && !videoModule.isLoading" class="show-more" :disabled="videoModule.isLoading" @click="showMore(20)">Show more</Button>
        </div>
    </div>
</template>

<style scoped>
.loading {
    margin-top: 2rem;
    width: 4rem;
}
.loading.small {
    width: 2rem;
}
.content .title {
    position: relative;
}
.videos {
    display: grid;
    grid-gap: 3rem;
    grid-template-columns: repeat(3, 1fr);
    transition: .5s;
    width: 100%;
}
@media screen and (max-width: 1024px) {
    .videos {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media screen and (max-width: 720px) {
    .videos {
        grid-template-columns: 1fr
    }
}
.videos .video .preview {
    position: relative;
    transition-property: transform;
    transition-timing-function: ease;
    transition-duration: 100ms;
    transition-delay: 75ms;
}
.videos .video .previews:hover .preview {
    transform: translate3d(.4rem, -.4rem, 0);
}
.videos .video, .videos .video .previews {
    position: relative;
}
.videos .video .previews .top {
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
.videos .video .previews:hover .top {
    transform: translateY(-.4rem) scale(1);
    transition-delay: 75ms;
}
.videos .video .previews .right {
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
.videos .video .previews:hover .right {
    transform: translateX(.4rem) scale(1);
    transition-delay: 75ms;
}
.videos .video .previews .left {
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
.videos .video .previews:hover .left {
    transform: scaleX(1);
    transition-delay: 75ms;
}
.videos .video .previews .bottom {
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
.videos .video .previews:hover .bottom {
    transform: scaleY(1);
    transition-delay: 75ms;
}
.videos .video .preview .duration {
    position: absolute;
    top: 0;
    left: 0;
    margin: .6rem;
}
.videos .video .preview .views {
    position: absolute;
    bottom: .25rem;
    left: 0;
    margin: .6rem;
}
.videos .video .preview .date {
    position: absolute;
    bottom: .25rem;
    right: 0;
    margin: .6rem;
}
.video .preview .duration > span, .video .preview .views > span, .video .preview .date > span {
    display: flex;
    padding: .1rem 0.2rem;
    align-items: center;
    justify-content: center;
    background: var(--overlay-background-color);
    font-size: .8rem;
    border-radius: 0.1rem;
}
.videos .video .infos {
    margin-top: .5rem;
    display: grid;
    grid-template-columns: 3rem auto;
    gap: .7rem
}
.videos .video .infos .profile-image {
    width: 3rem;
}
.videos .video .infos .title {
    margin: 0;
    font-size: .9rem;
    text-align: start;
}
.videos .video .previews img {
    width: 100%;
}
.show-more {
    margin-top: 2rem;
}
a > .previews span {
    color: var(--text-color);
}
</style>

<style>
.select {
    position: absolute;
    top: 0;
    right: 0;
    margin-bottom: 2rem;
}
@media screen and (max-width: 768px) {
    .select {
        position: relative;
        width: fit-content;
        margin-left: auto;
        margin-right: auto;
    }
}
</style>