<script setup lang="ts">
import SignInForm from "@/components/Auth/SignInForm.vue";
import { useLangStore } from "@/stores/langStore";
import { storeToRefs } from "pinia";

const langStore = useLangStore();
const { locale } = storeToRefs(langStore);
</script>

<template>
  <div
    class="w-full sm:w-[80%] flex flex-col mx-auto p-3 dark:bg-add-2 h-full min-h-full pb-10"
  >
    <h1 class="text-xl font-bold text-add">{{ $t("doSignIn", "SIGN IN") }}</h1>
    <p
      v-if="locale === 'ka'"
      class="text-add-2 dark:text-primary mt-2 text-xs xs:text-sm sm:text-base"
    >
      და დაიწყეთ ავტორების გამოწერა, რეცეპტების დამატება, მათი შეფასება.
      ისარგებლეთ
      <RouterLink
        :title="$t('aboutUs')"
        to="/about-us"
        class="font-merri font-semibold text-add"
        >MealShare</RouterLink
      >
      -ის სრული შესაძლებლობებით.
    </p>
    <p
      v-else
      class="text-add-2 dark:text-primary mt-2 text-xs xs:text-sm sm:text-base"
    >
      So you can start subscribing to people, adding and rating recipes and
      enjoying the full extend of
      <RouterLink
        :title="$t('aboutUs')"
        to="/about-us"
        class="font-merri font-semibold text-add"
        >MealShare</RouterLink
      >
    </p>
    <hr class="w-full border-add my-3" />

    <SignInForm />
  </div>
</template>
