import { defineEventHandler, readBody } from 'h3'
import Database from 'better-sqlite3'

const db = new Database('localdb.sqlite')

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body.username || !body.password) {
        return {
            success: false,
            message: 'Champs manquants',
        }
    }

    const stmt = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?')
    const user = stmt.get(body.username, body.password)

    if (user) {
        return {
            success: true,
            message: 'Connexion réussie',
        }
    } else {
        return {
            success: false,
            message: 'Identifiants invalides',
        }
    }
})
