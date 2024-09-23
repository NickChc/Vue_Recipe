<script setup lang="ts">
import { TRecipe } from "@/@types/general";
import { computed } from "vue";
import RecipeCardImage from "@/components/Recipes/RecipeCardImage.vue";
import RecipeCardFooter from "@/components/Recipes/RecipeCardFooter.vue";

interface RecipeCardProps {
  recipe: TRecipe;
  isMore?: boolean;
}

const { recipe, isMore } = defineProps<RecipeCardProps>();
const totalRates = computed(() => recipe.rates.length);
</script>

<template>
  <div
    :class="`flex flex-col shadow-xl  group h-full ${
      isMore ? 'h-full pb-6 bg-add-2' : 'rounded-sm bg-primary dark:bg-add-2'
    }`"
  >
    <RecipeCardImage
      :recipe="recipe"
      :totalRates="totalRates"
      :isMore="isMore"
    />
    <div
      :class="`p-3 flex flex-col ${isMore ? 'my-3 text-primary' : 'gap-y-3'}`"
    >
      <div class="flex flex-col gap-y-1">
        <h3
          :class="`text-xl font-semibold ${
            isMore ? 'md:text-2xl lg:text-3xl' : ''
          }`"
        >
          {{ recipe.title }}
        </h3>

        <hr v-if="isMore" class="w-full my-2" />
        <!-- REST -->

        <div v-if="isMore" class="flex flex-col">
          <ul class="list-none text-xs sm:text-sm mt-2">
            <li class="inline-flex m-1">
              <h4 class="text-lg sm:text-xl lg:text-2xl">Diets -</h4>
            </li>
            <li v-for="diet in recipe.diet" :key="diet" class="inline-flex m-1">
              <span class="rounded-md bg-add-2 p-2 bg-gray-300 text-add">{{
                diet.toUpperCase()
              }}</span>
            </li>
          </ul>
        </div>

        <p
          :class="`text-sm ${
            isMore
              ? 'md:max-w-[700px] mb-3 md:text-base lg:text-lg py-3 sm:px-10'
              : 'line-clamp-3'
          }`"
        >
          {{ recipe.recipe }}
        </p>
      </div>

      <RecipeCardFooter
        :recipe="recipe"
        :isMore="isMore"
        :totalRates="totalRates"
      />
    </div>
  </div>
</template>
