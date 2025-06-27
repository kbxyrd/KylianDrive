// server/api/me.get.ts
import { defineEventHandler, getCookie, createError } from 'h3'

export interface UserPayload {
    sub: number
    username: string
    role: string
}

function decodeJwt<T>(token: string): T {
    const parts = token.split('.')
    if (parts.length !== 3) throw new Error('Token JWT invalide')
    const payload = parts[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = Buffer.from(base64, 'base64').toString('utf-8')
    return JSON.parse(json) as T
}

export default defineEventHandler((event) => {
    const token = getCookie(event, 'token')
    if (!token) {
        throw createError({ statusCode: 401, statusMessage: 'Token manquant' })
    }

    // Usage de la fonction maison
    const payload = decodeJwt<UserPayload>(token)

    return {
        user: {
            sub: payload.sub,
            username: payload.username,
            role: payload.role
        }
    }
})
