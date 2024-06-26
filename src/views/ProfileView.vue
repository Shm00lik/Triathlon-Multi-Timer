<template>
    <v-container>
        <v-row class="d-flex align-start justify-center">
            <v-col v-for="(d, idx) in data" :key="idx">
                <view-stopwatch :data="d" :key="idx" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import ViewStopwatch from "../components/ViewStopwatch.vue";
import { db } from "@/App.vue";

export default {
    name: "ProfileView",

    components: {
        ViewStopwatch,
    },

    data() {
        return {
            user: {
                username: "",
                password: "",
                email: "",
            },
            data: [],
        };
    },

    methods: {
        updateData: async function () {
            this.data = await db
                .collection("data")
                .where("username", "==", this.user.username)
                .get();
        },
    },

    created: async function () {
        this.user = JSON.parse(localStorage.getItem("user"));
        await this.updateData();
    },
};
</script>
