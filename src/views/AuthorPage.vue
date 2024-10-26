<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { TRecipe, TUser } from "@/@types/general";
import { getUserById } from "@/data/getUserById";
import { useAuthStore } from "@/stores/authStore";
import { getRecipesByUserId } from "@/data/getRecipesByUserId";
import RecipeSlider from "@/components/RecipeSlider.vue";
import AuthorInfo from "@/components/authorPage/AuthorInfo.vue";
import AuthorPageSkeleton from "@/components/authorPage/AuthorPageSkeleton.vue";
import RecipeCardSkeleton from "@/components/recipes/RecipeCardSkeleton.vue";
import Button from "@/components/Button.vue";

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

    if (user == null) {
      error.value = "authorNotFound";
      return;
    }

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
        <!-- Skeleton loading for author's recipes -->
        <div
          v-if="loadingRecipes"
          class="grid grid-cols-1 gap-14 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div class="border-2 border-add animate-pulse-2">
            <RecipeCardSkeleton />
          </div>
          <div class="border-2 border-add animate-pulse-2 hidden sm:block">
            <RecipeCardSkeleton />
          </div>
          <div class="border-2 border-add animate-pulse-2 hidden lg:block">
            <RecipeCardSkeleton />
          </div>
        </div>

        <RecipeSlider v-else :recipes="authorRecipes" />
      </div>
    </template>

    <!-- Loading author -->
    <AuthorPageSkeleton v-if="loading" />
    <!-- Error fetching author -->
    <div v-else-if="error" class="bg-danger rounded-lg p-3 mt-14 text-center">
      <p class="text-lg lg:text-xl font-semibold mb-9">{{ $t(error) }}</p>
      <Button variation="outlined" size="sm" @click="router.go(-1)">
        <div class="flex items-center gap-x-2">
          <i class="material-symbols-outlined">arrow_back</i>
          {{ $t("back").toLocaleUpperCase() }}
        </div>
      </Button>
    </div>
  </div>
</template>
