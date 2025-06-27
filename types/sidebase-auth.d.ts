// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
    srcDir: 'src/',
    serverDir: 'server',
    nitro: {
        compatibilityDate: '2025-06-26'
    },
    modules: [
        // Configuration du module nuxt-auth avec ses options
        [
            '@sidebase/nuxt-auth',
            {
                enableGlobalAppMiddleware: true,
                origin: process.env.NUXT_PUBLIC_ORIGIN || 'http://localhost:3000',
                // autres options de NuxtAuthOptions ici
            }
        ],
        // ... autres modules
    ],
    runtimeConfig: {
        // Privat: acces clés R2 + JWT
        jwtSecret: process.env.JWT_SECRET,
        r2AccessKey: process.env.R2_ACCESS_KEY_ID,
        r2SecretKey: process.env.R2_SECRET_ACCESS_KEY,
        public: {
            r2AccountId: process.env.R2_ACCOUNT_ID,
            bucket: process.env.R2_BUCKET,
        }
    }
})
