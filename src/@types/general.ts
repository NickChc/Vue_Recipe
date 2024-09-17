export enum TComplexity_Enum {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
  CHEF = "chef",
}

export interface TRecipe {
  id: string;
  user_id: string;
  title: string;
  recipe: string;
  cooking_time: number;
  rating: number;
  complexity: TComplexity_Enum;
  created_at: Date;
  image: string;
}

export interface TUser {
  id: string;
  name: string;
  bio?: string;
  avatar?: string;
  recipes: string[]; // recipe id's
  subscriptions: string[]; // user id's
  subscribers: string[]; // user id's
  rating: number;
}
