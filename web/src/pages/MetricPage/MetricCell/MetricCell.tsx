import type { MetricQuery, MetricQueryVariables } from 'types/graphql'

import { type CellSuccessProps, type CellFailureProps, type TypedDocumentNode, Metadata } from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<MetricQuery, MetricQueryVariables> = gql`
  query MetricQuery($id: Int!) {
    metric(id: $id) {
      id
      name
      unit
      entries {
        id
        value
        date
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps<MetricQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ metric }: CellSuccessProps<MetricQuery, MetricQueryVariables>) => {
  return (
    <>
      <Metadata title={`${metric.name} Tracker`} />

      <h2 className="mb-4 text-2xl font-bold">{metric.name}</h2>

      <ul className="divide-y divide-white">
        {metric.entries.map((entry) => (
          <li key={entry.id} className="flex justify-between gap-6 py-4 text-sm">
            <time dateTime={entry.date} className="font-medium">
              {entry.date}
            </time>

            <p>
              {entry.value} {metric.unit}
            </p>
          </li>
        ))}
      </ul>
    </>
  )
}
