import { useI18n } from "vue-i18n";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { getUserById } from "@/data/getUserById";
import { updateUser } from "@/data/updateUser";
import { useAuthStore } from "@/stores/authStore";
import { sendToast } from "@/utils/sendToast";

export function useSubscribeUser(authorId: string | null | undefined) {
  const authStore = useAuthStore();
  const { currentUser } = storeToRefs(authStore);

  const error = ref<null | string>(null);

  const attemptCount = ref(0);
  const isSubscribed = ref(
    currentUser.value?.subscriptions.some((s) => s.id === authorId)
  );

  const { t } = useI18n();

  async function handleSubscription() {
    const currUser = currentUser.value;

    if (authorId == null) return;

    if (currUser == null || attemptCount.value > 9) return;

    const oldSubscribtions = currUser.subscriptions;

    // Prevent too many attempts
    if (attemptCount.value > 8) {
      setTimeout(() => {
        attemptCount.value = 0;
      }, 5000);
    }
    attemptCount.value++;

    try {
      const author = await getUserById(authorId);

      if (author == null) {
        error.value = "accaccountNoLongerExists";
        sendToast("error", t("accountNoLongerExists"));
        throw new Error("accountNoLongerExists");
      }

      if (isSubscribed.value) {
        const newSubscriptions = currUser.subscriptions.filter(
          (s) => s.id !== authorId
        );

        authStore.setCurrentUser({
          ...currUser,
          subscriptions: newSubscriptions,
        });

        await updateUser(currUser.id, {
          subscriptions: newSubscriptions,
        });
      } else {
        authStore.setCurrentUser({
          ...currUser,
          subscriptions: [
            ...currUser.subscriptions,
            { id: authorId, name: author.name },
          ],
        });

        await updateUser(currUser.id, {
          subscriptions: [
            ...currUser.subscriptions,
            { id: authorId, name: author.name },
          ],
        });
      }

      if (author.subscribers.some((sub) => sub.id === currUser.id)) {
        const newSubscribers = author.subscribers.filter(
          (sub) => sub.id !== currUser.id
        );

        await updateUser(authorId, {
          subscribers: newSubscribers,
        });
      } else {
        await updateUser(authorId, {
          subscribers: [
            ...author.subscribers,
            { id: currUser.id, email: currUser.email },
          ],
        });
      }

      if (oldSubscribtions.some((s) => s.id === authorId)) {
        sendToast(
          "success",
          `${t("unsubscribeSuccess", { name: author.name })}`
        );
      } else {
        sendToast("success", `${t("subscribeSuccess", { name: author.name })}`);
      }
    } catch (err: any) {
      console.log(err.message);
      sendToast("error", t("problemOccuredTryAgain"));
      authStore.setCurrentUser({
        ...currUser,
        subscriptions: oldSubscribtions,
      });
    }
  }

  watch(
    () => authStore.currentUser,
    (currUser) => {
      if (currUser == null) return;

      isSubscribed.value = currUser.subscriptions.some(
        (s) => s.id === authorId
      );
    }
  );

  return { handleSubscription, isSubscribed };
}
