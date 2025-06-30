import { spawn } from 'child_process'
import { PassThrough, Readable } from 'stream'

import { fetch } from '@whatwg-node/fetch'
import { db } from 'api/src/lib/db'
import { uploadExerciseGif } from 'api/src/lib/minio'

const generateGif = async (arrayBuffers: ArrayBuffer[]): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-f',
      'image2pipe',
      '-r',
      '1',
      '-i',
      'pipe:0',
      '-r',
      '1',
      '-vcodec',
      'gif',
      '-filter:v',
      'scale=w=400:h=trunc(ow/a/2)*2',
      '-f',
      'gif',
      'pipe:1',
    ])

    ffmpeg.on('error', reject)

    const inputStream = Readable.from(arrayBuffers)
    const bufferStream = new PassThrough()
    const outputBuffer: Buffer[] = []

    inputStream.pipe(ffmpeg.stdin)

    bufferStream.on('data', (chunk: Buffer) => outputBuffer.push(chunk))
    bufferStream.on('end', () => resolve(Buffer.concat(outputBuffer)))

    ffmpeg.stdout.pipe(bufferStream)
  })
}

interface Exercise {
  name: string
  force?: string
  level: string
  mechanic?: string
  equipment?: string
  primaryMuscles: string[]
  secondaryMuscles: string[]
  instructions: string[]
  category: string
  images: string[]
  id: string
}

interface Args {
  max: number
}

export default async ({ args }: { args: Args }) => {
  const response = await fetch(
    'https://raw.githubusercontent.com/yuhonas/free-exercise-db/refs/heads/main/dist/exercises.json'
  )
  const exercises: Exercise[] = await response.json()

  const exercisesToProcess = args.max ?? exercises.length
  for (let index = 0; index < exercisesToProcess; index++) {
    const exercise = exercises[index]
    const fileName = exercise.name.toLowerCase().replaceAll(' ', '-').replaceAll('/', '-')

    const imageBuffers = await Promise.all(
      exercise.images.map(async (path) => {
        const response = await fetch(
          `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${path}`
        )

        return response.arrayBuffer()
      })
    )

    const gifBuffer = await generateGif(imageBuffers)

    const gifPath = await uploadExerciseGif(fileName, gifBuffer)

    const exerciseData = { name: exercise.name, instructions: exercise.instructions, gifPath }

    await db.exercise.upsert({ where: { name: exerciseData.name }, update: exerciseData, create: exerciseData })
  }
}
