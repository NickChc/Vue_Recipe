<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import ProfileImage from "@/components/profile/ProfileImage.vue";
import BackgroundImage from "@/assets/images/Layout_Image.jpg";
import { useAuthStore } from "@/stores/authStore";
import AddUserData from "@/components/profile/AddUserData.vue";
import MyAuthorsList from "@/components/profile/MyAuthorsList.vue";
import HourglassLoading from "@/components/HourglassLoading.vue";
import Button from "@/components/Button.vue";
import RecipeCollection from "@/components/profile/RecipeCollection.vue";
import RatedRecipes from "@/components/profile/RatedRecipes.vue";
import Settings from "@/components/profile/Settings.vue";

const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);

const isEditMode = ref(false);

function setEditMode(value: boolean) {
  isEditMode.value = value;
}

// TODO : allow users to change their name
</script>

<template>
  <div
    v-if="authStore.loadingAuth || currentUser == null"
    class="h-full grid place-items-center"
  >
    <HourglassLoading />
  </div>
  <div
    v-else-if="currentUser"
    class="min-h-full pb-12 p-3 w-full sm:w-[90%] lg:w-[80%] mx-auto"
  >
    <div class="flex items-center justify-between">
      <h1 class="font-bold text-xl xs:text-2xl sm:text-3xl lg:text-4xl mb-3">
        {{ $t("yourProfile").toLocaleUpperCase() }}
      </h1>

      <button
        class="hover:opacity-75 mb-3 flex items-end gap-x-1"
        :class="{ 'text-success': isEditMode }"
        @click="isEditMode = !isEditMode"
      >
        <strong v-if="isEditMode" class="hidden sm:block text-lg">{{
          $t("done").toLocaleUpperCase()
        }}</strong>
        <strong v-else class="hidden sm:block text-lg">{{
          $t("edit").toLocaleUpperCase()
        }}</strong>
        <i class="material-symbols-outlined text-2xl sm:text-3xl">edit</i>
      </button>
    </div>
    <div
      class="min-h-60 bg-add-2 text-primary p-4 sm:p-6 rounded-lg relative flex flex-col items-center justify-center xs:items-start"
    >
      <div
        class="brightness-90 absolute top-0 bottom-[70%] sm:bottom-[60%] rounded-t-lg right-0 left-0 bg-cover bg-left"
        :style="{ backgroundImage: `url(${BackgroundImage})` }"
      ></div>

      <div class="flex flex-col xs:items-start">
        <div class="flex flex-col items-center gap-y-1.5">
          <ProfileImage :isEditMode />
          <h2 class="font-semibold mx-3 text-center sm:text-xl">
            {{ currentUser?.name }}
          </h2>
        </div>
        <template v-if="currentUser.bio">
          <h5 class="opacity-50 text-sm self-start m-1">
            {{ $t("biography") }}
          </h5>
          <p
            class="h-20 scrollbar-small overflow-y-auto text-sm sm:text-base max-w-[400px] lg:max-w-[500px] pr-1"
          >
            {{ currentUser.bio }}
          </p>
        </template>
        <button
          v-else-if="!isEditMode"
          class="opacity-50 flex items-center gap-x-1"
          @click="isEditMode = true"
        >
          Add a bio <i class="material-symbols-outlined text-lg">add</i>
        </button>
      </div>

      <Button class="sm:absolute right-5 max-w-full mt-2 sm:mt-0" asChild>
        <RouterLink
          to="/recipes/new"
          class="px-2 py-0.5 flex items-center gap-x-2 text-xs xs:text-sm sm:text-base"
          >{{ $t("addARecipe") }}
          <i class="material-symbols-outlined text-base xs:text-xl sm:text-2xl"
            >menu_book</i
          >
        </RouterLink>
      </Button>

      <div
        class="mt-6 w-full flex flex-col sm:flex-row sm:items-center gap-y-2 justify-between"
      >
        <h4>{{ $t("subscribers") }}: {{ currentUser.subscribers.length }}</h4>

        <button
          @click="authStore.handleSignOut"
          class="flex items-center justify-center font-semibold px-2 py-0.5 gap-x-2 bg-primary rounded-md text-add-2 w-fit duration-200 transition-opacity hover:opacity-80 self-end"
        >
          {{ $t("logOut") }} <i class="material-symbols-outlined">logout</i>
        </button>
      </div>
    </div>

    <div class="flex flex-col items-start sm:flex-row gap-x-6">
      <MyAuthorsList v-if="!isEditMode" :currentUser="currentUser" />

      <AddUserData
        @set-edit-mode="setEditMode"
        :isEditMode="isEditMode"
        :currentUser="currentUser"
      />
    </div>

    <RatedRecipes :currUser="currentUser" />

    <RecipeCollection :currentUser="currentUser" />

    <Settings />
  </div>
</template>
