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
    background-color: var(--background-input-color);
    border: 2px solid var(--background-input-color);
    display: inline-flex;
    position: relative;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    overflow: hidden;
    text-decoration: none;
    white-space: nowrap;
    user-select: none;
    border-radius: .3rem;
    font-size: .9rem;
    height: auto;
    color: var(--text-color);
    padding: .25em .8em;
    cursor: pointer;
    transition: border 100ms ease-in, background-color 100ms ease-in;
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