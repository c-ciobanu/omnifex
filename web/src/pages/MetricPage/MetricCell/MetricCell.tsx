import { useReducer } from 'react'

import { MoreVertical } from 'lucide-react'
import type { MetricQuery, MetricQueryVariables } from 'types/graphql'

import { type CellSuccessProps, type CellFailureProps, type TypedDocumentNode, Metadata } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu'

import EditMetricEntryModal from './EditMetricEntryModal/EditMetricEntryModal'
import NewMetricEntry from './NewMetricEntry/NewMetricEntry'

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

function editMetricEntryReducer(state, action) {
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

  throw Error('Unknown action: ' + action.type)
}

export const Success = ({ metric }: CellSuccessProps<MetricQuery, MetricQueryVariables>) => {
  const [state, dispatch] = useReducer(editMetricEntryReducer, { isOpen: false, metricEntryIndex: 0 })

  return (
    <>
      <Metadata title={`${metric.name} Tracker`} />

      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold md:text-2xl">{metric.name}</h2>

        <NewMetricEntry metric={metric} />
      </div>

      <ul className="divide-y divide-white">
        {metric.entries.map((entry, index) => (
          <li key={entry.id} className="flex items-center justify-between gap-6 py-4 ">
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
                  <DropdownMenuItem onClick={() => dispatch({ type: 'open', nextMetricEntryIndex: index })}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>

      <EditMetricEntryModal
        isOpen={state.isOpen}
        setIsOpen={(open: boolean) => dispatch({ type: 'setIsOpen', nextIsOpen: open })}
        metric={metric}
        metricEntry={metric.entries[state.metricEntryIndex]}
      />
    </>
  )
}
