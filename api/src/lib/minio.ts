import * as Minio from 'minio'

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_API_URL,
  port: Number(process.env.MINIO_PORT),
  useSSL: process.env.NODE_ENV !== 'development',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
})

