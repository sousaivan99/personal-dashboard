<script setup lang="ts">

const currentDate = ref(new Date());
const { getPlaybackState, fetchToken } = useSpotify();
const spotifyStore = useSpotifyStore();
const store = useGlobalStore();

onMounted(() => {
  {

    const intervalId = setInterval(() => {
      if (spotifyStore.token) {
        getPlaybackState();
      }
    }, 30000);

    onUnmounted(() => {
      clearInterval(intervalId);
    });
  }
})

onMounted(async () => {
  store.title = 'Dashboard';
})



const formattedDate = computed(() => {
  const options = { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' };
  let dateStr = currentDate.value.toLocaleDateString('en-US', options);
  // Replace the comma after the day of the week with an empty string
  return dateStr.replace(/,\s(?=\d)/, ' ');
});

onMounted(() => {
  currentDate.value = new Date();
});

</script>
<template>
  <div class="surface w-screen h-screen flex overflow-hidden">
    <Menu />
    <div class="w-full h-full flex flex-col overflow-hidden">
      <div class="flex justify-between items-center on-surface-text min-h-[80px] max-h-[80px] pr-[12px]">
        <div class="flex items-center justify-between gap-2">
          <div v-if="$route.params.id"
            class="p-1 w-[32px] flex items-center justify-center aspect-square hover:surface-container-high rounded-full">
            <Icon name="mdi:chevron-left" size="24" class="cursor-pointer" @click="useRouter().back()" />
          </div>
          <span class="text-[18px] font-bold">{{ store.title }}</span>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-[12px]">{{ formattedDate }}</span>
          <SpotifyPill />
        </div>
      </div>
      <div class="w-full h-full pr-[12px] flex pb-[12px] overflow-hidden">
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<style>
/* width */
::-webkit-scrollbar {
  width: 6px;
}

/* Track */
::-webkit-scrollbar-track {
  @apply surface rounded-xl;
}

/* Handle */
::-webkit-scrollbar-thumb {
  @apply surface-container-highest rounded-xl;

}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
