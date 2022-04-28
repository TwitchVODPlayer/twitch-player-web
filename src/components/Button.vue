<script setup lang="ts">
const emit = defineEmits(['click'])
const props = defineProps({
    href: String
})

const onClick = () => {
    emit('click')
}
</script>

<template>
    <component
        :is="props.href ? 'a' : 'button'"
        class="button"
        @click="onClick"
        :href="props.href"
        v-bind="$attrs"
    >
        <slot />
    </component>
</template>

<style scoped>
.button {
    background-color: hsla(0,0%,100%,0.15);
    border: none;
    display: inline-flex;
    position: relative;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    overflow: hidden;
    text-decoration: none;
    white-space: nowrap;
    user-select: none;
    border-radius: .35rem;
    font-size: 1.1rem;
    height: auto;
    color: var(--text-color);
    cursor: pointer;
    padding: .2em .5em;
}
.button:disabled {
    cursor: not-allowed;
}
.button:hover:not(:disabled) {
    background-color: var(--background-input-color);
}
.button .button-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 0.5rem;
}
.button .icon {
    display: inline-flex;
    align-items: center;
    width: 2.4rem;
}
.button .icon > svg {
    width: 1.5rem;
    margin: auto;
    fill: currentColor;
}
</style>