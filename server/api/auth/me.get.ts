// server/api/auth/me.get.ts
import { defineEventHandler, getCookie, sendError, createError } from 'h3'
import jwt from 'jsonwebtoken'
import { db } from '../../../src/db/db'
import { users } from '../../../src/db/schema/user'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'auth_token')
    const secret = process.env.JWT_SECRET

    if (!token || !secret) {
        return sendError(
            event,
            createError({ statusCode: 401, statusMessage: 'Non authentifié' })
        )
    }

    let payload: any
    try {
        payload = jwt.verify(token, secret)
    } catch {
        return sendError(
            event,
            createError({ statusCode: 401, statusMessage: 'Token invalide' })
        )
    }

    const [user] = await db
        .select({
            id: users.id,
            username: users.username,
            role: users.role,
        })
        .from(users)
        .where(eq(users.id, payload.sub))

    if (!user) {
        return sendError(
            event,
            createError({ statusCode: 404, statusMessage: 'Utilisateur introuvable' })
        )
    }

    return { user }
})
