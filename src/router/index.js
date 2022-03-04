import { createRouter, createWebHistory } from "vue-router";
import Ganancias from "../views/Ganancias.vue";
import Pesajes from "../views/Pesajes.vue";
import Ganado from "../views/Ganado.vue";

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
    {
      path: "/ganado",
      name: "Ganado",
      component: Ganado,
    },
  ],
});

export default router;
