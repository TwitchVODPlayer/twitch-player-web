<script setup lang="ts">
import { computed, onBeforeMount } from 'vue'
import { followModule } from '../store/follow'

import Button from './Button.vue'
import Icon from './Icon.vue'

const follows = computed(() => followModule.getFollows)

const showMore = function(number: number) {
    if (followModule.isLoading) return
    followModule.loadMoreFollows(number)
}

onBeforeMount(() => {
    followModule.loadFollows(20)
})
</script>

<template>
    <h2>Followed channels</h2>
    <Icon v-if="!followModule.getFollows" name="loading" class="loading" />
    <div v-else>
        <div class="follows">
            <div
                v-for="(follow, i) in follows"
                :key="i"
                class="follow"
            >
                <router-link :to="`/videos/${follow.login}`" :title="follow.login">
                    <div class="follow-container">
                        <img class="follow-image profile-image" :src="follow.profile_image_url">
                        <div class="follow-background"></div>
                    </div>
                </router-link>
                <router-link :to="`/videos/${follow.login}`" :title="follow.display_name">
                    <p class="username">{{follow.display_name}}</p>
                </router-link>
            </div>
        </div>
        <Icon v-if="followModule.isLoading" name="loading" class="loading small" />
        <div class="buttons-group">
            <Button v-if="followModule.getNext && !followModule.isLoading" class="show-more" :disabled="followModule.isLoading" @click="showMore(20)">Show more</Button>
        </div>
    </div>
</template>

<style scoped>
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
.follows .follow .follow-container {
    width: 5rem;
    height: 5rem;
    margin: auto;
    position: relative;
}
.follows .follow .follow-container > * {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    position: absolute;
    left: 0;
    top: 0;
    transition-delay: 75ms;
    transition-duration: 100ms;
}
.follow-image:hover ~ .follow-background {
    transform: scale(1) !important;
    transition-delay: 75ms;
    transition-duration: 100ms;
}
.follows .follow .follow-background {
    z-index: 1;
    transform: scale(.9);
    background-color: var(--primary-color);
}
.follows .follow .follow-image {
    z-index: 2;
    background-color: var(--background-color);
}
.follows .follow .follow-image:hover {
    transform: translate3d(.3rem, -.3rem, 0);
}
.show-more {
    margin-top: 2rem;
}
</style>