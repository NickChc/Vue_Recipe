<script setup lang="ts">
interface ButtonProps {
  variation?: "outlined" | "danger" | "primary";
  asChild?: boolean;
  type?: "submit" | "button";
  size?: "sm";
  disabled?: boolean;
  color?: "white" | "add";
}

const { variation, asChild, type, disabled, color, size } =
  defineProps<ButtonProps>();
</script>

<template>
  <button
    :disabled="disabled"
    :type="type"
    :class="`border-2 whitespace-nowrap rounded-sm font-semibold duration-300 transition-colors disabled:pointer-events-none disabled:opacity-75 ${
      variation === 'outlined' && color === 'white'
        ? 'text-primary border-primary dark:text-primary dark:border-primary'
        : variation === 'outlined' && color === 'add'
        ? 'text-add border-add'
        : variation === 'outlined'
        ? 'text-secondary dark:text-primary border-secondary dark:border-primary'
        : variation === 'danger'
        ? 'border-danger text-danger'
        : variation === 'primary'
        ? 'border-add text-primary bg-add hover:opacity-90'
        : 'border-add text-add hover:bg-add hover:text-primary'
    } ${asChild ? 'grid' : 'p-[0.4em]'} ${size === 'sm' ? 'px-3 py-1' : ''}`"
  >
    <slot></slot>
  </button>
</template>
