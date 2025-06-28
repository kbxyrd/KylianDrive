// server/api/files/list.get.ts
import { defineEventHandler, getCookie, sendError, createError } from 'h3'
import jwt from 'jsonwebtoken'
import { db } from '../../../src/db/db'                 // alias ~/ pointe sur src/
import { files } from '../../../src/db/schema/file'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    // 1) Authentification par JWT dans le cookie
    const token = getCookie(event, 'auth_token')
    const secret = process.env.JWT_SECRET
    if (!token || !secret) {
        return sendError(event, createError({ statusCode: 401, statusMessage: 'Non authentifié' }))
    }
    let payload: any
    try {
        payload = jwt.verify(token, secret)
    } catch {
        return sendError(event, createError({ statusCode: 401, statusMessage: 'Token invalide' }))
    }
    const userId = payload.sub as number

    // 2) Lecture en base
    try {
        const list = await db
            .select({
                id: files.id,
                filename: files.filename,
                size: files.size,
                path: files.path,
            })
            .from(files)
            .where(eq(files.userId, userId))

        // 3) Construction des URLs publiques
        const filesWithUrl = list.map(f => ({
            id:       f.id.toString(),
            filename: f.filename,
            size:     f.size,
            url:      `/uploads/${f.path}`,
        }))

        return { files: filesWithUrl }
    } catch (err: any) {
        // Affichez en console pour debugger
        console.error('Erreur /api/files/list :', err)
        return sendError(event, createError({ statusCode: 500, statusMessage: err.message }))
    }
})
