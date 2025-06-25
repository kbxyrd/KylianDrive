// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  srcDir: 'src/',
  serverDir: 'server',
  nitro: {
    compatibilityDate: '2025-06-24'
  }
})
