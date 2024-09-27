import { TRecipeFormValues } from "@/@types/general";

export async function updateRecipe(
  oldValues: TRecipeFormValues,
  newValues: TRecipeFormValues,
  imageFile: File | undefined
) {
  console.log(oldValues);
  console.log(newValues);
  console.log(imageFile?.name);

  //   FINISH THIS

  return { success: false, error: "JUST WAIT" };
}
