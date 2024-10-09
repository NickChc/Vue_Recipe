<script setup lang="ts">
import Button from "@/components/Button.vue";
import NotFoundIcon from "@/components/icons/NotFoundIcon.vue";
</script>

<template>
  <div class="w-full h-full mx-auto bg-secondary dark:bg-secondary">
    <div class="flex flex-col items-center p-3 text-center md:pt-20">
      <NotFoundIcon class="mx-auto text-add" :style="{ fontSize: '150px' }" />
      <h1 class="text-add sm:text-xl md:text-2xl">
        {{ $t("pageNotFoundText") }}
      </h1>
      <div class="w-fit xs:w-[200px] grid mt-10 sm:text-2xl">
        <Button variation="primary" asChild>
          <RouterLink to="/" class="p-[0.4em]">{{
            $t("takeMeHome")
          }}</RouterLink>
        </Button>
      </div>
    </div>
  </div>
</template>
