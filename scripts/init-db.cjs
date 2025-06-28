// scripts/init-db.cjs
const { createClient } = require('@libsql/client')

;(async () => {
    // Ouvre (ou crée) local.db
    const client = createClient({ url: 'file:./local.db' })

    // Exécute le SQL de création de table
    await client.execute(`
    CREATE TABLE IF NOT EXISTS files (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      filename  TEXT    NOT NULL,
      size      INTEGER NOT NULL,
      path      TEXT    NOT NULL,
      user_id   INTEGER NOT NULL
    );
  `)

    console.log('✅ Table "files" OK dans local.db')
    process.exit(0)
})().catch(err => {
    console.error('❌ Erreur init-db:', err)
    process.exit(1)
})
