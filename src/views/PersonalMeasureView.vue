<template>
    <h1 style="text-align: center">Personal Measure</h1>

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

        <v-btn variant="outlined" color="warning" @click="saveResults = true">
            Save Results
        </v-btn>
    </div>

    <v-container>
        <v-row class="d-flex align-start justify-center">
            <v-col v-for="track in numberOfTracks" :key="track">
                <syncronized-stopwatch
                    :run-all="runAll"
                    :initial-track="track"
                    :distance="distance"
                    :time="time"
                    :possible-names="possibleNames"
                    :save-results="saveResults"
                    @stop="stoppedWatches.push(track)"
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
            saveResults: false,
        };
    },

    methods: {
        startTimer: function () {
            this.stoppedWatches = [];
            this.saveResults = false;

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
            handler: function (newVal) {
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
