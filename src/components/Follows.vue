<script setup lang="ts">
import { computed } from 'vue'
import { onBeforeMount } from 'vue'
import { followModule } from '../store/follow'

import Logo from '../assets/img/logo.svg'
import Button from './Button.vue'

const follows = computed(() => followModule.getFollows)

const showMore = function() {
    if (followModule.isLoading) return
    followModule.loadMoreFollows()
}

onBeforeMount(() => {
    followModule.loadFollows()
})
</script>

<template>
    <h2>Followed channels</h2>
    <Logo v-if="!followModule.getFollows" class="loading" />
    <div v-else>
        <div class="follows">
            <div
                v-for="(follow, i) in follows"
                :key="i"
                class="follow"
            >
                <router-link :to="`/videos/${follow.login}`" :title="follow.login">
                    <img :src="follow.profile_image_url" class="profile-image">
                </router-link>
                <router-link :to="`/videos/${follow.login}`" :title="follow.display_name">
                    <p class="username">{{follow.display_name}}</p>
                </router-link>
            </div>
        </div>
        <Logo v-if="followModule.isLoading" class="loading small" />
        <Button v-if="followModule.getNext && !followModule.isLoading" class="show-more" :disabled="followModule.isLoading" @click="showMore">Show more</Button>
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
.follows {
    display: grid;
    grid-gap: 3rem;
    grid-template-columns: repeat(5, 1fr);
    transition: .5s;
    max-width: 70rem;
    margin: auto;
    margin-top: 3rem;
}
@media screen and (max-width: 1024px) {
    .follows {
        grid-template-columns: repeat(4, minmax(0, 1fr));
    }
}
@media screen and (max-width: 768px) {
    .follows {
        grid-template-columns: repeat(3, minmax(0, 1fr));
    }
}
@media screen and (max-width: 540px) {
    .follows {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
@media screen and (max-width: 380px) {
    .follows {
        grid-template-columns: 1fr
    }
}
.follows .follow .username {
    margin-top: .5rem;
}
.follows .follow img {
    width: 5rem;
}
.show-more {
    margin-top: 2rem;
}
</style>