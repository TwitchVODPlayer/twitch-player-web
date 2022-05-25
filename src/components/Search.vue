<script setup lang="ts">
import { Ref, ref } from 'vue'

import Icon from './Icon.vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue: String,
    placeholder: {
        type: String,
        default: 'Search'
    },
})
const searchRef: Ref<HTMLInputElement|null> = ref(null)
const disabledButton: Ref<boolean> = ref(true)
const updateValue = () => {
    emit('update:modelValue', searchRef.value?.value)
}
const onInput = function() {
    disabledButton.value = !searchRef.value?.value
}
</script>

<template>
    <div id="search">
        <div class="search-input">
            <input
                id="search-input"
                ref="searchRef"
                type="search"
                :modelValue="props.modelValue"
                @input="onInput"
                :placeholder="props.placeholder"
                autocomplete="off"
                @keydown.enter="updateValue"
            >
        </div>
        <div class="search-icon">
            <button class="search-button" :disabled="disabledButton" @click="updateValue">
                <Icon name="search" class="icon" />
            </button>
        </div>
    </div>
</template>

<style scoped>
#search {
    display: flex;
    width: 100%;
    max-width: 30rem;
    height: 2.3rem;
}
#search .search-input {
    flex-grow: 1;
    position: relative;
    flex-basis: 40rem;
    margin-right: 1px;
}
#search-input {
    font-family: inherit;
    appearance: none;
    background-clip: padding-box;
    line-height: 1.5;
    display: block;
    outline: none;
    width: 100%;
    height: 100%;
    font-size: .9rem;
    background-color: var(--background-input-color);
    color: var(--text-color) !important;
    border-radius: 6px 0 0 6px !important;
    padding: .4rem .6rem !important;
    border: 2px solid var(--background-input-color);
    transition: border 100ms ease-in, background-color 100ms ease-in;
}
#search-input:hover {
    border-color: var(--border-input-color-hover);
}
#search-input:focus, #search-input:active {
    outline: none;
    border-color: var(--primary-color);
    background-color: black;
}
#search-input::placeholder {
    color: #c8c8c9;
}

#search .search-icon {
    background-color: var(--background-input-color-darker);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    text-decoration: none;
    white-space: nowrap;
    user-select: none;
    border-radius: 0 6px 6px 0 !important;
    font-size: .9rem;
}
#search .search-icon:hover {
    background-color: var(--background-input-color);
}
#search .search-button .icon {
    fill: var(--text-color);
}
#search .search-button {
    background-color: transparent;
    border: none;
    padding: .2rem;
    width: 2rem;
    cursor: pointer;
}
#search .search-button:disabled {
    cursor: not-allowed;
}
#search .search-icon svg {
    width: 1.5rem;
}
</style>