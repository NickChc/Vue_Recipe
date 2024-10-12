<script setup lang="ts">
import { TUser } from "@/@types/general";
import { useGetUserRecipes } from "@/composables/useGetUserRecipes";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

interface RecipeCollectionProps {
  currentUser: TUser;
}

const { currentUser } = defineProps<RecipeCollectionProps>();

const { userRecipes, loading, error } = useGetUserRecipes(currentUser.id);

const recipesToShow = ref(3);

function updateRecipesToShow() {
  const width = window.innerWidth;

  if (width >= 640 && width <= 768) {
    recipesToShow.value = 2;
    return;
  }

  recipesToShow.value = 3;
}

onMounted(() => {
  document.addEventListener("resize", updateRecipesToShow);
});

onBeforeUnmount(() => {
  document.removeEventListener("reset", updateRecipesToShow);
});
</script>

<template>
  <div class="bg-add-2 rounded-lg p-3 mt-6">
    <h2 class="text-center">Your Recipes</h2>

    <hr class="my-3" />

    <div class="mt-3">
      <div v-for="recipe in userRecipes" :key="recipe.id">
        {{ recipe.title }}
      </div>
    </div>
  </div>
</template>
