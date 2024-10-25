<script setup lang="ts">
import { onMounted, ref } from "vue";
import { register, SwiperContainer } from "swiper/element/bundle";
import "swiper/css";
import RecipeCard from "@/components/recipes/RecipeCard.vue";
import { TRecipe } from "@/@types/general";

interface RecipeSliderProps {
  recipes: TRecipe[];
}

register();

const { recipes } = defineProps<RecipeSliderProps>();

const swiperRef = ref<null | SwiperContainer>(null);

const params = {
  navigation: true,
  injectStyles: [
    `
    .swiper {
      width: 100% ;
    }

    .swiper-button-next,
    .swiper-button-prev {
      top: 45% ;
      opacity: 75% ;
      width: 28px ;
      height: 28px ;
      background: var(--clr-primary) ;
      border-radius: 60%;
      box-shadow: 0 0.5rem 1rem rgba(16, 28, 38, 0.05);
      color: var(--clr-add);
      transition: background 350ms, color 350ms ;

      @media(min-width: 340px) {
        width: 36px ;
        height: 36px ;
        top: 30% ;
      }

      @media (min-width: 700px) {
        width: 40px ;
        height: 40px ;
      }
    }

    .swiper-button-next.swiper-button-disabled,
    .swiper-button-prev.swiper-button-disabled {
      display: none ;
    }

    .swiper-button-next {
      right: 4px ;
    }

    .swiper-button-prev {
      left: 4px ;
    }

    .swiper-button-prev:active,
    .swiper-button-next:active {
      opacity: 100% ;
      background-color: var(--clr-add);
      color: var(--clr-primary);
    }

    @media (pointer: fine) {
      .swiper-button-prev:hover,
      .swiper-button-next:hover {
        opacity: 100% ;
        background-color: var(--clr-add);
        color: var(--clr-primary);
        }
      }

    .swiper-button-next svg ,
    .swiper-button-prev svg {
      width: 25%;
    }
    `,
  ],
};

onMounted(() => {
  if (swiperRef.value == null) return;

  Object.assign(swiperRef.value, params);
  swiperRef.value.initialize();
});
</script>

<template>
  <swiper-container
    :slides-per-view="1"
    :space-between="16"
    :centered-slides="false"
    :navigation="true"
    :breakpoints="{
      500: {
        slidesPerView: 2,
      },
      1100: {
        slidesPerView: 3,
      },
    }"
    ref="swiperRef"
    :init="false"
  >
    <swiper-slide v-for="recipe in recipes" :key="recipe.id">
      <div class="border-2 border-add rounded-sm">
        <RecipeCard :hideRating="true" :isDark="true" :recipe="recipe" />
      </div>
    </swiper-slide>
  </swiper-container>
</template>
