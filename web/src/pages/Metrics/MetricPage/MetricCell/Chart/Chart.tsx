import { useState } from 'react'

import { format, intlFormat, isAfter, subDays } from 'date-fns'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { MetricQuery } from 'types/graphql'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'src/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from 'src/components/ui/chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'

const rangeOptions = [
  { value: '7', label: 'Last week' },
  { value: '30', label: 'Last month' },
  { value: '90', label: 'Last 3 months' },
  { value: '180', label: 'Last 6 months' },
  { value: '360', label: 'Last year' },
  { value: '0', label: 'All' },
]

type ChartProps = {
  metricName: string
  entries: MetricQuery['metric']['entries']
}

export function Chart(props: ChartProps) {
  const { metricName, entries } = props
  const [timeRange, setTimeRange] = useState(rangeOptions[2].value)

  const filteredData = entries
    .filter((item) => {
      if (timeRange === '0') {
        return true
      }

      return isAfter(item.date, subDays(new Date(), Number(timeRange)))
    })
    .reverse()

  return (
    <Card className="max-w-full">
      <CardHeader className="flex items-center gap-2 sm:flex-row sm:justify-between">
        <div className="space-y-1.5 text-center sm:text-left">
          <CardTitle>{metricName}</CardTitle>
          <CardDescription>
            {intlFormat(filteredData[0].date, { weekday: 'short', year: '2-digit', month: 'short', day: 'numeric' })} -{' '}
            {intlFormat(filteredData[filteredData.length - 1].date, {
              weekday: 'short',
              year: '2-digit',
              month: 'short',
              day: 'numeric',
            })}
          </CardDescription>
        </div>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48" aria-label="Select a value">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {rangeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={{
            value: { label: metricName, color: 'hsl(var(--chart-1))' },
          }}
          className="aspect-auto h-[300px] w-full"
        >
          <LineChart data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} tickMargin={8} tickFormatter={(date) => format(date, 'dd/MM')} />
            <YAxis
              dataKey="value"
              domain={[(dataMin) => Math.floor(dataMin), (dataMax) => Math.ceil(dataMax)]}
              tickLine={false}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(date) =>
                    intlFormat(date, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                  }
                  indicator="dot"
                />
              }
            />
            <Line dataKey="value" type="linear" stroke="var(--color-value)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
