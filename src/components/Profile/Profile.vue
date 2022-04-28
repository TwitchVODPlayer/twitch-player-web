<script setup lang="ts">
import { useRouter } from 'vue-router'
import { userModule } from '../../store/user'
import Button from '../Button.vue'

const router = useRouter()

const logout = function() {
    userModule.logout().then(() => {
        router.push({ name: "Login" })
    })
}
</script>

<template>
    <div class="content">
        <Button class="right" @click="logout">Logout</Button>
        <p v-for="([key, value]) in Object.entries(userModule.getUser || {})" :key="key">
            <strong>[{{key}}]</strong> {{value}}
        </p>
    </div>
</template>

<style scoped>
</style>