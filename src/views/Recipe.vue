<script setup lang="ts">
import HourglassLoading from "@/components/HourglassLoading.vue";
import RecipeCard from "@/components/Recipes/RecipeCard.vue";
import { useGetCurrentRecipe } from "@/composables/useGetCurrentRecipe";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
import { RouterLink, useRouter } from "vue-router";

interface RecipePageProps {
  recipeId: string;
}

const { recipeId } = defineProps<RecipePageProps>();

const router = useRouter();

const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);

const { currentRecipe, loading, error } = useGetCurrentRecipe(recipeId);
</script>

<template>
  <div class="sm:w-[80%] min-h-full mx-auto overflow-hidden relative">
    <nav
      class="text-primary text-lg w-full flex items-center justify-between p-2 bg-add-2"
    >
      <button @click="router.go(-1)" class="flex items-center gap-x-1">
        <i class="material-symbols-outlined">chevron_left</i> {{ $t("back") }}
      </button>

      <RouterLink
        v-if="currentRecipe?.user_id === currentUser?.id"
        :to="`/recipes/edit/${currentRecipe?.id}`"
        class="flex items-center gap-x-2"
      >
        <i class="material-symbols-outlined text-lg">edit</i>
        {{ $t("edit") }}</RouterLink
      >
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
