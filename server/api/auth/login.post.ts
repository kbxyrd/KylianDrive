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
import { db }    from '~/db/db'
import { users } from '~/db/schema/user'
import { eq }    from 'drizzle-orm'

export default defineEventHandler(async (event: H3Event) => {
    const secret = process.env.JWT_SECRET as string
    if (!secret) {
        return sendError(
            event,
            createError({ statusCode: 500, statusMessage: 'JWT secret non configuré' })
        )
    }

    const { username, password } = await readBody<{ username: string; password: string }>(event)
    if (!username || !password) {
        return sendError(
            event,
            createError({ statusCode: 400, statusMessage: 'Champs manquants' })
        )
    }

    const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return sendError(
            event,
            createError({ statusCode: 401, statusMessage: 'Identifiants invalides' })
        )
    }


    const token = jwt.sign(
        {
            sub:      user.id,
            username: user.username,
            role:     user.role
        },
        secret,
        { expiresIn: '7d' }
    )

    setCookie(event, 'auth_token', token, {
        httpOnly: true,
        maxAge:   60 * 60 * 24 * 7,
        sameSite: 'lax',
        secure:   process.env.NODE_ENV === 'production',
    })

    return {
        id:       user.id,
        username: user.username,
        role:     user.role
    }
})
