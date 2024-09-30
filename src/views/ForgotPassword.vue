<script setup lang="ts">
import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm.vue";
</script>

<template>
  <div
    class="w-full min-h-full overflow-y-auto flex flex-col gap-y-3 dark:bg-add-2 p-3 sm:w-[80%] mx-auto"
  >
    <h1 class="text-lg md:text-xl xl:text-2xl 2xl:text-3xl font-bold text-add">
      {{ $t("getPasswordRecovery", "GET PASSWORD RECOVERY") }}
    </h1>

    <ForgotPasswordForm />
  </div>
</template>
