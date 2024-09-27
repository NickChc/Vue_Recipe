<script setup lang="ts">
import Side_Food_Image from "@/assets/images/Side_Food_Image.jpg";
import Side_Food_Image_2 from "@/assets/images/Side_Food_Image_2.avif";
import RecipeForm from "@/components/RecipeForm.vue";
import { useGetCurrentRecipe } from "@/composables/useGetCurrentRecipe";
import { useAuthStore } from "@/stores/authStore";
import { watch } from "vue";
import { useRouter } from "vue-router";

interface EditRecipeProps {
  recipeId: string;
}

const { recipeId } = defineProps<EditRecipeProps>();

const router = useRouter();

const authStore = useAuthStore();

const { currentRecipe, loading } = useGetCurrentRecipe(recipeId);

watch([loading, () => authStore.loadingAuth], () => {
  if (authStore.loadingAuth || loading.value) return;

  if (
    authStore.currentUser == null ||
    authStore.currentUser.id !== currentRecipe.value?.user_id
  ) {
    router.replace("/");
  }
});
</script>

<template>
  <div class="h-full flex">
    <div
      class="hidden sm:block h-full w-40 md:w-60 bg-fixed bg-cover bg-center"
      :style="{ backgroundImage: `url(${Side_Food_Image})` }"
    ></div>
    <div
      class="w-full h-full max-h-full px-3 md:px-6 pt-6 pb-20 overflow-y-scroll"
    >
      <h2 class="font-semibold sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
        {{ $t("editYourRecipe") }}
      </h2>
      <RecipeForm v-if="currentRecipe" :editRecipe="currentRecipe" />
    </div>
    <div
      class="hidden sm:block h-full w-40 md:w-60 bg-fixed bg-right bg-cover"
      :style="{ backgroundImage: `url(${Side_Food_Image_2})` }"
    ></div>
  </div>
</template>
