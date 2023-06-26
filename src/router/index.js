import { createRouter, createWebHistory } from "vue-router";
import Simplifier from "@/views/Simplifier.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: Simplifier,
      name: "Simplifier",
    },
  ],
});

export default router;
