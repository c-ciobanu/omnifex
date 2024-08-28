import { useReducer } from 'react'

import { ChartLine, MoreVertical } from 'lucide-react'
import type {
  DeleteMetricMutation,
  DeleteMetricMutationVariables,
  MetricsQuery,
  MetricsQueryVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { type CellSuccessProps, type CellFailureProps, type TypedDocumentNode, useMutation } from '@redwoodjs/web'
import { useCache } from '@redwoodjs/web/dist/apollo'

import NewMetricEntryModal from 'src/components/NewMetricEntryModal/NewMetricEntryModal'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'src/components/ui/alert-dialog'
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
import NewMetric from './NewMetric/NewMetric'

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

const DELETE_METRIC = gql`
  mutation DeleteMetricMutation($id: Int!) {
    deleteMetric(id: $id) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => (
  <div className="min-h-main flex flex-col items-center justify-center gap-2">
    <ChartLine className="h-12 w-12" />
    <h3 className="text-2xl font-bold tracking-tight">You have no tracked metrics</h3>
    <p className="mb-4 text-sm text-muted-foreground">Get started by creating a new metric.</p>
    <NewMetric />
  </div>
)

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

function actionMetricReducer(state, action) {
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
  const [deleteState, deleteDispatch] = useReducer(actionMetricReducer, { isOpen: false, metricIndex: 0 })
  const [editState, editDispatch] = useReducer(actionMetricReducer, { isOpen: false, metricIndex: 0 })
  const [newEntryState, newEntryDispatch] = useReducer(actionMetricReducer, { isOpen: false, metricIndex: 0 })
  const { modify } = useCache()

  const [deleteMetric, { loading }] = useMutation<DeleteMetricMutation, DeleteMetricMutationVariables>(DELETE_METRIC, {
    variables: { id: metrics[deleteState.metricIndex]?.id },
    onCompleted: () => {
      deleteDispatch({ type: 'setIsOpen', nextIsOpen: false })
    },
    update(cache, { data: { deleteMetric } }) {
      const data = cache.readQuery({ query: QUERY })

      cache.writeQuery({
        query: QUERY,
        data: { ...data, metrics: data.metrics.filter((m) => m.id !== deleteMetric.id) },
      })
    },
  })

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
                  <DropdownMenuItem onClick={() => newEntryDispatch({ type: 'open', nextMetricIndex: index })}>
                    Add Entry
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editDispatch({ type: 'open', nextMetricIndex: index })}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deleteDispatch({ type: 'open', nextMetricIndex: index })}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>

      <NewMetricEntryModal
        isOpen={newEntryState.isOpen}
        setIsOpen={(open: boolean) => newEntryDispatch({ type: 'setIsOpen', nextIsOpen: open })}
        metric={metrics[newEntryState.metricIndex]}
        latestEntry={metrics[newEntryState.metricIndex]?.latestEntry}
        onCompleted={(newEntry) => {
          if (Date.parse(newEntry.date) > Date.parse(metrics[newEntryState.metricIndex].latestEntry.date)) {
            modify(metrics[newEntryState.metricIndex], { latestEntry: () => newEntry })
          }
        }}
      />

      <EditMetricModal
        isOpen={editState.isOpen}
        setIsOpen={(open: boolean) => editDispatch({ type: 'setIsOpen', nextIsOpen: open })}
        metric={metrics[editState.metricIndex]}
      />

      <AlertDialog
        open={deleteState.isOpen}
        onOpenChange={(open) => deleteDispatch({ type: 'setIsOpen', nextIsOpen: open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Metric?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the metric &#34;{metrics[deleteState.metricIndex]?.name}&#34;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={() => deleteMetric()} disabled={loading}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
