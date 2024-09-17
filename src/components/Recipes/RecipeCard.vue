<script setup lang="ts">
import { TRecipe } from "@/@types/general";
import Fallback_Food_Image from "@/assets/images/Fallback_Food_Image.avif";
import { ref } from "vue";
import RecipeCardRating from "./RecipeCardRating.vue";

interface RecipeCardProps {
  recipe: TRecipe;
}

const { recipe } = defineProps<RecipeCardProps>();

const imageError = ref(false);

function onImageError(e: Event) {
  const target = e.target as HTMLImageElement;

  target.src = Fallback_Food_Image;
  imageError.value = true;
}
</script>

<template>
  <div
    class="flex flex-col shadow-xl rounded-sm bg-priamry dark:bg-add-2 group"
  >
    <div class="relative overflow-hidden">
      <div
        v-if="imageError || recipe.image == null"
        class="absolute inset-0 bg-[rgba(128,128,128,0.8)] grid place-items-center"
      >
        <h2 class="text-primary font-bold text-xl xs:text-3xl font-merri">
          No image
        </h2>
      </div>
      <img
        :src="recipe.image || Fallback_Food_Image"
        alt="Meal image"
        @error="onImageError"
        :class="`object-cover w-full aspect-video ${
          imageError || recipe.image == null ? '' : ''
        } `"
      />
      <RecipeCardRating :rating="recipe.rating" />
    </div>

    <div class="p-3 flex flex-col gap-y-3">
      <div class="flex flex-col gap-y-1">
        <h3 class="text-xl font-semibold">{{ recipe.title }}</h3>

        <p class="text-sm line-clamp-3">{{ recipe.recipe }}</p>
      </div>

      <strong class="text-add">By - {{ recipe.author.name }}</strong>
      <div
        class="flex text-add-2 dark:text-primary justify-between items-center"
      >
        <span class="text-sm flex items-center">
          <i
            class="material-symbols-outlined mr-1"
            :style="{ fontSize: '1rem' }"
            >alarm</i
          >
          -
          {{ recipe.cooking_time }} {{ $t("min") }}
        </span>
        <span class="ml-auto text-sm">
          {{ $t(`complexity.${recipe.complexity}`) }}</span
        >
      </div>
    </div>
  </div>
</template>
