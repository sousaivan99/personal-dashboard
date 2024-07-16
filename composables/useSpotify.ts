export const useSpotify = () => {
  const spotifyStore = useSpotifyStore()

  const spotifyAuth = () => {
    const config = useRuntimeConfig()

    const client_id = config.public.spotify_client_id
    // const client_secret = config.CLIENT_SECRET
    const redirect_uri = config.public.redirect_uri
    const state = generateRandomString(16)
    const scope =
      "user-library-read user-top-read user-read-recently-played user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative"

    const params = `response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}`

    const url = `https://accounts.spotify.com/authorize?${params.toString()}`

    window.location.href = url
  }
  async function validateSpotifyToken() {
    const spotifyToken = localStorage.getItem("spotifyToken")
    const spotifyTokenTimestamp = localStorage.getItem("spotifyTokenTimestamp")

    if (!spotifyToken || !spotifyTokenTimestamp) {
      return await spotifyAuth()
    } else {
      spotifyStore.token = spotifyToken
    }

    const currentTime = new Date()
    const tokenTimestamp = new Date(spotifyTokenTimestamp)
    const timeDifference = currentTime.getTime() - tokenTimestamp.getTime()
    const minutesDifference = Math.floor(timeDifference / (1000 * 60))

    if (minutesDifference >= 60) {
      return await spotifyAuth()
    } else {
      spotifyStore.date = new Date(spotifyTokenTimestamp)
    }
  }

  const getPlaybackState = async () => {
    await validateSpotifyToken()

    const result = await $fetch("/api/spotify/getPlaybackState", {
      method: "POST",
      body: {
        code: `${spotifyStore.token}`
      }
    })

    spotifyStore.playbackState = result

    return result
  }

  const fetchToken = async () => {
    const result = await $fetch("/api/spotify/getSpotifyToken", {
      method: "POST",
      body: {
        code: spotifyStore.code,
        state: spotifyStore.state
      }
    })

    spotifyStore.token = result
    localStorage.setItem("spotifyToken", result)
    localStorage.setItem("spotifyTokenTimestamp", new Date().toString())
    spotifyStore.date = new Date()

    return result
  }
  const refreshToken = async () => {
    const result = await $fetch("/api/spotify/refreshToken", {
      method: "POST",
      body: {
        token: spotifyStore.token
      }
    })

    spotifyStore.token = result
    spotifyStore.date = new Date()
    return result
  }
  // const checkTokenExpiration = async () => {
  //   if (!spotifyStore.date) {
  //     await refreshToken()
  //     return
  //   }

  //   const currentTime = new Date()
  //   const timeDifference = currentTime.getTime() - spotifyStore.date.getTime()
  //   const minutesDifference = Math.floor(timeDifference / (1000 * 60))
  //   console.log("Minutes difference: ", minutesDifference)

  //   if (minutesDifference >= 50) {
  //     console.log("No date found")
  //     await refreshToken()
  //   }
  // }

  const pausePlayback = async () => {
    await validateSpotifyToken()

    await $fetch("/api/spotify/pausePlayback", {
      method: "POST",
      body: { token: spotifyStore.token }
    })
    await new Promise((resolve) => setTimeout(resolve, 500))

    spotifyStore.playbackState = await getPlaybackState()
  }

  const skip = async () => {
    await validateSpotifyToken()

    await $fetch("/api/spotify/skip", {
      method: "POST",
      body: { token: spotifyStore.token }
    })
    await new Promise((resolve) => setTimeout(resolve, 500))
    spotifyStore.playbackState = await getPlaybackState()
  }

  const previous = async () => {
    await validateSpotifyToken()

    await $fetch("/api/spotify/previous", {
      method: "POST",
      body: { token: spotifyStore.token }
    })
    await new Promise((resolve) => setTimeout(resolve, 500))

    spotifyStore.playbackState = await getPlaybackState()
  }
  const startPlayback = async (
    context_uri: string | number,
    uris?: string[] | string,
    offset?: number
  ) => {
    await validateSpotifyToken()

    await $fetch("/api/spotify/startPlayback", {
      method: "POST",
      body: { token: spotifyStore.token, context_uri, uris, offset }
    })

    await new Promise((resolve) => setTimeout(resolve, 500))

    spotifyStore.playbackState = await getPlaybackState()
  }

  const changeVolume = async (volume: number) => {
    await validateSpotifyToken()

    await $fetch("/api/spotify/changeVolume", {
      method: "POST",
      body: {
        token: spotifyStore.token,
        volume: volume,
        device_id: spotifyStore.playbackState.device.id
      }
    })
  }

  const getUser = async () => {
    await validateSpotifyToken()

    const result = await $fetch("/api/spotify/getUser", {
      method: "POST",
      body: {
        code: spotifyStore.token
      }
    })

    return result
  }
  const getTopItems = async (type: string) => {
    await validateSpotifyToken()

    const result = await $fetch("/api/spotify/getTopItem", {
      method: "POST",
      body: {
        code: spotifyStore.token,
        type: type
      }
    })

    return result
  }

  const getPlaylists = async () => {
    await validateSpotifyToken()
    console.log("Getting playlists")

    const result = await $fetch("/api/spotify/getPlaylists", {
      method: "POST",
      body: {
        code: spotifyStore.token,
        userid: spotifyStore.user.id
      }
    })

    return result
  }
  const getPlaylist = async (id) => {
    await validateSpotifyToken()

    const result = await $fetch("/api/spotify/getPlaylist", {
      method: "POST",
      body: {
        code: spotifyStore.token,
        playlist_id: id
      }
    })

    return result
  }

  return {
    spotifyAuth,
    getPlaybackState,
    fetchToken,
    refreshToken,
    pausePlayback,
    skip,
    previous,
    startPlayback,
    changeVolume,
    getUser,
    getPlaylists,
    getPlaylist,
    getTopItems,
    validateSpotifyToken
  }
}

function generateRandomString(length: number) {
  let text = ""
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return text
}
