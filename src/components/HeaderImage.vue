<script setup lang="ts">
import LayoutImage from "@/assets/images/Layout_Image.jpg";
import LayoutImageLarge from "@/assets/images/Layout_Image_Large.jpg";
import { useLangStore } from "@/stores/langStore";
import { storeToRefs } from "pinia";

const langStore = useLangStore();
const { locale } = storeToRefs(langStore);
</script>

<template>
  <div class="relative overflow-hidden">
    <img
      :src="LayoutImage"
      alt="layout image"
      class="lg:hidden w-full h-40 object-cover"
    />
    <img
      :src="LayoutImageLarge"
      alt="layout image large"
      class="hidden lg:block w-full h-[calc(100vw/6)] object-cover"
    />

    <div
      class="absolute inset-0 bg-gradient-to-b from-secondary via-transparent to-transparent"
    ></div>
    <div
      class="absolute inset-0 p-2 sm:p-3 pb-4 pr-4 text-primary text-shadow flex flex-col justify-between h-full xs:gap-y-1 sm:gap-y-3 md:px-10 md:py-6"
    >
      <div>
        <h1
          class="text-lg xs:mb-1 sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl lg:mb-4 font-bold whitespace-nowrap"
        >
          <p v-if="locale === 'en'">Welcome to MealShare</p>
          <p v-else-if="locale === 'ka'">
            MealShare -ი <br class="xs:hidden" />
            მოგესალმებათ
          </p>
        </h1>
        <p
          v-if="locale === 'en'"
          class="text-xs xs:text-sm sm:text-base lg:text-lg xl:text-xl"
        >
          Connect with fellow food lovers and share your cherished
          <br class="hidden sm:block" />
          recipes for every occasion.
        </p>
        <p
          v-else-if="locale === 'ka'"
          class="text-xs xs:text-sm sm:text-base lg:text-lg xl:text-xl"
        >
          დაამყარეთ კავშირი სხვებთან თქვენი საყვარელი რეცეპტების მეშვეობით.
        </p>
      </div>

      <button
        class="absolute bottom-4 lg:bottom-6 right-6 lg:right-8 xl:right-10 p-1 px-3 text-xs border-2 border-primary rounded-sm ml-auto w-fit font-bold font-merri flex items-center gap-x-2 backdrop-blur-sm lg:text-base xl:text-lg lg:p-2 xl:p-3 hover:bg-primary duration-200 transition-colors hover:text-[rgba(0,0,0,0.5)]"
      >
        {{ $t("addARecipe") }}
        <i class="material-symbols-outlined mb-1">add</i>
      </button>
    </div>
  </div>
</template>
