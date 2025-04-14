
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "@/components/ui/Tag";

export function AnalyticsOverview() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-semibold">Analytics Overview</CardTitle>
          <Tag status="info">Overview</Tag>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              Analytics data will appear here once available.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
