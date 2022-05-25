<script setup lang="ts">
import { computed } from 'vue'

import { mainModule } from '../store/main'

import Icon from './Icon.vue'

const isLoading = computed(() => mainModule.isLoading)

</script>

<template>
    <div id="loading" v-if="isLoading">
        <Icon name="logo" class="loading" />
    </div>
</template>

<style scoped>
#loading {
    background-color: var(--loading-background-color);
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    z-index: 9999;
}
</style>