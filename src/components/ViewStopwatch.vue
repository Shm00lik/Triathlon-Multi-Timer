<template>
    <v-expand-transition>
        <v-card
            v-show="showWatch"
            width="270"
            class="mx-auto text-center"
            rounded="xl"
        >
            <v-card-title class="d-flex flex-column align-center">
                Track {{ data.track }}

                <v-list-item-subtitle>
                    {{ stringifyDateDay(getDateFromData()) }}
                    |
                    {{ stringifyDateTime(getDateFromData()) }}

                    <div v-if="data.description">
                        {{ data.description }}
                    </div>
                </v-list-item-subtitle>
            </v-card-title>

            <v-card-text>
                <h1 class="text--green">
                    {{ stringifyTime(data.totalTime) }}
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

                <div v-if="data.laps.length > 0">
                    <br />

                    <v-btn
                        @click="expandLapsTable = !expandLapsTable"
                        color="primary"
                        block
                        variant="outlined"
                    >
                        {{ expandLapsTable ? "Hide" : "Show All" }}
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </v-expand-transition>
</template>

<script>
export default {
    name: "ViewStopwatch",

    props: {
        data: {
            type: Object,
            default: () => {},
            required: true,
        },
    },

    data() {
        return {
            showWatch: false,
            lapsTableHeaders: [
                { title: "", key: "distance", align: "center" },
                { title: "", key: "totalTime", align: "center" },
                { title: "", key: "deltaTime", align: "center" },
            ],
            expandLapsTable: false,
        };
    },

    methods: {
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

        stringifyDateDay: function (date) {
            return `${date.getDate()}/${
                date.getMonth() + 1
            }/${date.getFullYear()}`;
        },

        stringifyDateTime: function (date) {
            return `${this.pad(date.getHours())}:${this.pad(
                date.getMinutes()
            )}`;
        },

        getDateFromData: function () {
            return new Date(this.data.date.seconds * 1000);
        },

        getLapsData: function () {
            return this.data.laps.map((lap) => {
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

    created: function () {
        setTimeout(() => {
            this.showWatch = true;
        }, 200);
    },
};
</script>
