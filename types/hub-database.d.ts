// types/hub-database.d.ts
import type { AnyD1Database } from 'drizzle-orm/d1'

declare function hubDatabase(): AnyD1Database

export {}  // fait de ce fichier un module
