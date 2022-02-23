import { createRouter, createWebHistory } from "vue-router";
import Ganancias from "../views/Ganancias.vue";
import Pesajes from "../views/Pesajes.vue";

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
      component: Pesajes,
    },
  ],
});

export default router;
