<script setup lang="ts">
import FoodGalleryImage from "@/assets/images/Food_Gallery_Image.jpg";
</script>

<template>
  <div
    class="h-full relative before:content-[''] before:absolute before:inset-0 before:bg-[rgba(0,0,0,0.4)] before:z-1 bg-fixed"
    :style="{ backgroundImage: `url(${FoodGalleryImage})` }"
  >
    <div
      class="p-3 py-8 xl:pb-20 relative z-5 text-shadow-lg overflow-y-auto max-h-full"
    >
      <div class="mx-auto xl:w-[75%] flex flex-col">
        <div>
          <h1 class="text-xl md:text-2xl xl:text-3xl font-bold">
            {{ $t("whatIsMealShare").toLocaleUpperCase() }}
          </h1>
          <p class="mt-3 font-semibold sm:text-lg max-w-[750px]">
            {{ $t("mealShareWhat") }}
          </p>
        </div>

        <div class="ml-auto inline-block mt-9">
          <h1 class="text-xl md:text-2xl xl:text-3xl font-bold">
            {{ $t("values").toLocaleUpperCase() }}
          </h1>

          <p class="mt-3 font-semibold sm:text-lg max-w-[750px] flex flex-col">
            {{ $t("mealShareValues.text") }}

            <span class="mt-2 ml-3">
              {{ $t("mealShareValues.pointOne") }}
            </span>

            <span class="mt-2 ml-3">
              {{ $t("mealShareValues.pointTwo") }}
            </span>
          </p>
        </div>

        <div class="mt-9">
          <h1 class="text-xl md:text-2xl xl:text-3xl font-bold">
            {{ $t("howToGetStarted").toLocaleUpperCase() }}
          </h1>
          <p class="mt-3 font-semibold sm:text-lg max-w-[750px]">
            {{ $t("gettingStartedInfo.partOne") }}
            <br />
            <br />
            {{ $t("gettingStartedInfo.partTwo") }}
          </p>
        </div>

        <h1
          class="text-xl sm:text-2xl md:text-3xl xl:text-4xl font-bold text-center mt-9"
        >
          {{ $t("thankYou").toLocaleUpperCase() }}
        </h1>
      </div>
    </div>
  </div>
</template>
