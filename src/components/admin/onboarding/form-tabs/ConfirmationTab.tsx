
import { UseFormReturn } from "react-hook-form";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClientFormValues } from "../formSchema";

interface ConfirmationTabProps {
  form: UseFormReturn<ClientFormValues>;
  subscriptions: any[];
  addons: any[];
  selectedAddons: string[];
}

export default function ConfirmationTab({ 
  form, 
  subscriptions, 
  addons, 
  selectedAddons 
}: ConfirmationTabProps) {
  return (
    <CardContent className="pt-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Client Information</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm text-muted-foreground">Email:</div>
          <div>{form.getValues("email")}</div>
          <div className="text-sm text-muted-foreground">Company:</div>
          <div>{form.getValues("companyName") || "Not specified"}</div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Subscription</h3>
        <div>
          {subscriptions.find(
            (s) => s.id === form.getValues("subscriptionId")
          )?.name || "None selected"}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Add-ons</h3>
        {selectedAddons.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedAddons.map((addonId) => (
              <Badge key={addonId} variant="secondary">
                {addons.find((a) => a.id === addonId)?.name}
              </Badge>
            ))}
          </div>
        ) : (
          <div>No add-ons selected</div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Team Members</h3>
        {form.getValues("teamMembers").length > 0 ? (
          <ul className="space-y-1">
            {form.getValues("teamMembers").map((member, index) => (
              <li key={index}>{member.email}</li>
            ))}
          </ul>
        ) : (
          <div>No team members added</div>
        )}
      </div>

      <div className="rounded-md bg-muted p-4">
        <p className="text-sm">
          An invitation email will be sent to the client and all team members
          upon submission.
        </p>
      </div>
    </CardContent>
  );
}
