
import React from "react";
import { ExternalLink, Download, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <div className="flex items-center justify-center py-12 bg-muted/10 rounded-lg shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span className="text-lg">Loading document...</span>
      </div>
    );
  }

  const renderControls = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      {webViewLink && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(webViewLink, "_blank")}
                className="hover:bg-primary/5 transition-colors"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Open in Google Drive</span>
                <span className="sm:hidden">Open</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View the full document in Google Drive</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {webViewLink && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(webViewLink + "&export=download", "_blank")}
                className="hover:bg-primary/5 transition-colors"
              >
                <Download className="mr-2 h-4 w-4" />
                <span>Download</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save a local copy of this document</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );

  if (error) {
    return (
      <div className="space-y-4">
        {renderControls()}
        <div className="flex flex-col items-center justify-center py-12 bg-muted/10 rounded-lg shadow-sm">
          <AlertCircle className="h-8 w-8 text-destructive mb-2" />
          <p className="text-center mb-4 max-w-md px-4">
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
        <div className="w-full h-[300px] sm:h-[450px] md:h-[600px] relative">
          <iframe 
            src={embedLink} 
            className="w-full h-full border border-neutral-200 rounded-lg shadow-sm absolute inset-0"
            title={fileName || "Latest Insight Document"}
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-muted/10 rounded-lg shadow-sm">
          <p className="text-center mb-4">No document available to preview.</p>
        </div>
      )}
    </div>
  );
}
