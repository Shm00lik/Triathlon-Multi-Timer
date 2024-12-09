<template>
    <v-container>
        <v-slide-y-transition>
            <v-card v-show="show" :loading="loading">
                <v-card-title class="d-flex justify-center">
                    <h2>Login!</h2>
                </v-card-title>

                <v-card-text>
                    <v-text-field
                        clearable
                        v-model="username"
                        label="Username"
                        variant="outlined"
                    />

                    <v-text-field
                        clearable
                        v-model="password"
                        label="Password"
                        variant="outlined"
                        type="password"
                    />

                    <v-btn
                        @click="login"
                        block
                        variant="outlined"
                        color="primary"
                    >
                        Login
                    </v-btn>
                </v-card-text>
            </v-card>
        </v-slide-y-transition>
    </v-container>

    <v-snackbar v-model="failedSnackbar" variant="outlined" color="transparent">
        <v-alert
            text="Invalid username or password!"
            type="error"
            variant="outlined"
        />
    </v-snackbar>
</template>

<script>
import { db } from "@/App.vue";

export default {
    name: "LoginView",

    data() {
        return {
            show: false,
            username: "",
            password: "123456",
            failedSnackbar: false,
            loading: false,
        };
    },

    methods: {
        login: async function () {
            this.loading = true;

            let res = await db
                .collection("users")
                .where("username", "==", this.username)
                .where("password", "==", this.password)
                .get();

            if (res.length === 0) {
                this.loading = false;
                this.failedSnackbar = true;
                return;
            }

            this.loading = false;

            localStorage.setItem("user", JSON.stringify(res[0]));

            this.$router.push("/");
        },
    },

    created: function () {
        setTimeout(() => {
            this.show = true;
        }, 400);
    },
};
</script>
