<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import Button from "@/components/Button.vue";
import { useAuthStore } from "@/stores/authStore";
import { useGlobalStore } from "@/stores/globalStore";
import ChangeEmail from "@/components/profile/ChangeEmail.vue";

enum TChangeData_Enum {
  EMAIL = "email",
  PASSWORD = "password",
}

const authStore = useAuthStore();
const { fireUser } = storeToRefs(authStore);

const globlaStore = useGlobalStore();
const changeData = ref<TChangeData_Enum | null>(null);

function setChangeData(dataToChange: TChangeData_Enum | null) {
  if (dataToChange == null) {
    changeData.value = null;
    return;
  }

  if (changeData.value === dataToChange) {
    changeData.value = null;
    return;
  }

  changeData.value = dataToChange;
}
</script>

<template>
  <div class="mt-6 bg-add-2 text-primary rounded-lg p-3">
    <div class="text-center flex items-center justify-center gap-x-2">
      <h3 class="sm:text-lg">{{ $t("settings").toLocaleUpperCase() }}</h3>
      <span class="grid text-xl">
        <i class="material-symbols-outlined text-[1em]">settings</i>
      </span>
    </div>

    <hr class="my-3" />

    <div
      v-if="fireUser?.providerData.some((p) => p.providerId === 'password')"
      class="flex flex-col"
    >
      <button
        @click="setChangeData(TChangeData_Enum.EMAIL)"
        :class="`text-xs xs:text-sm flex items-center justify-between px-2 sm:px-6 py-2 duration-200 transition-colors hover:bg-[rgba(0,0,0,0.1)] ${
          changeData === TChangeData_Enum.EMAIL ? 'text-success' : ''
        }`"
      >
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center gap-x-2 w-[70%] sm:text-base"
        >
          <h3 class="whitespace-nowrap">{{ $t("changeEmail") }}</h3>
          <br />
          <span class="max-w-[90%] truncate">
            {{ fireUser.email }}
          </span>
        </div>

        <span>
          <i class="material-symbols-outlined">edit</i>
        </span>
      </button>

      <hr class="my-3" />

      <ChangeEmail
        v-if="changeData === TChangeData_Enum.EMAIL"
        @done="setChangeData(null)"
      />

      <!-- <button @click="setChangeData(TChangeData_Enum.PASSWORD)"> -->
      <!-- <h3>{{ $t("changePassword") }}</h3> -->
      <!-- </button> -->
    </div>

    <div class="flex flex-col items-center mt-9">
      <Button
        @click="
          () => {
            authStore.setIsDeletingAcc(true);
            globlaStore.toggleModal();
          }
        "
        class="sm:ml-auto"
        variation="danger-filled"
      >
        <div class="text-sm">
          {{ $t("deleteAccount").toLocaleUpperCase() }}
        </div>
      </Button>
    </div>
  </div>
</template>
