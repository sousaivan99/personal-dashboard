export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const code = body.token
  const volume = body.volume
  const result = await fetch(
    `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${code}`
      }
    }
  )
})
