const { defineConfig } = require('drizzle-kit');

module.exports = defineConfig({
    schema: './src/server/db',
    out: './drizzle',
    driver: 'better-sqlite3',
    dbCredentials: {
        url: './sqlite.db',
    },
});
