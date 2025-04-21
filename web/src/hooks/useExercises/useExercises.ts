import { ExercisesQuery } from 'types/graphql'

import { TypedDocumentNode, useQuery } from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<ExercisesQuery> = gql`
  query ExercisesQuery {
    exercises {
      id
      name
      instructions
      gifUrl
    }
  }
`

export function useExercises() {
  const { data, loading } = useQuery<ExercisesQuery>(QUERY)

  return loading ? [] : data.exercises
}
