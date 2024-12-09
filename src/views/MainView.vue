<template>
    <v-container style="text-align: center">
        <h1 class="mb-4">Hello, {{ user.username }}!</h1>

        <v-btn
            v-if="user.isAdmin"
            @click="
                () => {
                    this.$router.push('/measure');
                }
            "
            color="green"
        >
            Measure
        </v-btn>

        <v-btn v-if="user.isAdmin" @click="createUsers()" color="red">
            Create Users
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

        createUsers: async function () {
            const names = [
                "אלעד בוכניק",
                "ארז בן נח",
                "ארז ברקאי",
                "אריאל מזור",
                "גדי ברקאי",
                "יורם אביגד",
                "יעל דקל",
                "מיקי כהן",
                "נדב קירש",
                "עדי מרטינז",
                "עדי קסלר",
                "עומרי קסלר",
                "עמיר כהן",
                "ערן אברון",
                "פטררו",
                "קרן ברנדס",
                "איה",
                "תומר שפרן",
                "גלעד ברנדס",
                "עטרת",
                "ליהי מזרחי",
                "ספיר לוין",
                "מוטי",
                "מושון",
                "שושי כהן",
                "ליאור",
                "אלה",
                "מנצור",
                "ניב",
                "עומרי  ",
                "לירן",
                "קטרין",
                "עופר",
                "אביב",
            ];

            for (let i = 0; i < names.length; i++) {
                await db.collection("users").add({
                    username: names[i],
                    password: "123456",
                    isAdmin: false,
                });
            }
        },
    },

    created: async function () {
        this.user = JSON.parse(localStorage.getItem("user")) || this.user;

        console.log(this.user);
        await this.updateData();
    },
};
</script>
