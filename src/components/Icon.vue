<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue'

const props = defineProps<{
    name: String
}>()

const dynamicComponent = computed(() => defineAsyncComponent(() => import(`../assets/img/${props.name}.svg`)))
</script>

<template>
    <component :is="dynamicComponent" />
</template>