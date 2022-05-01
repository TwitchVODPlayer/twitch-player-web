<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { userModule } from '../store/user'

import Button from '../components/Button.vue'

const router = useRouter()

const profile = computed(() => userModule.getUser)

const logout = function() {
    userModule.logout().then(() => {
        router.push({ name: "Login" })
    })
}
</script>

<template>
    <div class="content">
        <div class="profile">
            <img :src="profile?.profile_image_url" class="profile-image">
            <p>{{profile?.display_name}}</p>
            <p>{{profile?.description}}</p>
            <Button @click="logout">Logout</Button>
        </div>
    </div>
</template>

<style scoped>
.profile {
    text-align: center;
}
.profile .profile-image {
    width: 8rem;
}
</style>