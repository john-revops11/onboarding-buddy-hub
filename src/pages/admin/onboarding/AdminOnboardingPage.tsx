
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { ClientOnboardingForm } from "@/components/admin/onboarding/ClientOnboardingForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminOnboardingPage = () => {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Client Onboarding</h1>
            <p className="text-muted-foreground mt-1">
              Streamline the client onboarding process and monitor progress
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
        
        <Tabs defaultValue="new-client">
          <TabsList className="mb-4">
            <TabsTrigger value="new-client">New Client</TabsTrigger>
            <TabsTrigger value="checklist-templates">Checklist Templates</TabsTrigger>
            <TabsTrigger value="settings">Onboarding Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="new-client" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Onboarding</CardTitle>
                <CardDescription>
                  Complete the steps below to set up a new client with their subscription details and send invitations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientOnboardingForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="checklist-templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Checklist Templates</CardTitle>
                <CardDescription>
                  Manage your onboarding checklist templates to customize the client onboarding journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">This feature is coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Settings</CardTitle>
                <CardDescription>
                  Configure global settings for the client onboarding process.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">This feature is coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminOnboardingPage;
