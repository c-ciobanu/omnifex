import { useReducer, useState } from 'react'

import { MoreVertical, Plus } from 'lucide-react'
import type {
  DeleteMetricEntryMutation,
  DeleteMetricEntryMutationVariables,
  MetricQuery,
  MetricQueryVariables,
} from 'types/graphql'

import {
  type CellFailureProps,
  type CellSuccessProps,
  type TypedDocumentNode,
  Metadata,
  useMutation,
} from '@redwoodjs/web'
import { useCache } from '@redwoodjs/web/apollo'

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

import { Chart } from './Chart/Chart'
import EditMetricEntryModal from './EditMetricEntryModal/EditMetricEntryModal'

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

const DELETE_METRIC_ENTRY = gql`
  mutation DeleteMetricEntryMutation($id: Int!) {
    deleteMetricEntry(id: $id) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps<MetricQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

function actionMetricEntryReducer(state, action) {
  switch (action.type) {
    case 'setIsOpen': {
      return {
        metricEntryIndex: state.metricEntryIndex,
        isOpen: action.nextIsOpen,
      }
    }
    case 'open': {
      return {
        metricEntryIndex: action.nextMetricEntryIndex,
        isOpen: true,
      }
    }
  }

  throw Error(`Unknown action: ${action.type}.`)
}

export const Success = ({ metric }: CellSuccessProps<MetricQuery, MetricQueryVariables>) => {
  const [deleteState, deleteDispatch] = useReducer(actionMetricEntryReducer, { isOpen: false, metricEntryIndex: 0 })
  const [editState, editDispatch] = useReducer(actionMetricEntryReducer, { isOpen: false, metricEntryIndex: 0 })
  const [isOpen, setIsOpen] = useState(false)
  const { modify } = useCache()

  const [deleteMetricEntry, { loading }] = useMutation<DeleteMetricEntryMutation, DeleteMetricEntryMutationVariables>(
    DELETE_METRIC_ENTRY,
    {
      variables: { id: metric.entries[deleteState.metricEntryIndex]?.id },
      onCompleted: () => {
        deleteDispatch({ type: 'setIsOpen', nextIsOpen: false })
      },
      update(cache, { data: { deleteMetricEntry } }) {
        const data = cache.readQuery({ query: QUERY, variables: { id: metric.id } })

        cache.writeQuery({
          query: QUERY,
          data: {
            ...data,
            metric: {
              ...data.metric,
              entries: data.metric.entries.filter((e) => e.id !== deleteMetricEntry.id),
            },
          },
        })
      },
    }
  )

  return (
    <>
      <Metadata title={metric.name} robots="noindex" />

      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold md:text-2xl">{metric.name}</h2>

        <Button onClick={() => setIsOpen(true)}>
          <Plus />
          New Entry
        </Button>
      </div>

      <Chart metricName={metric.name} entries={metric.entries} />

      <ul className="mt-4 divide-y divide-white">
        {metric.entries.map((entry, index) => (
          <li key={entry.id} className="flex items-center justify-between gap-6 py-4">
            <time dateTime={entry.date} className="text-sm font-medium">
              {entry.date}
            </time>

            <div className="flex shrink-0 items-center gap-4">
              <p className="text-sm text-muted-foreground">
                {entry.value} {metric.unit}
              </p>

              <DropdownMenu>
                <Button asChild variant="ghost" size="icon">
                  <DropdownMenuTrigger>
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                </Button>

                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => editDispatch({ type: 'open', nextMetricEntryIndex: index })}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deleteDispatch({ type: 'open', nextMetricEntryIndex: index })}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>

      <NewMetricEntryModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        metric={metric}
        latestEntry={metric.entries[0]}
        onCompleted={(newEntry) => {
          modify(metric, {
            entries: () => metric.entries.concat([newEntry]).sort((a, b) => Date.parse(b.date) - Date.parse(a.date)),
          })
        }}
      />

      <EditMetricEntryModal
        isOpen={editState.isOpen}
        setIsOpen={(open: boolean) => editDispatch({ type: 'setIsOpen', nextIsOpen: open })}
        metric={metric}
        metricEntry={metric.entries[editState.metricEntryIndex]}
      />

      <AlertDialog
        open={deleteState.isOpen}
        onOpenChange={(open) => deleteDispatch({ type: 'setIsOpen', nextIsOpen: open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Metric Entry?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the {metric.entries[deleteState.metricEntryIndex]?.date} metric entry?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={() => deleteMetricEntry()} disabled={loading}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
