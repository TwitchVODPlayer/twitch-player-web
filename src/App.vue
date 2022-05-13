<script setup lang="ts">
import { onBeforeMount } from 'vue'

import Navbar from './components/Navbar.vue'
import Loading from './components/Loading.vue'
import { mainModule } from './store/main'
import './store/history'
import './store/user'
import './store/follow'
import './store/video'
import './store/vod'

onBeforeMount(() => {
    mainModule.load()
})
</script>

<template>
    <Loading />
    <Navbar />
    <router-view />
</template>

<style>
@import 'plyr/dist/plyr.css';
@import '/src/assets/css/main.css';
@import 'vue-toast-notification/dist/theme-default.css';

body {
    font-family: "Inter","Roobert","Helvetica Neue",Helvetica,Arial,sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
}
html, body {
    padding: 0;
    margin: auto;
    background-color: var(--background-color);
    color: var(--text-color);
}
.v-toast > .v-toast__item {
    min-height: unset;
    height: 1.75rem;
}
</style>
