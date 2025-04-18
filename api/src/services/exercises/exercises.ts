import { Exercise as PrismaExercise } from '@prisma/client'
import type { QueryResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { getObjectUrl } from 'src/lib/minio'

export const mapExerciseToGraphql = (exercise: PrismaExercise) => ({
  ...exercise,
  gifUrl: getObjectUrl(exercise.gifPath),
})

export const exercises: QueryResolvers['exercises'] = async () => {
  requireAuth()

  const exercises = await db.exercise.findMany()

  return exercises.map(mapExerciseToGraphql)
}
