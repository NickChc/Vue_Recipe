<script setup lang="ts">
import { computed } from "vue";
import { TUser } from "@/@types/general";

interface RatedRecipesProps {
  currUser: TUser;
}

const { currUser } = defineProps<RatedRecipesProps>();

const ratedRecipesSorted = computed(() => {
  return currUser.rates.sort((a, b) => b.point - a.point);
});
</script>

<template>
  <div v-if="!!currUser.rates.length" class="rounded-lg bg-add-2 p-3 mt-6">
    <h2
      class="my-1 text-center xs:text-lg sm:text-2xl lg:text-3xl font-semibold"
    >
      {{ $t("ratedByYou") }}
    </h2>
    <hr class="my-2" />

    <ul
      class="list-none flex overflow-y-hidden overflow-x-auto scrollbar-small"
    >
      <li
        v-for="rate in ratedRecipesSorted"
        :key="rate.recipe_id"
        class="m-1 inline-block"
      >
        <RouterLink
          :to="`/recipes/${rate.recipe_id}`"
          class="whitespace-nowrap px-2 py-0.5 bg-primary rounded-md text-add-2 font-semibold flex flex-col gap-y-0.5 duration-500 transition-opacity hover:opacity-75"
        >
          <h5 class="text-xs sm:text-xl">{{ rate.recipe_title }}</h5>
          <div>
            <i
              v-for="_ in rate.point / 20"
              class="material-symbols-outlined text-[goldenrod] text-lg sm:text-2xl"
              >star</i
            >
          </div>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
