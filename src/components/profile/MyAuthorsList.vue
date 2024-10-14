<script setup lang="ts">
import { TUser } from "@/@types/general";
import { computed, ref } from "vue";

interface MyAuthorsListProps {
  currentUser: TUser;
}

const { currentUser } = defineProps<MyAuthorsListProps>();

const showAll = ref(false);

const authorsToShow = computed(() => {
  if (showAll.value) {
    return currentUser.subscriptions;
  }
  return currentUser.subscriptions.slice(0, 3);
});
</script>

<template>
  <div
    class="rounded-lg bg-add-2 p-3 mt-6 w-full sm:w-auto sm:min-w-fit text-primary"
  >
    <h3 class="text-center xs:text-lg">{{ $t("authorsYouFollow") }}</h3>

    <hr class="my-3" />

    <div
      :class="
        showAll
          ? 'sm:top-full sm:left-full inset-x-0 border border-add shadow-sm bg-add-2 w-full p-3 rounded-lg'
          : ''
      "
    >
      <ul
        :class="`list-none ${
          showAll ? 'overflow-y-auto max-h-34 pt-1 pr-1 scrollbar-small ' : ''
        }`"
      >
        <li
          v-for="author in authorsToShow"
          :key="author.id"
          class="my-2 lg:my-3"
        >
          <RouterLink
            :to="`/users/${author.id}`"
            class="bg-primary text-add-2 dark:bg-secondary dark:text-primary font-semibold rounded-sm block text-center hover:opacity-75"
          >
            {{ author.name }}
          </RouterLink>
        </li>
      </ul>

      <button
        v-if="!showAll && currentUser.subscriptions.length > 3"
        class="w-full flex items-center justify-center gap-x-2 hover:opacity-75"
        @click="showAll = true"
      >
        Show All
        <i class="material-symbols-outlined text-xl">arrow_downward</i>
      </button>

      <button
        v-else-if="showAll"
        class="w-full flex items-end justify-center gap-x-2 hover:opacity-75 text-add font-semibold"
        @click="showAll = false"
      >
        Show Less
        <i class="material-symbols-outlined text-xl">arrow_upward</i>
      </button>
    </div>
  </div>
</template>
