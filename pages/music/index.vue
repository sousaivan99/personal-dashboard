<script setup lang="ts">

const { startPlayback, getPlaybackState, changeVolume, getPlaylists, getTopItems, getUser } = useSpotify();
const spotifyStore = useSpotifyStore();
const store = useGlobalStore();

store.tabs = {
    home: { name: 'Home', icon: 'mdi:home', active: true },
    favorites: { name: 'Favorites', icon: 'mdi:home', active: false },
}

const isImgOpen = ref(false);
const changeVolumeHandler = () => {
    changeVolume(spotifyStore.volume);
}
const tableHeaders = [
    { text: '#', sortable: false },
    { text: 'Title', sortable: false },
    { text: 'Album', sortable: false },
    { text: 'Duration', sortable: false },
];

onMounted(async () => {

    store.title = 'Spotify';
    spotifyStore.playbackState = await getPlaybackState();
    spotifyStore.user = await getUser();
    spotifyStore.playlists = await getPlaylists();
    spotifyStore.topItems = await getTopItems('tracks');
    if (spotifyStore.playbackState) {
        spotifyStore.volume = spotifyStore.playbackState.device.volume_percent
    }


})
function formatDuration(duration: number) {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

watch(() => spotifyStore.token, async () => {
    if (spotifyStore.token) {
        spotifyStore.playbackState = await getPlaybackState();
    }
})


</script>
<template>
    <Layout>
        <template #home>
            <div class="w-full h-full flex items-center justify-center relative overflow-hidden">
                <div class="flex flex-col items-center gap-2  w-full h-full">
                    <div class="w-full h-full on-surface-text overflow-y-auto overflow-x-hidden">
                        <div class="grid grid-cols-8 gap-2">
                            <template v-if="spotifyStore.playlists">
                                <div v-for="(item, index) in spotifyStore.playlists.items" :key="index"
                                    class="group/card w-full aspect-auto rounded-xl surface-container-high overflow-hidden relative cursor-pointer flex flex-col justify-between">
                                    <NuxtLink :to="`/music/${item.id}`">
                                        <div class="flex-1 w-full overflow-hidden">
                                            <img :src="item.images[0].url"
                                                class="group-hover/card:scale-[1.1] group-hover/card:opacity-50 w-full object-cover rounded-xl  transition-all duration-150 ease-in-out"
                                                style="image-rendering: auto;" />
                                        </div>
                                        <template v-if="item.owner.id === spotifyStore.user.id">
                                            <div
                                                class="p-1 z-10 w-fit rounded-full aspect-square flex items-center justify-center absolute top-2 right-2 surface-container-high">
                                                <Icon name="material-symbols:verified"
                                                    class="w-[16px] h-[16px] on-surface-text text-blue-200" />
                                            </div>
                                        </template>
                                        <template v-else-if="item.owner.id !== spotifyStore.user.id">
                                            <div
                                                class="p-1 z-10 w-fit rounded-full aspect-square flex items-center justify-center absolute top-2 right-2 surface-container-high">
                                                <Icon name="material-symbols-light:lock"
                                                    class="w-[16px] h-[16px] on-surface-text" />
                                            </div>
                                        </template>
                                        <div
                                            class="p-2 z-10 w-full h-14 absolute rounded-b-xl overflow-hidden bottom-0 bg-black/80">
                                            <div class="relative w-full h-fit">
                                                <p class="text-[0.8rem] truncate on-surface-text">{{ item.name }}</p>
                                            </div>
                                            <p class="text-[0.7rem] on-surface-text opacity-70">{{
                                                item.owner.display_name
                                            }}</p>
                                        </div>
                                    </NuxtLink>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template #favorites>
            <div class="w-full h-full overflow-hidden">
                <div class="flex flex-col items-center gap-2  w-full h-full">

                    <div class="w-full h-full on-surface-text overflow-y-auto overflow-x-hidden">
                        <table class="table-auto w-full">
                            <thead>
                                <tr class="border-b border-color">
                                    <template v-for="(header, headindex) in tableHeaders" :key="headindex">
                                        <th class="py-2 text-[12px] secondary-text font-normal"
                                            :class="{ 'text-center': header.text === '#', 'text-left': header.text !== '#' }">
                                            {{ header.text }}
                                        </th>
                                    </template>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-for="(item, index) in spotifyStore.topItems.items">
                                    <tr @click="startPlayback('null', item.uri)"
                                        class="group/item cursor-pointer hover:surface-container-highest transition-colors duration-150 ease-in-out">
                                        <td class=" py-2 text-center text-[12px] secondary-text font-normal relative">

                                            <span class="group-hover/item:opacity-0 transition-opacity duration-150">
                                                {{ index + 1 }}
                                            </span>
                                            <Icon name="mdi:play" size="16"
                                                class="absolute cursor-pointer group-hover/item:opacity-100 opacity-0 transition-opacity duration-150 left-1/2 transform -translate-x-1/2"
                                                @click.prevent="startPlayback('null', [item.uri])" />
                                        </td>
                                        <td class="py-2 text-[12px] secondary-text font-normal ">
                                            <div class="flex items-center">
                                                <img :src="item.album.images[0].url"
                                                    class="w-8 h-8 rounded-full mr-2" />
                                                {{ item.name }}
                                            </div>
                                        </td>
                                        <td class="py-2 text-[12px] secondary-text font-normal  ">{{
                                            item.album.name
                                        }}</td>
                                        <td class="py-2 text-[12px] secondary-text font-normal  ">{{
                                            formatDuration(item.duration_ms) }} min</td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </template>

    </Layout>
</template>


<style scoped>
.slider {
    width: 100%;
    height: 12px;
    border-radius: 9999px;
    outline: none;
    -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
    width: 12px;
    height: 12px;
    cursor: pointer;
    appearance: none;
    border-radius: 50%;
    -webkit-appearance: none;
    @apply surface
}
</style>