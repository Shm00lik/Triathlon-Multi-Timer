<template>
    <v-app>
        <v-main>
            <home-view />

            <v-footer app class="d-flex justify-center">
                <div class="text-center" width="auto">
                    {{ new Date().toLocaleString("en-us", { month: "long" }) }}
                    {{ new Date().getFullYear() }} -
                    <strong>Yoav Levy</strong> - v{{ VERSION }}
                </div></v-footer
            >
        </v-main>
    </v-app>
</template>

<script>
import HomeView from "./views/HomeView.vue";

export default {
    name: "App",

    components: {
        HomeView,
    },

    data() {
        return {
            VERSION: "1.0.0",
        };
    },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Heebo:wght@200;300;400;600;700&display=swap");

* {
    font-family: "Heebo";
}
</style>
