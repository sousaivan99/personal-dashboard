export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const code = body.code
  const result = await fetch(`https://api.spotify.com/v1/me/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${code}`
    }
  })
  if (result.status === 200) {
    const data = await result.json()
    return data
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
