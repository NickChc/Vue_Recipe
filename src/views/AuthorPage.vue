<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { TUser } from "@/@types/general";
import { getUserById } from "@/data/getUserById";

interface AuthorPageProps {
  userId: string;
}

const { userId } = defineProps<AuthorPageProps>();

const authStore = useAuthStore();

const loading = ref(false);
const error = ref<null | string>(null);
const user = ref<null | TUser>(null);

async function getAuthor() {
  try {
    loading.value = true;

    if (userId == null) return;

    user.value = await getUserById(userId);

    if (user.value == null) throw new Error("Author not found");
  } catch (err: any) {
    console.log(err.message);
    error.value = "problemOccuredTryAgain";
  } finally {
    loading.value = false;
  }
}

// onMounted(() => {
//     if (authStore.currentUser == null) return;

//     if (authStore.currentUser)
// })
</script>

<template>
  <div class="h-full">
    <h1>AUTHOR PAGE</h1>
  </div>
</template>
