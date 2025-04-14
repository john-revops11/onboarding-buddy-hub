
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "@/components/ui/Tag";
import { BarChart2, TrendingUp, Users } from "lucide-react";

export function AnalyticsOverview() {
  return (
    <div className="grid gap-6">
      <Card className="border-accent-green-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-h3 text-primary-700">Analytics Overview</CardTitle>
          <Tag status="info">Overview</Tag>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-50 rounded-lg p-4 transition-all hover:shadow-md">
              <div className="flex items-center space-x-3">
                <div className="bg-primary-100 p-2 rounded-full">
                  <Users className="h-5 w-5 text-primary-700" />
                </div>
                <span className="text-caption text-primary-600 font-medium">Users</span>
              </div>
              <p className="text-h2 mt-2 text-primary-800 font-mono-numeric">1,245</p>
              <div className="flex items-center mt-1 text-accent-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-micro">+12.5% from last month</span>
              </div>
            </div>
            
            <div className="bg-accent-green-50 rounded-lg p-4 transition-all hover:shadow-md">
              <div className="flex items-center space-x-3">
                <div className="bg-accent-green-100 p-2 rounded-full">
                  <BarChart2 className="h-5 w-5 text-accent-green-700" />
                </div>
                <span className="text-caption text-accent-green-600 font-medium">Revenue</span>
              </div>
              <p className="text-h2 mt-2 text-accent-green-800 font-mono-numeric">$24,500</p>
              <div className="flex items-center mt-1 text-accent-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-micro">+18.2% from last month</span>
              </div>
            </div>
            
            <div className="bg-neutral-200 rounded-lg p-4 transition-all hover:shadow-md">
              <div className="flex items-center space-x-3">
                <div className="bg-neutral-300 p-2 rounded-full">
                  <Users className="h-5 w-5 text-neutral-700" />
                </div>
                <span className="text-caption text-neutral-600 font-medium">Conversion</span>
              </div>
              <p className="text-h2 mt-2 text-neutral-800 font-mono-numeric">3.6%</p>
              <div className="flex items-center mt-1 text-error-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-micro">-2.3% from last month</span>
              </div>
            </div>
          </div>
          
          <div className="text-center py-4 mt-4 border-t border-neutral-200">
            <p className="text-caption text-muted-foreground body-copy">
              Complete analytics data will be available after the next reporting cycle.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
