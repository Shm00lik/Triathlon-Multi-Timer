<template>
    <v-expand-transition>
        <v-card
            v-show="showWatch"
            width="270"
            class="mx-auto text-center"
            rounded="xl"
        >
            <v-card-title class="d-flex justify-space-between" dir="rtl">
                <div v-if="name">{{ track }} - {{ name }}</div>

                <div v-else>Track {{ track }}</div>

                <v-icon @click="openSettingsDialog = true" size="small">
                    mdi-cog
                </v-icon>
            </v-card-title>

            <v-card-text>
                <div v-if="isRunning">
                    <v-btn
                        @click="toggleTimer"
                        color="red"
                        variant="outlined"
                        block
                    >
                        STOP
                    </v-btn>

                    <br />

                    <v-btn
                        @click="saveLap"
                        color="primary"
                        block
                        variant="outlined"
                    >
                        Lap
                    </v-btn>

                    <br />
                </div>

                <h1 class="text--green">
                    {{ stringifyTime(elapsedTime) }}
                </h1>

                <v-data-table
                    :items="expandLapsTable ? getLapsData() : getLastLapsData()"
                    density="compact"
                    no-data-text="No laps recorded"
                    disable-sort
                    hide-default-footer
                    hide-default-header
                    :items-per-page="-1"
                    hover
                />

                <br />

                <v-btn
                    @click="expandLapsTable = !expandLapsTable"
                    color="primary"
                    block
                    variant="outlined"
                >
                    {{ expandLapsTable ? "Hide" : "Show All" }}
                </v-btn>
            </v-card-text>
        </v-card>
    </v-expand-transition>

    <v-dialog
        v-model="openSettingsDialog"
        width="auto"
        class="mx-auto text-center"
        :opacity="0.254"
        transition="dialog-bottom-transition"
    >
        <v-card>
            <v-card-title>Settings</v-card-title>
            <v-card-text>
                <v-pagination :length="8" :total-visible="8" v-model="track" />

                <br />

                <v-autocomplete
                    v-model="name"
                    :items="possibleNames"
                    label="Name"
                    variant="outlined"
                />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import { db } from "@/App.vue";

class Lap {
    constructor(distance, totalTime, deltaTime) {
        this.distance = distance;
        this.totalTime = totalTime;
        this.deltaTime = deltaTime;
    }
}

export default {
    name: "Stopwatch",

    props: {
        time: {
            type: Number,
            default: 0,
        },

        forceRun: {
            type: Boolean,
            default: false,
            required: false,
        },

        initialTrack: {
            type: Number,
            default: 0,
        },

        distance: {
            type: Number,
            default: 25,
        },

        possibleNames: {
            type: Array,
            default: () => [],
        },

        saveResults: {
            type: Boolean,
            default: false,
        },
    },

    emits: ["stop"],

    data() {
        return {
            showWatch: false,
            isRunning: this.forceRun,
            openSettingsDialog: false,
            track: this.initialTrack,
            name: null,
            elapsedTime: 0,
            laps: [],
            lapsTableHeaders: [
                { title: "", key: "distance", align: "center" },
                { title: "", key: "totalTime", align: "center" },
                { title: "", key: "deltaTime", align: "center" },
            ],
            expandLapsTable: false,
        };
    },

    methods: {
        toggleTimer: function () {
            this.isRunning = !this.isRunning;
        },

        pad: function (num) {
            if (num < 10) {
                return `0${num}`;
            }

            return num;
        },

        stringifyTime: function (time) {
            const minutes = Math.floor(time / 60000);
            const seconds = Math.floor((time % 60000) / 1000);
            const milliseconds = Math.floor((time % 1000) / 10);

            return `${this.pad(minutes)}:${this.pad(seconds)}:${this.pad(
                milliseconds
            )}`;
        },

        saveLap: function () {
            this.laps.push(
                new Lap(
                    this.distance * 2 * (this.laps.length + 1),
                    this.elapsedTime,
                    this.laps.length > 0
                        ? this.elapsedTime -
                          this.laps[this.laps.length - 1].totalTime
                        : this.elapsedTime
                )
            );
        },

        getLapsData: function () {
            return this.laps.map((lap) => {
                return {
                    distance: lap.distance,
                    deltaTime: this.stringifyTime(lap.deltaTime),
                    totalTime: this.stringifyTime(lap.totalTime),
                };
            });
        },

        getLastLapsData: function (size = 3) {
            return this.getLapsData().slice(-size);
        },
    },

    watch: {
        forceRun: function () {
            if (this.forceRun) {
                this.laps = [];
            }

            this.isRunning = this.forceRun;
        },

        time: function () {
            if (this.isRunning) {
                this.elapsedTime = this.time;
            }
        },

        isRunning: function () {
            if (!this.isRunning) {
                this.$emit("stop");
            }
        },

        saveResults: function () {
            console.log(this.saveResults, this.name);

            if (this.saveResults && this.name) {
                db.collection("data").add({
                    track: this.track,
                    username: this.name,
                    totalTime: this.elapsedTime,
                    date: new Date(),
                    laps: this.laps.map((lap) => {
                        return {
                            distance: lap.distance,
                            deltaTime: lap.deltaTime,
                            totalTime: lap.totalTime,
                        };
                    }),
                });
            }
        },
    },

    created: function () {
        setTimeout(() => {
            this.showWatch = true;
        }, 200);
    },
};
</script>
