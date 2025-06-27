import { defineEventHandler, readBody, createError } from 'h3'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { r2, BUCKET } from '../../utils/r2'

export default defineEventHandler(async (event) => {
    // Récupère l’ID du fichier à supprimer
    const { id } = await readBody(event)

    // Cherche le fichier en base
    const file = await event.context.prisma.file.findUnique({ where: { id } })
    if (!file) {
        throw createError({ statusCode: 404, statusMessage: 'Fichier introuvable' })
    }

    const { role, id: userId } = event.context.auth.user
    if (role !== 'ADMIN' && file.ownerId !== userId) {
        throw createError({ statusCode: 403, statusMessage: 'Accès refusé' })
    }

    // Supprime dans R2
    await r2.send(new DeleteObjectCommand({
        Bucket: BUCKET,
        Key: file.key
    }))

    // Supprime en base
    await event.context.prisma.file.delete({ where: { id } })

    return { success: true }
})
