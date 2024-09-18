import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/recipes",
    name: "Recipes",
    component: () => import("@/views/Recipes.vue"),
  },
  {
    path: "/recipes/:recipeId",
    name: "Recipe",
    props: true,
    component: () => import("@/views/Recipe.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
