import { defineEventHandler, readMultipartFormData, createError, getCookie } from 'h3'
import { storeFile } from '../../utils/files'
import { getUserFromToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    // Auth
    const token = getCookie(event, 'token')
    if (!token) throw createError({ statusCode: 401 })
    const user = getUserFromToken(token)
    if (!['USER','ADMIN'].includes(user.role)) {
        throw createError({ statusCode: 403 })
    }

    // On force parts à toujours être un tableau
    const parts = (await readMultipartFormData(event)) ?? []
    const filePart = parts.find(p => (p as any).fieldName === 'file')
    if (!filePart || !(filePart as any).filename) {
        throw createError({ statusCode: 400, statusMessage: 'Aucun fichier envoyé' })
    }

    // Upload sur R2
    const meta = await storeFile(user.sub, filePart as any)
    return { file: meta }
})
