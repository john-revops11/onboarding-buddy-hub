// pages/dashboard/InsightsPage.tsx
import { useInsights } from "@/hooks/useInsights";
import { DocumentViewer } from "@/components/insights/DocumentViewer";
import { Button } from "@/components/ui/button";

const InsightsPage = () => {
  const { latestFile, historicalFiles, error } = useInsights("LATEST_INSIGHTS_FOLDER_ID");

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-4">Latest Insights</h1>
      <p className="text-muted-foreground mb-6">
        Your regular performance snapshots and strategic recommendations from Revify. (Updated Monthly)
      </p>

      {error && <div className="text-red-600">{error}</div>}

      {latestFile && (
        <div className="space-y-4 mb-10">
          <h2 className="text-lg font-semibold">Current Monthly Insight</h2>
          <DocumentViewer file={latestFile} />
          <div className="flex gap-3 mt-3">
            <Button asChild>
              <a href={latestFile.webContentLink} download>
                Download
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={latestFile.webViewLink} target="_blank">
                Open in Drive
              </a>
            </Button>
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold mt-8">Previous Insights</h2>
      {historicalFiles.length === 0 ? (
        <p className="text-muted-foreground">No previous insights available yet.</p>
      ) : (
        <div className="grid gap-4 mt-4">
          {historicalFiles.map((file) => (
            <div key={file.id} className="p-4 border rounded-md flex justify-between items-center">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(file.modifiedTime).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <a href={file.webViewLink} target="_blank">
                    View
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={file.webContentLink} download>
                    Download
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InsightsPage;
