<script setup lang="ts">
import { computed } from 'vue'

const emit = defineEmits(['update:modelValue', 'toggle'])
const props = defineProps({
    id: {
        type: String,
        default: () => "toggle-id"
    },
    label: String,
    modelValue: Boolean,
    checked: Boolean,
    disabled: Boolean
})

const isChecked = computed(() => props.modelValue || props.checked)

const onToggle = function(value: boolean) {
    emit('update:modelValue', value)
    emit('toggle', value)
}
</script>

<template>
    <div class="toggle">
        <div class="label">
            {{props.label}}
        </div>
        <div class="input">
            <input
                type="checkbox"
                :id="props.id"
                :disabled="props.disabled"
                :checked="isChecked"
                @change="onToggle(!props.modelValue)"
            >
            <label :for="props.id"></label>
        </div>
    </div>
</template>

<style scoped>
.toggle {
    display: flex;
    position: relative;
    align-self: flex-start;
    justify-content: center;
}
.toggle .label {
    margin-right: 1rem;
}
.input {
    display: flex;
    position: relative;
}
.input > input {
    position: absolute;
    opacity: 0;
    margin: 0;
    padding: 0;
}
.input > label {
    display: inline-block;
    position: relative;
    order: 0;
    width: 2.2rem;
    height: 1.1rem;
    cursor: pointer;
    vertical-align: bottom;
    border-width: 2px;
    border-style: solid;
    border-radius: 1rem;
    transition-property: background-color;
    transition-timing-function: ease;
    transition-duration: 100ms;
    border-color: var(--text-color);
    content: "";
}
.input > label::after {
    display: block;
    position: absolute;
    top: 0.15rem;
    bottom: 0.2rem;
    width: .8rem;
    height: .8rem;
    left: .15rem;
    transition-property: left;
    transition-timing-function: ease;
    transition-duration: 100ms;
    border-radius: 50%;
    background-color: var(--text-color);
    content: "";
}
input:checked + label {
    border-color: var(--primary-color);
    background-color: black;
}
input:checked + label::before {
    border-width: 0 0 2px 2px;
    border-style: solid;
    border-color: var(--primary-color);
    display: block;
    position: absolute;
    top: 0.45rem;
    left: 0.6rem;
    width: 0.55rem;
    height: 0.25rem;
    transform: translate3d(-50%, -50%, 0px) rotate(-45deg);
    content: "";
}
input:checked + label::after {
    background-color: var(--primary-color);
    left: calc((100% - 1rem) + .05rem)
}
input:disabled + label, input:disabled + label::before {
    border-color: var(--background-input-color);
}
input:disabled + label::after {
    background-color: var(--background-input-color);
}
</style>