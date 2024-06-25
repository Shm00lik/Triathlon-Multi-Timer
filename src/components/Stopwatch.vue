<template>
    <v-card width="270" class="mx-auto text-center">
        <v-card-title class="d-flex justify-space-between">
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
                    :color="getButtonColor('start')"
                    variant="outlined"
                    block
                >
                    {{ isRunning ? "Stop" : "Start" }}
                </v-btn>

                <br />

                <v-btn
                    @click="saveLap"
                    :color="getButtonColor('lap')"
                    block
                    variant="outlined"
                >
                    Lap
                </v-btn>

                <br />
            </div>

            <h1>
                {{ stringifyTime(elapsedTime) }}
            </h1>

            <v-data-table
                :items="getLapsData()"
                density="compact"
                no-data-text="No laps recorded"
                disable-sort
                hide-default-footer
                hide-default-header
                :items-per-page="-1"
                hover
            >
            </v-data-table>
        </v-card-text>
    </v-card>

    <v-dialog
        v-model="openSettingsDialog"
        width="auto"
        class="mx-auto text-center"
        :opacity="0.254"
    >
        <v-card>
            <v-card-title>Settings</v-card-title>
            <v-card-text>
                <v-pagination :length="8" :total-visible="8" v-model="track" />

                <v-text-field
                    clearable
                    v-model="name"
                    label="Name"
                    variant="outlined"
                />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
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
    },

    data() {
        return {
            isRunning: false,
            openSettingsDialog: false,
            track: this.initialTrack,
            name: "יואב",
            elapsedTime: 0,
            laps: [],
            lapsTableHeaders: [
                { title: "", key: "distance", align: "center" },
                { title: "", key: "totalTime", align: "center" },
                { title: "", key: "deltaTime", align: "center" },
            ],
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

        getButtonColor: function (button) {
            switch (button) {
                case "start":
                    return this.isRunning ? "red" : "green";
                case "lap":
                    return "primary";
            }
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
    },
};
</script>
