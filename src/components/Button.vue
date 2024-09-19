<script setup lang="ts">
interface ButtonProps {
  variation?: "outlined" | "danger";
  asChild?: boolean;
  type?: "submit" | "button";
  disabled?: boolean;
}

const { variation, asChild, type, disabled } = defineProps<ButtonProps>();
</script>

<template>
  <button
    :disabled="disabled"
    :type="type"
    :class="`border-2 whitespace-nowrap rounded-md font-semibold disabled:pointer-events-none ${
      variation === 'outlined'
        ? 'text-secondary dark:text-primary border-secondary dark:border-primary'
        : variation === 'danger'
        ? 'border-danger text-danger'
        : 'border-add text-add'
    } ${asChild ? 'grid' : 'p-2'}`"
  >
    <slot></slot>
  </button>
</template>
