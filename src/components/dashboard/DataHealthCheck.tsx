
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, ChevronRight, AlertTriangle } from "lucide-react";

interface DataHealthCheckProps {
  report: {
    id: string;
    name: string;
    webViewLink: string;
    modifiedTime: string;
  } | null;
}

export const DataHealthCheck = ({ report }: DataHealthCheckProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart className="mr-2" size={20} />
          Data Health Check
        </CardTitle>
        <CardDescription>
          Review the quality and completeness assessment of your latest data submission
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[120px] flex flex-col items-center justify-center">
        {report ? (
          <>
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground mb-1">Latest Report:</p>
              <p className="font-medium">{formatDate(report.modifiedTime)}</p>
            </div>
            <Button className="gap-1" asChild>
              <a href={report.webViewLink} target="_blank" rel="noopener noreferrer">
                View Latest Health Check Report
                <ChevronRight size={16} />
              </a>
            </Button>
          </>
        ) : (
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <p className="text-muted-foreground mb-2">Awaiting Initial Check</p>
            <p className="text-xs text-muted-foreground">
              Your first data health check will be available after your initial data submission.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
