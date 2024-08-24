"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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

interface PieChartComponentProps {
  trips: Trip[];
  type: string;
}

const chartConfig = {
  money: {
    label: "Profit",
  },
  income: {
    label: "Income",
    color: "#3B82F6",
  },
  expense: {
    label: "Expense",
    color: "#EF4444",
  },
} satisfies ChartConfig;

export const PieChartComponent: React.FC<PieChartComponentProps> = ({
  trips,
  type,
}) => {
  const { totalIncome, totalExpense } = trips?.reduce(
    (acc, curr) => {
      acc.totalIncome += curr.partyFreightAmount;
      acc.totalExpense += curr.totalExpenseAmount;
      return acc;
    },
    { totalIncome: 0, totalExpense: 0 }
  );

  console.log(totalIncome, totalExpense);

  const chartData = [
    { state: "income", money: totalIncome, fill: "var(--color-income)" },
    { state: "expense", money: totalExpense, fill: "var(--color-expense)" },
  ];

  const profit = totalIncome - totalExpense;
  const profitPercentage =
    totalIncome > 0 ? ((profit / totalIncome) * 100).toFixed(1) : 0;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Active Profit</CardTitle>
        <CardDescription>
          {type === "monthlyTrips"
            ? "Profit for this month"
            : "Profit till now"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              wrapperStyle={{
                display: "flex",
                gap: "0.5rem",
                width: "100px",
              }}
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="money"
              nameKey="state"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          ₹ {profit.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Profit
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {profit > 0 ? (
            <>
              Trending up by {profitPercentage}%{" "}
              <TrendingUp className="h-4 w-4" />
            </>
          ) : (
            "No profit trend this period"
          )}
        </div>
        <div className="leading-none text-muted-foreground">
          {type === "monthlyTrips"
            ? "Showing profit for the current month"
            : "Showing total profit till now"}
        </div>
      </CardFooter>
    </Card>
  );
};
