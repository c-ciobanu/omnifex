import * as Minio from 'minio'

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_API_URL,
  port: Number(process.env.MINIO_PORT),
  useSSL: process.env.NODE_ENV !== 'development',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
})

export async function uploadExerciseGif(objectName: string, buffer: Buffer) {
  await minioClient.putObject(process.env.MINIO_BUCKET_NAME, `exercises/${objectName}.gif`, buffer, undefined, {
    'Content-Type': 'image/gif',
  })
}
