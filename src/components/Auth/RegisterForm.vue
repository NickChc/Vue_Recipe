<script setup lang="ts">
import FormInput from "@/components/FormInput.vue";
import Button from "@/components/Button.vue";
import { ref } from "vue";
import {
  TRegisterValues,
  useValidateRegister,
} from "@/composables/useValidateRegister";
import FormError from "./FormError.vue";

const userData = ref<TRegisterValues>({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const { errors, isValid, validateRegister, clearError } = useValidateRegister(
  userData.value
);

const submitError = ref<null | string>(null);
const loading = ref(false);

async function handleSubmit() {
  try {
    submitError.value = null;
    loading.value = true;
    validateRegister();

    if (!isValid.value) return;

    console.log(userData.value);
  } catch (err: any) {
    console.log(err.message);
    submitError.value = "Couldn't register user";
  } finally {
    loading.value = false;
  }
}

function handleUpdate(e: Event) {
  const target = e.target as HTMLInputElement;
  const name = target.name as keyof TRegisterValues;

  userData.value[name] = target.value;
  clearError(name);
}
</script>

<template>
  <form
    novalidate
    @submit.prevent="handleSubmit"
    class="flex flex-col gap-y-3 w-[700px] max-w-full mx-auto mt-6"
  >
    <FormInput
      name="name"
      :label="$t('name', 'NAME')"
      @update:value="handleUpdate"
      :error="errors.name?.[0]"
    />

    <FormInput
      name="email"
      :label="$t('email', 'EMAIL')"
      @update:value="handleUpdate"
      :error="errors.email?.[0]"
    />

    <FormInput
      type="password"
      name="password"
      :label="$t('password', 'PASSWORD')"
      @update:value="handleUpdate"
      :error="errors.password?.[0]"
    />

    <FormInput
      type="password"
      name="confirmPassword"
      :label="$t('confirmPassword', 'CONFIRM PASSWORD')"
      @update:value="handleUpdate"
      :error="errors.confirmPassword?.[0]"
    />

    <FormError
      v-if="errors.rootError || submitError"
      :error="errors.rootError || submitError || $t('problemOccuredTryAgain')"
      @clear-error="
        () => {
          clearError('rootError');
          submitError = null;
        }
      "
    />

    <div class="invisible my-6"></div>

    <Button variation="primary" type="submit">REGISTER</Button>
    <RouterLink class="underline mt-10" to="/sign-in">{{
      $t("alreadyHaveAnAccount")
    }}</RouterLink>
  </form>
</template>
