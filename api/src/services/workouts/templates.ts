import type {
  QueryResolvers,
  WorkoutTemplateExerciseRelationResolvers,
  WorkoutTemplateRelationResolvers,
} from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'
import { getObjectUrl } from 'src/lib/minio'

export const workoutTemplates: QueryResolvers['workoutTemplates'] = () => {
  requireAuth()

  return db.workoutTemplate.findMany({ where: { userId: context.currentUser.id } })
}

export const workoutTemplate: QueryResolvers['workoutTemplate'] = ({ id }) => {
  requireAuth()

  return db.workoutTemplate.findUnique({ where: { id, userId: context.currentUser.id } })
}

export const WorkoutTemplate: WorkoutTemplateRelationResolvers = {
  exercises: (_obj, { root }) => {
    return db.workoutTemplate.findUnique({ where: { id: root?.id } }).exercises({ orderBy: { order: 'asc' } })
  },
}

export const WorkoutTemplateExercise: WorkoutTemplateExerciseRelationResolvers = {
  exercise: async (_obj, { root }) => {
    const exercise = await db.workoutTemplateExercise.findUnique({ where: { id: root.id } }).exercise()

    return { ...exercise, gifUrl: getObjectUrl(exercise.gifPath) }
  },
  sets: (_obj, { root }) => {
    return db.workoutTemplateExercise.findUnique({ where: { id: root.id } }).sets()
  },
}
