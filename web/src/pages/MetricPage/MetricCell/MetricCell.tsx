import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { MetricQuery, MetricQueryVariables } from 'types/graphql'

import { type CellSuccessProps, type CellFailureProps, type TypedDocumentNode, Metadata } from '@redwoodjs/web'

import NewMetricEntryModal from 'src/components/NewMetricEntryModal/NewMetricEntryModal'

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

      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">{metric.name}</h2>

        <NewMetricEntryModal
          trigger={(onClick) => (
            <button
              onClick={onClick}
              className="flex shrink-0 items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              <FontAwesomeIcon icon={faPlus} />
              Add Entry
            </button>
          )}
          defaultValue={metric.entries[0].value}
          valueUnit={metric.unit}
        />
      </div>

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
