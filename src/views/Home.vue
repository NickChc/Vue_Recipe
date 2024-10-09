<script setup lang="ts">
import HeaderImage from "@/components/HeaderImage.vue";
import NewIcon from "@/components/icons/NewIcon.vue";
import StarIcon from "@/components/icons/StarIcon.vue";
import PreviewCard from "@/components/recipes/PreviewCard.vue";
import { useNewestRecipes } from "@/composables/useNewestRecipes";
import { useTopRatedRecipes } from "@/composables/useTopRatedRecipes";
import { useThemeStore } from "@/stores/themeStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const {
  getTopRatedRecipes,
  loading: gettingTopRated,
  topRatedRecipes,
} = useTopRatedRecipes();

const {
  getNewestRecipes,
  loading: gettingNewest,
  newestRecipes,
} = useNewestRecipes();
const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);

onMounted(() => {
  getTopRatedRecipes();
  getNewestRecipes();
});
</script>

<template>
  <HeaderImage />
  <div
    class="sm:w-[90%] md:w-[80%] mx-auto pt-6 pb-20 sm:pb-40 flex flex-col gap-y-10"
  >
    <PreviewCard
      :recipes="newestRecipes"
      :loading="gettingNewest"
      :title="$t('newest', 'New Recipes')"
    >
      <NewIcon
        class="text-secondary dark:text-primary text-xl sm:text-2xl xl:text-4xl mb-1"
      />
    </PreviewCard>

    <PreviewCard
      :loading="gettingTopRated"
      :recipes="topRatedRecipes"
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
