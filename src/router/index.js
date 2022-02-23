import { createRouter, createWebHistory } from "vue-router";
import Ganancias from "../views/Ganancias.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "ganancias",
      component: Ganancias,
    },
    {
      path: "/pesajes",
      name: "pesajes",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/Pesajes.vue"),
    },
  ],
});

export default router;
