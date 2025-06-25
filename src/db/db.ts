// src/db/db.ts
import { createClient } from '@libsql/client'
import { drizzle }      from 'drizzle-orm/libsql'
import * as schema      from './schema/user'

// Ouvre (ou crée) ./local.db
export const client = createClient({ url: 'file:local.db' })

// Instancie Drizzle avec ton schéma
export const db = drizzle(client, { schema })
