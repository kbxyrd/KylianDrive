import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2, BUCKET } from '../../utils/r2'

export default defineEventHandler(async (event) => {
    // Lit le form-data
    const parts = await readMultipartFormData(event)
    if (!parts || parts.length === 0) {
        throw createError({ statusCode: 400, statusMessage: 'Aucun fichier reçu' })
    }

    // Récupère la partie nommée 'file'
    const filePart = parts.find(p => p.name === 'file')
    if (!filePart) {
        throw createError({ statusCode: 400, statusMessage: 'Champ "file" manquant' })
    }

    // On suppose que filePart.data contient un Buffer et filePart.type le mime-type
    const { data, filename, type: mimeType } = filePart as any

    // Construit une clé unique (userId/timestamp_filename)
    const userId = event.context.auth.user.id
    const key = `${userId}/${Date.now()}_${filename}`

    // Upload sur R2
    await r2.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: data,
        ContentType: mimeType
    }))

    // Enregistre en base avec Prisma
    await event.context.prisma.file.create({
        data: {
            filename,
            size: (data as Buffer).byteLength,
            key,
            ownerId: userId
        }
    })

    return { success: true }
})