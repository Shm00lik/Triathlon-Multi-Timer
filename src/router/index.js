import { createRouter, createWebHistory } from "vue-router";

import LoginView from "@/views/LoginView.vue";
import MainView from "@/views/MainView.vue";
import SyncronizedMeasureView from "@/views/SyncronizedMeasureView.vue";

const routes = [
    {
        path: "/",
        component: MainView,
    },
    {
        path: "/login",
        component: LoginView,
    },
    {
        path: "/measure",
        component: SyncronizedMeasureView,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
