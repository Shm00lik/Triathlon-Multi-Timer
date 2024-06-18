<template>
    <VCard max-width="200" width="auto" class="mx-auto text-center">
        <VCardTitle>Stopwatch</VCardTitle>

        <VCardText>
            <div v-for="(idx, l) in laps" :key="idx">
                {{ l }}
                <VDivider class="my-2" />
            </div>
        </VCardText>
    </VCard>
</template>

<script>
export default {
    name: "Stopwatch",

    data() {
        return {
            time: 0,
            running: false,
            interval: null,
            laps: [1, 2, 3, 4],
        };
    },
};
</script>
