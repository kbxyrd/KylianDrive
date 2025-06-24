// 📁 src/server/api/login.post.ts
import { defineEventHandler, readBody, createError, setCookie } from 'h3'
import { compare } from 'bcryptjs'

const users = []

export default defineEventHandler(async (event) => {
    const { email, password } = await readBody(event)
    const user = users.find(u => u.email === email)
    if (!user || !(await compare(password, user.password))) {
        throw createError({ statusCode: 401, statusMessage: 'Identifiants invalides.' })
    }
    setCookie(event, 'session', JSON.stringify({ id: user.id, email: user.email }), {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24,
    })
    return { success: true, user: { id: user.id, email: user.email } }
})