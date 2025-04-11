
import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
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

interface LineChartProps {
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

export const LineChart = ({
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
}: LineChartProps) => {
  const defaultColors = ["#68b046", "#72c90a", "#9edc4f", "#b6e376", "#c9e99d"];
  const chartColors = colors || defaultColors;

  return (
    <ChartContainer config={{}} className={className}>
      <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
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
          <Line
            key={category}
            type="monotone"
            dataKey={category}
            stroke={chartColors[i % chartColors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  );
};
