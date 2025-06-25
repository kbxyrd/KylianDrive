// global.d.ts
import type { AnyD1Database } from 'drizzle-orm/d1'

declare global {
    /**
     * `useD1()` est injecté par le module @nuxtjs/d1
     * pour accéder à ta base Cloudflare D1.
     */
    function useD1(): AnyD1Database
}

export {}
