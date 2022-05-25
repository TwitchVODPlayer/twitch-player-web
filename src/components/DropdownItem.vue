<script lang="ts">
    export default {
        name: 'dropdown-item',
        inheritAttrs: false,
        customOptions: {}
    }
</script>

<script setup lang="ts">
import { ref, Ref } from 'vue'

import Icon from './Icon.vue'
import Dropdown from './Dropdown.vue'

defineProps<{
    option: DropdownItem
}>()

const showChildren: Ref<boolean> = ref(false)
</script>

<template>
    <div
        @click="event => option.action?.(event)"
        @mouseleave="showChildren = false"
        class="options"
        tabindex="0"
    >
        <slot name="option">
            <div
                class="item"
                @mouseover="showChildren = true"
            >
                <button class="button">
                    <div class="elements">
                        <Icon v-if="option.icon" :name="option.icon" />
                        <div>{{option.label}}</div>
                        <Icon v-if="option.children?.length" name="arrow" class="arrow" />
                    </div>
                </button>
                <Dropdown v-if="showChildren && option.children?.length" :options="option.children" no-trigger />
            </div>
        </slot>
    </div>
</template>

<style scoped>
.dropdown .options {
    display: flex;
    flex-direction: column;
    padding: .4rem;
    position: relative;
}
.dropdown  .options .item {
    position: relative;
    width: 100%;
}
.dropdown .item .button {
    font-size: .9rem;
    display: block;
    width: 100%;
    color: inherit;
    background: none;
    border: none;
    border-radius: .2rem;
    text-align: inherit;
    cursor: pointer;
    padding: 0;
}
.dropdown .item .button:hover {
    background-color: var(--border-input-color-hover);
}
.dropdown .item .button .elements {
    position: relative;
    display: flex;
    gap: .5rem;
    padding: .4rem;
    align-items: center;
}
.dropdown .item .button svg {
    width: 1.2rem;
    margin-left: -.2rem;
}
.dropdown .item .button .arrow {
    transform: rotate(-90deg);
    position: absolute;
    right: 0.2rem;
}
</style>