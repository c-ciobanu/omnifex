import * as Minio from 'minio'

export const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_API_URL,
  port: process.env.NODE_ENV !== 'development' ? undefined : Number(process.env.MINIO_PORT),
  useSSL: process.env.NODE_ENV !== 'development',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
})

export async function uploadExerciseGif(fileName: string, buffer: Buffer) {
  const objectName = `exercises/${fileName}.gif`

  await minioClient.putObject(process.env.MINIO_BUCKET_NAME, objectName, buffer, undefined, {
    'Content-Type': 'image/gif',
  })

  return objectName
}

export function getObjectUrl(objectName: string) {
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:9000/${process.env.MINIO_BUCKET_NAME}/${objectName}`
  }

  return `${process.env.MINIO_API_URL}/${process.env.MINIO_BUCKET_NAME}/${objectName}`
}
