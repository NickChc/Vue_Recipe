<script setup lang="ts">
import { TRecipe } from "@/@types/general";
import { getUserById } from "@/data/getUserById";
import { updateUser } from "@/data/updateUser";
import { useAuthStore } from "@/stores/authStore";
import { sendToast } from "@/utils/sendToast";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

interface SubscrieButtonProps {
  recipe: TRecipe;
}

const error = ref<null | string>(null);

const { recipe } = defineProps<SubscrieButtonProps>();

const { t } = useI18n();

const authStore = useAuthStore();
const { currentUser } = storeToRefs(authStore);

const isSubscribed = ref(false);
const attemptCount = ref(0);

async function handleSubscription() {
  const currUser = currentUser.value;
  if (currUser == null || attemptCount.value > 9) return;

  const originalState = isSubscribed.value;

  if (attemptCount.value > 8) {
    setTimeout(() => {
      attemptCount.value = 0;
    }, 5000);
  }
  attemptCount.value++;

  isSubscribed.value = !isSubscribed.value;

  try {
    const author = await getUserById(recipe.user_id);

    if (author == null) {
      error.value = "accaccountNoLongerExists";
      sendToast("error", t("accountNoLongerExists"));
      throw new Error("accountNoLongerExists");
    }

    const isSubscribed = currUser.subscriptions.some(
      (s) => s.id === recipe.user_id
    );

    if (isSubscribed) {
      const newSubscriptions = currUser.subscriptions.filter(
        (s) => s.id !== recipe.user_id
      );

      await updateUser(currUser.id, {
        subscriptions: newSubscriptions,
      });

      authStore.setCurrentUser({
        ...currUser,
        subscriptions: newSubscriptions,
      });
    } else {
      await updateUser(currUser.id, {
        subscriptions: [
          ...currUser.subscriptions,
          { id: recipe.user_id, name: recipe.author.name },
        ],
      });

      authStore.setCurrentUser({
        ...currUser,
        subscriptions: [
          ...currUser.subscriptions,
          { id: recipe.user_id, name: recipe.author.name },
        ],
      });
    }

    if (author.subscribers.some((sub) => sub.id === currUser.id)) {
      const newSubscribers = author.subscribers.filter(
        (sub) => sub.id !== currUser.id
      );

      await updateUser(recipe.user_id, {
        subscribers: newSubscribers,
      });
    } else {
      await updateUser(recipe.user_id, {
        subscribers: [
          ...author.subscribers,
          { id: currUser.id, email: currUser.email },
        ],
      });
    }

    if (originalState) {
      sendToast(
        "success",
        `${t("unsubscribeSuccess", { name: recipe.author.name })}`
      );
    } else {
      sendToast(
        "success",
        `${t("subscribeSuccess", { name: recipe.author.name })}`
      );
    }
  } catch (err: any) {
    console.log(err.message);
    isSubscribed.value = originalState;
    sendToast("error", t("problemOccuredTryAgain"));
  }
}

onMounted(() => {
  if (currentUser.value) {
    isSubscribed.value = currentUser.value.subscriptions.some(
      (s) => s.id === recipe.user_id
    );
  }
});
</script>

<template>
  <button
    class="relative"
    :class="`xs:w-fit text-sm sm:text-base lg:text-lg text-add flex items-center justify-center gap-x-2 border border-add rounded-sm px-4 py-0.5 font-semibold duration-200 transition-colors ${
      isSubscribed ? 'bg-add text-primary' : 'text-add'
    }`"
    @click="handleSubscription"
  >
    <template v-if="isSubscribed">
      {{ $t("unsubscribe") }}
      <i class="material-symbols-outlined note">notifications_active</i>
    </template>

    <template v-else>
      {{ $t("subscribe") }}
      <i class="material-symbols-outlined note">notifications</i>
    </template>
  </button>
</template>
