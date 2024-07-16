<script setup lang="ts">
const { spotifyAuth } = useSpotify();
const spotifyStore = useSpotifyStore();
const store = useGlobalStore();
const token = ref();
store.tabs = {
    home: { name: 'Home', icon: 'mdi:home', active: true },
}
const randomNumbers = [{
    action: 'deposit',
    amount: 1000
},
{
    action: 'transfer',
    amount: -200
}, {
    action: 'Tanken',
    amount: 64.50
}
]
const SpotifyLogin = async () => {
    spotifyAuth();
}



</script>
<template>
    <Layout>
        <template #home>

            <div class="w-full h-full on-surface-text flex gap-4">
                <Widget title="Balance">
                    <div class="flex flex-col justify-between h-full">

                        <div class="flex justify-center gap-4 items-center h-full">
                            <div>
                                <span class="text-[12px] secondary-text">€</span>
                                <span class="text-[32px]">10820</span>
                                <span class="text-[12px] secondary-text">.64</span>
                            </div>
                            <div>
                                <span class="text-[12px] text-green-400 font-semibold">2.38%</span>
                            </div>
                        </div>
                        <div class="h-full flex flex-col">
                            <div v-for="item in randomNumbers" class="flex items-center justify-between w-full h-full">
                                <span class="text-[12px] on-surface-text capitalize">{{ item.action }}</span>
                                <span class="text-[12px] on-surface-text font-semibold"
                                    :class="item.amount > 0 ? 'text-green-400' : 'text-red-400'">{{ item.amount }}
                                    €</span>
                            </div>
                        </div>
                    </div>
                </Widget>
                <Widget title="Weather">
                    18°C
                </Widget>
            </div>
        </template>

    </Layout>
</template>

<style scoped></style>