<script setup lang="ts">
import { useRouter } from "vue-router";
import { TRecipe } from "@/@types/general";
import RecipeCardImage from "@/components/recipes/RecipeCardImage.vue";
import RecipeCardRating from "@/components/recipes/RecipeCardRating.vue";
import Button from "@/components/Button.vue";
import { useRecipesStore } from "@/stores/recipesStore";

interface CollectionCardProps {
  recipe: TRecipe;
}

const { recipe } = defineProps<CollectionCardProps>();

const router = useRouter();
const recipesStore = useRecipesStore();
</script>

<template>
  <div
    @click="router.push(`/recipes/${recipe.id}`)"
    class="flex flex-col justify-between p-3 rounded-sm bg-primary dark:bg-secondary text-secondary dark:text-primary cursor-pointer pointer-fine:hover:shadow pointer-fine:hover:shadow-add duration-200 transition-shadows"
  >
    <div>
      <div class="text-xs">
        <RecipeCardImage
          :hideRating="true"
          :recipe="recipe"
          :totalRates="recipe.rates.length"
        />
      </div>

      <h3 class="my-2 font-semibold">{{ recipe.title }}</h3>

      <div @click.stop>
        <RecipeCardRating show :recipe="recipe" />
      </div>

      <p class="line-clamp-3 text-sm my-1">{{ recipe.recipe }}</p>
    </div>

    <div @click.stop class="flex items-stretch flex-col gap-y-2 mt-3">
      <Button variation="primary" asChild>
        <RouterLink
          :to="`/recipes/edit/${recipe.id}`"
          class="flex items-end justify-center gap-x-2"
          >{{ $t("edit").toLocaleUpperCase() }}
          <i class="material-symbols-outlined text-xl">edit</i>
        </RouterLink>
      </Button>
      <Button
        variation="danger-filled"
        asChild
        @click="recipesStore.startDeleteRecipe(recipe)"
        ><div class="flex items-end justify-center gap-x-2">
          {{ $t("delete").toLocaleUpperCase() }}
          <i class="material-symbols-outlined text-xl">delete</i>
        </div>
      </Button>
    </div>
  </div>
</template>
