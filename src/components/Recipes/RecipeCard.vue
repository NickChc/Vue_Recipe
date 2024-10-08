<script setup lang="ts">
import { computed } from "vue";
import { TRecipe } from "@/@types/general";
import RecipeCardImage from "@/components/recipes/RecipeCardImage.vue";
import RecipeCardFooter from "@/components/recipes/RecipeCardFooter.vue";

interface RecipeCardProps {
  recipe: TRecipe;
  isMore?: boolean;
}

const { recipe, isMore } = defineProps<RecipeCardProps>();
const totalRates = computed(() => recipe.rates.length);
</script>

<template>
  <div
    :class="`flex flex-col shadow-xl group h-full relative ${
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

        <div v-if="isMore" class="flex flex-col">
          <hr class="w-full my-2" />
          <div
            class="flex flex-col md:grid md:grid-cols-2 w-full gap-y-3 md:gap-x-6 md:relative my-2"
          >
            <div
              class="w-full h-full flex flex-col items-center bg-primary dark:bg-secondary text-secondary dark:text-primary rounded-2xl p-1"
            >
              <h4
                class="text-lg sm:text-xl md:text-2xl md:px-4 lg:text-2xl xl:text-3xl text-center"
              >
                {{ $t("diets") }}
              </h4>
              <ul
                v-if="recipe.diet?.length! > 0"
                class="list-none sm:px-2 h-full w-fit text-xs sm:text-sm mt-2"
              >
                <li
                  v-for="diet in recipe.diet"
                  :key="diet"
                  class="inline-flex m-1"
                >
                  <span
                    class="rounded-md p-1 sm:p-2 bg-add-2 text-primary font-semibold"
                    >{{ $t(`diet_obj.${diet.replace(/\s/g, "_")}`) }}</span
                  >
                </li>
              </ul>
              <i v-else class="material-symbols-outlined text-3xl mt-1"
                >block</i
              >
            </div>
            <div
              class="absolute right-1/2 h-full w-[1px] bg-primary hidden md:block"
            ></div>

            <div
              class="w-full h-full flex flex-col items-center bg-primary dark:bg-secondary text-secondary dark:text-primary rounded-2xl p-1"
            >
              <h4
                class="text-lg sm:text-xl md:text-2xl md:px-4 lg:text-2xl xl:text-3xl text-center"
              >
                {{ $t("ingredients") }}
              </h4>
              <ul
                class="list-none sm:px-2 h-full w-fit text-xs sm:text-sm mt-2"
              >
                <li
                  v-for="ingredient in recipe.ingredients"
                  :key="ingredient"
                  class="inline-flex m-1"
                >
                  <span
                    class="rounded-md p-1 sm:p-2 bg-add-2 text-primary font-semibold"
                    >{{ ingredient }}</span
                  >
                </li>
              </ul>
            </div>
          </div>
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
