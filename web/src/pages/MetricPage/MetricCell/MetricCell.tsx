import { useState } from 'react'

import { MoreVertical, Plus } from 'lucide-react'
import type { MetricQuery, MetricQueryVariables } from 'types/graphql'

import {
  type CellSuccessProps,
  type CellFailureProps,
  type TypedDocumentNode,
  Metadata,
  useMutation,
} from '@redwoodjs/web'

import NewMetricEntryModal from 'src/components/NewMetricEntryModal/NewMetricEntryModal'
import { Button } from 'src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu'

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

const CREATE_METRIC_ENTRY = gql`
  mutation CreateMetricEntryMutation($input: CreateMetricEntryInput!) {
    createMetricEntry(input: $input) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps<MetricQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ metric }: CellSuccessProps<MetricQuery, MetricQueryVariables>) => {
  const [isOpen, setIsOpen] = useState(false)

  const [createMetricEntry, { loading: createMetricEntryLoading }] = useMutation(CREATE_METRIC_ENTRY, {
    onCompleted: () => {
      setIsOpen(false)
    },
    refetchQueries: [{ query: QUERY, variables: { id: metric.id } }],
  })

  return (
    <>
      <Metadata title={`${metric.name} Tracker`} />

      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold md:text-2xl">{metric.name}</h2>

        <NewMetricEntryModal
          trigger={
            <Button onClick={() => setIsOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              New Entry
            </Button>
          }
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSubmit={({ value, date }) =>
            createMetricEntry({
              variables: { input: { metricId: metric.id, value, date: date.toISOString().substring(0, 10) } },
            })
          }
          isSubmitting={createMetricEntryLoading}
          defaultValue={metric.entries[0].value}
          valueUnit={metric.unit}
        />
      </div>

      <ul className="divide-y divide-white">
        {metric.entries.map((entry) => (
          <li key={entry.id} className="flex items-center justify-between gap-6 py-4 text-sm">
            <time dateTime={entry.date} className="font-medium">
              {entry.date}
            </time>

            <div className="flex shrink-0 items-center gap-4">
              <p className="text-muted-foreground">
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
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
