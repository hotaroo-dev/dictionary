// https://nuxt.com/docs/api/configuration/nuxt-config
import colors from 'tailwindcss/colors'

export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  devtools: { enabled: true },
  tailwindcss: {
    config: {
      theme: {
        extends: {
          colors: {
            pimary: { ...colors.purple, DEFAULT: colors.purple[600] }
          }
        },
        container: {
          center: true,
          paddding: {
            DEFAULT: '1rem',
            md: '1.5rem',
            lg: '2rem'
          }
        }
      }
    }
  }
})
