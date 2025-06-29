import { defineEventHandler, readBody, getCookie, sendError, createError } from 'h3'
import jwt from 'jsonwebtoken'
import { db } from '../../../src/db/db'
import { files } from '../../../src/db/schema/file'
import { eq } from 'drizzle-orm'
import fs from 'fs'
import { join } from 'pathe'

export default defineEventHandler(async (event) => {
    // Auth
    const token = getCookie(event, 'auth_token')
    const secret = process.env.JWT_SECRET
    if (!token || !secret) {
        return sendError(event, createError({ statusCode: 401, statusMessage: 'Non authentifié' }))
    }
    let payload: any
    try { payload = jwt.verify(token, secret) }
    catch { return sendError(event, createError({ statusCode: 401, statusMessage: 'Token invalide' })) }
    const userId = payload.sub as number

    // Body
    const { id } = await readBody<{ id: number }>(event)
    if (!id) {
        return sendError(event, createError({ statusCode: 400, statusMessage: 'ID manquant' }))
    }

    // Récupère le chemin
    const [record] = await db
        .select({ path: files.path })
        .from(files)
        .where(eq(files.id, id), eq(files.userId, userId))

    if (!record) {
        return sendError(event, createError({ statusCode: 404, statusMessage: 'Fichier introuvable' }))
    }

    const filePath = join(process.cwd(), 'public/uploads', record.path)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

    // Supprime de la base
    await db.delete(files).where(eq(files.id, id), eq(files.userId, userId))

    return { ok: true }
})
