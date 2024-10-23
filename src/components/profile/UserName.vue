<script setup lang="ts">
import { TUser } from "@/@types/general";
import { updateUser } from "@/data/updateUser";
import { useAuthStore } from "@/stores/authStore";
import { createNameSchema } from "@/utils/createSchemas";
import { sendToast } from "@/utils/sendToast";
import { watch } from "vue";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

interface UserNameProps {
  isEditMode: boolean;
  currUser: TUser;
}

const { isEditMode, currUser } = defineProps<UserNameProps>();

const authStore = useAuthStore();

const { t } = useI18n();

const loading = ref(false);
const name = ref(currUser?.name || "");

async function changeName() {
  try {
    loading.value = true;

    if (name.value === currUser.name) return;

    const nameSchema = createNameSchema(t);

    const result = nameSchema.safeParse(name.value);

    if (result.error) {
      sendToast("error", result.error.formErrors.formErrors[0]);
      return;
    }

    await updateUser(currUser.id, { name: name.value });

    await authStore.resetCurrUser();
  } catch (err: any) {
    console.log(err.message);
    sendToast("error", t("problemOccuredTryAgain"));
  } finally {
    loading.value = false;
  }
}

watch(
  () => isEditMode,
  (mode) => {
    if (!mode) return;
    name.value = currUser.name || "";
  }
);
</script>

<template>
  <form @submit.prevent="changeName" v-if="isEditMode" class="relative mb-3">
    <input
      :disabled="loading"
      type="text"
      :placeholder="$t('enterName')"
      v-model="name"
      class="text-add-2 bg-primary text-center font-semibold text-sm w-full p-1 rounded-sm disabled:opacity-75"
    />
    <p
      v-if="name !== currUser.name && name.trim()"
      class="absolute inset-x-0 top-full text-center text-xs p-1"
    >
      {{ $t("enterToSave") }}
    </p>
  </form>
  <h2 v-else class="font-semibold mx-3 text-center sm:text-xl">
    {{ currUser?.name }}
  </h2>
</template>
