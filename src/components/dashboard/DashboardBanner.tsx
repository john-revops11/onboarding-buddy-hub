import React from 'react';
import { Card } from '@/components/ui/card';
import { LineChart } from '@/components/ui/charts/LineChart';

interface DashboardBannerProps {
  userName: string;
  userRole?: string;
}

export function DashboardBanner({ userName, userRole }: DashboardBannerProps) {
  // Sample data for the area chart
  const chartData = [
    { name: 'Jan', primary: 40, secondary: 24, comparison: 35 },
    { name: 'Feb', primary: 30, secondary: 13, comparison: 22 },
    { name: 'Mar', primary: 20, secondary: 28, comparison: 25 },
    { name: 'Apr', primary: 27, secondary: 39, comparison: 30 },
    { name: 'May', primary: 18, secondary: 48, comparison: 28 },
    { name: 'Jun', primary: 23, secondary: 38, comparison: 20 },
    { name: 'Jul', primary: 34, secondary: 43, comparison: 32 },
    { name: 'Aug', primary: 45, secondary: 50, comparison: 40 },
  ];

  return (
    <Card className="bg-brand text-white relative overflow-hidden">
      <div className="relative z-10 p-6">
        <div className="flex flex-col gap-1 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-xl text-white/90">
            Welcome back, {userName}!
          </p>
          {userRole && (
            <p className="text-white/80 font-medium">
              {userRole === 'admin' ? 'Administrator' : 'Team Member'}
            </p>
          )}
        </div>
      </div>

      {/* Background chart overlay */}
      <div className="absolute inset-0 opacity-20">
        <LineChart
          data={chartData}
          categories={['primary', 'secondary', 'comparison']}
          index="name"
          colors={['#1e3a8a', '#7EC242', '#ef4444']}
          showYAxis={false}
          showXAxis={false}
          showLegend={false}
          showGridLines={false}
        />
      </div>
    </Card>
  );
}
