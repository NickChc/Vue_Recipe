<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import HeaderImage from "@/components/HeaderImage.vue";
import RecipeCard from "@/components/recipes/RecipeCard.vue";
import RecipeCardSkeleton from "@/components/recipes/RecipeCardSkeleton.vue";
import { useGetRecipes } from "@/composables/useGetRecipes";
import RecipesFilter from "@/components/recipesFilters/RecipesFilter.vue";
import { useRecipesStore } from "@/stores/recipesStore";
import {
  TCategory_Enum,
  TComplexity_Enum,
  TCookingTime_Enum,
  TDiet_Enum,
} from "@/@types/general";

const { recipes, loading } = useGetRecipes();

const recipesStore = useRecipesStore();

const route = useRoute();

onMounted(() => {
  const { query } = route;

  const newFilters: Partial<typeof recipesStore.filters> = {};

  const { cooking_time, diet, category, complexity, high_rating } = query;

  if (cooking_time) {
    newFilters.cookingTime = cooking_time as TCookingTime_Enum;
  }

  if (diet) {
    newFilters.diets = (Array.isArray(diet) ? diet : [diet]) as TDiet_Enum[];
  }

  if (category) {
    newFilters.categories = (
      Array.isArray(category) ? category : [category]
    ) as TCategory_Enum[];
  }

  if (complexity) {
    newFilters.complexity = complexity as TComplexity_Enum;
  }

  if (high_rating) {
    newFilters.highRating = JSON.parse(high_rating as string);
  }

  recipesStore.setFilters({ ...recipesStore.filters, ...newFilters });
  recipesStore.saveFilters();
});
</script>

<template>
  <HeaderImage />

  <div class="flex flex-col sm:flex-row">
    <div class="bg-add-2 pt-3 pb-6 px-1 xs:px-2 sm:relative">
      <div class="sm:sticky sm:top-0 sm:inset-x-0">
        <RecipesFilter />
      </div>
    </div>

    <div
      v-if="!loading && recipes.length === 0"
      class="w-full flex pt-14 sm:pt-32 justify-center sm:h-screen pb-9"
    >
      <div class="flex flex-col-reverse md:flex-row items-center gap-x-3 h-fit">
        <span>
          <i class="material-symbols-outlined text-4xl sm:text-5xl 2xl:text-7xl"
            >block</i
          >
        </span>

        <h1 class="text-xl sm:text-3xl 2xl:text-5xl font-semibold text-center">
          {{ $t("recipesNotFound").toLocaleUpperCase() }}
        </h1>
      </div>
    </div>

    <div
      v-else
      class="py-14 px-4 sm:w-[75%] md:w-full mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8 mb-9"
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
