import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  srcDir: 'src/',
  serverDir: 'server',
  // Configuration minimale pour @libsql/client
  vite: {
    optimizeDeps: {
      include: ['@libsql/client']
    }
  },
  nitro: {
    externals: {
      inline: ['@libsql/client']
    }
  }
})
