"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface MessageTrendLineChartProps {
  name: string;
  date: string;
  data: {
    _id: string;
    total: number;
    flagged: number;
  }[];
}

const chartConfig = {
  total: {
    label: "Total Messages",
    color: "hsl(var(--chart-1))",
  },
  flagged: {
    label: "Flagged Messages",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function MessageTrendLineChart({ name, date, data }: MessageTrendLineChartProps) {
  console.log("MessageTrend Data:", data);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("default", { month: "short", day: "numeric" });
  };

  const calculateTrend = () => {
    if (data.length < 2) return 0;
    const last = data[data.length - 1].total;
    const secondLast = data[data.length - 2].total;
    const trend = ((last - secondLast) / secondLast) * 100;
    return Number(trend.toFixed(1));
  };

  const trend = calculateTrend();
  const isTrendingUp = trend > 0;

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{date}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">No message data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{date}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12, top: 10, bottom: 10 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="_id"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatDate}
              interval={0}
            />
            <YAxis />
            <ChartTooltip
              cursor={data.length > 1}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    `${value} `, // Value first
                    chartConfig[name]?.label || name // Use label from chartConfig
                  ]}
                />
              }
            />
            <Line
              dataKey="total"
              type="monotone"
              stroke="var(--color-total)"
              strokeWidth={2}
              dot={data.length === 1 ? { r: 6 } : { r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls
            />
            <Line
              dataKey="flagged"
              type="monotone"
              stroke="var(--color-flagged)"
              strokeWidth={2}
              dot={data.length === 1 ? { r: 6 } : { r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {data.length < 2
                ? "No trend data available"
                : `${isTrendingUp ? "Trending up" : "Trending down"} by ${Math.abs(trend)}% this month`}
              {data.length >= 2 && <TrendingUp className="h-4 w-4" />}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total and flagged messages over time
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}