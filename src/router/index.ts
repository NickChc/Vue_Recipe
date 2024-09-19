import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "PublicLayout",
    component: () => import("@/layouts/PublicLayout.vue"),
    children: [
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
      {
        path: "/recipes/new",
        name: "NewRecipe",
        component: () => import("@/views/NewRecipe.vue"),
      },
      {
        path: "/sign-in",
        name: "SignIn",
        component: () => import("@/views/SignIn.vue"),
      },
      {
        path: "/about-us",
        name: "AboutUs",
        component: () => import("@/views/AboutUs.vue"),
      },
    ],
  },
  {
    path: "/admin",
    name: "AdminLayout",
    component: () => import("@/layouts/AdminLayout.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    return { top: 0 };
  },
});

export default router;
