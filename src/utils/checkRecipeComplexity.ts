import { TComplexity_Enum } from "@/@types/general";

export function checkRecipeComplexity(
  iconIndex: number,
  complexity: TComplexity_Enum
) {
  const totalCases = Object.values(TComplexity_Enum);
  const lvlIndex = totalCases.indexOf(complexity);

  if (iconIndex <= lvlIndex) {
    return true;
  }

  return false;
}
