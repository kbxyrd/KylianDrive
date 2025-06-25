// src/db/db.ts
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { join } from 'path'

const sqlite = new Database(join(process.cwd(), 'localdb.sqlite'))
export const db = drizzle(sqlite)
