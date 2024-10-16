<script setup lang="ts">
import HeaderImage from "@/components/HeaderImage.vue";
import NewIcon from "@/components/icons/NewIcon.vue";
import StarIcon from "@/components/icons/StarIcon.vue";
import PreviewCard from "@/components/recipes/PreviewCard.vue";
import { useRecipesStore } from "@/stores/recipesStore";
import { useThemeStore } from "@/stores/themeStore";
import { storeToRefs } from "pinia";

const recipesStore = useRecipesStore();

const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);

const { topRatedRecipesState, newestRecipesState } = storeToRefs(recipesStore);
</script>

<template>
  <HeaderImage />
  <div
    class="sm:w-[90%] md:w-[80%] mx-auto pt-6 pb-20 sm:pb-40 flex flex-col gap-y-10"
  >
    <PreviewCard
      :recipesState="newestRecipesState"
      :title="$t('newest', 'New Recipes')"
    >
      <NewIcon
        class="text-secondary dark:text-primary text-xl sm:text-2xl xl:text-4xl mb-1"
      />
    </PreviewCard>

    <PreviewCard
      :recipesState="topRatedRecipesState"
      :title="$t('topRated', 'Top Rated')"
    >
      <StarIcon
        maskWidth="0%"
        :fill="isDark ? 'var(--clr-primary)' : 'var(--clr-secondary)'"
        class="text-secondary dark:text-primary text-xs sm:text-sm xl:text-lg mb-1"
      />
    </PreviewCard>
  </div>
</template>
