<script setup lang="ts">
const route = useRoute();
const { spotifyAuth, getPlaybackState, fetchToken, getUser } = useSpotify();

const spotifyStore = useSpotifyStore();
const query = route.query;
spotifyStore.code = query.code.toString();
spotifyStore.state = query.state.toString();

// Save to local storage
if (typeof window !== 'undefined') {
    window.localStorage.setItem('spotifyCode', spotifyStore.code);
    window.localStorage.setItem('spotifyState', spotifyStore.state);
}




onMounted(async () => {
    spotifyStore.token = null;
    await fetchToken();
})
watch(() => spotifyStore.token, async () => {
    if (spotifyStore.token) {
        spotifyStore.user = await getUser();
        await navigateTo('/music');
    }
})
</script>
<template>
    <div class="w-full h-full flex items-center justify-center">
        <span class="on-surface-text">
            about to be redirected
        </span>
    </div>
</template>


<style scoped></style>