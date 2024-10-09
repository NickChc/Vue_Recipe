<script setup lang="ts">
import Button from "@/components/Button.vue";
import FormError from "@/components/auth/FormError.vue";
import { useEmailConfirmation } from "@/composables/useEmailConfirmation";
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";

const cancelPassword = ref("");

const {
  isCancelling,
  submitCancel,
  handleCancel,
  cancelError,
  sending,
  confirmVerified,
  error,
  handleSendAgain,
} = useEmailConfirmation(cancelPassword);

const authStore = useAuthStore();
const { fireUser } = storeToRefs(authStore);
</script>

<template>
  <div
    class="bg-add-2 border-2 border-add rounded-sm flex flex-col sm:flex-row sm:gap-x-3 items-center justify-between text-add p-2 text-center sm:text-start w-[700px] max-w-full mx-auto md:text-lg xl:text-xl"
  >
    <div v-if="isCancelling" class="flex flex-col">
      <p>{{ $t("authCancelText") }}</p>
      <form
        @submit.prevent="submitCancel"
        class="flex items-stretch justify-center mt-3 gap-x-3 py-3"
      >
        <input
          class="rounded-sm p-2 outline-add"
          placeholder="Password"
          name="password"
          type="password"
          v-model="cancelPassword"
        />

        <Button variation="outlined" color="add" size="sm" type="submit">
          {{ $t("cancel") }}
        </Button>
      </form>
      <FormError
        v-if="cancelError"
        :error="cancelError"
        @clear-error="cancelError = null"
      />
    </div>

    <p v-else-if="error == null">
      {{ $t("verificationSent", { email: fireUser?.email }) }}
    </p>

    <p v-else class="p-1 text-danger-dark dark:text-danger-dark">{{ error }}</p>

    <div
      v-if="error == null && !isCancelling"
      class="text-sm grid grid-cols-1 xs:text-base sm:w-auto sm:min-w-fit gap-y-3 w-full gap-x-3 mt-3 sm:mt-0"
    >
      <Button @click="confirmVerified" variation="primary" size="sm">{{
        $t("confirm")
      }}</Button>
      <Button @click="handleSendAgain" size="sm">{{
        sending ? $t("sending") : $t("sendAgain")
      }}</Button>

      <Button @click="handleCancel" variation="danger" size="sm">{{
        $t("cancel")
      }}</Button>
    </div>
    <div v-else-if="!isCancelling">
      <Button
        size="sm"
        variation="primary"
        @click="
          () => {
            if (fireUser == null) {
              authStore.verificationSent = false;
            }
            error = null;
          }
        "
        >{{ $t("tryAgain") }}</Button
      >
    </div>
  </div>
</template>
