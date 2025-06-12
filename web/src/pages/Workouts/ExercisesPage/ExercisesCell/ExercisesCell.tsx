import type { ExercisesQuery, ExercisesQueryVariables } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps, TypedDocumentNode } from '@redwoodjs/web'

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

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps<ExercisesQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ exercises }: CellSuccessProps<ExercisesQuery, ExercisesQueryVariables>) => {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {exercises.map((exercise) => {
        return (
          <li key={exercise.id} className="space-y-2">
            <p className="">{exercise.name}</p>

            <img src={exercise.gifUrl} alt={`${exercise.name} demonstration`} className="rounded-lg" />
          </li>
        )
      })}
    </ul>
  )
}
