<script setup lang="ts">
import { computed, onBeforeMount, onUpdated, watch } from 'vue'
import { vodModule } from '../../store/vod'
import { mainModule } from '../../store/main'
import { getPlaylistApiUrl } from '../../api/vod'
import TwitchPlayerLogo from '../../assets/img/logo.svg'

import VideoPlayer from '../VideoPlayer.vue'
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
    <div class="not-found" v-else-if="!mainModule.isLoading">
        <div>
            <TwitchPlayerLogo class="logo" />
        </div>
        <p class="details">No VOD found with id {{vodId}}</p>
    </div>
</template>

<style scoped>
.not-found {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 3rem;
}
.logo {
    width: 10rem;
}
.details {
    font-weight: bold;
}
</style>