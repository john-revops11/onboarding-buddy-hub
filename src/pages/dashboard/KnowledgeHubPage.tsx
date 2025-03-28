
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
            <div className="min-h-[600px] border-t">
              <iframe 
                src="https://knowledgehub-revology.notion.site/ebd/1730db3d2d0880b3b471e47957635bfa?v=1730db3d2d088142a724000cff9fddb8" 
                width="100%" 
                height="600" 
                style={{ border: "none" }} 
                title="Revify Knowledge Hub"
                allowFullScreen
              />
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
