<template>
    <v-expand-transition>
        <v-card
            v-show="showWatch"
            width="100%"
            :min-width="getMinWidth()"
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
                    <div v-if="!isInRestLap">
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
                            @click="saveLap()"
                            color="primary"
                            block
                            variant="outlined"
                        >
                            Lap
                        </v-btn>

                        <br />

                        <v-btn
                            @click="
                                saveLap();
                                enterRestLap();
                            "
                            color="green"
                            block
                            variant="outlined"
                        >
                            Rest
                        </v-btn>

                        <br />
                    </div>

                    <div v-else>
                        <v-btn
                            @click="saveLap()"
                            color="green"
                            block
                            variant="outlined"
                        >
                            Finish Rest
                        </v-btn>

                        <br />
                    </div>
                </div>

                <h1 class="text--green">
                    <div v-if="!isInRestLap">
                        {{ stringifyTime(getTimeSinceLastRest) }}
                    </div>

                    <div v-else>
                        {{
                            stringifyTime(
                                this.laps.length > 0
                                    ? this.elapsedTime -
                                          this.laps[this.laps.length - 1]
                                              .totalTime
                                    : this.elapsedTime
                            )
                        }}
                    </div>
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
                <v-pagination
                    :length="10"
                    :total-visible="10"
                    v-model="track"
                />

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
class Lap {
    constructor(distance, totalTime, deltaTime, isRestLap = false) {
        this.distance = isRestLap ? "Rest" : distance;
        this.totalTime = totalTime;
        this.deltaTime = deltaTime;
        this.isRestLap = isRestLap;
    }
}

export default {
    name: "Stopwatch",

    props: {
        time: {
            type: Number,
            default: 0,
            required: true,
        },

        runAll: {
            type: Boolean,
            required: true,
        },

        initialTrack: {
            type: Number,
            default: 0,
        },

        numberOfTracks: {
            type: Number,
            default: 1,
        },

        distance: {
            type: Number,
            default: 25,
        },

        possibleNames: {
            type: Array,
            default: () => [],
        },
    },

    emits: ["stop"],

    data() {
        return {
            showWatch: false,
            isRunning: this.runAll,
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
            isInRestLap: false,
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
                    this.getNextLapDistance(),
                    this.elapsedTime,
                    this.laps.length > 0
                        ? this.elapsedTime -
                          this.laps[this.laps.length - 1].totalTime
                        : this.elapsedTime,
                    this.isInRestLap
                )
            );

            if (this.isInRestLap) {
                this.leaveRestLap();
            }
        },

        enterRestLap: function () {
            this.isInRestLap = true;
        },

        leaveRestLap: function () {
            this.isInRestLap = false;
        },

        getNextLapDistance: function () {
            if (this.laps.length === 0) {
                return this.distance;
            }

            const lastLap = this.laps[this.laps.length - 1];

            if (lastLap.isRestLap) {
                return this.distance;
            }

            return lastLap.distance + this.distance;
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

        exportResult: function () {
            return {
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
            };
        },

        getMinWidth: function () {
            if (this.numberOfTracks <= 4) {
                return 680 / 2; // 2 per row
            }

            return 680 / 3; // 3 per row
        },
    },

    watch: {
        runAll: function () {
            if (this.runAll) {
                this.laps = [];
            }

            this.isRunning = this.runAll;
        },

        time: function () {
            if (this.isRunning) {
                this.elapsedTime = this.time;
            }
        },

        isRunning: function () {
            if (!this.isRunning) {
                this.$emit("stop", this.exportResult());
            }

            this.isInRestLap = false;
        },
    },

    computed: {
        getTimeSinceLastRest: function () {
            console.log("called");
            if (this.laps.length === 0) {
                return this.elapsedTime;
            }

            const lastRestLap = this.laps
                .slice()
                .reverse()
                .find((lap) => lap.isRestLap);

            if (!lastRestLap) {
                return this.elapsedTime;
            }

            return this.elapsedTime - lastRestLap.totalTime;
        },
    },

    created: function () {
        setTimeout(() => {
            this.showWatch = true;
        }, 200);
    },
};
</script>
