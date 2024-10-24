<script setup lang="ts">
import { TUser, TRecipe } from "@/@types/general";
import SubscribeButton from "@/components/recipes/SubscribeButton.vue";

interface RecipeCardUserProps {
  isMore?: boolean;
  recipe: TRecipe;
  currUser?: null | TUser;
}

const { recipe, currUser, isMore } = defineProps<RecipeCardUserProps>();
</script>

<template>
  <!-- Author is not deleted and not the current user -->
  <RouterLink
    v-if="
      recipe.author != null &&
      recipe.user_id != null &&
      recipe.user_id !== currUser?.id
    "
    :to="`/authors/${recipe.user_id}`"
    class="text-add w-fit hover:underline"
  >
    {{ $t("author", { name: recipe.author.name }) }}
  </RouterLink>

  <!-- Author is current user -->
  <strong v-else-if="currUser != null && currUser.id === recipe.user_id">
    <strong class="text-[#08a408] w-fit"
      >{{ $t("author") }}
      <span class="]">{{ $t("you") }}</span>
    </strong>
  </strong>

  <!-- Author is deleted -->
  <strong
    v-else-if="recipe.author == null"
    class="text-gray-400 w-fit text-sm whitespace-nowrap"
  >
    {{ $t("author", { name: $t("deletedAcc") }) }}
  </strong>

  <!-- If authorized and is "isMore" view and current suer isn't the author -->
  <SubscribeButton
    v-if="isMore && currUser != null && currUser.id !== recipe.user_id"
    :authorId="recipe.user_id"
  />
</template>
