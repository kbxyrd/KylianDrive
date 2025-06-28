// src/db/db.ts
import { createClient } from '@libsql/client'
import { drizzle }      from 'drizzle-orm/libsql'
import { users }        from './schema/user'
import { files }        from './schema/file'

const client = createClient({ url: 'file:./local.db' })

export const db = drizzle(client, { schema: { users, files } })
