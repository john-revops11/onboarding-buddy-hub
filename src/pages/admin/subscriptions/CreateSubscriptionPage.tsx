
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { SubscriptionForm } from "@/components/admin/subscription/SubscriptionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CreateSubscriptionPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Create Subscription Plan</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>New Subscription Details</CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriptionForm />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateSubscriptionPage;
