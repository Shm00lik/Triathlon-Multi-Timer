<template>
    <v-btn
        @click="forceRun = !forceRun"
        :color="forceRun ? 'red' : 'green'"
        block
    >
        {{ forceRun ? "Stop" : "Start" }}
    </v-btn>

    <v-pagination :length="8" :total-visible="8" v-model="numberOfTracks" />

    <div class="d-flex justify-center">
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
    </div>

    <v-container>
        <v-row class="d-flex align-start justify-center">
            <v-col v-for="track in numberOfTracks" :key="track">
                <stopwatch
                    :forceRun="forceRun"
                    :initial-track="track"
                    :distance="distance"
                    :time="time"
                    @stop="stoppedWatches.push(track)"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Stopwatch from "../components/Stopwatch.vue";

const DT = 0.01;

export default {
    name: "HomeView",

    components: {
        Stopwatch,
    },

    data() {
        return {
            startTime: 0,
            time: 0,
            intervalId: null,
            forceRun: false,
            numberOfTracks: 6,
            distance: 25,
            possibleDistances: [25, 50],
            stoppedWatches: [],
        };
    },

    methods: {
        startTimer: function () {
            this.stoppedWatches = [];

            this.startTime = Date.now();

            this.intervalId = setInterval(() => {
                this.time = Date.now() - this.startTime;
                console.log(this.time);
            }, DT * 1000);
        },

        stopTimer: function () {
            clearInterval(this.intervalId);
        },

        getTicks: function () {
            let ticks = [];

            for (let i = 0; i < this.numberOfDistances; i++) {
                ticks.push(i * this.distanceStep);
            }

            return ticks;
        },

        setDistance: function (distance) {
            this.distance = distance;
        },
    },

    watch: {
        forceRun: function (newVal) {
            if (newVal) {
                this.startTimer();
            } else {
                this.stopTimer();
            }
        },

        stoppedWatches: {
            handler: function (newVal) {
                if (newVal.length >= this.numberOfTracks) {
                    this.forceRun = false;
                }
            },

            deep: true,
        },
    },
};
</script>
