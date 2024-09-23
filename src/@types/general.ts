import { Timestamp } from "firebase/firestore";

export enum TComplexity_Enum {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  CHEF = "chef",
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
  cooking_time: number;
  rating: number;
  rates: { point: number; user_id: string }[];
  complexity: TComplexity_Enum;
  created_at: Timestamp;
  ingredients: string[];
  diet?: TDiet_Enum[];
  servings: number;
  category: TCategory_Enum[];
  image?: string;
  author: {
    name: string;
    rating: number;
  };
}

export interface TUser {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar?: string;
  recipes: string[]; // recipe id's
  subscriptions: string[]; // user id's
  subscribers: string[]; // user id's
  rating: number;
}
