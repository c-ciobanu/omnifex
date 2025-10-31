import type { OrpcClientOutputs } from "@/utils/orpc";
import { useState } from "react";
import { format, getTime, intlFormat, isAfter, subDays } from "date-fns";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const rangeOptions = [
  { value: "7", label: "Last week" },
  { value: "30", label: "Last month" },
  { value: "90", label: "Last 3 months" },
  { value: "180", label: "Last 6 months" },
  { value: "360", label: "Last year" },
  { value: "0", label: "All" },
] as const;

interface Props {
  metricName: string;
  entries: NonNullable<OrpcClientOutputs["metrics"]["get"]>["entries"];
}

export function MetricEntryChart(props: Props) {
  const { metricName, entries } = props;
  const [timeRange, setTimeRange] = useState<(typeof rangeOptions)[number]["value"]>(rangeOptions[2].value);

  const filteredData = entries
    .filter((item) => {
      if (timeRange === "0") {
        return true;
      }

      return isAfter(item.date, subDays(new Date(), Number(timeRange)));
    })
    .reverse();

  const firstDate = filteredData[0]?.date;
  const lastDate = filteredData.at(-1)?.date;

  return (
    <Card className="max-w-full">
      <CardHeader className="flex items-center gap-2 sm:flex-row sm:justify-between">
        <div className="space-y-1.5 text-center sm:text-left">
          <CardTitle>{metricName}</CardTitle>

          {firstDate && lastDate ? (
            <CardDescription>
              {intlFormat(firstDate, { weekday: "short", year: "2-digit", month: "short", day: "numeric" })} -{" "}
              {intlFormat(lastDate, {
                weekday: "short",
                year: "2-digit",
                month: "short",
                day: "numeric",
              })}
            </CardDescription>
          ) : null}
        </div>

        <Select
          value={timeRange}
          onValueChange={(value: typeof timeRange) => {
            setTimeRange(value);
          }}
        >
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
            value: { label: metricName, color: "var(--chart-1)" },
          }}
          className="aspect-auto h-[300px] w-full"
        >
          <LineChart data={filteredData}>
            <CartesianGrid vertical={false} />

            <XAxis
              type="number"
              dataKey={(item: (typeof filteredData)[number]) => getTime(item.date)}
              domain={["dataMin", "dataMax"]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(timestamp: number) => format(timestamp, "yy-MM-dd")}
            />

            <YAxis
              dataKey="value"
              domain={[(dataMin: number) => Math.floor(dataMin), (dataMax: number) => Math.ceil(dataMax)]}
              tickLine={false}
              axisLine={false}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(timestamp: number) =>
                    intlFormat(timestamp, { weekday: "long", year: "numeric", month: "long", day: "numeric" })
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
  );
}
