// Composables
import { createRouter, createWebHistory } from "vue-router";

import LoginView from "@/views/LoginView.vue";
import ProfileView from "@/views/ProfileView.vue";
import SyncronizedMeasureView from "@/views/SyncronizedMeasureView.vue";
import PersonalMeasureView from "@/views/PersonalMeasureView.vue";

const routes = [
    {
        path: "/measure/syncronized",
        component: SyncronizedMeasureView,
    },
    // {
    //     path: "/measure/personal",
    //     component: PersonalMeasureView,
    // },
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
