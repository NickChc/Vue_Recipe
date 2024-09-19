import { TRecipe } from "@/@types/general";
import { recipesCollection } from "@/firebase";
import { useRecipesStore } from "@/stores/recipesStore";
import { getDocs } from "firebase/firestore";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

export function useGetRecipes() {
  const recipesStore = useRecipesStore();
  const { recipes } = storeToRefs(recipesStore);

  const loading = ref(false);
  const error = ref<null | string>(null);

  async function getRecipes() {
    try {
      error.value = null;
      loading.value = true;

      const recipeDocs = await getDocs(recipesCollection);

      const data: TRecipe[] = recipeDocs.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as TRecipe;
      });

      recipesStore.setRecipes(data);
    } catch (err: any) {
      console.log(err.message);
      error.value = "Couldn't fetch recipes";
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    getRecipes();
  });

  return { loading, error, getRecipes, recipes };
}
