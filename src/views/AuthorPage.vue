<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { TRecipe, TUser } from "@/@types/general";
import { getUserById } from "@/data/getUserById";
import HourglassLoading from "@/components/HourglassLoading.vue";
import { useAuthStore } from "@/stores/authStore";
import { getRecipesByUserId } from "@/data/getRecipesByUserId";
import RecipeSlider from "@/components/RecipeSlider.vue";
import AuthorInfo from "@/components/authorPage/AuthorInfo.vue";

interface AuthorPageProps {
  userId: string;
}

const { userId } = defineProps<AuthorPageProps>();

const authStore = useAuthStore();

const loading = ref(false);
const error = ref<null | string>(null);

const loadingRecipes = ref(false);
const recipesError = ref<null | string>(null);

const author = ref<null | TUser>(null);
const authorRecipes = ref<TRecipe[]>([]);

const router = useRouter();

async function getAuthorRecipes(authorId: string) {
  try {
    loadingRecipes.value = true;
    recipesError.value = null;
    authorRecipes.value = await getRecipesByUserId(authorId);
  } catch (err: any) {
    console.log(err.message);
    recipesError.value = "failedToFetchRecipes";
  } finally {
    loadingRecipes.value = false;
  }
}

async function getAuthor() {
  try {
    loading.value = true;

    if (userId == null) return;

    const user = await getUserById(userId);

    if (user == null) throw new Error("Author not found");

    // Handle redirect if current user is author ends up here
    if (user.id === authStore.currentUser?.id) {
      router.replace("/profile");
      return;
    }

    author.value = user;
    getAuthorRecipes(user.id);
  } catch (err: any) {
    console.log(err.message);
    error.value = "problemOccuredTryAgain";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  getAuthor();
});
</script>

<template>
  <div class="h-full sm:w-[80%] mx-auto min-h-fit mb-14 px-1 xs:px-3">
    <template v-if="author">
      <AuthorInfo :author="author" />

      <div class="bg-add-2 rounded-lg p-1.5 xs:p-3 my-6">
        <RecipeSlider :recipes="authorRecipes" />
      </div>
    </template>

    <!-- No author view -->
    <!-- TODO : make skeleton loading for this page -->
    <div v-else-if="loading">
      <HourglassLoading />
    </div>
    <div v-else-if="error">{{ error }}</div>
  </div>
</template>
