
import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltipContent,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";

interface BarChartProps {
  data: any[];
  categories: string[];
  index: string;
  className?: string;
  colors?: string[];
  valueFormatter?: (value: any) => string;
  showLegend?: boolean;
  showGridLines?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
}

export const BarChart = ({
  data,
  categories,
  index,
  className,
  colors,
  valueFormatter,
  showLegend = true,
  showGridLines = true,
  showXAxis = true,
  showYAxis = true,
}: BarChartProps) => {
  const defaultColors = ["#68b046", "#72c90a", "#9edc4f", "#b6e376", "#c9e99d"];
  const chartColors = colors || defaultColors;

  return (
    <ChartContainer config={{}} className={className}>
      <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
        {showGridLines && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
        
        {showXAxis && (
          <XAxis
            dataKey={index}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
        )}
        
        {showYAxis && (
          <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        )}
        
        <ChartTooltip content={<ChartTooltipContent />} />
        
        {showLegend && (
          <ChartLegend content={<ChartLegendContent />} />
        )}
        
        {categories.map((category, i) => (
          <Bar
            key={category}
            dataKey={category}
            fill={chartColors[i % chartColors.length]}
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
        ))}
      </RechartsBarChart>
    </ChartContainer>
  );
};
