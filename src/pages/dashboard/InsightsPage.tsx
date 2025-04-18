
import React, { useEffect, useState } from "react";
import { useInsights } from "@/hooks/use-insights";
import { Main } from "@/components/ui/main";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { ExternalLink, Download, AlertCircle } from "lucide-react";
import { Insight } from "@/hooks/use-insights";

export default function InsightsPage() {
  const { data: insights = [], isLoading, error } = useInsights();
  const [activeDoc, setActiveDoc] = useState<Insight | null>(null);
  const [embedError, setEmbedError] = useState(false);

  useEffect(() => {
    if (insights.length > 0) {
      setActiveDoc(insights[0]);
    }
  }, [insights]);

  const handleEmbedError = () => {
    setEmbedError(true);
  };

  const handleViewPrevious = (doc: Insight) => {
    setActiveDoc(doc);
    setEmbedError(false);
  };

  return (
    <Main>
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Latest Insights</h1>
          <p className="text-muted-foreground">
            Your regular performance snapshots and strategic recommendations
          </p>
        </div>

        {isLoading && <p>Loading insights...</p>}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error.toString()}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && activeDoc && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>
                    Current Monthly Insight: {formatInsightDate(activeDoc)}
                  </CardTitle>
                  <CardDescription>{activeDoc.name}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={activeDoc.download_url || activeDoc.drive_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={activeDoc.drive_url}
                      target="_blank"
                      rel="noreferrer"
                    >
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
                    src={activeDoc.embed_url}
                    width="100%"
                    height="600"
                    title={activeDoc.name}
                    className="border-0"
                    onError={handleEmbedError}
                  />
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>
                    Unable to display the latest insight preview.
                  </AlertTitle>
                  <AlertDescription>
                    You can still download it or open directly in Google Drive.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {!isLoading && insights.length > 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Previous Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights.slice(1).map((doc) => (
                <Card
                  key={doc.id}
                  className="hover:border-primary cursor-pointer transition"
                  onClick={() => handleViewPrevious(doc)}
                >
                  <CardHeader>
                    <CardTitle className="text-base">{doc.name}</CardTitle>
                    <CardDescription>{formatInsightDate(doc)}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewPrevious(doc)}
                    >
                      View
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={doc.download_url || doc.drive_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Download
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Main>
  );
}

function formatInsightDate(doc: Insight): string {
  const match = doc.name.match(/(\d{4})[-_ ]?(\d{2})/);
  if (match) {
    const [_, year, month] = match;
    const date = new Date(`${year}-${month}-01`);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  }

  const fallbackDate = new Date(doc.modifiedTime || doc.updatedAt || '');
  return fallbackDate.toLocaleString("default", { month: "long", year: "numeric" });
}
