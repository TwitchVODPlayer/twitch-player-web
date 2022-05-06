<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

onBeforeMount(() => {
    useRouter().replace({ name: "Dashboard" })
})
</script>

<template>
    <div class="content">
        <h2>Reloading...</h2>
    </div>
</template>