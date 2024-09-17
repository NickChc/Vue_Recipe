<script setup lang="ts">
import { useGlobalStore } from "@/stores/globalStore";
import { storeToRefs } from "pinia";
import { ref } from "vue";

interface RecipeCardRatingProps {
  rating: number;
}

const globalStore = useGlobalStore();
const { hasMouse } = storeToRefs(globalStore);

const { rating } = defineProps<RecipeCardRatingProps>();

const newRating = ref(0);
</script>

<!-- TODO : make this into a range input -->
<template>
  <div
    class="flex translate-y-full opacity-0 duration-200 group-hover:opacity-100 group-hover:translate-y-0 items-center gap-x-1 absolute bottom-1 px-2 text-[goldenrod]"
  >
    <button>
      <i class="material-symbols-outlined" :style="{ fontSize: '2rem' }"
        >star</i
      >
    </button>
    <button>
      <i class="material-symbols-outlined" :style="{ fontSize: '2rem' }"
        >star</i
      >
    </button>
    <button>
      <i class="material-symbols-outlined" :style="{ fontSize: '2rem' }"
        >star</i
      >
    </button>
    <button>
      <i class="material-symbols-outlined" :style="{ fontSize: '2rem' }"
        >star</i
      >
    </button>
    <button>
      <i class="material-symbols-outlined" :style="{ fontSize: '2rem' }"
        >star</i
      >
    </button>
  </div>
</template>
