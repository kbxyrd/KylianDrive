// src/db/schema/user.ts

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),

    username: text('username').unique().notNull(),
    password: text('password').notNull(), // à hasher à l'inscription !


    firstName: text('first_name'),
    lastName: text('last_name'),
    age: integer('age'),

    // Timestamp de création
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
})
