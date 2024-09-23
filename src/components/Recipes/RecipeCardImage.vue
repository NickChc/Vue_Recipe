<script setup lang="ts">
import { TRecipe } from "@/@types/general";
import { ref } from "vue";
import Fallback_Food_Image from "@/assets/images/Fallback_Food_Image.jpeg";
import RecipeCardRating from "@/components/Recipes/RecipeCardRating.vue";

interface RecipeCardImageProps {
  recipe: TRecipe;
  isMore?: boolean;
  totalRates: number;
}

const { recipe, isMore, totalRates } = defineProps<RecipeCardImageProps>();

const imageError = ref(false);

function onImageError(e: Event) {
  const target = e.target as HTMLImageElement;

  target.src = Fallback_Food_Image;
  imageError.value = true;
}
</script>

<template>
  <div
    :class="`relative overflow-hidden  ${
      isMore ? 'min-h-40 xs:min-h-auto aspect-video' : ''
    }`"
  >
    <div
      v-if="imageError || recipe.image == null"
      class="absolute aspect-video inset-0 bg-[rgba(128,128,128,0.8)] grid place-items-center z-10"
    >
      <h2
        :class="`text-primary font-bold  font-merri select-none ${
          isMore ? 'text-xl xs:text-2xl' : 'text-lg'
        }`"
      >
        {{ $t("noImage") }}
      </h2>
    </div>
    <img
      :src="recipe.image || Fallback_Food_Image"
      alt="Meal image"
      @error="onImageError"
      :class="`object-cover w-full aspect-video  ${
        isMore
          ? 'absolute inset-0 xs:static xs:aspect-video z-0'
          : 'aspect-video'
      }`"
    />
    <RecipeCardRating
      v-if="!isMore"
      :rating="recipe.rating"
      :totalRates="totalRates"
    />
  </div>
</template>
