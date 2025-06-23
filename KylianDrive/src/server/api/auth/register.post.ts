import { db } from '../../db';
import { users } from '../../db/schema';
import { defineEventHandler, readBody, createError } from 'h3';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const { email, password } = body;

    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
        throw createError({ statusCode: 400, statusMessage: 'Email déjà utilisé' });
    }

    const hashedPassword = await hash(password, 10);

    const inserted = await db.insert(users).values({
        email,
        password: hashedPassword,
        role: 'USER',
    }).returning();

    return {
        success: true,
        user: { id: inserted[0].id, email: inserted[0].email },
    };
});
