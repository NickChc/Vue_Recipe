<script setup lang="ts">
import NavLink from "@/components/NavLink.vue";
import ToggleTheme from "@/components/ToggleTheme.vue";
</script>

<template>
  <header class="bg-add p-3 flex items-center">
    <nav
      class="flex items-center justify-around xs:justify-center w-full xs:gap-x-6 sm:gap-x-10 text-primary font-merri mx-auto"
    >
      <NavLink to="/">HOME</NavLink>
      <NavLink to="/recipes">RECIPES</NavLink>
    </nav>
    <ToggleTheme />
  </header>
</template>
