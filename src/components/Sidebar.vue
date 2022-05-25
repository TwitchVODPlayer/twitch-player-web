<script setup lang="ts">
import { ref, Ref } from 'vue'

import { userModule } from '../store/user'
import { historyModule } from '../store/history'

import Icon from './Icon.vue'

const extended: Ref<boolean> = ref(false)
</script>

<template>
    <nav id="sidebar" v-if="userModule.isLogged && historyModule.getHistory" :class="{ extended }">
        <div class="sidebar">
            <div class="collapse">
                <div class="item">
                    <div v-if="extended" class="info">Library</div>
                    <Icon class="icon" name="collapse" @click="extended = !extended" />
                </div>
            </div>
            <div class="items">
                <router-link class="item" :to="{ name: 'History' }">
                    <Icon class="icon" name="history" />
                    <div class="info">History</div>
                </router-link>
                <router-link class="item" :to="{ name: 'WatchLater' }">
                    <Icon class="icon" name="watch" />
                    <div class="info">Watch Later</div>
                </router-link>
            </div>
        </div>
    </nav>
</template>

<style scoped>
#sidebar {
    background-color: var(--sidebar-color);
    width: 3rem !important;
    height: 100% !important;
    display: flex;
    flex-direction: column;
    flex-shrink: 0 !important;
    overflow: hidden;
    position: fixed;
    left: 0;
    top: 3.5rem;
    z-index: 50;
}
#sidebar.extended {
    width: 12rem;
}
@media screen and (max-width: 540px) {
    #sidebar {
        height: 3.5rem !important;
        width: 100% !important;
        bottom: 0 !important;
        top: unset;
    }
    .sidebar .collapse {
        display: none;
    }
    .sidebar .items {
        flex-direction: row !important;
        justify-content: space-evenly;
    }
}
.sidebar {
    padding-bottom: 0;
    margin-bottom: 0;
    max-height: inherit;
}
.sidebar .items {
    display: flex;
    flex-direction: column;
    font-size: .9rem;
}
.extended .sidebar .item {
    display: flex;
    justify-content: center;
    align-items: center;
}
.sidebar .icon {
    padding: .3rem;
    border-radius: .3rem;
    cursor: pointer;
}
.sidebar .collapse .item {
    margin-top: .5em;
    margin-bottom: .2em;
}
.sidebar .item .info {
    font-size: .7rem;
}
.extended .sidebar .item {
    justify-content: start;
    padding-left: .6em;
    padding-right: .6em;
}
.extended .sidebar .item .info {
    margin-left: .5em;
    font-size: .9rem;
}
.extended .sidebar .collapse .item {
    justify-content: space-between;
    margin-top: .5em;
}
.extended .sidebar .collapse .item .info {
    text-transform: uppercase;
    font-size: 1rem;
}
.extended .sidebar .collapse .item .icon {
    transform: rotate(180deg);
}
.sidebar .icon:hover {
    background-color: var(--background-input-color);
}
svg {
    width: 1.3rem;
    vertical-align: bottom;
}
</style>