<script setup lang="ts">
import { useSubscribeUser } from "@/composables/useSubscribeUser";

interface SubscrieButtonProps {
  authorId: string | null;
}

const { authorId } = defineProps<SubscrieButtonProps>();

const { handleSubscription, isSubscribed } = useSubscribeUser(authorId);
</script>

<template>
  <button
    class="relative"
    :class="`xs:w-fit text-sm sm:text-base lg:text-lg text-add flex items-center justify-center gap-x-2 border border-add rounded-sm px-4 py-0.5 font-semibold duration-200 transition-colors ${
      isSubscribed ? 'bg-add text-primary' : 'text-add'
    }`"
    @click="handleSubscription()"
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
