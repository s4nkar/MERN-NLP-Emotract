"use client";

import { Cell, Pie, PieChart } from "recharts";
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
import { PieChartProps } from "@/types";

// Dynamic chart config based on data
const generateChartConfig = (data: PieChartProps["data"]): ChartConfig => {
  const config: ChartConfig = {
    percentage: {
      label: "Percentage",
    },
  };
  data.forEach((item) => {
    config[item.emotion] = {
      label: item.emotion.charAt(0).toUpperCase() + item.emotion.slice(1), // Capitalize emotion
      color: item.color,
    };
  });
  return config;
};

// Custom label renderer to show emotion
const renderCustomLabel = ({ name }: { name: string }) => {
  return name; // Displays the emotion (from nameKey="emotion")
};

export function PieWithLabel({ name, date, data }: PieChartProps) {
  const chartConfig = generateChartConfig(data);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{name}</CardTitle>
        <CardDescription>{date}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel // Hide the default label (emotion)
                  formatter={(value) => `${value}%`} // Show percentage in tooltip
                />
              }
            />
            <Pie
              data={data}
              dataKey="percentage" // Value used for slice size
              nameKey="emotion"   // Name used for label and tooltip
              label={renderCustomLabel} // Show emotion outside
              labelLine={true}    // Optional: line connecting label to slice
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            <ChartLegend
              content={<ChartLegendContent nameKey="emotion" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}