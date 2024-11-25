<template>
    <v-container style="text-align: center">
        <h1 class="mb-4">Hello, {{ user.username }}!</h1>

        <v-btn
            v-if="user.isAdmin"
            @click="
                () => {
                    this.$router.push('/measure/syncronized');
                }
            "
            color="green"
        >
            Measure
        </v-btn>

        <br />
        <br />

        <v-skeleton-loader
            v-if="user.notLoggedIn"
            v-for="i in Math.floor(Math.random() * 4) + 1"
            :key="i"
            class="my-4"
            :elevation="10"
            type="card"
        />

        <v-row v-else class="d-flex align-start justify-center">
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
                notLoggedIn: true,
                isAdmin: false,
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
        this.user = JSON.parse(localStorage.getItem("user")) || this.user;

        console.log(this.user);
        await this.updateData();
    },
};
</script>
