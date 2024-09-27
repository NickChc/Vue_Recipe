<script setup lang="ts">
import { TRecipe } from "@/@types/general";
import RecipeCard from "@/components/Recipes/RecipeCard.vue";
import RecipeCardSkeleton from "./RecipeCardSkeleton.vue";

interface PreviewCardProps {
  recipes: TRecipe[];
  title: string;
  loading: boolean;
}

const { recipes, title } = defineProps<PreviewCardProps>();
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
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-4 gap-y-6 p-3"
    >
      <template v-if="loading">
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
        <RecipeCardSkeleton />
      </template>
      <RecipeCard
        v-else
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
  </div>
</template>
