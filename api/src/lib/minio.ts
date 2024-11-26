import * as Minio from 'minio'

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_API_URL,
  port: process.env.NODE_ENV !== 'development' ? undefined : Number(process.env.MINIO_PORT),
  useSSL: process.env.NODE_ENV !== 'development',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
})

export async function uploadExerciseGif(objectName: string, buffer: Buffer) {
  const path = `exercises/${objectName}.gif`

  await minioClient.putObject(process.env.MINIO_BUCKET_NAME, path, buffer, undefined, { 'Content-Type': 'image/gif' })

  return path
}
