<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { userModule } from '../store/user'
import { historyModule } from '../store/history'

import Button from '../components/Button.vue'
import Toggle from '../components/Toggle.vue'

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
            <p><Toggle label="History" :checked="historyModule.isEnabled" :disabled="historyModule.isLoading" @toggle="historyModule.toggleHistory" /></p>
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
.profile p {
    margin: 2rem auto;
}
.profile .experimental {
    margin-top: .3rem;
}
.profile .experimental .icon {
    width: 1rem;
    height: 1rem;
    vertical-align: bottom;
    margin-bottom: 0.1em;
}
</style>