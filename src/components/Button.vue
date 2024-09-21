<script setup lang="ts">
interface ButtonProps {
  variation?: "outlined" | "danger" | "primary";
  asChild?: boolean;
  type?: "submit" | "button";
  disabled?: boolean;
  color?: "white";
}

const { variation, asChild, type, disabled, color } =
  defineProps<ButtonProps>();
</script>

<template>
  <button
    :disabled="disabled"
    :type="type"
    :class="`border-2 whitespace-nowrap rounded-md font-semibold duration-300 transition-colors disabled:pointer-events-none disabled:opacity-80 ${
      variation === 'outlined' && color === 'white'
        ? 'text-primary border-primary dark:text-primary dark:border-primary'
        : variation === 'outlined'
        ? 'text-secondary dark:text-primary border-secondary dark:border-primary'
        : variation === 'danger'
        ? 'border-danger text-danger'
        : variation === 'primary'
        ? 'border-add text-primary bg-add'
        : 'border-add text-add hover:bg-add hover:text-primary'
    } ${asChild ? 'grid' : 'p-2'}`"
  >
    <slot></slot>
  </button>
</template>
