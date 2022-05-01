<script setup lang="ts">
import { onBeforeMount, Ref, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { userModule } from '../store/user'

import Search from './Search.vue'
import Button from './Button.vue'
import Logo from '../assets/img/logo.svg'

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
                <Logo class="logo" />
            </router-link>
        </div>
        <div class="navbar navbar-center">
            <Search v-model="vodId" placeholder="Enter a VOD id..." />
        </div>
        <div class="navbar navbar-right">
            <router-link v-if="userModule.isLogged" to="/profile" class="navbar-item">
                <img :src="userModule.getUser?.profile_image_url" class="profile-image">
            </router-link>
            <div v-else class="navbar-item">
                <Button class="right" :href="authUrl">Login</Button>
            </div>
        </div>
    </nav>
</template>

<style scoped>
#navbar {
    background-color: var(--navbar-color);
    display: flex;
    height: 3.4rem;
    z-index: 100;
    font-size: 1.5em;
    font-size: 1.25em;
    box-shadow: 0 1px 2px rgba(0,0,0,.9),0 0px 2px rgba(0,0,0,.9);
}
.navbar {
    display: flex;
    align-items: center;
}
.navbar-left {
    flex: 1;
    justify-content: flex-start;
}
.navbar-right {
    flex: 1;
    justify-content: flex-end;
}
.navbar-center {
    flex: 2;
    flex-shrink: 1;
    justify-content: center;
}
.navbar-item {
    padding: 0.8rem;
}
a {
    text-decoration: none;
    cursor: pointer;
    color: inherit;
    outline: none;
}
svg {
    width: 1.5rem;
    vertical-align: bottom;
}
img {
    width: 1.9rem;
}
</style>

<style>
#navbar .logo:hover .arrow {
    transform-origin: 27px 46px;
    animation: .8s rotate-third cubic-bezier(0.23, .7, 0.320, 1);
}
</style>