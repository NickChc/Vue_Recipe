<script setup lang="ts">
import { InputTypeHTMLAttribute, ref } from "vue";

interface FormInputProps {
  label?: string;
  error?: null | string;
  type?: InputTypeHTMLAttribute;
  name?: string;
}

const emit = defineEmits<{
  (e: "update:value", value: string): void;
}>();

function emitUpdate(e: Event) {
  const target = e.target as HTMLInputElement;

  emit("update:value", target.value);
}

const { label, error, type, name } = defineProps<FormInputProps>();

const showPassword = ref(false);
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <label v-if="label" class="xs:text-lg">{{ label }}</label>

    <div class="relative">
      <input
        :name="name"
        v-bind="$attrs"
        class="p-2 rounded-sm outline-add text-secondary w-full"
        @input="emitUpdate"
        :type="`${
          type === 'password'
            ? `${showPassword ? 'text' : 'password'}`
            : type || 'text'
        }`"
      />
      <button
        type="button"
        v-if="type === 'password'"
        @click="showPassword = !showPassword"
        class="absolute bottom-1/2 translate-y-1/2 right-3 grid text-secondary"
      >
        <i
          v-if="!showPassword"
          class="material-symbols-outlined text-xl sm:text-2xl"
          >visibility</i
        >
        <i v-else class="material-symbols-outlined text-xl sm:text-2xl"
          >visibility_off</i
        >
      </button>
    </div>

    <div v-if="error">{{ error }}</div>
  </div>
</template>
