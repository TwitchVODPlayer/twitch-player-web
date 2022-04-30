<script setup lang="ts">
import { computed, onBeforeMount, watch } from 'vue'
import { vodModule } from '../../store/vod'
import { getPlaylistApiUrl } from '../../api/vod'

import VideoPlayer from '../VideoPlayer.vue'
import Error from '../Native/Error.vue'

const props = defineProps({
    vodId: {
        type: [Number,String],
        default: () => ""
    }
})

const vodSource = computed(() => getPlaylistApiUrl(vodModule.vod))

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
    <VideoPlayer v-if="vodModule.isValid" :source="vodSource" />
    <Error title="" :message="`No VOD found with id ${vodId}`" />
</template>