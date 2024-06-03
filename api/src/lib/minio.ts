import * as Minio from 'minio'

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_API_URL,
  port: Number(process.env.MINIO_PORT),
  useSSL: process.env.NODE_ENV !== 'development',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
})

export async function generatePresignedGetUrl(objectName: string) {
  const presignedUrl = await minioClient.presignedGetObject(process.env.MINIO_BUCKET_NAME, objectName, 86400)

  return presignedUrl
}

export async function generatePresignedPutUrl(objectName: string) {
  const presignedUrl = await minioClient.presignedPutObject(process.env.MINIO_BUCKET_NAME, objectName, 30)

  return presignedUrl
}
