<script setup lang="ts">
import { TRecipe } from "@/@types/general";
import Button from "@/components/Button.vue";
import { deleteRecipe } from "@/data/deleteRecipe";
import { useGlobalStore } from "@/stores/globalStore";
import { useRecipesStore } from "@/stores/recipesStore";
import { ref } from "vue";
import { useRouter } from "vue-router";

interface AssurePopupProps {
  recipe: TRecipe;
}

const { recipe } = defineProps<AssurePopupProps>();

const router = useRouter();

const loading = ref(false);

const globalStore = useGlobalStore();
const recipesStore = useRecipesStore();

function handleCancel() {
  globalStore.toggleModal();
  recipesStore.setDeleteRecipe(null);
}

async function handleDelete() {
  try {
    loading.value = true;
    await deleteRecipe(recipe);
    handleCancel();
  } catch (err: any) {
    console.log(err.message);
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="px-4 sm:px-6 py-4 flex flex-col gap-y-3 rounded-sm bg-primary dark:bg-secondary w-[500px] max-w-[95vw] mx-auto border border-primary"
  >
    <h2 class="text-lg sm:text-xl md:text-2xl">{{ recipe.title }}</h2>
    <p class="sm:text-lg md:text-xl">{{ $t("sureToDeleteRecipe") }}</p>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-x-6 mt-4 text-base sm:text-lg md:text-xl w-full"
    >
      <Button @click="handleCancel" variation="outlined">{{
        $t("cancel")
      }}</Button>
      <Button
        :disabled="loading"
        @click="handleDelete"
        variation="danger-filled"
        >{{ loading ? $t("deleting") : $t("delete") }}</Button
      >
    </div>
  </div>
</template>
