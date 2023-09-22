// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  devtools: { enabled: true },
  tailwindcss: {
    config: {
      darkMode: 'class'
    }
  }
})
