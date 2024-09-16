<script setup lang="ts">
import { useRoute } from "vue-router";

interface NavLinkProps {
  to: string;
}

const route = useRoute();

const { to } = defineProps<NavLinkProps>();
</script>

<template>
  <RouterLink
    :class="`text-sm font-merri xs:text-base flex items-center gap-x-3 sm:text-3xl font-bold ${
      route.fullPath.endsWith(to) ? 'text-add-2 pointer-events-none ' : ''
    }`"
    :to="to"
  >
    <slot></slot>
  </RouterLink>
</template>
