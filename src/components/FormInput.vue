<script setup lang="ts">
import { InputTypeHTMLAttribute, ref } from "vue";

interface FormInputProps {
  label?: string;
  error?: null | string;
  type?: InputTypeHTMLAttribute;
  name?: string;
  disabled?: boolean;
  placeholder?: string;
  hint?: string;
}

const emit = defineEmits<{
  (e: "update:value", inputEvent: Event): void;
  (e: "keyobard", keyboardInput: Event): void;
}>();

function emitUpdate(e: Event) {
  emit("update:value", e);
}

function emitKeyboard(e: Event) {
  emit("keyobard", e);
}

const { label, error, type, name, disabled, placeholder, hint } =
  defineProps<FormInputProps>();

const showPassword = ref(false);
</script>

<template>
  <div class="flex flex-col">
    <label
      v-if="label"
      class="xs:text-lg mb-0.5 sm:text-xl md:text-2xl 2xl:text-3xl"
      >{{ label }}</label
    >

    <div class="relative">
      <input
        @keydown="emitKeyboard"
        :placeholder="placeholder"
        :disabled="disabled"
        :name="name"
        class="p-2 rounded-sm outline-add text-secondary w-full disabled:bg-add-2 dark:disabled:bg-primary disabled:opacity-50 disabled:text-primary"
        @input="emitUpdate"
        :type="`${
          type === 'password'
            ? `${showPassword ? 'text' : 'password'}`
            : type || 'text'
        }`"
      />
      <button
        :disabled="disabled"
        type="button"
        v-if="type === 'password'"
        @click="showPassword = !showPassword"
        class="absolute bottom-1/2 translate-y-1/2 right-3 grid text-secondary disabled:opacity-75"
      >
        <i
          v-if="!showPassword"
          class="material-symbols-outlined text-xl sm:text-2xl`"
          >visibility</i
        >
        <i v-else class="material-symbols-outlined text-xl sm:text-2xl`"
          >visibility_off</i
        >
      </button>
    </div>

    <div v-if="error == null && hint != null" class="h-[1em] mt-1">
      <div
        :class="`overflow-hidden font-semibold text-xs xs:text-sm sm:text-base xl:text-lg duration-300 ${
          !!hint ? 'h-[1.4em]' : 'h-0'
        }`"
      >
        {{ hint }}
      </div>
    </div>

    <div
      :class="`overflow-hidden text-danger dark:text-danger-dark font-semibold text-xs xs:text-sm sm:text-base xl:text-lg duration-300 ${
        error ? 'h-[1.4em]' : 'h-0'
      }`"
    >
      {{ error }}
    </div>
  </div>
</template>
