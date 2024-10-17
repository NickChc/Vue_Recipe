<script setup lang="ts">
import Button from "@/components/Button.vue";
import { useAuthStore } from "@/stores/authStore";
import { useGlobalStore } from "@/stores/globalStore";

const authStore = useAuthStore();
const globlaStore = useGlobalStore();
</script>

<template>
  <div class="mt-6 bg-add-2 text-primary rounded-lg p-3">
    <div class="text-center flex items-center justify-center gap-x-2">
      <h3>SETTINGS</h3>
      <span class="grid text-xl">
        <i class="material-symbols-outlined text-[1em]">settings</i>
      </span>
    </div>

    <hr class="my-3" />

    <!-- TODO : allow users to change email and password -->

    <div class="flex flex-col items-center">
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

<!-- TODO : allow users to delete their account -->
