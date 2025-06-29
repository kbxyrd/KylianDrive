import { createReadStream } from 'fs'
import { join } from 'path'
import { H3Event, sendStream } from 'h3'

export default defineEventHandler((event: H3Event) => {
    const { id } = event.context.params!
    const filePath = join(process.cwd(), 'private-files', `${id}.pdf`)
    event.node.res.setHeader('Content-Type', 'application/pdf')
    event.node.res.setHeader('Content-Disposition', `attachment; filename="${id}.pdf"`)
    return sendStream(event, createReadStream(filePath))
})
