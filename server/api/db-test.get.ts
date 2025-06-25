// server/api/db-test.get.ts
import type { H3Event } from 'h3'
import { defineEventHandler, sendError, createError } from 'h3'
import { client } from '~/db/db'  // ← ici on importe le client
// plus besoin de db ni de sql pour ce test

export default defineEventHandler(async (event: H3Event) => {
    try {
        // Exécution de la requête brute via le client libSQL
        const result = await client.execute('SELECT COUNT(*) AS count FROM users')
        const rows = Array.isArray((result as any).rows) ? (result as any).rows : []
        const count = rows.length > 0 ? Number(rows[0].count) : 0

        return {
            success: true,
            usersCount: count,
            message: count > 0
                ? `OK : ${count} utilisateur(s) trouvé(s) dans la base.`
                : 'La table users est vide ou n’existe pas.',
        }
    } catch (err: any) {
        return sendError(event, createError({ statusCode: 500, statusMessage: err.message }))
    }
})
