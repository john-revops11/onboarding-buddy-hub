
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { BarChart } from "@/components/ui/charts/BarChart";
import { LineChart } from "@/components/ui/charts/LineChart";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/components/ui/Tag";

export function AnalyticsOverview() {
  // Sample data for charts
  const barChartData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 500 },
    { name: "Apr", value: 200 },
    { name: "May", value: 450 },
    { name: "Jun", value: 600 },
  ];

  const lineChartData = [
    { name: "Week 1", value: 4000 },
    { name: "Week 2", value: 3000 },
    { name: "Week 3", value: 5000 },
    { name: "Week 4", value: 2780 },
    { name: "Week 5", value: 1890 },
    { name: "Week 6", value: 2390 },
    { name: "Week 7", value: 3490 },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-semibold">Monthly Performance</CardTitle>
          <Tag status="success">Trending Up</Tag>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[200px]">
            <BarChart
              data={barChartData}
              index="name"
              categories={["value"]}
              colors={["#7EC242"]}
              showLegend={false}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-semibold">Weekly Trends</CardTitle>
          <div className="flex items-center gap-2">
            <Icons.arrowRight className="h-4 w-4 text-green-base" />
            <span className="text-sm font-medium text-green-base">+14%</span>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[200px]">
            <LineChart
              data={lineChartData}
              index="name"
              categories={["value"]}
              colors={["#1e3a8a"]}
              showLegend={false}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
