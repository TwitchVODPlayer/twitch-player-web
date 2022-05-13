<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

onBeforeMount(() => {
    router.replace({ path: String(router.currentRoute.value.query.next || '/') })
})
</script>

<template>
    <div class="content">
        <h2>Reloading...</h2>
    </div>
</template>