export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const code = body.token
  const context_uri = body.context_uri
  const uris = body.uris
  const offset = body.offset

  const requestBody = {}

  if (
    context_uri &&
    context_uri.length > 0 &&
    !context_uri.includes("null") &&
    context_uri !== "null"
  ) {
    requestBody.context_uri = context_uri
  }
  if (offset && offset !== "null") {
    requestBody.offset = { position: parseInt(offset) }
  }

  // Add the uris parameter to the requestBody
  if (uris && uris.length > 0 && !uris.includes("null") && uris !== "null") {
    requestBody.uris = Array.isArray(uris) ? uris : [uris]
  }
  const result = await fetch("https://api.spotify.com/v1/me/player/play", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${code}`
    },
    body: JSON.stringify(requestBody)
  })

  if (result.status === 204) {
    // Handle success
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
