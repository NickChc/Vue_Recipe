import { useAuthStore } from "@/stores/authStore";
import { storeToRefs } from "pinia";
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
        path: "/register",
        name: "Register",
        component: () => import("@/views/Register.vue"),
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
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
  },
];

export const PROTECTED_ROUTES = ["/profile", "/recipes/new"];
export const AUTH_ROUTES = ["/sign-in", "/register"];

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

router.beforeEach((to) => {
  const authStore = useAuthStore();
  const { loadingAuth, currentUser } = storeToRefs(authStore);

  if (AUTH_ROUTES.includes(to.path)) {
    if (!loadingAuth.value) return currentUser.value ? { path: "/" } : true;

    return new Promise((resolve) => {
      const unsubscribe = authStore.$subscribe(() => {
        if (!authStore.loadingAuth) {
          unsubscribe();
          resolve(to);
        }
      });
    });
  }

  if (!PROTECTED_ROUTES.includes(to.path)) return true;

  if (loadingAuth.value) {
    return new Promise((resolve) => {
      const unsubscribe = authStore.$subscribe(() => {
        if (!authStore.loadingAuth) {
          unsubscribe();
          resolve(to);
        }
      });
    });
  }

  if (currentUser.value) return true;

  return { path: "/sign-in" };
});

export default router;
