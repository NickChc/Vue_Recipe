import { TRecipeFormValues } from "@/@types/general";

export async function createRecipe(
  values: TRecipeFormValues,
  imageFile?: File
) {
  try {
    console.table(values);
    console.log(imageFile);
  } catch (err: any) {
    console.log(err.message);
  }
}
