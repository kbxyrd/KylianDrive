// 📁 src/server/api/me.get.ts
import { defineEventHandler, getCookie } from 'h3'

export default defineEventHandler((event) => {
    const session = getCookie(event, 'session')
    if (!session) return { user: null }
    try {
        const user = JSON.parse(session)
        return { user }
    } catch {
        return { user: null }
    }
})