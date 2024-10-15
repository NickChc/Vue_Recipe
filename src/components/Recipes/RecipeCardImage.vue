<script setup lang="ts">
import { TRecipe } from "@/@types/general";
import { ref } from "vue";
import Fallback_Food_Image from "@/assets/images/Fallback_Food_Image.jpeg";
import RecipeCardRating from "@/components/recipes/RecipeCardRating.vue";

interface RecipeCardImageProps {
  recipe: TRecipe;
  isMore?: boolean;
  hideRating?: boolean;
}

const { recipe, isMore, hideRating } = defineProps<RecipeCardImageProps>();

const imageError = ref(false);

function onImageError(e: Event) {
  const target = e.target as HTMLImageElement;

  target.src = Fallback_Food_Image;
  imageError.value = true;
}
</script>

<template>
  <div
    :class="`relative overflow-hidden ${
      isMore ? 'min-h-32 xs:min-h-auto' : ''
    }`"
  >
    <div
      v-if="imageError || recipe.image == null"
      class="absolute aspect-video inset-0 bg-[rgba(128,128,128,0.8)] flex items-center justify-center z-10"
    >
      <h2
        :class="`text-primary text-center font-bold font-merri select-none ${
          isMore ? 'text-xl xs:text-2xl' : 'text-[1.4em]'
        }`"
      >
        {{ $t("noImage") }}
      </h2>
    </div>
    <img
      :src="recipe.image || Fallback_Food_Image"
      alt="Meal image"
      @error="onImageError"
      :class="`w-full brightness-90 ${
        isMore
          ? 'absolute inset-0 xs:static xs:aspect-video z-0 object-contain max-w-[1000px] xl:mx-auto'
          : 'aspect-video object-cover'
      }`"
    />
    <RecipeCardRating v-if="!isMore && !hideRating" :recipe="recipe" />
  </div>
</template>
