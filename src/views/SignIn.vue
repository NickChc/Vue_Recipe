<script setup lang="ts">
import Button from "@/components/Button.vue";
import FormInput from "@/components/FormInput.vue";
import { useLangStore } from "@/stores/langStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";

interface TUserData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const userData = ref<TUserData>({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const langStore = useLangStore();
const { locale } = storeToRefs(langStore);

function handleUpdate(value: keyof TUserData) {
  userData.value[value] = value;
}
</script>

<template>
  <!-- TODO : make an about us page -->
  <div class="w-full sm:w-[80%] flex flex-col mx-auto p-3 dark:bg-add-2 h-full">
    <h1 class="text-xl font-bold text-add">{{ $t("signIn", "SIGN IN") }}</h1>
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

    <form
      @submit.prevent="console.log(userData)"
      class="flex flex-col w-[700px] max-w-full mx-auto"
    >
      <FormInput
        name="name"
        v-model="userData.name"
        :label="$t('name', 'NAME')"
        @update:value="handleUpdate('name')"
      />

      <FormInput
        name="email"
        v-model="userData.email"
        :label="$t('email', 'EMAIL')"
        @update:value="handleUpdate('email')"
      />

      <FormInput
        name="password"
        v-model="userData.password"
        :label="$t('password', 'PASSWORD')"
        @update:value="handleUpdate('password')"
      />

      <FormInput
        name="confirmPassword"
        v-model="userData.confirmPassword"
        :label="$t('confirmPassword', 'CONFIRM PASSWORD')"
        @update:value="handleUpdate('confirmPassword')"
      />

      <div class="invisible my-6"></div>

      <Button type="submit">SIGN IN</Button>
    </form>
  </div>
</template>
