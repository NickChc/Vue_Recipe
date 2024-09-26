<script setup lang="ts">
interface FormHintProps {
  variation: "required" | "optional";
}

const { variation } = defineProps<FormHintProps>();
</script>

<template>
  <span v-if="variation === 'required'" class="text-danger text-2xl sm:text-3xl"
    >*</span
  >
  <span v-else class="text-success text-2xl sm:text-3xl">*</span>
</template>
