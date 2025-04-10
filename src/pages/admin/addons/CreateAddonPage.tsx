
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { AddonForm } from "@/components/admin/addon/AddonForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CreateAddonPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Create Add-on</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>New Add-on Details</CardTitle>
          </CardHeader>
          <CardContent>
            <AddonForm />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateAddonPage;
