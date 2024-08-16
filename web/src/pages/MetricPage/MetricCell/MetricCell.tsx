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

export const Success = ({ metric }: CellSuccessProps<MetricQuery, MetricQueryVariables>) => {
  return (
    <>
      <Metadata title={`${metric.name} Tracker`} />

      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold md:text-2xl">{metric.name}</h2>

        <NewMetricEntry metric={metric} />
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
