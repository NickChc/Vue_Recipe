<script setup lang="ts">
interface FieldErrorProps {
  error?: string;
}

const { error } = defineProps<FieldErrorProps>();
</script>

<template>
  <div
    :class="`overflow-hidden text-danger dark:text-danger-dark font-semibold transition-[height] duration-300 ${
      error ? 'h-[1.4em]' : 'h-0'
    }`"
  >
    {{ error }}
  </div>
</template>
