<script setup lang="ts">
import HourglassLoading from "@/components/HourglassLoading.vue";
import RecipeCard from "@/components/Recipes/RecipeCard.vue";
import { useGetCurrentRecipe } from "@/composables/useGetCurrentRecipe";
import { useRouter } from "vue-router";

interface RecipePageProps {
  recipeId: string;
}

const { recipeId } = defineProps<RecipePageProps>();

const router = useRouter();

const { currentRecipe, loading, error } = useGetCurrentRecipe(recipeId);
</script>

<template>
  <div class="sm:w-[80%] min-h-full mx-auto overflow-hidden relative">
    <nav class="w-full p-2 bg-add-2">
      <button
        @click="router.go(-1)"
        class="text-primary text-lg flex items-center gap-x-1"
      >
        <i class="material-symbols-outlined">chevron_left</i> {{ $t("back") }}
      </button>
    </nav>
    <div
      v-if="loading"
      class="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-full"
    >
      <HourglassLoading />
    </div>
    <RecipeCard v-else-if="currentRecipe" :recipe="currentRecipe" isMore />
    <div v-else-if="error" class="w-full text-center text-lg text-danger">
      {{ error }}
    </div>
  </div>
</template>
