// server/api/auth/register.post.ts
import type { H3Event } from 'h3'
import { defineEventHandler, readBody, sendError, createError, setCookie } from 'h3'
import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '../../../src/db/db'
import { users } from '../../../src/db/schema/user'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event: H3Event) => {
    const body = await readBody<{ username?: string; password?: string }>(event)
    const username = body.username?.trim() ?? ''
    const password = body.password ?? ''

    if (!username || !password) {
        return sendError(event, createError({ statusCode: 400, statusMessage: 'Champs manquants' }))
    }

    const [existing] = await db.select().from(users).where(eq(users.username, username))
    if (existing) {
        return sendError(event, createError({ statusCode: 409, statusMessage: 'Nom d’utilisateur déjà pris' }))
    }

    const hashed = await bcrypt.hash(password, 12)

    const [newUser] = await db.insert(users).values({
        username,
        password: hashed,
        role: 'USER',
    }).returning()

    const secret = process.env.JWT_SECRET
    if (!secret) {
        return sendError(event, createError({ statusCode: 500, statusMessage: 'JWT_SECRET non configuré' }))
    }
    const token = jwt.sign(
        { sub: newUser.id, username: newUser.username, role: newUser.role },
        secret,
        { expiresIn: '7d' }
    )

    setCookie(event, 'auth_token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    })

    return { id: newUser.id, username: newUser.username, role: newUser.role }
})
