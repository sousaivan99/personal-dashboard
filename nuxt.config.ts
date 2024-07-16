// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "nuxt-icon",
    "@nuxtjs/google-fonts",
    "@pinia/nuxt"
  ],
  runtimeConfig: {
    public: {
      spotify_client_id: process.env.NUXT_PUBLIC_SPOTIFY_CLIENT_ID,
      redirect_uri: process.env.NUXT_PUBLIC_REDIRECT_URI
    }
  }
})
