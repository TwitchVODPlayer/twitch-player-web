<script setup lang="ts">
import { computed, onBeforeMount, Ref, ref } from 'vue'
import { videoModule } from '../store/video'
import { useRouter } from 'vue-router'

import Button from '../components/Button.vue'
import Select from '../components/Select.vue'
import Video from '../components/Video.vue'
import Icon from '../components/Icon.vue'

const router = useRouter()

const props = defineProps({
    login: String
})

const filterOptions: Ref<Array<SelectOption>> = ref([
    { label: "Recent", value: 'time' },
    { label: "Trending", value: 'trending' },
    { label: "Views", value: 'views' }
])

const videos = computed(() => videoModule.getVideos)

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
        <Icon v-if="!videos" name="loading" class="loading" />
        <div v-else>
            <p v-if="!videos?.length">No videos found.</p>
            <div v-else class="videos">
                <Video
                    v-for="(video, i) in videos"
                    :key="i"
                    :video="video"
                />
            </div>
            <Icon v-if="videoModule.isLoading" name="loading" class="loading small" />
            <Button v-if="videoModule.getNext && !videoModule.isLoading" class="show-more" :disabled="videoModule.isLoading" @click="showMore(20)">Show more</Button>
        </div>
    </div>
</template>

<style scoped>
.content .title {
    position: relative;
}
</style>

<style>
.title .select {
    position: absolute;
    top: 0;
    right: 0;
    margin-bottom: 2rem;
}
@media screen and (max-width: 768px) {
    .title .select {
        position: relative;
        width: fit-content;
        margin-left: auto;
        margin-right: auto;
    }
}
</style>