import { useReducer, useState } from 'react'

import { ChartLine, MoreVertical, Plus } from 'lucide-react'
import type { MetricsQuery, MetricsQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { type CellSuccessProps, type CellFailureProps, type TypedDocumentNode, useMutation } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu'

import EditMetricModal from './EditMetricModal/EditMetricModal'
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
    <NewMetricModal
      trigger={
        <Button onClick={() => setIsOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Metric
        </Button>
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSubmit={(data) =>
        createMetric({
          variables: {
            input: { ...data, entry: { ...data.entry, date: data.entry.date.toISOString().substring(0, 10) } },
          },
        })
      }
      isSubmitting={createMetricLoading}
    />
  )
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => (
  <div className="min-h-main flex flex-col items-center justify-center gap-2">
    <ChartLine className="h-12 w-12" />
    <h3 className="text-2xl font-bold tracking-tight">No metrics tracked</h3>
    <p className="mb-4 text-sm text-muted-foreground">Get started by creating a new metric.</p>
    <NewMetric />
  </div>
)

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

function editMetricReducer(state, action) {
  switch (action.type) {
    case 'setIsOpen': {
      return {
        metricIndex: state.metricIndex,
        isOpen: action.nextIsOpen,
      }
    }
    case 'open': {
      return {
        metricIndex: action.nextMetricIndex,
        isOpen: true,
      }
    }
  }

  throw Error('Unknown action: ' + action.type)
}

export const Success = ({ metrics }: CellSuccessProps<MetricsQuery>) => {
  const [state, dispatch] = useReducer(editMetricReducer, { isOpen: false, metricIndex: 0 })

  return (
    <>
      <div className="mb-4 flex justify-end">
        <NewMetric />
      </div>

      <ul className="divide-y divide-white">
        {metrics.map((metric, index) => (
          <li key={metric.id} className="flex items-center justify-between gap-6 py-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{metric.name}</p>
              <p className="text-xs text-muted-foreground">
                <time dateTime={metric.latestEntry.date}>{metric.latestEntry.date}</time>
                {' • '}
                {metric.latestEntry.value} {metric.unit}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <Button asChild variant="outline">
                <Link to={routes.metric({ id: metric.id })} title={metric.name}>
                  View Metric
                </Link>
              </Button>

              <DropdownMenu>
                <Button asChild variant="ghost" size="icon">
                  <DropdownMenuTrigger>
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                </Button>

                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => dispatch({ type: 'open', nextMetricIndex: index })}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>

      <EditMetricModal
        isOpen={state.isOpen}
        setIsOpen={(open: boolean) => dispatch({ type: 'setIsOpen', nextIsOpen: open })}
        metric={metrics[state.metricIndex]}
      />
    </>
  )
}
