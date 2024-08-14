import { useState } from 'react'

import { faChartLine, faEllipsisVertical, faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import type { MetricsQuery, MetricsQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { type CellSuccessProps, type CellFailureProps, type TypedDocumentNode, useMutation } from '@redwoodjs/web'

import NewMetricModal from './NewMetricModal/NewMetricModal'

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
const CREATE_METRIC = gql`
  mutation CreateMetricMutation($input: CreateMetricInput!) {
    createMetric(input: $input) {
      id
    }
  }
`

const NewMetric = () => {
  const [isOpen, setIsOpen] = useState(false)

  const [createMetric, { loading: createMetricLoading }] = useMutation(CREATE_METRIC, {
    onCompleted: () => {
      setIsOpen(false)
    },
    refetchQueries: [{ query: QUERY }],
  })

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex shrink-0 items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
      >
        <FontAwesomeIcon icon={faPlus} />
        New Metric
      </button>

      <NewMetricModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={(data) =>
          createMetric({
            variables: {
              input: { ...data, entry: { ...data.entry, date: data.entry.date.toISOString().substring(0, 10) } },
            },
          })
        }
        isSubmitting={createMetricLoading}
      />
    </>
  )
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => (
  <div className="min-h-main flex flex-col items-center justify-center">
    <FontAwesomeIcon icon={faChartLine} className="text-4xl" />

    <h4 className="mt-4 text-sm font-semibold text-gray-900">No metrics tracked</h4>

    <p className="mb-6 mt-1 text-sm text-gray-500">Get started by creating a new metric.</p>

    <NewMetric />
  </div>
)

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

export const Success = ({ metrics }: CellSuccessProps<MetricsQuery>) => {
  return (
    <>
      <div className="mb-4 flex items-center justify-end gap-4">
        <NewMetric />
      </div>

      <ul className="divide-y divide-white">
        {metrics.map((metric) => (
          <li key={metric.id} className="flex items-center justify-between gap-6 py-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">{metric.name}</p>

              <p className="mt-1 text-xs text-gray-500">
                <time dateTime={metric.latestEntry.date}>{metric.latestEntry.date}</time>
                {' • '}
                <span className="text-gray-900">
                  {metric.latestEntry.value} {metric.unit}
                </span>
              </p>
            </div>

            <div className="shrink-0 space-x-4">
              <Link to={routes.metric({ id: metric.id })} title={metric.name}>
                <button className="rounded-md border px-4 py-2 text-sm font-semibold shadow-sm hover:bg-gray-200">
                  View Metric
                </button>
              </Link>

              <Menu>
                <MenuButton className="rounded-md px-4 py-2 text-sm hover:bg-gray-200 hover:shadow-sm">
                  <FontAwesomeIcon icon={faEllipsisVertical} />
                </MenuButton>

                <MenuItems
                  transition
                  anchor="bottom end"
                  className="w-32 origin-top-right rounded-xl border border-white/5 bg-white p-1 text-sm transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                  <MenuItem>
                    <button className="flex w-full items-center gap-2 px-4 py-2 data-[focus]:bg-gray-200">
                      <FontAwesomeIcon icon={faPen} fixedWidth />
                      Edit
                    </button>
                  </MenuItem>

                  <MenuItem>
                    <button className="flex w-full items-center gap-2 px-4 py-2 data-[focus]:bg-gray-200">
                      <FontAwesomeIcon icon={faTrash} fixedWidth />
                      Delete
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
