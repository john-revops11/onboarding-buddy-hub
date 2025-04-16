import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchClientDetails, updateClientDetails } from "@/lib/client-management/details"; // <-- Fetching and Updating Functions
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"; // <-- Editable Input Component

// Define form state type
interface FormState {
  email: string;
  phone: string;
  address: string;
  industry: string;
  companySize: string;
  // Add any other fields you want editable
}

const ClientDetailPage = () => {
  const { clientId } = useParams();
  const { data: clientData, isLoading, isError } = useQuery(
    ["client-details", clientId],
    () => fetchClientDetails(clientId!),
    { enabled: !!clientId }
  );

  const [formState, setFormState] = useState<FormState>({
    email: clientData?.email || "",
    phone: clientData?.phone || "",
    address: clientData?.address || "",
    industry: clientData?.industry || "",
    companySize: clientData?.companySize || "",
  });

  const handleSave = async () => {
    const result = await updateClientDetails(clientId!, formState);
    if (result.success) {
      toast({ title: "Success", description: "Client updated." });
    } else {
      toast({ title: "Error", description: result.error?.message, variant: "destructive" });
    }
  };

  // Loading state and error handling
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching client details.</div>;

  return (
    <DashboardLayout>
      <div className="space-y-5 bg-neutral-50 p-5 min-h-screen">
        <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{clientData?.name}</h1>
            <p className="text-muted-foreground">Client ID: {clientData?.id}</p>
          </div>
        </div>

        <Card className="standard-card">
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Edit the details below.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </label>
                <Input
                  id="phone"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="address" className="text-sm font-medium">
                  Address
                </label>
                <Input
                  id="address"
                  value={formState.address}
                  onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="industry" className="text-sm font-medium">
                  Industry
                </label>
                <Input
                  id="industry"
                  value={formState.industry}
                  onChange={(e) => setFormState({ ...formState, industry: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="companySize" className="text-sm font-medium">
                  Company Size
                </label>
                <Input
                  id="companySize"
                  value={formState.companySize}
                  onChange={(e) => setFormState({ ...formState, companySize: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-3 flex justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ClientDetailPage;
