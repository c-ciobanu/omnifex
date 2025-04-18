import type {
  MutationResolvers,
  QueryResolvers,
  WorkoutExerciseRelationResolvers,
  WorkoutRelationResolvers,
} from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

import { mapExerciseToGraphql } from '../exercises/exercises'

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

  const { exercises, ...workoutData } = input

  return db.workout.create({
    data: {
      ...workoutData,
      userId: context.currentUser.id,
      exercises: {
        create: exercises.map(({ sets, ...exerciseData }) => ({ ...exerciseData, sets: { create: sets } })),
      },
    },
  })
}

export const updateWorkout: MutationResolvers['updateWorkout'] = ({ id, input }) => {
  requireAuth()

  return db.workout.update({ data: input, where: { id, userId: context.currentUser.id } })
}

export const deleteWorkout: MutationResolvers['deleteWorkout'] = ({ id }) => {
  requireAuth()

  return db.workout.delete({ where: { id, userId: context.currentUser.id } })
}

export const Workout: WorkoutRelationResolvers = {
  exercises: (_obj, { root }) => {
    return db.workout.findUnique({ where: { id: root.id } }).exercises({ orderBy: { order: 'asc' } })
  },
}

export const WorkoutExercise: WorkoutExerciseRelationResolvers = {
  exercise: async (_obj, { root }) => {
    const exercise = await db.workoutExercise.findUnique({ where: { id: root.id } }).exercise()

    return mapExerciseToGraphql(exercise)
  },
  sets: (_obj, { root }) => {
    return db.workoutExercise.findUnique({ where: { id: root.id } }).sets()
  },
}
