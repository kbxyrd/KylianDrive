// scripts/hash-passwords.ts
import { createClient } from '@libsql/client'
import { drizzle }      from 'drizzle-orm/libsql'
import { users }        from '../src/db/schema/user'
import { eq }           from 'drizzle-orm'
import * as bcrypt      from 'bcrypt'

async function migrate() {
    // 1) Connexion à local.db
    const client = createClient({ url: 'file:local.db' })
    const db     = drizzle(client, { schema: { users } })

    // 2) Lecture de tous les utilisateurs
    const allUsers = await db.select().from(users)

    console.log(`Found ${allUsers.length} users. Starting migration…`)

    // 3) Pour chaque utilisateur, on hash son mot de passe clair
    for (const user of allUsers) {
        const plain = user.password
        // Skip si déjà hashé (les hash bcrypt commencent par '$2')
        if (plain.startsWith('$2')) {
            console.log(`→ User ${user.id} already hashed, skipping.`)
            continue
        }
        const hash = await bcrypt.hash(plain, 10)
        // MAJ en base en utilisant eq() pour la condition
        await db
            .update(users)
            .set({ password: hash })
            .where(eq(users.id, user.id))
        console.log(`→ User ${user.id} migrated.`)
    }

    console.log('Migration completed.')
    process.exit(0)
}

migrate().catch(err => {
    console.error('Migration error:', err)
    process.exit(1)
})
