<script setup lang="ts">
import HeaderImage from "@/components/HeaderImage.vue";
import StarIcon from "@/components/Icons/StarIcon.vue";
import PreviewCard from "@/components/Recipes/PreviewCard.vue";
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
    class="w-fill sm:w-[90%] md:w-[80%] mx-auto min-h-screen pt-6 pb-14 flex flex-col gap-y-6"
  >
    <PreviewCard
      v-if="topRatedRecipes.length > 0"
      :loading="gettingTopRated"
      :recipes="topRatedRecipes"
      :title="$t('topRated', 'Top Rated')"
    >
      <StarIcon
        maskWidth="0%"
        :fill="isDark ? 'var(--clr-primary)' : 'var(--clr-secondary)'"
        class="text-secondary dark:text-primary text-xs mb-1"
      />
    </PreviewCard>

    <PreviewCard
      v-if="newestRecipes.length > 0"
      :recipes="newestRecipes"
      :loading="gettingNewest"
      :title="$t('newest', 'New Recipes')"
    >
    </PreviewCard>
  </div>
</template>
