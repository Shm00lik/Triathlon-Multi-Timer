// Composables
import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import ProfileView from "@/views/ProfileView.vue";

const routes = [
    {
        path: "/",
        component: HomeView,
    },
    {
        path: "/login",
        component: LoginView,
    },
    {
        path: "/profile",
        component: ProfileView,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
