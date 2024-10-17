<script setup lang="ts">
import Button from "@/components/Button.vue";

interface AssurePopupProps {
  loading?: boolean;
  title?: string;
  type?: "danger";
  loadingText?: string;
}

const { loadingText, type } = defineProps<AssurePopupProps>();

const emit = defineEmits<{
  (e: "on-confirm"): void;
  (e: "on-decline"): void;
}>();

function emitConfirm() {
  emit("on-confirm");
}

function emitDecline() {
  emit("on-decline");
}
</script>

<template>
  <div
    class="px-4 sm:px-6 py-4 flex flex-col gap-y-3 rounded-sm bg-primary dark:bg-secondary w-[500px] max-w-[95vw] mx-auto border border-primary"
  >
    <div :class="`flex items-end  ${type === 'danger' ? 'text-danger' : ''}`">
      <h2 class="text-lg sm:text-xl md:text-2xl font-semibold">{{ title }}</h2>
      <span v-if="type === 'danger'">
        <i class="material-symbols-outlined text-2xl">priority_high</i>
      </span>
    </div>
    <p class="sm:text-lg md:text-xl">
      <slot></slot>
    </p>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-x-6 mt-4 text-base sm:text-lg md:text-xl w-full"
    >
      <Button @click="emitDecline" variation="primary">{{
        $t("no").toLocaleUpperCase()
      }}</Button>

      <Button
        :disabled="loading"
        @click="emitConfirm"
        variation="danger-filled"
        >{{
          loading
            ? loadingText || `${$t("yes").toLocaleUpperCase()}...`
            : $t("yes").toLocaleUpperCase()
        }}</Button
      >
    </div>
  </div>
</template>
