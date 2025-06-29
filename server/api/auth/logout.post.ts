// server/api/auth/logout.post.ts
import { defineEventHandler, setCookie } from 'h3'

export default defineEventHandler((event) => {
    setCookie(event, 'auth_token', '', {
        maxAge: 0,
        path: '/',
    })
    return { message: 'Déconnecté' }
})
