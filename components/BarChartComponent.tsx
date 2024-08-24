"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { Trip } from "@/lib/interface";

interface BarChartComponentProps {
  trips: Trip[];
}

const chartConfig = {
  income: {
    label: "Income",
    color: "#3B82F6",
  },

  expense: {
    label: "Expense",
    color: "#EF4444",
  },
} satisfies ChartConfig;

export const BarChartComponent: React.FC<BarChartComponentProps> = ({
  trips,
}) => {
  // Aggregate income and expense by month
  const chartData = trips.reduce((acc, curr) => {
    const day = new Date(curr.startedAt).toLocaleDateString("default", {
      day: "numeric",
      month: "short",
    });

    const existing = acc.find((item) => item.day === day);
    if (existing) {
      existing.income += curr.partyFreightAmount;
      existing.expense += curr.totalExpenseAmount;
    } else {
      acc.push({
        day,
        income: curr.partyFreightAmount,
        expense: curr.totalExpenseAmount,
      });
    }

    return acc;
  }, [] as { day: string; income: number; expense: number }[]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expense</CardTitle>
        <CardDescription>Total Overview</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
