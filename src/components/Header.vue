<script setup lang="ts">
import NavLink from "@/components/NavLink.vue";
import ToggleTheme from "@/components/ToggleTheme.vue";
import SelectLang from "@/components/SelectLang.vue";
import SideBarButton from "@/components/SideBar/SideBarButton.vue";
</script>

<template>
  <header class="bg-add py-3 pr-6 pl-0 sm:pl-6 flex items-center">
    <SideBarButton />

    <SelectLang />
    <nav
      class="flex items-center justify-around xs:justify-center w-full xs:gap-x-6 sm:gap-x-10 text-primary font-merri mx-auto"
    >
      <NavLink to="/">{{ $t("home") }}</NavLink>
      <NavLink to="/recipes">{{ $t("recipes") }}</NavLink>
    </nav>
    <ToggleTheme />
  </header>
</template>
