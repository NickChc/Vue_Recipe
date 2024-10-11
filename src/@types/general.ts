import { Timestamp } from "firebase/firestore";

export enum TComplexity_Enum {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  CHEF = "chef",
}

export enum TCookingTime_Enum {
  FIFTEEN_TO_THRITY = "15 - 30 min",
  THIRTY_TO_HOUR = "30 - 60 min",
  HOUR_TO_TWO_HOURS = "1 - 2 hr",
  TWO_PLUS_HOURS = "2+ hr",
}

export enum TCategory_Enum {
  BREAKFAST = "Breakfast",
  LUNCH = "Lunch",
  DINNER = "Dinner",
  SNACK = "Snack",
  DESSERT = "Dessert",
  APPETIZER = "Appetizer",
}

export enum TDiet_Enum {
  VEGETARIAN = "Vegetarian",
  VEGAN = "Vegan",
  GLUTEN_FREE = "Gluten Free",
  DAIRY_FREE = "Dairy Free",
  KETO = "Keto",
  PALEO = "Paleo",
  LOW_CARB = "Low Carb",
}

export interface TRecipe {
  id: string;
  user_id: string;
  title: string;
  recipe: string;
  cooking_time: TCookingTime_Enum;
  rating: number;
  rates: { point: number; user_id: string }[];
  complexity: TComplexity_Enum;
  created_at: Timestamp;
  ingredients: string[];
  diet?: TDiet_Enum[];
  servings: number;
  category: TCategory_Enum[];
  image: null | string;
  author: {
    name: string;
  };
}

export type TRecipeFormValues = Omit<
  TRecipe,
  "id" | "user_id" | "rating" | "rates" | "created_at" | "author"
>;

export interface TSocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
}

export interface TUser {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  recipes: string[]; // recipe id's
  subscriptions: string[]; // user id's
  subscribers: { id: string; email: string }[]; // user id's
  socialLinks: TSocialLinks;
}
