<script setup lang="ts">
import Button from '../Button.vue'

</script>

<template>
    <div class="content">
        <div>
            <h1>404</h1>
            <p>
                Oops! The page you requested doesn't exist :'(
            </p>
            <Button @click="$router.back()">Go back</Button>
        </div>
    </div>
</template>

<style scoped>
</style>