// middleware/auth.global.ts
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware(async (to) => {
    const publicPages = ['/login']
    if (publicPages.includes(to.path)) return

    try {
        const res = await fetch('/api/auth/me', { credentials: 'include' })
        if (!res.ok) throw new Error()
        const me = await res.json() as { id: number; username: string; role: string }

        if (to.path.startsWith('/admin') && me.role !== 'admin') {
            return navigateTo('/dashboard')
        }
    } catch {
        return navigateTo('/login')
    }
})
