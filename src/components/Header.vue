<script setup lang="ts">
import NavLink from "@/components/NavLink.vue";
import ToggleTheme from "@/components/ToggleTheme.vue";
import SelectLang from "@/components/SelectLang.vue";
import SideBarButton from "@/components/SideBar/SideBarButton.vue";
</script>

<template>
  <header
    class="sticky z-50 top-0 left-0 right-0 bg-add backdrop-blur-xl border-y border-add py-3 pr-6 pl-1 sm:pl-6 flex items-center"
  >
    <SideBarButton />

    <SelectLang />
    <nav
      class="flex items-center justify-around sm:justify-center w-full xs:gap-x-6 sm:gap-x-10 text-primary font-merri mx-auto"
    >
      <NavLink to="/">
        <i class="material-symbols-outlined sm:hidden">house</i>

        <p class="hidden xs:block">
          {{ $t("home") }}
        </p>
      </NavLink>
      <NavLink to="/recipes">
        <i class="material-symbols-outlined sm:hidden">menu_book</i>

        <p class="hidden xs:block">
          {{ $t("recipes") }}
        </p>
      </NavLink>
    </nav>
    <ToggleTheme />
  </header>
</template>
