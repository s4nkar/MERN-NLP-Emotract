"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface GenderChartDataItem {
  date: string;
  M: number;
  F: number;
  O: number;
}

interface GenderChartProps {
  data: GenderChartDataItem[];
}

const chartConfig = {
  M: { label: "Male", color: "hsl(var(--chart-1))" },
  F: { label: "Female", color: "hsl(var(--chart-2))" },
  O: { label: "Other", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

export function GenderChart({ data }: GenderChartProps) {
    // Check if data is an array and filter only if valid
    if (!Array.isArray(data)) {
      return (
        <Card>
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <div className="grid flex-1 gap-1 text-center sm:text-left">
              <CardTitle>User Gender Chart</CardTitle>
              <CardDescription>No data available</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                <div>No data available</div>
            </ChartContainer>
          </CardContent>
        </Card>
      );
    }
  
    // Filter data for the last 90 days based on the date
    const filteredData = data.filter((item) => {
      const date = new Date(item.date);
      const referenceDate = new Date("2024-06-30"); // You can make this dynamic
      const daysToSubtract = 90;
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - daysToSubtract);
      return date >= startDate;
    });
  
    return (
      <Card>
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>User Gender Chart</CardTitle>
            <CardDescription>Showing users based on gender (last 90 days)</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillM" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-male)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-male)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillF" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-female)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-female)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillO" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-other)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="var(--color-other)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
  
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
  
              <Area
                type="natural"
                dataKey="M"
                stroke="var(--color-male)"
                fill="url(#fillM)"
                stackId="a"
              />
              <Area
                type="natural"
                dataKey="F"
                stroke="var(--color-female)"
                fill="url(#fillF)"
                stackId="a"
              />
              <Area
                type="natural"
                dataKey="O"
                stroke="var(--color-other)"
                fill="url(#fillO)"
                stackId="a"
              />
  
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  }
  