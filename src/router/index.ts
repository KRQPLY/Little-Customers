import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: "/",
    //   name: "home",
    //   component: HomeView,
    // },
    // {
    //   path: "/login",
    //   name: "login",
    //   component: () => import("@/views/LoginView.vue"),
    // },
    // {
    //   path: "/list",
    //   name: "list",
    //   component: () => import("@/views/ListView.vue"),
    // },
    // {
    //   path: "/:catchAll(.*)*",
    //   redirect: "/login",
    // },
    {
      path: "/",
      redirect: `/en-US`,
    },
    {
      path: "/:matchAll(.*)*",
      redirect: `/en-US`,
    },
    {
      path: "/en-US",
      alias: ["/pl-PL"],
      children: [
        {
          path: "",
          name: "home",
          component: HomeView,
        },
        {
          path: "login",
          name: "login",
          component: () => import("@/views/LoginView.vue"),
        },
        {
          path: "list",
          name: "list",
          component: () => import("@/views/ListView.vue"),
        },
      ],
    },
  ],
});

export default router;
