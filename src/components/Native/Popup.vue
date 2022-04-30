<script setup lang="ts">
const props = defineProps({
    message: String
})
</script>

<template>
    <div class="popup">
        <span>{{props.message}}</span>
    </div>
</template>

<style scoped>
.popup {
    width: fit-content;
    margin: auto;
    position: fixed;
    top: 1rem;
}

.error {
    background-color: #e03c3c;
}
.success {
    background-color: #e03c3c;
}
</style>