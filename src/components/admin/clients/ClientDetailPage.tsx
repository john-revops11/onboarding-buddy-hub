import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Client } from "@/lib/types/client-types";
import { updateClient } from "@/lib/client-management/client-update";
import { ClientEditModal } from "./ClientEditModal";

interface ClientDetailPageProps {
  client: Client;
}

const ClientDetailPage: React.FC<ClientDetailPageProps> = ({ client }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [clientData, setClientData] = useState(client);
  const { toast } = useToast();

  const handleUpdate = async (values: Partial<Client>) => {
    const success = await updateClient(client.id, values);
    if (success) {
      setClientData({ ...clientData, ...values });
      setIsEditOpen(false);
      toast({
        title: "Client updated",
        description: "The client details were successfully updated.",
      });
    } else {
      toast({
        title: "Update failed",
        description: "Something went wrong while updating client details.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Client Details</CardTitle>
        <Button onClick={() => setIsEditOpen(true)}>Edit</Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <div><strong>Company:</strong> {clientData.companyName}</div>
        <div><strong>Email:</strong> {clientData.email}</div>
        <div><strong>Contact Person:</strong> {clientData.contactPerson}</div>
        <div><strong>Position:</strong> {clientData.position}</div>
        <div><strong>Industry:</strong> {clientData.industry}</div>
        <div><strong>Company Size:</strong> {clientData.companySize}</div>
        <div><strong>Subscription:</strong> {clientData.subscriptionId}</div>
        <div><strong>Status:</strong> {clientData.status}</div>
        <div><strong>Onboarding:</strong> {clientData.onboardingStatus}</div>
      </CardContent>

      <ClientEditModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        client={clientData}
        onSave={handleUpdate}
      />
    </Card>
  );
};

export default ClientDetailPage;
