<script setup lang="ts">
import { TUser } from "@/@types/general";
import BackgroundImage from "@/assets/images/Layout_Image.jpg";
import PlaceholderImage from "@/assets/images/Profile_Placeholder_Image.png";
import SubscribeButton from "@/components/recipes/SubscribeButton.vue";
import { SOCIAL_NETWORKS } from "@/config/data";
import { useAuthStore } from "@/stores/authStore";
import { computed } from "vue";

interface AuthorInfoProps {
  author: TUser;
}

const { author } = defineProps<AuthorInfoProps>();

const authStore = useAuthStore();

const userSocLinks = computed(() => {
  return SOCIAL_NETWORKS.filter((soc) => author.socialLinks[soc.name] != null);
});
</script>

<template>
  <div class="bg-add-2 rounded-lg p-3 mt-6">
    <div
      class="min-h-60 bg-add-2 text-primary p-4 sm:p-6 rounded-lg relative flex flex-col items-center justify-center xs:items-start"
    >
      <div
        class="brightness-90 absolute top-0 bottom-[70%] sm:bottom-[60%] rounded-t-lg right-0 left-0 bg-cover bg-left"
        :style="{ backgroundImage: `url(${BackgroundImage})` }"
      ></div>

      <div
        class="flex flex-col items-start md:items-center md:flex-row justify-between w-full"
      >
        <div class="flex flex-col xs:items-start mx-auto xs:mx-0">
          <div class="flex flex-col items-center gap-y-1.5 relative z-30">
            <div class="bg-black w-32 sm:w-40 h-32 sm:h-40">
              <img
                :src="author.image || PlaceholderImage"
                alt="Author's image"
                class="h-full w-full object-cover"
              />
            </div>
            <h2>{{ author.name }}</h2>
          </div>
          <div>
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
        </div>

        <!-- Social links here -->
        <div class="flex items-center gap-x-3 mt-3 md:mt-9">
          <a
            v-for="soc in userSocLinks"
            :key="soc.name"
            :href="soc.url"
            target="_blank"
            class="text-2xl md:text-3xl duration-200 transition-opacity hover:opacity-80"
          >
            <component :is="soc.icon" />
          </a>
        </div>
      </div>

      <div
        class="mt-6 w-full flex flex-col sm:flex-row sm:items-center gap-y-2 justify-between"
      >
        <h4 class="sm:text-lg md:text-xl">
          {{ $t("subscribers") }}: {{ author.subscribers.length }}
        </h4>

        <SubscribeButton
          v-if="authStore.currentUser != null"
          :authorId="author.id"
        />
      </div>
    </div>
    <p
      v-if="authStore.currentUser != null"
      class="text-xs text-add sm:text-sm sm:text-end"
    >
      {{ $t("subscribeTip") }}
    </p>
  </div>
</template>
