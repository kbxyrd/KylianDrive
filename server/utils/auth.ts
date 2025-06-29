// server/utils/auth.ts
export interface UserPayload {
    sub: number
    username: string
    role: 'USER' | 'ADMIN'
}

export function getUserFromToken(token: string): UserPayload {
    const parts = token.split('.')
    if (parts.length !== 3) {
        throw new Error('Token JWT invalide')
    }

    const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = Buffer.from(payloadBase64, 'base64').toString('utf-8')
    const data = JSON.parse(json)

    if (
        typeof data.sub !== 'number' ||
        typeof data.username !== 'string' ||
        (data.role !== 'USER' && data.role !== 'ADMIN')
    ) {
        throw new Error('Payload JWT incomplet ou incorrect')
    }

    return {
        sub: data.sub,
        username: data.username,
        role: data.role
    }
}
