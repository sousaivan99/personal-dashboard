import dotenv from "dotenv"
dotenv.config()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const token = body.token

  const params = {
    grant_type: "refresh_token",
    refresh_token: token,
    client_id: process.env.NUXT_PUBLIC_SPOTIFY_CLIENT_ID
  }

  const requestBody = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join("&")

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.NUXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NUXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`
      ).toString("base64")}`
    },
    body: requestBody
  })

  const { access_token } = await result.json()
  return access_token
})
