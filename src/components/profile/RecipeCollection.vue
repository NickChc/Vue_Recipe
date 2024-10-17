<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { useGetUserRecipes } from "@/composables/useGetUserRecipes";
import CollectionCard from "@/components/profile/CollectionCard.vue";
import RecipeCardSkeleton from "@/components/recipes/RecipeCardSkeleton.vue";
import AddRecipeCardImage from "@/assets/images/Add_Recipe_Card_Image.jpg";

const { currUserRecipes, loading, error, handleGetUserRecipes } =
  useGetUserRecipes();

const recipesToShow = ref(3);
const showMore = ref(false);

function updateRecipesToShow() {
  const width = window.innerWidth;

  if (width >= 1024) {
    recipesToShow.value = 2;
    return;
  }

  recipesToShow.value = 3;
}

onMounted(() => {
  handleGetUserRecipes();

  window.addEventListener("resize", updateRecipesToShow);
  updateRecipesToShow();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateRecipesToShow);
});
</script>

<template>
  <div class="bg-add-2 rounded-lg p-1.5 xs:p-3 mt-6 text-primary">
    <div class="flex items-center justify-between sm:justify-center">
      <h2 class="text-center xs:text-lg sm:text-2xl lg:text-3xl font-semibold">
        {{ $t("yourRecipes") }}
      </h2>
      <RouterLink
        to="/recipes/new"
        class="block sm:hidden rounded-full border-2 text-xl border-primary grid active:text-success active:border-success"
      >
        <i class="material-symbols-outlined text-[1em]">add</i>
      </RouterLink>
    </div>

    <hr class="my-3" />

    <div
      v-if="error"
      class="text-center sm:text-lg p-3 rounded-lg bg-danger text-primary"
    >
      {{ $t(error) }}
    </div>

    <div
      v-else
      class="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-if="loading"
        v-for="n in recipesToShow"
        :key="n"
        class="border-2 border-add rounded-sm"
      >
        <RecipeCardSkeleton />
      </div>

      <template v-else>
        <RouterLink to="/recipes/new" class="hidden sm:block min-h-60">
          <div
            class="h-full rounded-sm group bg-primary dark:bg-secondary text-secondary dark:text-primary text-center grid place-items-center relative bg-cover"
            :style="{ backgroundImage: `url(${AddRecipeCardImage})` }"
          >
            <div class="absolute inset-0 bg-[rgba(0,0,0,0.4)] z-10"></div>
            <div
              class="flex flex-col items-center relative z-20 pointer-fine:group-hover:text-success text-3xl duration-200 transition-colors text-primary"
            >
              <h2 class="font-semibold">
                {{ $t("addARecipe").toLocaleUpperCase() }}
              </h2>
              <span class="">
                <i class="material-symbols-outlined text-7xl">add</i>
              </span>
            </div>
          </div>
        </RouterLink>

        <CollectionCard
          v-for="recipe in showMore
            ? currUserRecipes
            : currUserRecipes.slice(0, recipesToShow)"
          :key="recipe.id"
          :recipe="recipe"
        />
      </template>
    </div>
    <button
      v-if="currUserRecipes.length > recipesToShow"
      @click="showMore = !showMore"
      class="flex items-center justify-center gap-x-2 mx-auto mt-3 font-semibold"
      :class="{ 'text-add': showMore }"
    >
      {{ showMore ? $t("showLess") : $t("showMore") }}
      <span
        :class="`grid duration-300 transition-transform ease-in ${
          showMore ? 'rotate-180' : ''
        }`"
      >
        <i class="material-symbols-outlined">arrow_downward</i>
      </span>
    </button>
  </div>
</template>
