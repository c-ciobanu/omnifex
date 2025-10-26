import { ExercisesQuery } from 'types/graphql'

import { useQuery } from '@redwoodjs/web'

import { QUERY } from 'src/pages/Workouts/ExercisesPage/ExercisesCell'

export function useExercises() {
  const { data, loading } = useQuery<ExercisesQuery>(QUERY)

  return loading ? [] : data.exercises
}
