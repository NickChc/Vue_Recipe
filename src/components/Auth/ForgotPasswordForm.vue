<script setup lang="ts">
import { RouterLink } from "vue-router";
import Button from "@/components/Button.vue";
import FormInput from "@/components/FormInput.vue";
import FormError from "@/components/auth/FormError.vue";
import { onMounted, ref } from "vue";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";
import { z } from "zod";

const emailSchema = z.string().min(1, "enterEmail").email("invalidEmailFormat");

const loading = ref(false);
const error = ref<null | string>(null);
const fieldError = ref<null | string>(null);

const PASSWORD_RECOVERY_EMAIL = "password_recovery_email";

const email = ref("");
const isSent = ref(false);

function handleTryAgain() {
  localStorage.removeItem(PASSWORD_RECOVERY_EMAIL);
  isSent.value = false;
}

async function handleSubmit() {
  try {
    error.value = null;
    loading.value = true;
    isSent.value = false;

    const res = emailSchema.safeParse(email.value);

    if (!res.success) {
      fieldError.value = res.error.errors?.[0].message;
      return;
    }

    await sendPasswordResetEmail(auth, email.value);
    isSent.value = true;
    localStorage.setItem(PASSWORD_RECOVERY_EMAIL, email.value);
  } catch (err: any) {
    console.log(err.message);
    error.value = "problemOccuredTryAgain";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  const savedEmail = localStorage.getItem(PASSWORD_RECOVERY_EMAIL);

  if (savedEmail) {
    email.value = savedEmail;
    isSent.value = true;
  }
});
</script>

<template>
  <form
    novalidate
    @submit.prevent="handleSubmit"
    class="flex flex-col gap-y-3 w-[700px] max-w-full mx-auto mt-6 pb-6 bg-primary dark:bg-secondary p-3 rounded-sm border-add border-2"
  >
    <div
      v-if="isSent"
      class="flex flex-col justify-between rounded-sm bg-add-2 text-primary p-3"
    >
      <h3 class="sm:text-lgfont-semibold">
        {{ $t("recoverySentTo") }}
      </h3>
      <span class="truncate">{{ email }}</span>

      <div
        class="flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-center gap-y-3 gap-x-6 w-full mt-3"
      >
        <div class="w-full xs:w-1/2 grid">
          <Button
            @click="handleTryAgain"
            variation="outlined"
            color="add"
            size="sm"
            type="button"
            >{{ $t("tryAgain").toLocaleUpperCase() }}</Button
          >
        </div>
        <div class="w-full xs:w-1/2 grid">
          <Button
            asChild
            variation="primary"
            color="add"
            size="sm"
            type="button"
          >
            <RouterLink class="px-3 py-1" to="/sign-in">{{
              $t("done").toLocaleUpperCase()
            }}</RouterLink></Button
          >
        </div>
      </div>
    </div>

    <FormInput
      :disabled="loading || isSent"
      type="email"
      name="email"
      v-model="email"
      :label="$t('email', 'EMAIL')"
      :error="fieldError && $t(`${fieldError}`)"
      @clear-error="fieldError = null"
    />

    <FormError
      v-if="error"
      :error="$t(`${error}`)"
      @clear-error="error = null"
    />

    <div v-else class="invisible my-3"></div>

    <Button :disabled="loading || isSent" variation="primary" type="submit">
      <div class="sm:text-lg">
        {{
          loading
            ? $t("sending").toLocaleUpperCase()
            : $t("send").toLocaleUpperCase()
        }}
      </div>
    </Button>

    <RouterLink class="underline" to="/sign-in">{{ $t("back") }}</RouterLink>
  </form>
</template>
