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
  <div class="flex flex-col gap-y-2 relative">
    <label v-if="label" class="xs:text-lg">{{ label }}</label>

    <input
      :name="name"
      v-bind="$attrs"
      class="p-2 rounded-sm outline-add text-secondary"
      @input="emitUpdate"
      :type="`${
        type === 'password' && !showPassword ? 'password' : type || 'text'
      }`"
    />

    <div v-if="error">{{ error }}</div>
  </div>
</template>
