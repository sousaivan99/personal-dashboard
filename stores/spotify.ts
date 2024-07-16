import { defineStore } from "pinia"
export const useSpotifyStore = defineStore("spotify", () => {
  const code = ref<string | null>(null)
  const state = ref<string | null>(null)
  const token = ref<string | null>(null)
  const date = ref()
  const playbackState = ref()
  const isPlaying = ref(false)
  const volume = ref(0)
  const user = ref()
  const playlists = ref()
  const topItems = ref()

  return {
    playlists,
    code,
    state,
    token,
    date,
    playbackState,
    isPlaying,
    volume,
    user,
    topItems
  }
})
