<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, onMounted, Ref, ref, watch } from 'vue'
import Plyr from 'plyr'
import Hls, { Level } from 'hls.js'

import { historyModule } from '../store/history'
import { userModule } from '../store/user'
import { error } from '../utils/popup'

import Icon from './Icon.vue'

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

watch(() => props.source, () => setSource())

const setSource = function () {
    if (!hls.value || !props.source) return
    loading.value = true

    hls.value.loadSource(props.source)

    hls.value.on(Hls.Events.MANIFEST_PARSED, () => {
        if (!hls.value) return
        const availableQualities = hls.value.levels.map(l => l.height).reverse() || []
        availableQualities.unshift(0)
        player.value = new Plyr(videoRef.value, {
            quality: {
                default: 0,
                options: availableQualities || [],
                forced: true,
                onChange: (e) => updateQuality(e)
            },
            i18n: {
                qualityLabel: {
                    0: 'Auto',
                }
            }
        })
    })

    hls.value.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        if (!hls.value) return
        const span = document.querySelector(".plyr__menu__container [data-plyr='quality'][value='0'] span")
        if (!span) return
        if (hls.value.autoLevelEnabled) span.innerHTML = `Auto (${hls.value.levels[data.level].height}p)`
        else span.innerHTML = `Auto`
    })

    hls.value.on(Hls.Events.ERROR, (_, data) => {
        error(new Error(JSON.parse(data.networkDetails.response).message))
    })

    hls.value.on(Hls.Events.FRAG_CHANGED, (_, data) => {
        historyModule.setWatchtime(data.frag.start)
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
    <div :class="{ video: true, loaded: !loading }">
        <video ref="videoRef"></video>
        <div v-if="loading" class="loading-container">
            <Icon name="logo" class="loading" />
        </div>
    </div>
</template>

<style scoped>
.video {
    max-width: 1280px !important;
    max-height: 720px !important;
    margin: 2rem auto;
    position: relative;
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
.video .loading-container .loading {
    width: 4rem;
    margin: auto;
}
</style>

<style>
.video:not(.loaded) [class*="plyr__control"] {
    display: none;
}
</style>