<script setup lang="ts">
const { getPlaylist, fetchToken, startPlayback } = useSpotify();

const store = useGlobalStore();
const spotifyStore = useSpotifyStore();

const route = useRoute();
const { id } = route.params;
const playlist = ref();
const pending = ref(true);

const tableHeaders = [
    { text: '#', sortable: false },
    { text: 'Title', sortable: false },
    { text: 'Album', sortable: false },
    { text: 'Duration', sortable: false },
];

function formatDuration(duration: number) {
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

onMounted(async () => {
    store.title = 'loading';

    if (id) {
        store.tabs = {
            home: { name: 'Home', icon: 'mdi:home', active: true },
        }
        console.log(store.tabs);

        playlist.value = await getPlaylist(id);
        if (playlist.value) {
            pending.value = false;
            store.title = playlist.value.name;
        }
    }
});

</script>

<template>
    <div class="on-surface-text" v-if="pending">
        <p>Loading...</p>
    </div>
    <div v-else class=" w-full h-full surface-container rounded-3xl px-2 py-4">

        <div class="w-full h-full on-surface-text overflow-y-auto overflow-x-hidden  ">
            <template v-if="playlist.tracks">
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
                        <tr v-for="(track, index) in playlist.tracks.items" :key="track.track.id"
                            @click="startPlayback(playlist.uri, 'null', index)"
                            class="group/item cursor-pointer hover:surface-container-highest transition-colors duration-150 ease-in-out"
                            :class="{ 'surface-container-highest': track.track.id === spotifyStore.playbackState.item.id }">

                            <td class=" py-2 text-center text-[12px] secondary-text font-normal relative">
                                <span class="group-hover/item:opacity-0 transition-opacity duration-150">
                                    {{ index + 1 }}
                                </span>
                                <Icon name="mdi:play" size="16"
                                    class="absolute cursor-pointer group-hover/item:opacity-100 opacity-0 transition-opacity duration-150 left-1/2 transform -translate-x-1/2"
                                    @click.prevent="startPlayback(playlist.uri, 'null', index)" />
                            </td>
                            <td class=" py-2 text-left text-[12px] font-normal flex flex-col">
                                <span>
                                    {{ track.track.name }}
                                </span>
                                <span>
                                    <span v-if="track.track.artists.length > 0" class="text-[12px] secondary-text">
                                        by {{ track.track.artists.map(artist => artist.name).join(', ') }}
                                    </span>
                                </span>
                            </td>
                            <td class=" py-2 text-left text-[12px] secondary-text font-normal">{{
                                track.track.album.name
                            }}
                            </td>
                            <td class=" py-2 text-left text-[12px] secondary-text font-normal">{{
                                formatDuration(track.track.duration_ms) }} min
                            </td>
                        </tr>
                    </tbody>
                </table>
            </template>
        </div>
    </div>
</template>


<style scoped></style>