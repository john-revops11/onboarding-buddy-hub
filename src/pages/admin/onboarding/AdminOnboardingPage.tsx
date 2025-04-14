
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { ClientOnboardingForm } from "@/components/admin/onboarding/ClientOnboardingForm";
import { BulkClientInvites } from "@/components/admin/onboarding/BulkClientInvites";
import { OnboardingTemplateManager } from "@/components/admin/onboarding/OnboardingTemplateManager";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, FileText, Settings, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ClientInvites } from "@/components/admin/onboarding/ClientInvites";
import { ClientStatus } from "@/components/admin/onboarding/ClientStatus";

const AdminOnboardingPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("new-client");
  
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
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="new-client">New Client</TabsTrigger>
            <TabsTrigger value="bulk-invite">Bulk Invite</TabsTrigger>
            <TabsTrigger value="client-invites">Client Invites</TabsTrigger>
            <TabsTrigger value="client-status">Client Status</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
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

          <TabsContent value="bulk-invite" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Client Invites</CardTitle>
                <CardDescription>
                  Invite multiple clients at once by pasting data or uploading a CSV file.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BulkClientInvites />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="client-invites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Invites</CardTitle>
                <CardDescription>
                  Manage invitations sent to clients. You can resend or revoke invitations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientInvites />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="client-status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Status</CardTitle>
                <CardDescription>
                  View and manage client onboarding status. Mark onboarding as complete when all steps are finished.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ClientStatus />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Templates</CardTitle>
                <CardDescription>
                  Manage your client onboarding templates to customize the journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OnboardingTemplateManager />
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
