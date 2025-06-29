// server/api/files/upload.post.ts
import { defineEventHandler, readMultipartFormData, getCookie, sendError, createError } from 'h3'
import jwt from 'jsonwebtoken'
import { db } from '../../../src/db/db'
import { files } from '../../../src/db/schema/file'
import { v4 as uuid } from 'uuid'
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
    try {
        payload = jwt.verify(token, secret)
    } catch {
        return sendError(event, createError({ statusCode: 401, statusMessage: 'Token invalide' }))
    }
    const userId = payload.sub as number

    const parts = (await readMultipartFormData(event)) || []
    const filePart = parts.find((p): p is { name: string; filename: string; data: any } => p.name === 'file' && !!p.filename)
    if (!filePart) {
        return sendError(event, createError({ statusCode: 400, statusMessage: 'Aucun fichier reçu' }))
    }

    let buffer: Buffer
    const data = filePart.data
    if (Buffer.isBuffer(data)) {
        buffer = data
    } else if (data && typeof (data as any).arrayBuffer === 'function') {
        const arr = await (data as any).arrayBuffer()
        buffer = Buffer.from(arr)
    } else {
        return sendError(event, createError({ statusCode: 400, statusMessage: 'Données du fichier invalides' }))
    }

    const originalName = filePart.filename
    const ext = originalName.includes('.') ? originalName.split('.').pop() : ''
    const name = `${uuid()}${ext ? `.${ext}` : ''}`

    // Prépare le dossier uploads
    const uploadDir = join(process.cwd(), 'public/uploads')
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

    await fs.promises.writeFile(join(uploadDir, name), buffer)

    await db.insert(files).values({ filename: originalName, size: buffer.byteLength, path: name, userId })

    return { ok: true }
})
