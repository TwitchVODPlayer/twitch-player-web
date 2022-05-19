<script setup lang="ts">
import { mainModule } from '../store/main'

import Button from './Button.vue'
import Icon from './Icon.vue'

const props = defineProps({
    title: {
        type: String,
        default: () => "Error"
    },
    message: {
        type: String,
        default: () => "Sorry for the inconvenience :'("
    },
})
</script>

<template>
    <div id="error" v-if="!mainModule.isLoading">
        <div class="not-found">
            <Icon name="error" class="image" />
            <h1 v-if="props.title">{{props.title}}</h1>
            <p v-if="props.message" class="details">{{props.message}}</p>
            <Button class="back" @click="$router.back()">Go back</Button>
        </div>
    </div>
</template>

<style scoped>
.not-found {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 3rem;
}
.details {
    margin-bottom: 2rem;
}
.back {
    width: fit-content;
    margin: auto;
}
.image {
    width: 8rem;
    height: 10rem;
    margin: 2rem auto;
}
</style>
<style>
#error .image .shadow {
    animation: float 3s ease-in-out infinite;
    animation-delay: .3s;
}
#error .image .body {
    animation: float 3s ease-in-out infinite;
}
@keyframes float {
    0% { transform: translateY(0rem); }
    50% { transform: translateY(4rem); }
    100% { transform: translateY(0rem); }
}
</style>