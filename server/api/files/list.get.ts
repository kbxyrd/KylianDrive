import { defineEventHandler } from 'h3'
import { BUCKET } from '../../utils/r2'

export default defineEventHandler(async (event) => {
    const { role, id: userId } = event.context.auth.user
    const where = role === 'ADMIN'
        ? {}
        : { ownerId: userId }

    const files = await event.context.prisma.file.findMany({ where })


    const baseUrl = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${BUCKET}`

    return {
        files: files.map(f => ({
            id: f.id,
            filename: f.filename,
            size: f.size,
            url: `${baseUrl}/${f.key}`
        }))
    }
})
