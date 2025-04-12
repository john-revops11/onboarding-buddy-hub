import { useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const KnowledgeHubPage = () => {
  useEffect(() => {
    const disableInspect = () => {
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "F12") {
          e.preventDefault();
        }

        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "i")) {
          e.preventDefault();
        }

        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "C" || e.key === "c")) {
          e.preventDefault();
        }

        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "J" || e.key === "j")) {
          e.preventDefault();
        }

        if ((e.ctrlKey || e.metaKey) && (e.key === "U" || e.key === "u")) {
          e.preventDefault();
        }
      };

      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("keydown", handleKeyDown);
      };
    };

    const cleanup = disableInspect();
    return cleanup;
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="text-left">
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Hub</h1>
          <p className="text-muted-foreground mt-1">
            Access comprehensive guides, documentation, and resources
          </p>
        </div>

        <Card className="overflow-hidden border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="min-h-[80vh]">
              <iframe 
                src="https://knowledgehub-revology.notion.site/ebd/1730db3d2d0880b3b471e47957635bfa?v=1730db3d2d088142a724000cff9fddb8" 
                width="100%" 
                height="100%" 
                style={{ 
                  border: "none",
                  height: "80vh",
                  borderRadius: "0.5rem" 
                }} 
                title="Revify Knowledge Hub"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>

        <div className="md:hidden mt-6">
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium">Getting Started</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>Platform overview</li>
                  <li>Account setup guide</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium">FAQ & Support</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>Common questions</li>
                  <li>Contact support team</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KnowledgeHubPage;
