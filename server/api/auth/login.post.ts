// server/api/auth/login.post.ts
import type { H3Event } from 'h3'
import {
    defineEventHandler,
    readBody,
    sendError,
    createError,
    setCookie,
} from 'h3'
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

    // récupère l'utilisateur
    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return sendError(event, createError({ statusCode: 401, statusMessage: 'Identifiants invalides' }))
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
        return sendError(event, createError({ statusCode: 500, statusMessage: 'JWT_SECRET non configuré' }))
    }

    // génère le token
    const token = jwt.sign(
        { sub: user.id, username: user.username, role: user.role },
        secret,
        { expiresIn: '7d' }
    )

    // pose le cookie
    setCookie(event, 'auth_token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,  // 7 jours
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production', // false en dev
        path: '/', // essentiel pour que /api/auth/me le reçoive
    })

    // on renvoie l'utilisateur (sans le mot de passe)
    return { id: user.id, username: user.username, role: user.role }
})
