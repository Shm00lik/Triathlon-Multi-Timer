<template>
    <v-app>
        <v-main>
            <router-view />

            <v-fade-transition>
                <v-footer app class="d-flex justify-center" v-if="showFooter">
                    <div class="text-center" width="auto">
                        {{
                            new Date().toLocaleString("en-us", {
                                month: "long",
                            })
                        }}
                        {{ new Date().getFullYear() }} -
                        <strong>Yoav Levy</strong> - v{{ VERSION }}
                    </div>
                </v-footer>
            </v-fade-transition>
        </v-main>
    </v-app>
</template>

<script>
import DB from "@/db/db.ts";

export const db = new DB("triathlon-multitimer");

export default {
    name: "App",

    data() {
        return {
            VERSION: "1.0.0",
            showFooter: false,
        };
    },

    created: function () {
        setTimeout(() => {
            this.showFooter = true;
        }, 500);

        if (!localStorage.getItem("user")) {
            this.$router.push("/login");
        }
    },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Heebo:wght@200;300;400;600;700&display=swap");

* {
    font-family: "Heebo";
}
</style>
