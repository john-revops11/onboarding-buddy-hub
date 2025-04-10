
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { ClientOnboardingForm } from "@/components/admin/onboarding/ClientOnboardingForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const AdminOnboardingPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Onboard New Client</h1>
        
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
      </div>
    </DashboardLayout>
  );
};

export default AdminOnboardingPage;
