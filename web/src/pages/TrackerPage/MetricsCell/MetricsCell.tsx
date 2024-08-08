import type { MetricsQuery, MetricsQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps, TypedDocumentNode } from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<MetricsQuery, MetricsQueryVariables> = gql`
  query MetricsQuery {
    metrics {
      id
      name
      unit
      latestEntry {
        id
        value
        date
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

export const Success = ({ metrics }: CellSuccessProps<MetricsQuery>) => {
  return (
    <ul className="divide-y divide-white">
      {metrics.map((metric) => (
        <li key={metric.id}>
          <Link
            to={routes.metric({ id: metric.id })}
            title={metric.name}
            className="flex items-center justify-between gap-6 py-4"
          >
            <p className="text-sm font-semibold text-gray-900">{metric.name}</p>

            <div className="flex shrink-0 flex-col items-end">
              <p className="text-sm leading-6 text-gray-900">
                {metric.latestEntry.value} {metric.unit}
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                <time dateTime={metric.latestEntry.date}>{metric.latestEntry.date}</time>
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
