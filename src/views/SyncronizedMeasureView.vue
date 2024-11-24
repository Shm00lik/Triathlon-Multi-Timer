<template>
    <v-btn @click="runAll = !runAll" :color="runAll ? 'red' : 'green'" block>
        {{ runAll ? "Stop" : "Start" }}
    </v-btn>

    <div v-if="!runAll" style="text-align: center">
        <v-pagination :length="8" :total-visible="8" v-model="numberOfTracks" />

        <v-chip
            v-for="(d, idx) in possibleDistances"
            :key="idx"
            :color="d == distance ? 'primary' : ''"
            @click="setDistance(d)"
            variant="flat"
            class="mx-4"
        >
            {{ d }} METERS
        </v-chip>

        <br />
        <br />

        <v-btn variant="outlined" color="warning" @click="saveResultsToDB()">
            Save Results
        </v-btn>
    </div>

    <v-container>
        <v-row class="d-flex align-start justify-center">
            <v-col v-for="track in numberOfTracks" :key="track">
                <syncronized-stopwatch
                    :run-all="runAll"
                    :initial-track="track"
                    :number-of-tracks="numberOfTracks"
                    :distance="distance"
                    :time="time"
                    :possible-names="possibleNames"
                    @stop="(r) => stoppedWatches.push(r)"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import SyncronizedStopwatch from "../components/SyncronizedStopwatch.vue";
import { db } from "@/App.vue";

const DT = 0.01;

export default {
    name: "HomeView",

    components: {
        SyncronizedStopwatch,
    },

    data() {
        return {
            startTime: 0,
            time: 0,
            intervalId: null,
            runAll: false,
            numberOfTracks: 6,
            distance: 25,
            possibleDistances: [25, 50],
            possibleNames: [],
            stoppedWatches: [],
        };
    },

    methods: {
        startTimer: function () {
            this.stoppedWatches = [];

            this.startTime = Date.now();

            this.intervalId = setInterval(() => {
                this.time = Date.now() - this.startTime;
            }, DT * 1000);
        },

        stopTimer: function () {
            clearInterval(this.intervalId);
        },

        setDistance: function (distance) {
            this.distance = distance;
        },

        saveResultsToDB: async function () {
            this.stoppedWatches.forEach(async (r) => {
                if (r.username) {
                    await db.collection("data").add(r);
                }
            });
        },
    },

    watch: {
        runAll: function (newVal) {
            if (newVal) {
                this.startTimer();
            } else {
                this.stopTimer();
            }
        },

        stoppedWatches: {
            handler: async function (newVal) {
                if (newVal.length >= this.numberOfTracks) {
                    this.runAll = false;
                }
            },

            deep: true,
        },
    },

    created: async function () {
        this.possibleNames = (await db.collection("users").get()).map(
            (doc) => doc.username
        );
    },
};
</script>
