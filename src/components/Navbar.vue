<script setup lang="ts">
import { onBeforeMount, Ref, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { userModule } from '../store/user'

import Search from '../components/Search.vue'
import Button from './Button.vue'

const router = useRouter()
const vodId: Ref<string> = ref("")
const authUrl: Ref<string> = ref("")

watch(vodId, () => {
    router.push({ name: "VOD", params: { vodId: vodId.value } })
})

onBeforeMount(() => {
    fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/auth/login`).then(res => res.json()).then(res => authUrl.value = res.url).catch(console.error)
})
</script>

<template>
    <nav id="navbar">
        <div class="navbar navbar-left">
            <router-link to="/" class="navbar-item">
                <a class="main">
                    <img src="../assets/img/logo.png" class="logo">
                </a>
            </router-link>
        </div>
        <div class="navbar navbar-center">
            <Search v-model="vodId" placeholder="Enter a VOD id..." />
        </div>
        <div class="navbar navbar-right">
            <!-- <div v-if="userModule.isLogged" class="navbar-item">
                <router-link to="/profile" class="navbar-item">
                    <img class="user-icon" :src="userModule.getUser?.profile_image_url">
                </router-link>
            </div>
            <div v-else class="navbar-item">
                <Button class="right" :href="authUrl">Login</Button>
            </div> -->
        </div>
    </nav>
</template>

<style scoped>
#navbar {
    background-color: var(--navbar-color);
    display: flex;
    height: 3rem;
    z-index: 100;
    font-size: 1.5em;
    font-size: 1.25em;
}
#navbar .navbar {
    display: flex;
    align-items: center;
}
#navbar .navbar-left {
    flex: 1;
    justify-content: flex-start;
}
#navbar .navbar-right {
    flex: 1;
    justify-content: flex-end;
}
#navbar .navbar-center {
    flex: 2;
    flex-shrink: 1;
    justify-content: center;
}
#navbar .navbar-item {
    padding-left: 2rem;
    padding-right: 2rem;
}
#navbar a {
    text-decoration: none;
    cursor: pointer;
    color: inherit;
}
#navbar .logo {
    width: 1.7rem;
    transition: cubic-bezier(0.075, 0.82, 0.165, 1) 1s;
    vertical-align: bottom;
}
#navbar .logo:hover {
    transform: scale(1.2);
}
#navbar .user-icon {
    width: 2rem;
}
</style>
