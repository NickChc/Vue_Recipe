<script setup lang="ts">
import { onMounted, ref } from "vue";
import { TUser } from "@/@types/general";
import { getUserById } from "@/data/getUserById";
import BackgroundImage from "@/assets/images/Layout_Image.jpg";
import PlaceholderImage from "@/assets/images/Profile_Placeholder_Image.png";
import HourglassLoading from "@/components/HourglassLoading.vue";
import Button from "@/components/Button.vue";

interface AuthorPageProps {
  userId: string;
}

// TODO : if author is current user, redirect to profile

const { userId } = defineProps<AuthorPageProps>();

const loading = ref(false);
const error = ref<null | string>(null);
const author = ref<null | TUser>(null);

async function getAuthor() {
  try {
    loading.value = true;

    if (userId == null) return;

    const user = await getUserById(userId);

    if (user == null) throw new Error("Author not found");

    author.value = user;
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
  <div class="h-full sm:w-[80%] mx-auto">
    <div v-if="author" class="bg-add-2 rounded-lg p-3 mt-6">
      <div
        class="min-h-60 bg-add-2 text-primary p-4 sm:p-6 rounded-lg relative flex flex-col items-center justify-center xs:items-start"
      >
        <div
          class="brightness-90 absolute top-0 bottom-[70%] sm:bottom-[60%] rounded-t-lg right-0 left-0 bg-cover bg-left"
          :style="{ backgroundImage: `url(${BackgroundImage})` }"
        ></div>

        <!-- TODO : show authors social links -->

        <div class="flex flex-col xs:items-start">
          <div class="flex flex-col items-center gap-y-1.5 relative z-30">
            <div class="bg-black w-32 sm:w-40 h-32 sm:h-40">
              <!-- TODO : add image to user doc to use it -->
              <img
                :src="author.image || PlaceholderImage"
                alt="Author's image"
              />
            </div>
            <h2>{{ author.name }}</h2>
          </div>
          <template v-if="author.bio">
            <h5 class="opacity-50 text-sm self-start m-1">
              {{ $t("biography") }}
            </h5>
            <p
              class="h-20 scrollbar-small overflow-y-auto text-sm sm:text-base max-w-[400px] lg:max-w-[500px] pr-1"
            >
              {{ author.bio }}
            </p>
          </template>
        </div>

        <div
          class="mt-6 w-full flex flex-col sm:flex-row sm:items-center gap-y-2 justify-between"
        >
          <h4>{{ $t("subscribers") }}: {{ author.subscribers.length }}</h4>

          <Button>{{ $t("subscribe") }}</Button>
        </div>
      </div>
    </div>

    <!-- TODO : list of author's recipes -->

    <!-- No author view -->
    <div v-else-if="loading">
      <HourglassLoading />
    </div>
    <div v-else-if="error">{{ error }}</div>
  </div>
</template>
