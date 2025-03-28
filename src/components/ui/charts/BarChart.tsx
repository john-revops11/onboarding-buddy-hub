
import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltipContent,
  ChartTooltip 
} from "@/components/ui/chart";

interface BarChartProps {
  data: any[];
  categories: string[];
  index: string;
  className?: string;
}

export const BarChart = ({
  data,
  categories,
  index,
  className,
}: BarChartProps) => {
  const colors = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#65a30d"];

  return (
    <ChartContainer config={{}} className={className}>
      <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey={index}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {categories.map((category, i) => (
          <Bar
            key={category}
            dataKey={category}
            fill={colors[i % colors.length]}
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
};
