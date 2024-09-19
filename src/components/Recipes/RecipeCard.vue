<script setup lang="ts">
import { TRecipe } from "@/@types/general";
import Fallback_Food_Image from "@/assets/images/Fallback_Food_Image.jpeg";
import RecipeCardRating from "@/components/Recipes/RecipeCardRating.vue";
import { computed, ref } from "vue";
import { TComplexity_Enum } from "@/@types/general";

interface RecipeCardProps {
  recipe: TRecipe;
  isMore?: boolean;
}

const { recipe, isMore } = defineProps<RecipeCardProps>();
const totalRates = computed(() => recipe.rates.length);

const imageError = ref(false);

// TODO : make real subscribe thing
const isSubscribed = ref(false);

function onImageError(e: Event) {
  const target = e.target as HTMLImageElement;

  target.src = Fallback_Food_Image;
  imageError.value = true;
}

function checkLevel(iconIndex: number) {
  const totalCases = Object.values(TComplexity_Enum);
  const lvlIndex = totalCases.indexOf(recipe.complexity);

  if (iconIndex <= lvlIndex) {
    return true;
  }

  return false;
}
</script>

<template>
  <div
    :class="`flex flex-col shadow-xl  group h-full ${
      isMore ? 'h-full pb-6 bg-add-2' : 'rounded-sm bg-primary dark:bg-add-2'
    }`"
  >
    <div
      :class="`relative overflow-hidden  ${
        isMore ? 'min-h-40 xs:min-h-auto aspect-video' : ''
      }`"
    >
      <div
        v-if="imageError || recipe.image == null"
        class="absolute aspect-video inset-0 bg-[rgba(128,128,128,0.8)] grid place-items-center z-10"
      >
        <h2
          :class="`text-primary font-bold  font-merri select-none ${
            isMore ? 'text-xl xs:text-2xl' : 'text-lg'
          }`"
        >
          {{ $t("noImage") }}
        </h2>
      </div>
      <img
        :src="recipe.image || Fallback_Food_Image"
        alt="Meal image"
        @error="onImageError"
        :class="`object-cover w-full aspect-video  ${
          isMore
            ? 'absolute inset-0 xs:static xs:aspect-video z-0'
            : 'aspect-video'
        }`"
      />
      <RecipeCardRating
        v-if="!isMore"
        :rating="recipe.rating"
        :totalRates="totalRates"
      />
    </div>

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

      <template v-if="isMore">
        <hr class="w-full border-add mb-2" />
        <div
          class="flex flex-col sm:justify-between gap-y-3 xs:gap-y-3 xs:gap-x-4 xs:flex-row"
        >
          <div
            class="flex flex-col gap-y-2 items-start sm:items-center lg:flex-row lg:gap-x-3 min-w-[50%]"
          >
            <strong class="text-add max-w-[50%] min-w-fit"
              >{{ $t("author", { name: recipe.author.name }) }}
            </strong>

            <button
              :class="`text-sm text-add flex items-center gap-x-2 border border-add rounded-sm px-4 py-0.5 font-semibold duration-200 transition-colors ${
                isSubscribed ? 'bg-add text-primary' : 'text-add'
              }`"
              @click="isSubscribed = !isSubscribed"
            >
              <template v-if="isSubscribed">
                {{ $t("unsubscribe") }}
                <i
                  class="material-symbols-outlined mt-1"
                  :style="{ fontSize: '1.2rem' }"
                  >notifications_active</i
                >
              </template>

              <template v-else>
                {{ $t("subscribe") }}
                <i
                  class="material-symbols-outlined mt-1"
                  :style="{ fontSize: '1.2rem' }"
                  >notifications</i
                >
              </template>
            </button>
          </div>
          <p class="text-sm text-add">
            {{ $t("subscribeTip") }}
          </p>
        </div>
        <hr class="w-full border-add mt-2" />
      </template>

      <strong v-else class="text-add max-w-full truncate"
        >{{ $t("author", { name: recipe.author.name }) }}
      </strong>

      <RecipeCardRating
        v-if="isMore"
        isMore
        :rating="recipe.rating"
        :totalRates="totalRates"
      />

      <div
        :class="`flex justify-between gap-x-1 items-center text-xs xs:text-sm ${
          isMore ? 'sm:text-lg text-primary' : 'text-add-2 dark:text-primary'
        }`"
      >
        <span class="flex items-center" :title="$t('estimatedTimeOfCooking')">
          <i
            class="material-symbols-outlined mr-1"
            :style="{ fontSize: '1rem' }"
            >alarm</i
          >
          -
          {{ recipe.cooking_time }} {{ $t("min") }}
        </span>

        <div
          v-if="isMore"
          class="flex flex-col sm:flex-row sm:gap-x-2 items-center gap-y-1 text-add select-none"
          :title="$t('complexityTitle')"
        >
          <div class="flex items-center gap-x-1">
            <i
              v-for="(lvl, index) in Object.values(TComplexity_Enum)"
              :key="lvl"
              class="material-symbols-outlined text-xs sm:text-base"
              >{{
                checkLevel(index)
                  ? "radio_button_checked"
                  : "radio_button_unchecked"
              }}</i
            >
          </div>

          <strong class="hidden sm:block">-</strong>

          <span>
            {{
              $t(
                `complexity.${recipe.complexity}`,
                recipe.complexity.toUpperCase()
              )
            }}</span
          >
        </div>
        <span v-else>
          {{
            $t(
              `complexity.${recipe.complexity}`,
              recipe.complexity.toUpperCase()
            )
          }}</span
        >
        <RouterLink
          v-if="!isMore"
          class="text-secondary dark:text-add duration-200 transition-colors hover:text-add active:opacity-75 flex items-center"
          :to="`/recipes/${recipe.id}`"
        >
          <p class="underline">{{ $t("more") }}</p>
          <i class="material-symbols-outlined text-xl">chevron_right</i>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
