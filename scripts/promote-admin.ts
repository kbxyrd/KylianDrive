// scripts/promote-admin.ts
import { createClient } from '@libsql/client'
import { drizzle }      from 'drizzle-orm/libsql'
import { users }        from '../src/db/schema/user'
import { eq }           from 'drizzle-orm'

async function run() {
    const client = createClient({ url: 'file:local.db' })
    const db     = drizzle(client, { schema: { users } })

    await db
        .update(users)
        .set({ role: 'admin' })
        .where(eq(users.username, ''))

    console.log('Utilisateur kylian promu en admin.')
}

run().catch(err => {
    console.error(err)
    process.exit(1)
})
