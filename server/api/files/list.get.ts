import { defineEventHandler, getCookie, createError } from 'h3'
import { listFiles } from '../../utils/files'
import { getUserFromToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token')
    if (!token) throw createError({ statusCode: 401 })
    const user = getUserFromToken(token)

    const files = await listFiles(user.sub)
    return { files }
})
