
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, ExternalLink, AlertCircle } from "lucide-react";

interface InsightPreviewProps {
  insight: {
    name: string;
    embed_url: string;
    drive_url: string;
    download_url: string;
  };
}

export function InsightPreview({ insight }: InsightPreviewProps) {
  const [embedError, setEmbedError] = useState(false);

  const formatInsightDate = (name: string): string => {
    const match = name.match(/(\d{4})[-_ ]?(\d{2})/);
    if (match) {
      const [_, year, month] = match;
      const date = new Date(`${year}-${month}-01`);
      return date.toLocaleString("default", { month: "long", year: "numeric" });
    }
    return "Unknown Date";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Current Monthly Insight: {formatInsightDate(insight.name)}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={insight.download_url} target="_blank" rel="noreferrer">
                <Download className="h-4 w-4 mr-1" />
                Download
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={insight.drive_url} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Open in Drive
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!embedError ? (
          <div className="border rounded-lg overflow-hidden h-[600px]">
            <iframe
              src={insight.embed_url}
              width="100%"
              height="600"
              title={insight.name}
              className="border-0"
              onError={() => setEmbedError(true)}
            />
          </div>
        ) : (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unable to display the latest insight preview.</AlertTitle>
            <AlertDescription>
              You can still download it or open directly in Google Drive.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
