// src/db/schema/user.ts
import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { sql }                                     from 'drizzle-orm'

export const users = sqliteTable(
    'users',
    {
        id:        integer('id').primaryKey({ autoIncrement: true }),
        username:  text('username').notNull(),
        password:  text('password').notNull(),
        role: text('role').notNull().default('user'),
        createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => ({
        uniqueUsername: uniqueIndex('idx_users_username').on(table.username),
    })
)
