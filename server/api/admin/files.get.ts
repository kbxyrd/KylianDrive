// server/api/admin/files.get.ts
import { defineEventHandler, getCookie, sendError, createError } from 'h3'
import jwt from 'jsonwebtoken'
import { db } from '../../../src/db/db'
import { files } from '../../../src/db/schema/file'
import { users } from '../../../src/db/schema/user'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    // 1) Auth + JWT
    const token = getCookie(event, 'auth_token')
    const secret = process.env.JWT_SECRET
    if (!token || !secret) {
        return sendError(event, createError({ statusCode: 401, message: 'Non authentifié' }))
    }

    let payload: any
    try {
        payload = jwt.verify(token, secret)
    } catch {
        return sendError(event, createError({ statusCode: 401, message: 'Token invalide' }))
    }

    // 2) Vérifie que c'est bien un ADMIN (insensible à la casse)
    if (String(payload.role).toLowerCase() !== 'admin') {
        return sendError(event, createError({ statusCode: 403, message: 'Accès refusé' }))
    }

    // 3) Lecture en base : on ne récupère que les fichiers dont userId = payload.sub
    try {
        const list = await db
            .select({
                id:       files.id,
                filename: files.filename,
                size:     files.size,
                path:     files.path,
                username: users.username,
            })
            .from(files)
            .leftJoin(users, eq(files.userId, users.id))
            .where(eq(files.userId, payload.sub as number))

        const out = list.map(f => ({
            id:       f.id.toString(),
            filename: f.filename,
            size:     f.size,
            url:      `/uploads/${f.path}`,
            username: f.username,
        }))

        return { files: out }
    } catch (err: any) {
        console.error('Erreur /api/admin/files :', err)
        return sendError(event, createError({ statusCode: 500, message: err.message }))
    }
})
