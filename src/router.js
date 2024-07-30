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
      path: "/home",
      name: "home",
      component: () => import("./views/Home.vue")
    },
    {
      path: "/manage-users",
      name: "manage-users",
      component: () => import("./views/ManageUsers.vue")
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("./views/Profile.vue")
    },
    {
      path: "/resume/1",
      name: "resume-1",
      component: () => import("./views/ResumeTemplate1.vue")
    },
    {
      path: "/resume/2",
      name: "resume-2",
      component: () => import("./views/ResumeTemplate2.vue")
    },
    {
      path: "/resume/3",
      name: "resume-3",
      component: () => import("./views/ResumeTemplate3.vue")
    },
    {
      path: "/resume/4",
      name: "resume-4",
      component: () => import("./views/ResumeTemplate4.vue")
    }
    ,
    {
      path: "/newresume/:jobId",
      name: "newresume",
      component: () => import("./views/NewResume.vue")
    },
    {
      path: "/airesumes/",
      name: "airesumes",
      component: () => import("./views/AiResumes.vue")
    }
  ],
});

export default router;
