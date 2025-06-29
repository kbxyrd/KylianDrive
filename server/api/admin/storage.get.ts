// server/api/admin/storage.get.ts
import type { H3Event } from 'h3'
import { defineEventHandler, sendError, createError } from 'h3'
import { db } from '../../../src/db/db'
import { users } from '../../../src/db/schema/user'
import { files } from '../../../src/db/schema/file'
import { sql, eq } from 'drizzle-orm'

export default defineEventHandler(async (event: H3Event) => {
    try {
        const result = await db
            .select({
                id: users.id,
                username: users.username,
                totalSize: sql<number>`COALESCE(SUM(${files.size}), 0)`
            })
            .from(users)
            .leftJoin(files, eq(files.userId, users.id))
            .groupBy(users.id)

        return result.map(u => ({ id: u.id, username: u.username, totalSize: u.totalSize }))
    } catch (err) {
        console.error(err)
        return sendError(event, createError({ statusCode: 500, statusMessage: 'Erreur serveur' }))
    }
})
