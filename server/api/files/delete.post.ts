// server/api/files/delete.post.ts
import { defineEventHandler, getCookie, createError, readBody } from 'h3'
import { deleteFile }              from '../../utils/files'
import { getUserFromToken }        from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    if (!token) throw createError({ statusCode: 401 })

    const user = getUserFromToken(token)
    if (!['USER','ADMIN'].includes(user.role)) {
        throw createError({ statusCode: 403 })
    }

    const { id } = await readBody(event)
    if (typeof id !== 'string') {
        throw createError({ statusCode: 400, statusMessage: 'Identifiant invalide' })
    }

    await deleteFile(user, id)
    return { success: true }
})
