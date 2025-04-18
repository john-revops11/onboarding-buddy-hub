import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClientFormSchema, ClientFormValues } from "@/components/admin/onboarding/formSchema";
import { updateClient } from "@/lib/client-management/client-update";
import { useToast } from "@/hooks/use-toast";

interface ClientEditModalProps {
  open: boolean;
  onClose: () => void;
  clientId: string;
  defaultValues: ClientFormValues;
  onUpdated: () => void;
}

export const ClientEditModal: React.FC<ClientEditModalProps> = ({
  open,
  onClose,
  clientId,
  defaultValues,
  onUpdated,
}) => {
  const { toast } = useToast();
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues,
  });

  const handleSubmit = async (values: ClientFormValues) => {
    try {
      await updateClient(clientId, values);
      toast({ title: "Client updated successfully." });
      onUpdated();
      onClose();
    } catch (error: any) {
      toast({
        title: "Failed to update client",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input {...form.register("email")} />
          </div>
          <div>
            <Label>Company Name</Label>
            <Input {...form.register("companyName")} />
          </div>
          <div>
            <Label>Contact Person</Label>
            <Input {...form.register("contactPerson")} />
          </div>
          <div>
            <Label>Position</Label>
            <Input {...form.register("position")} />
          </div>
          <div>
            <Label>Industry</Label>
            <Input {...form.register("industry")} />
          </div>
          <div>
            <Label>Company Size</Label>
            <Input {...form.register("companySize")} />
          </div>
          <Button type="submit">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default ClientEditModal;
