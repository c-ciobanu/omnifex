import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const workouts: QueryResolvers['workouts'] = () => {
  requireAuth()

  return db.workout.findMany({ where: { userId: context.currentUser.id }, orderBy: { date: 'desc' } })
}

export const workout: QueryResolvers['workout'] = ({ id }) => {
  requireAuth()

  return db.workout.findUnique({ where: { id, userId: context.currentUser.id } })
}

export const createWorkout: MutationResolvers['createWorkout'] = ({ input }) => {
  requireAuth()

  return db.workout.create({ data: { ...input, userId: context.currentUser.id } })
}

export const updateWorkout: MutationResolvers['updateWorkout'] = ({ id, input }) => {
  requireAuth()

  return db.workout.update({ data: input, where: { id, userId: context.currentUser.id } })
}

export const deleteWorkout: MutationResolvers['deleteWorkout'] = ({ id }) => {
  requireAuth()

  return db.workout.delete({ where: { id, userId: context.currentUser.id } })
}
