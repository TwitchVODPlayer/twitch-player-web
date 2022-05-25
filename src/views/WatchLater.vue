<script setup lang="ts">
import { computed, onBeforeMount, Ref, ref } from 'vue'

import { historyModule } from '../store/history'
import { videoModule } from '../store/video'

import Icon from '../components/Icon.vue'
import Video from '../components/Video.vue'
import Button from '../components/Button.vue'

const videos: Ref<Array<Video>|undefined> = ref(undefined)

const availableVideos = computed(() => videos.value?.filter(video => historyModule.isInWatchLater(Number(video.id))) || [])
const canShowMore = computed(() => !videoModule.isLoading && ((historyModule.getWatchLater?.length ?? 0) > (availableVideos.value?.length ?? 0)))

const showMore = function(number: number) {
    if (historyModule.isLoading) return
    const currentVideoIndex = availableVideos.value?.length || 0
    const history = historyModule.getWatchLater?.slice(currentVideoIndex, currentVideoIndex + number)
    if (!history?.length) return
    videoModule.fetchVideos(history).then((vids: Array<Video>|undefined) => {
        videos.value = [...(availableVideos.value || []),  ...(vids || [])]
    })
}

onBeforeMount(() => {
    const history = historyModule.getWatchLater?.slice(0, 20)
    if (!history?.length) return
    videoModule.fetchVideos(history).then((vids: Array<Video>|undefined) => {
        videos.value = [...(vids || [])]
    })
})
</script>

<template>
    <div class="content">
        <Icon v-if="!availableVideos" name="loading" class="loading" />
        <div v-else>
            <p v-if="!availableVideos?.length">No videos found in Watch Later.</p>
            <div v-else class="videos">
                <Video
                    v-for="(video, i) in availableVideos"
                    :key="i"
                    :video="video"
                />
            </div>
            <Icon v-if="videoModule.isLoading" name="loading" class="loading small" />
            <div class="buttons-group">
                <Button v-if="canShowMore" class="show-more" :disabled="videoModule.isLoading" @click="showMore(20)">Show more</Button>
            </div>
        </div>
    </div>
</template>