<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import SearchIcon from '../assets/img/search.svg'

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
                <SearchIcon />
            </button>
        </div>
    </div>
</template>

<style scoped>
#search {
    display: flex;
    width: 100%;
    max-width: 30rem;
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
    width: 2.8rem;
    display: inline-flex;
    position: relative;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
    overflow: hidden;
    text-decoration: none;
    white-space: nowrap;
    user-select: none;
    border-radius: 0 6px 6px 0 !important;
    font-size: .9rem;
    cursor: pointer;
}
#search .search-icon:hover {
    background-color: var(--background-input-color);
}
#search .search-button {
    background-color: transparent;
    border: none;
    padding: .2rem;
}
#search .search-button:disabled {
    cursor: not-allowed;
}
#search .search-icon svg {
    width: 100%;
    fill: var(--text-color);
}
</style>