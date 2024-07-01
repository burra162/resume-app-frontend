import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/resumes",
      name: "resumes",
      component: () => import("./views/ResumeList.vue"),
    }
  ],
});

export default router;
