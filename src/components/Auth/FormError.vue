<script setup lang="ts">
import { ref } from "vue";

interface FormErrorProps {
  error: string;
}

const { error } = defineProps<FormErrorProps>();

const show = ref(true);

const emit = defineEmits<{
  (e: "clear-error"): void;
}>();

function emitClearError() {
  emit("clear-error");
}
</script>

<template>
  <div
    v-if="show"
    class="flex items-start justify-start font-semibold text-sm xs:text-base p-2 pr-8 bg-danger text-primary text-center rounded-lg my-2 sm:px-5 relative"
  >
    {{ error }}
    <button
      @click="
        () => {
          emitClearError();
          show = false;
        }
      "
      class="absolute top-1 right-2 grid"
    >
      <i class="material-symbols-outlined text-base xs:text-xl sm:text-2xl"
        >cancel</i
      >
    </button>
  </div>
</template>
