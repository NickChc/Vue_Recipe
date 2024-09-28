<script setup lang="ts">
import HourglassLoading from "@/components/HourglassLoading.vue";
import RecipeCard from "@/components/Recipes/RecipeCard.vue";
import { useGetCurrentRecipe } from "@/composables/useGetCurrentRecipe";
import { useAuthStore } from "@/stores/authStore";
import { useGlobalStore } from "@/stores/globalStore";
import { useRecipesStore } from "@/stores/recipesStore";
import { storeToRefs } from "pinia";
import { RouterLink, useRouter } from "vue-router";

interface RecipePageProps {
  recipeId: string;
}

const { recipeId } = defineProps<RecipePageProps>();

const router = useRouter();

const globalStore = useGlobalStore();

const recipesStore = useRecipesStore();

const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);

const { currentRecipe, loading, error } = useGetCurrentRecipe(recipeId);

function startDelete() {
  if (currentRecipe.value == null) return;

  recipesStore.setDeleteRecipe(currentRecipe.value);
  globalStore.toggleModal();
}
</script>

<template>
  <div class="sm:w-[80%] min-h-full mx-auto overflow-hidden relative">
    <nav
      class="text-primary text-lg w-full flex items-center justify-between p-2 px-4 bg-add-2 font-semibold border-b border-primary"
    >
      <button @click="router.go(-1)" class="flex items-center gap-x-1">
        <i class="material-symbols-outlined">chevron_left</i> {{ $t("back") }}
      </button>

      <div
        v-if="currentRecipe?.user_id === currentUser?.id"
        class="flex justify-between gap-x-5"
      >
        <button
          @click="startDelete"
          class="flex items-center gap-x-2 hover:opacity-80 duration-200 transition-colors text-danger"
        >
          <i class="material-symbols-outlined text-2xl">delete</i>
          <p class="hidden sm:block">
            {{ $t("delete") }}
          </p>
        </button>

        <RouterLink
          :to="`/recipes/edit/${currentRecipe?.id}`"
          class="flex items-center gap-x-2 hover:text-success duration-200 transition-colors"
        >
          <i class="material-symbols-outlined text-2xl">edit</i>
          <p class="hidden sm:block">
            {{ $t("edit") }}
          </p>
        </RouterLink>
      </div>
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
