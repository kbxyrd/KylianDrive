import { db } from '../db';
import { users } from '../db/schema';
import { defineEventHandler } from 'h3';

export default defineEventHandler(async () => {
    const result = await db.select().from(users).limit(1);
    return {
        success: true,
        users: result,
    };
});
