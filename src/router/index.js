import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "list",
            component: () => import("../views/list.vue"),
        },
        {
            path: "/single",
            name: "single",
            component: () => import("../views/single.vue"),
        },
        {
            path: "/about",
            name: "about",
            component: () => import("../views/about.vue"),
        },
    ],
});

export default router;
