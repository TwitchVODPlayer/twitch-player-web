<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue'
import DropdownItem from './DropdownItem.vue'
import Icon from './Icon.vue'

const emit = defineEmits(['open','close'])
const props = defineProps<{
    label?: String,
    options: Array<DropdownItem>,
    loading?: boolean,
    noTrigger?: boolean
}>()

const showItems: Ref<boolean> = ref(false)
const dialog: Ref<HTMLElement|null> = ref(null)

const openDialog = function() {
    showItems.value = true
    emit('open')
}

const onClickOutside = function() {
    showItems.value = false
    emit('close')
}

onMounted(() => {
    const rect = dialog.value?.getBoundingClientRect()
    if (Number(rect?.x) + Number(rect?.width) > window.innerWidth) dialog.value?.classList.add('left')
    else dialog.value?.classList.remove('left')
})
</script>

<template>
    <div class="dropdown">
        <div v-if="props.label" class="label">{{props.label}}</div>
        <div class="options">
            <div
                v-if="!noTrigger"
                @click="openDialog"
                tabindex="0"
            >
                <slot name="trigger" />
            </div>
            <div
                v-if="showItems || noTrigger"
                v-click-outside="onClickOutside"
                class="dialog"
                ref="dialog"
            >
                <div class="container">
                    <div v-if="loading" class="load">
                        <Icon name="loading" />
                    </div>
                    <DropdownItem
                        v-else
                        v-for="(option, id) in options"
                        :key="id"
                        :option="option"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.dropdown {
    position: relative;
}
.dropdown .options .dialog {
    z-index: 100;
    font-size: .9rem;
    position: absolute;
    margin: .5rem auto;
    text-align: start;
    color: inherit !important;
    display: inline-block;
    max-width: 90vw;
    min-width: 10rem;
    width: max-content;
    inset: auto 0 100% auto;
    padding: .5rem;
}
.dropdown .options .dialog .container {
    background-color: var(--dialog-color);
    border-radius: 0.4rem !important;
    box-shadow: 0 4px 8px #00000022, 0 0 4px #00000022;
}
.dropdown .options .dialog .load {
    display: flex;
    justify-content: center;
}
.dropdown .options .dialog .load > svg {
    width: 1.45rem;
    padding: .4rem;
    animation: rotate 1.5s linear infinite;
}
.dropdown .options .icon {
    width: 1.2rem;
    height: 1.2rem;
    padding: .3rem;
    border-radius: .3rem;
    cursor: pointer;
}
.dropdown .options .icon:hover {
    background-color: var(--background-input-color);
}
.dropdown .dialog .dropdown .dialog {
    inset: auto auto auto 102% !important;
    margin-top: -2.85rem;
}
.dropdown .dialog .dropdown .dialog.left {
    inset: auto auto auto -120% !important;
}
</style>