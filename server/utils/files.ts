// server/utils/files.ts
import {
    PutObjectCommand,
    ListObjectsV2Command,
    GetObjectCommand,
    DeleteObjectCommand
} from '@aws-sdk/client-s3'
import { r2 } from './r2'
import { v4 as uuidv4 } from 'uuid'

export interface FileMetadata {
    id: string
    filename: string
    size: number
    url: string
}

export async function storeFile(
    userId: number,
    file: any
): Promise<FileMetadata> {
    const id = uuidv4()
    const key = `${userId}/${id}`

    await r2.send(
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: key,
            Body: file.data,
            ContentType: file.type
        })
    )

    const url = `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/${key}`

    return {
        id,
        filename: file.filename,
        size: file.size,
        url
    }
}


export async function listFiles(userId: number): Promise<FileMetadata[]> {
    const out = await r2.send(
        new ListObjectsV2Command({
            Bucket: process.env.R2_BUCKET!,
            Prefix: `${userId}/`
        })
    )
    const objects = out.Contents || []

    return objects.map(obj => {
        const key = obj.Key!
        const id = key.split('/')[1]
        return {
            id,
            filename: id,
            size: obj.Size || 0,
            url: `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/${key}`
        }
    })
}


export async function getFileStream(
    user: { sub: number; role: string },
    id: string
) {
    const key = `${user.sub}/${id}`
    const res = await r2.send(
        new GetObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: key
        })
    )
    return res.Body as any
}


export async function deleteFile(
    user: { sub: number; role: string },
    id: string
): Promise<void> {
    const key = `${user.sub}/${id}`
    await r2.send(
        new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: key
        })
    )
}
