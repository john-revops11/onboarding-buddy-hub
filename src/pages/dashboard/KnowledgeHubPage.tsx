
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const KnowledgeHubPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Knowledge Hub</h1>
        <p className="text-muted-foreground">
          Access resources, guides, and helpful information.
        </p>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Resource Library</CardTitle>
            <CardDescription>
              Explore our collection of guides and documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* In a real application, this would be an embedded Notion page */}
            <div className="bg-muted/50 border-t p-6 min-h-[500px] flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-medium">Notion Embed</h3>
              <p className="text-sm text-muted-foreground mt-2 mb-4 max-w-md">
                This is where a Notion page would be embedded in the actual application. 
                The admin can configure which Notion page is displayed here.
              </p>
              <div className="border border-dashed border-muted-foreground/25 rounded-lg p-8 w-full max-w-2xl">
                <p className="text-muted-foreground">
                  Notion Knowledge Base Content
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Learn the basics of our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Platform overview</li>
                <li>Account setup guide</li>
                <li>First-time configuration</li>
                <li>Basic features walkthrough</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
              <CardDescription>
                Common questions and answers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Account management</li>
                <li>Billing and subscriptions</li>
                <li>Feature usage guides</li>
                <li>Troubleshooting tips</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Support</CardTitle>
              <CardDescription>
                Get help when you need it
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Contact support team</li>
                <li>Submit a ticket</li>
                <li>Schedule a call</li>
                <li>Feature requests</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KnowledgeHubPage;
