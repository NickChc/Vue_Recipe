<script setup lang="ts">
import { TRecipe } from "@/@types/general";
import RecipeCard from "@/components/recipes/RecipeCard.vue";
import RecipeCardSkeleton from "@/components/recipes/RecipeCardSkeleton.vue";

interface PreviewCardProps {
  recipesState: {
    recipes: TRecipe[];
    loading: boolean;
    error: null | string;
  };
  title: string;
}

const { recipesState, title } = defineProps<PreviewCardProps>();
</script>

<template>
  <div class="flex flex-col gap-y-2">
    <h2
      class="px-3 flex items-center gap-x-3 md:gap-x-5 font-semibold sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl"
    >
      {{ title }}
      <slot></slot>
    </h2>
    <div
      v-if="recipesState.error"
      class="bg-danger rounded-lg text-primary p-3 w-full text-center font-semibold my-2"
    >
      {{ $t(recipesState.error).toLocaleUpperCase() }}
    </div>
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-6 p-3"
    >
      <template v-if="recipesState.loading">
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
      </template>

      <RecipeCard
        v-else
        v-for="recipe in recipesState.recipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
  </div>
</template>
