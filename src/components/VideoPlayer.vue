<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, onMounted, Ref, ref, watch } from 'vue'
import Plyr from 'plyr'
import Hls, { Level } from 'hls.js'

import { historyModule } from '../store/history'
import { userModule } from '../store/user'
import { error } from '../utils/popup'
import { useRoute } from 'vue-router'

import Icon from './Icon.vue'

const route = useRoute()
const props = defineProps({
    options: {
        type: Object,
        default: () => ({})
    },
    source: String
})

const player: Ref<Plyr | null> = ref(null)
const hls: Ref<Hls | null> = ref(null)
const videoRef: Ref<HTMLElement | string> = ref("videoRef")
const loading: Ref<boolean> = ref(false)
const availableQualities: Ref<Array<SelectOption>> = ref([])
const iframe = ref(false)

watch(() => props.source, () => setSource())

const getQualityLabel = function(quality: string) {
    quality = quality.split(',')[0]
    if (quality === "chunked") return "Source"
    return quality.replace('p30', 'p')
}

const setSource = function() {
    if (!hls.value || !props.source) return
    loading.value = true

    hls.value.loadSource(props.source)

    hls.value.on(Hls.Events.MANIFEST_PARSED, () => {
        if (!hls.value) return
        availableQualities.value = hls.value.levels.map(l => ({
            label: getQualityLabel(l.attrs.VIDEO),
            value: l.height
        })).reverse() || []
        availableQualities.value.unshift({
            label: 'Auto',
            value: 0
        })
        player.value = new Plyr(videoRef.value, {
            quality: {
                default: 0,
                options: availableQualities.value.map(q => Number(q.value)) || [],
                forced: true,
                onChange: (e) => updateQuality(e)
            },
            i18n: {
                qualityLabel: {
                    0: 'Auto'
                }
            }
        })
        player.value.on('ended', () => {
            historyModule.setWatchtime({ start: 0 })
        })
        player.value.on('qualitychange', (event: any) => {
            const qualitySetting = document.querySelector('[role="menu"] > [data-plyr="settings"]:nth-child(2) .plyr__menu__value')
            if (qualitySetting) qualitySetting.innerHTML = availableQualities.value.find(q => event.detail.quality == q.value)?.label || event.detail.quality
        })
    })

    hls.value.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        if (!hls.value) return
        const span = document.querySelector(".plyr__menu__container [data-plyr='quality'][value='0'] span")
        if (!span) return
        const qualityLabel = String(availableQualities.value[hls.value.levels.length - data.level].label)

        if (hls.value.autoLevelEnabled) span.innerHTML = `Auto (${qualityLabel})`
        else span.innerHTML = `Auto`

        availableQualities.value.forEach(q => {
            if (q.label === "Auto") return
            const span = document.querySelector(`.plyr__menu__container [data-plyr='quality'][value='${q.value}'] span`)
            if (span) span.innerHTML = String(q.label)
        })
    })

    hls.value.on(Hls.Events.ERROR, (_, data) => {
        error(new Error(JSON.parse(data.networkDetails.response).message))
    })

    hls.value.on(Hls.Events.FRAG_CHANGED, (_, data) => {
        historyModule.setWatchtime({ start: data.frag.start })
        loading.value = false
    })

    hls.value.attachMedia(videoRef.value as HTMLMediaElement)
}

const updateQuality = function (newQuality: number) {
    if (!hls.value) return
    if (newQuality === 0) {
        hls.value.currentLevel = -1
    } else {
        hls.value.levels.forEach((level: Level, levelIndex: number) => {
            if (level.height === newQuality && hls.value) {
                hls.value.currentLevel = levelIndex
            }
        })
    }
}

onBeforeMount(() => {
    if (!Hls.isSupported()) error("Your browser doesn't support Hls.")
    iframe.value = route.query.hasOwnProperty('iframe')
})

onMounted(() => {
    hls.value = new Hls({
        xhrSetup: xhr => xhr.setRequestHeader('Authorization', `Bearer ${userModule.getAccessToken}`),
        startPosition: historyModule.getVodStart()
    })
    setSource()
})

onBeforeUnmount(() => {
    player.value?.destroy()
    hls.value?.destroy()
})
</script>

<template>
    <div class="video" :class="{ 'loaded': !loading, 'iframe': iframe }">
        <video ref="videoRef"></video>
        <div v-if="loading" class="loading-container">
            <Icon name="loading" class="loading" />
        </div>
    </div>
</template>

<style scoped>
.video {
    max-width: 1280px;
    max-height: 720px;
    margin: 2rem auto;
    position: relative;
}
.video.iframe {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    max-width: unset;
    max-height: unset;
    z-index: 10000;
    margin: 0;
    padding: 0;
}
.video .loading-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    vertical-align: middle;
}
</style>

<style>
.video:not(.loaded) [class*="plyr__control"] {
    display: none;
}
.plyr__menu__container .plyr__control[role=menuitemradio]:before {
    background: var(--background-input-color);
}
</style>