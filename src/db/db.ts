// src/db/db.ts

import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database = require('better-sqlite3')

// On importe tous les schémas définis dans ./schema/user.ts
import * as schema from './schema/user'

const sqlite = new Database('local.db') // Ou sqlite.db selon ton nom
export const db = drizzle(sqlite, { schema })
