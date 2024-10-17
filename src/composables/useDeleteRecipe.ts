import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { deleteRecipe } from "@/data/deleteRecipe";
import { useGlobalStore } from "@/stores/globalStore";
import { useRecipesStore } from "@/stores/recipesStore";
import { sendToast } from "@/utils/sendToast";
import { useGetUserRecipes } from "@/composables/useGetUserRecipes";

export function useDeleteRecipe() {
  const recipesStore = useRecipesStore();
  const globalStore = useGlobalStore();
  const router = useRouter();
  const route = useRoute();

  const { handleGetUserRecipes } = useGetUserRecipes();

  const { t } = useI18n();

  const loading = ref(false);

  function deleteDone() {
    globalStore.toggleModal();
    recipesStore.setDeleteRecipe(null);
    loading.value = false;
  }

  async function handleDeleteRecipe() {
    try {
      if (recipesStore.deleteRecipe == null) return;

      loading.value = true;
      await deleteRecipe(recipesStore.deleteRecipe);
      recipesStore.fetchRecipeData();
      recipesStore.setDeleteRecipe(null);

      if (route.path.endsWith("/profile")) {
        handleGetUserRecipes();
      }
    } catch (err: any) {
      console.log(err.message);
      sendToast("error", t("failedToDeleteRecipe"));
    } finally {
      deleteDone();
    }

    if (route.path.endsWith("/profile")) return;

    router.replace("/");
  }

  return { handleDeleteRecipe, loading };
}
