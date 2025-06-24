import type { AuthOptions } from '@auth/core'

declare module 'nuxt/schema' {
    interface NuxtConfig {
        auth?: Partial<AuthOptions>
    }

    interface NuxtOptions {
        auth?: Partial<AuthOptions>
    }
}
