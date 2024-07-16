<script setup lang="ts">
const { spotifyAuth, getUser, getPlaybackState } = useSpotify();
const spotifyStore = useSpotifyStore();
const Progress = ref();


const pausePlayback = async () => {
    await useFetch('/api/spotify/pausePlayback', {
        method: 'POST',
        body: { token: spotifyStore.token }
    });
    await new Promise(resolve => setTimeout(resolve, 150));

    spotifyStore.playbackState = await getPlaybackState();
    isBigger.value = false;
    text.value.classList.remove('marquee');
}

const skip = async () => {
    await useFetch('/api/spotify/skip', {
        method: 'POST',
        body: { token: spotifyStore.token }
    });
    await new Promise(resolve => setTimeout(resolve, 150));
    spotifyStore.playbackState = await getPlaybackState();
    isBigger.value = false;
    text.value.classList.remove('marquee');

}

const previous = async () => {
    await useFetch('/api/spotify/previous', {
        method: 'POST',
        body: { token: spotifyStore.token }
    });
    await new Promise(resolve => setTimeout(resolve, 150));

    spotifyStore.playbackState = await getPlaybackState();
    isBigger.value = false;
    text.value.classList.remove('marquee');
}
const startPlayback = async () => {
    await useFetch('/api/spotify/startPlayback', {
        method: 'POST',
        body: { token: spotifyStore.token }
    });
    await new Promise(resolve => setTimeout(resolve, 150));

    spotifyStore.playbackState = await getPlaybackState();
    isBigger.value = false;
    text.value.classList.remove('marquee');
}
watch(() => spotifyStore.token, async () => {
    if (spotifyStore.token) {
        spotifyStore.playbackState = await getPlaybackState();
    }
})


let timer;

const startTimer = () => {
    timer = setInterval(() => {
        spotifyStore.playbackState.progress_ms += 1000;
        Progress.value = calculatePlaybackCompletion(spotifyStore.playbackState.progress_ms, spotifyStore.playbackState.item.duration_ms);
    }, 1000);
};

const stopTimer = () => {
    clearInterval(timer);
};

onMounted(async () => {
    if (spotifyStore.playbackState) {
        spotifyStore.user = await getUser();
        spotifyStore.playbackState = await getPlaybackState();
        console.log(spotifyStore.playbackState);

        startTimer();
    }
});

onBeforeUnmount(() => {
    stopTimer();
});


function calculatePlaybackCompletion(progressMs: number, durationMs: number) {
    if (durationMs === 0) {
        // Avoid division by zero
        return 0;
    }
    let completionPercentage = (progressMs / durationMs) * 100;
    if (completionPercentage < 0) {
        completionPercentage = 0;
    } else if (completionPercentage > 100) {
        completionPercentage = 100;
        isBigger.value = false;
        text.value.classList.remove('marquee');
    }

    // Ensure the completion percentage is within 0 to 100
    return Math.floor(completionPercentage); // Return the percentage without decimals
}

watch(Progress, async (value) => {
    if (value === 100) {
        spotifyStore.playbackState = await getPlaybackState();
    }
})


</script>
<template>
    <div class="flex flex-col items-center surface-container rounded-full  relative overflow-hidden">
        <div class="flex gap-3 items-center px-7 py-2">
            <div v-if="spotifyStore.playbackState" class="flex flex-col max-w-36 overflow-hidden">
                <div class="text-container relative flex overflow-hidden w-full" ref="container"
                    @mouseover="scrollText">
                    <span class="text-[12px] scrolling-text  w-full truncate" ref="text">
                        {{
                            spotifyStore.playbackState.item.name
                        }}
                    </span>
                </div>
                <div class="text-[10px] opacity-70 flex items-center gap-1 whitespace-nowrap">
                    <span v-for="(artist, index) in spotifyStore.playbackState.item.artists.slice(0, 3)">
                        {{ artist.name }}
                        <template
                            v-if="index !== spotifyStore.playbackState.item.artists.slice(0, 3).length - 1">,</template>
                    </span>
                    <template v-if="spotifyStore.playbackState.item.artists.length > 3">...</template>
                </div>
            </div>
            <div class="flex gap-2 items-center justify-around">
                <span @click="previous"
                    class="hover:surface-container-highest duration-75 transition-all ease-in-out cursor-pointer rounded-full flex items-center justify-center">
                    <Icon name="material-symbols-light:skip-previous-rounded" class="w-[24px] h-[24px]" />
                </span>
                <span v-if="!spotifyStore.playbackState?.is_playing" @click="startPlayback"
                    class="hover:surface-container-highest duration-75 transition-all ease-in-out cursor-pointer rounded-full flex items-center justify-center">
                    <Icon name="material-symbols-light:play-arrow-rounded" class="w-[24px] h-[24px]" />
                </span>
                <span v-if="spotifyStore.playbackState?.is_playing" @click="pausePlayback"
                    class="hover:surface-container-highest duration-75 transition-all ease-in-out cursor-pointer rounded-full flex items-center justify-center">
                    <Icon name="material-symbols-light:pause-rounded" class="w-[24px] h-[24px]" />
                </span>
                <span @click="skip"
                    class="hover:surface-container-highest duration-75 transition-all ease-in-out cursor-pointer rounded-full flex items-center justify-center">
                    <Icon name="material-symbols-light:skip-next" class="w-[24px] h-[24px]" />
                </span>
            </div>
            <div v-if="spotifyStore.user"
                class="flex  items-center  h-8 aspect-square rounded-full surface-container-highest">
                <img :src="spotifyStore.user?.images[1].url" class="w-full h-full rounded-full"
                    style="image-rendering: auto;" />
            </div>
            <span v-else @click="spotifyAuth"
                class="p-1 hover:surface-container-highest duration-75 transition-all ease-in-out cursor-pointer rounded-full flex items-center justify-center">
                <Icon name="mdi:login" class="w-[16px] h-[16px]" />
            </span>
        </div>
        <div v-if="spotifyStore.playbackState?.is_playing" class=" px-7 rounded-full h-1 w-[100%] surface-container">
            <div class=" rounded-full h-full green transition-all duration-100 ease-in-out" :style="{
                width: `${Progress}%`
            }">
            </div>
        </div>
    </div>
</template>


<style scoped>
.green {
    background-color: #adadbc;
}

.text-container {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
}
</style>