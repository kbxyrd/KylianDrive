// 📁 src/server/api/register.post.ts
import { defineEventHandler, readBody, createError } from 'h3'
import { hash } from 'bcryptjs'

const users = []

export default defineEventHandler(async (event) => {
    const { email, password } = await readBody(event)
    if (!email || !password) {
        throw createError({ statusCode: 400, statusMessage: 'Champs requis.' })
    }
    if (users.find(u => u.email === email)) {
        throw createError({ statusCode: 400, statusMessage: 'Email déjà utilisé.' })
    }
    const hashed = await hash(password, 10)
    const user = { id: users.length + 1, email, password: hashed }
    users.push(user)
    return { success: true, user: { id: user.id, email: user.email } }
})
