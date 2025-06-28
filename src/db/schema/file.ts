import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const files = sqliteTable('files', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    filename: text('filename').notNull(),
    size: integer('size').notNull(),
    path: text('path').notNull(),
    userId: integer('user_id').notNull(),
})
