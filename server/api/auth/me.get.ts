// server/api/auth/me.get.ts
import type { H3Event } from 'h3'
import { defineEventHandler, createError } from 'h3'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event: H3Event) => {
    const secret = process.env.JWT_SECRET!
    // Récupère le cookie auth_token
    const raw = event.node.req.headers.cookie
        ?.split('; ')
        .find(c => c.startsWith('auth_token='))
        ?.split('=')[1]

    if (!raw) {
        throw createError({ statusCode: 401, statusMessage: 'Pas authentifié' })
    }

    try {
        // Le payload contient maintenant sub, username et role
        const payload = jwt.verify(raw, secret) as {
            sub: number
            username: string
            role: string
        }

        return {
            id:       payload.sub,
            username: payload.username,
            role:     payload.role
        }
    } catch {
        throw createError({ statusCode: 401, statusMessage: 'Token invalide' })
    }
})
