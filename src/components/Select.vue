<script setup lang="ts">
import { computed, Ref, ref } from 'vue'
import ArrowIcon from '../assets/img/arrow.svg'
import Button from '../components/Button.vue'


const emit = defineEmits(['select'])
const props = defineProps({
    label: String,
    options: {
        type: Array as () => Array<Option>,
        required: true
    }
})

const selectedId: Ref<number> = ref(0)
const showOptions: Ref<boolean> = ref(false)

const selectedOption = computed(() => props.options[selectedId.value])

const openDialog = function() {
    showOptions.value = true
}

const onClickOutside = function() {
    showOptions.value = false
}

const handleSelect = function(value: number) {
    selectedId.value = value
}

const onSelect = function(value: number) {
    selectedId.value = value
    onClickOutside()
    emit('select', selectedOption.value.value)
}
</script>

<template>
    <div class="select">
        <div v-if="props.label" class="label">{{props.label}}</div>
        <div class="options">
            <Button
                @click="openDialog"
                tabindex="0"
            >
                <span>{{selectedOption.label}}</span>
                <ArrowIcon class="icon" />
            </Button>
            <div
                v-if="showOptions"
                v-click-outside="onClickOutside"
                class="dialog"
            >
                <div
                    v-for="(option, id) in options"
                    :key="id"
                    @click="onSelect(id)"
                    @keydown.enter="() => handleSelect(id)"
                    :class="`option${id === selectedId ? ' selected' : ''}`"
                    tabindex="0"
                >
                    <span>{{option.label}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.select {
    display: flex;
}
.select .icon {
    width: 1.2rem;
    fill: var(--text-color);
    margin-left: .4rem;
}
.select > .label {
    margin: auto;
    margin-right: .7rem;
}
.select .dialog {
    z-index: 100;
    font-size: .9rem;
    position: absolute;
    margin-top: .5rem;
    /* display: inline-block; */
    text-align: start;
    min-width: 8rem;
    max-width: 90vw;
    background-color: var(--dialog-color);
}
.select .option {
    padding: .4rem .8rem;
    cursor: pointer;
}
.select .option:hover {
    background-color: var(--background-input-color);
}
.select .option.selected {
    background-color: var(--select-color);
}
</style>

<style>
.select .button:hover, .select .button:focus {
    background-color: var(--background-input-color) !important;
    border-color: var(--border-input-color-hover) !important;
}
</style>