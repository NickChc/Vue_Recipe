<script setup lang="ts">
import FacebookIcon from "@/components/icons/FacebookIcon.vue";
import GithubIcon from "@/components/icons/GithubIcon.vue";
import InstagramIcon from "@/components/icons/InstagramIcon.vue";
import LinkedinIcon from "@/components/icons/LinkedinIcon.vue";
import TwitterIcon from "@/components/icons/TwitterIcon.vue";
import { RouterLink } from "vue-router";
</script>

<template>
  <footer
    class="bg-add-2 text-primary pt-3 sm:pt-6 pb-10 px-3 sm:px-10 border-t-2 border-primary flex flex-col sm:flex-row sm:justify-between gap-y-4 lg:px-[250px] text-lg md:text-xl"
  >
    <nav class="flex flex-col items-center gap-y-2">
      <h2
        class="mb-2 text-xl sm:text-2xl md:text-3xl whitespace-nowrap text-add font-semibold"
      >
        {{ $t("socialNetworks") }}
      </h2>
      <a
        class="flex items-center gap-x-2 underline hover:text-add"
        href="https://facebook.com"
        target="_blank"
      >
        <FacebookIcon /> Facebook</a
      >
      <a
        class="flex items-center gap-x-2 underline hover:text-add"
        href="https://instagram.com"
        target="_blank"
      >
        <InstagramIcon />
        Instagram</a
      >
      <a
        class="flex items-center gap-x-2 underline hover:text-add"
        href="https://twitter.com"
        target="_blank"
      >
        <TwitterIcon />
        X (twitter)</a
      >
    </nav>
    <div class="flex flex-col items-center gap-y-2">
      <h2
        class="mb-2 texl-lg sm:text-2xl md:text-3xl whitespace-nowrap text-add font-semibold"
      >
        {{ $t("info") }}
      </h2>

      <h4
        class="border-b border-add pb-0.5 whitespace-nowrap truncate max-w-full text-base sm:text-lg"
      >
        {{ $t("author") }} {{ $t("nikaChichua") }}
      </h4>
      <nav class="flex flex-col items-start gap-y-2">
        <a
          class="flex items-center gap-x-2 underline hover:text-add"
          href="https://github.com/NickChc"
          target="_blank"
        >
          <GithubIcon />
          Github</a
        >
        <a
          class="flex items-center gap-x-2 underline hover:text-add"
          href="https://www.linkedin.com/in/nika-chichua-051713290"
          target="_blank"
        >
          <LinkedinIcon />
          LinkedIn</a
        >
      </nav>
      <RouterLink
        to="/about-us"
        class="text-add flex items-center ml-auto text-base"
      >
        <span class="underline">{{ $t("moreInfo") }}</span>
        <i class="material-symbols-outlined">arrow_right</i></RouterLink
      >
    </div>
  </footer>
</template>
