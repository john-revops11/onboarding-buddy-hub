
import { UseFormReturn } from "react-hook-form";
import { CardContent } from "@/components/ui/card";
import { FormLabel, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ClientFormValues } from "../formSchema";

interface AddonsFormProps {
  form: UseFormReturn<ClientFormValues>;
  addons: any[];
  selectedAddons: string[];
  toggleAddon: (addonId: string) => void;
}

export default function AddonsForm({ form, addons, selectedAddons, toggleAddon }: AddonsFormProps) {
  return (
    <CardContent className="pt-6">
      <FormLabel>Available Add-ons</FormLabel>
      <FormDescription className="mb-4">
        Select any additional services for this client
      </FormDescription>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addons.map((addon) => (
          <div
            key={addon.id}
            className={`border rounded-md p-4 cursor-pointer transition-colors ${
              selectedAddons.includes(addon.id)
                ? "border-primary bg-primary/10"
                : "hover:border-muted-foreground"
            }`}
            onClick={() => toggleAddon(addon.id)}
          >
            <div className="flex items-start gap-3">
              {/* The issue was here - the checkbox's onCheckedChange was calling a function 
                  that was updating state, but we're already handling this in the div's onClick */}
              <Checkbox
                checked={selectedAddons.includes(addon.id)}
                id={`addon-${addon.id}`}
                // Remove the onCheckedChange handler as it's redundant with the parent div onClick
              />
              <div>
                <p className="font-medium">{addon.name} - ${addon.price}</p>
                <p className="text-sm text-muted-foreground">
                  {addon.description}
                </p>
                {addon.tags && addon.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {addon.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  );
}
