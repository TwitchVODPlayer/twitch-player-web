<script setup lang="ts">
import { computed, onBeforeMount, watch } from 'vue'
import { vodModule } from '../store/vod'
import { getPlaylistApiUrl } from '../api/vod'

import VideoPlayer from '../components/VideoPlayer.vue'
import Error from '../components/Error.vue'

const props = defineProps({
    vodId: {
        type: [Number,String],
        default: () => ""
    }
})

const vodSource = computed(() => getPlaylistApiUrl(vodModule.getVod))

watch(() => props.vodId, () => {
    setVod()
})

const setVod = function() {
    vodModule.setVod(props.vodId)
}

onBeforeMount(() => {
    setVod()
})
</script>

<template>
    <div class="content">
        <span v-if="vodModule.isLoading"></span>
        <Error v-else-if="!vodModule.isValid" title="" :message="`No VOD found with id ${vodId}`" />
        <VideoPlayer v-else :source="vodSource" />
    </div>
</template>