import dotenv from "dotenv"
dotenv.config()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const code = body.code

  const params = {
    grant_type: "authorization_code",
    code: code,
    redirect_uri: process.env.NUXT_PUBLIC_REDIRECT_URI
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
