<script setup lang="ts">
import Button from "@/components/Button.vue";
import { TAuthProvider_Enum, useAuthStore } from "@/stores/authStore";
import { useGlobalStore } from "@/stores/globalStore";
import FormInput from "@/components/FormInput.vue";
import { ref } from "vue";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase";
import { storeToRefs } from "pinia";
import { deleteCurrUser } from "@/data/deleteCurrUser";
import { sendToast } from "@/utils/sendToast";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useRecipesStore } from "@/stores/recipesStore";

const password = ref("");
const loading = ref(false);
const error = ref<null | string>(null);

const recipesStore = useRecipesStore();
const globalStore = useGlobalStore();
const authStore = useAuthStore();
const { currProvider, currentUser } = storeToRefs(authStore);

const { t } = useI18n();

const router = useRouter();

async function handleDeleteAccount() {
  try {
    loading.value = true;
    error.value = null;

    if (currentUser.value == null) return;

    await authStore.resetCurrUser(currentUser.value.id);

    const currUser = currentUser.value;

    if (currProvider.value == null) {
      throw new Error("no auth provider present");
    }

    if (currProvider.value === TAuthProvider_Enum.PASSWORD) {
      const res = await signInWithEmailAndPassword(
        auth,
        currUser.email,
        password.value
      );

      if (res.user == null) {
        error.value = "invalidPassword";
        return;
      }
    } else if (currProvider.value === TAuthProvider_Enum.GOOGLE) {
      await signInWithPopup(auth, googleProvider);
    }

    await deleteCurrUser(currUser);
    globalStore.closeModal();
    router.replace("/");

    if (!currUser.recipes.length) return;

    recipesStore.fetchRecipeData();
  } catch (err: any) {
    console.log(err.message);
    if (err.message.includes("invalid-credential")) {
      error.value = "invalidPassword";
    }
    sendToast("error", t("failedToDeleteAcc"));
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="px-4 sm:px-6 py-4 flex flex-col gap-y-3 rounded-sm bg-primary dark:bg-secondary w-[500px] max-w-[95vw] mx-auto border border-primary"
  >
    <div class="flex items-end">
      <h2 class="text-lg sm:text-xl md:text-2xl font-semibold">
        {{ $t("deleteAccount") }}
      </h2>
    </div>
    <p class="sm:text-lg md:text-xl">
      {{ $t("assureDeleteAcc") }}
    </p>

    <form
      v-if="currProvider === TAuthProvider_Enum.PASSWORD"
      @submit.prevent="handleDeleteAccount"
    >
      <FormInput
        type="password"
        v-model="password"
        :error="error"
        @clear-error="error = null"
        :hint="$t('enterYourPasswordToProceed')"
      />
    </form>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 gap-y-3 sm:gap-x-6 mt-4 text-base sm:text-lg md:text-xl w-full"
    >
      <Button @click="globalStore.closeModal" variation="primary">{{
        $t("no").toLocaleUpperCase()
      }}</Button>

      <Button
        @click="handleDeleteAccount"
        :disabled="
          loading || (!password && currProvider === TAuthProvider_Enum.PASSWORD)
        "
        variation="danger-filled"
        >{{ $t("yes").toLocaleUpperCase() }}</Button
      >
    </div>
  </div>
</template>
