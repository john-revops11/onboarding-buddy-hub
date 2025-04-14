
import React from "react";
import { ExternalLink, Download, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InsightEmbedProps {
  embedLink: string | null;
  webViewLink: string | null;
  fileName: string | null;
  isLoading: boolean;
  error: string | null;
}

export function InsightEmbed({ embedLink, webViewLink, fileName, isLoading, error }: InsightEmbedProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 bg-muted/20 rounded-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span className="text-lg">Loading document...</span>
      </div>
    );
  }

  const renderControls = () => (
    <div className="flex gap-2 mb-4">
      {webViewLink && (
        <Button variant="outline" size="sm" onClick={() => window.open(webViewLink, "_blank")}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Open in Google Drive
        </Button>
      )}
      {webViewLink && (
        <Button variant="outline" size="sm" onClick={() => window.open(webViewLink + "&export=download", "_blank")}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      )}
    </div>
  );

  if (error) {
    return (
      <div className="space-y-4">
        {renderControls()}
        <div className="flex flex-col items-center justify-center py-12 bg-muted/20 rounded-lg">
          <AlertCircle className="h-8 w-8 text-destructive mb-2" />
          <p className="text-center mb-4">
            Unable to display the latest insight preview. You can try opening it directly in Google Drive or downloading it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {renderControls()}
      {embedLink ? (
        <iframe 
          src={embedLink} 
          className="w-full h-[600px] border border-neutral-200 rounded-lg"
          title={fileName || "Latest Insight Document"}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-muted/20 rounded-lg">
          <p className="text-center mb-4">No document available to preview.</p>
        </div>
      )}
    </div>
  );
}
