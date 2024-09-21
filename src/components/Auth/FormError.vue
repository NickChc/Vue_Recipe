<script setup lang="ts">
interface FormErrorProps {
  error: string;
}

const { error } = defineProps<FormErrorProps>();

const emit = defineEmits<{
  (e: "clear-error"): void;
}>();

function emitClearError() {
  emit("clear-error");
}
</script>

<template>
  <div
    class="font-semibold text-base p-2 bg-danger text-primary text-center rounded-lg my-2 px-5 relative"
  >
    {{ error }}
    <button
      @click="emitClearError"
      class="absolute bottom-1/2 translate-y-1/2 right-3 grid"
    >
      <i class="material-symbols-outlined">cancel</i>
    </button>
  </div>
</template>
