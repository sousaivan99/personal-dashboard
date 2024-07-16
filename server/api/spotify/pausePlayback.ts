export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const code = body.token
  const result = await fetch("https://api.spotify.com/v1/me/player/pause", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${code}`
    }
  })
  if (result.status === 204) {
  } else if (result.status === 401) {
    throw new Error("Bad or expired token")
  } else if (result.status === 403) {
    throw new Error("Forbidden")
  } else if (result.status === 429) {
    throw new Error("Too Many Requests")
  } else {
    throw new Error("Unexpected status code")
  }
})
