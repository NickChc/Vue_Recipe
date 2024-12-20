<script setup lang="ts">
import { computed, ref } from "vue";
import { TSocialLinks, TUser } from "@/@types/general";
import FormInput from "@/components/FormInput.vue";
import Button from "@/components/Button.vue";
import { useProfileUpdate } from "@/composables/useProfileUpdate";
import { SOCIAL_NETWORKS } from "@/config/data";

interface UserDataProps {
  currentUser: TUser;
  isEditMode: boolean;
}

const emit = defineEmits<{
  (e: "set-edit-mode", value: boolean): void;
}>();

function emitSetEditMode(value: boolean) {
  emit("set-edit-mode", value);
}

const { currentUser, isEditMode } = defineProps<UserDataProps>();

const loading = ref(false);

const userBio = ref(currentUser.bio || "");

const userSocialLinks = ref<TSocialLinks>({});

const hasSocLinked = computed(() => {
  return SOCIAL_NETWORKS.some((s) => currentUser.socialLinks[s.name] != null);
});

SOCIAL_NETWORKS.forEach((soc) => {
  userSocialLinks.value[soc.name] = currentUser.socialLinks[soc.name] || "";
});

const { handleAddData, removeLink, removalLoading, disableBtn } =
  useProfileUpdate({ userBio, loading, userSocialLinks }, emitSetEditMode);
</script>

<template>
  <form
    @submit.prevent="handleAddData"
    class="bg-add-2 text-primary p-4 sm:p-6 rounded-lg mt-6 w-full flex flex-col"
  >
    <div
      v-if="isEditMode"
      class="flex flex-col gap-y-2 items-stretch text-center"
    >
      <h3 class="sm:text-lg">{{ $t("tellAboutYourself") }}</h3>
      <textarea
        v-model="userBio"
        class="outline-add p-1 resize-none h-32 text-secondary text-sm sm:text-base lg:text-lg"
        maxlength="250"
        :placeholder="$t('bioPlaceholder')"
      />
      <p class="text-xs opacity-60 text-start sm:text-sm">
        250 {{ $t("wordsMax") }}
      </p>
    </div>

    <button
      v-if="!isEditMode"
      type="button"
      class="font-merri w-fit mx-auto md:text-lg duration-200 transition-opacity hover:opacity-80 flex items-center gap-x-2"
      @click="emitSetEditMode(true)"
    >
      {{ $t("linkSocialAccounts") }}
      <span>
        <i class="material-symbols-outlined text-2xl">share</i>
      </span>
    </button>

    <hr class="w-full my-4" />

    <div class="flex flex-col gap-y-2 items-stretch text-center">
      <div
        v-if="isEditMode"
        type="button"
        class="font-merri w-fit mx-auto md:text-lg flex items-center gap-x-2"
      >
        {{ $t("linkSocialAccounts") }}
        <span>
          <i class="material-symbols-outlined text-2xl">share</i>
        </span>
      </div>

      <div
        v-if="!hasSocLinked && !isEditMode"
        class="flex items-center justify-center gap-x-3"
      >
        <span v-for="soc in SOCIAL_NETWORKS" :key="soc.url" class="text-2xl">
          <component :is="soc.icon" />
        </span>
      </div>
      <ul v-else class="list-none">
        <li v-for="soc in SOCIAL_NETWORKS" :key="soc.url" class="text-sm">
          <div
            class="flex items-center justify-between px-4 gap-x-3 w-full"
            v-if="isEditMode || currentUser.socialLinks[soc.name]"
          >
            <span
              class="flex justify-center items-center gap-x-2 mt-2 sm:text-lg"
            >
              <component :is="soc.icon" />
              {{ soc.displayName }}</span
            >
            <span
              v-if="removalLoading.includes(soc.name)"
              class="animate-spin-3/2 cursor-default grid"
            >
              <i class="material-symbols-outlined">progress_activity</i>
            </span>
            <span
              v-else-if="
                currentUser.socialLinks[soc.name] &&
                userSocialLinks[soc.name] &&
                isEditMode
              "
              @click="removeLink(soc.name)"
              class="cursor-pointer"
            >
              <i class="material-symbols-outlined text-xl text-danger"
                >delete</i
              >
            </span>
          </div>

          <div v-if="isEditMode" class="text-xs mt-1.5 bg-black rounded-sm">
            <FormInput
              :disabled="loading || currentUser.socialLinks[soc.name] != null"
              :placeholder="`${soc.url}/your-account`"
              v-model="userSocialLinks[soc.name]!"
            />
          </div>
          <a
            v-else-if="currentUser.socialLinks[soc.name]"
            :href="currentUser.socialLinks[soc.name]!"
            target="_blank"
            class="bg-primary flex text-secondary rounded-sm my-1 px-1 py-0.5 underline truncate sm:text-base"
          >
            {{ currentUser.socialLinks[soc.name] }}
          </a>
        </li>
      </ul>
    </div>

    <Button
      v-if="isEditMode"
      :disabled="disableBtn || loading"
      variation="primary"
      size="sm"
      class="w-full mt-6"
      >{{
        loading
          ? $t("saving").toLocaleUpperCase()
          : $t("save").toLocaleUpperCase()
      }}</Button
    >
  </form>
</template>
