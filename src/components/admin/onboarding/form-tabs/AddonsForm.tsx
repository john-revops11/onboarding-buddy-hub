
import { UseFormReturn } from "react-hook-form";
import { CardContent } from "@/components/ui/card";
import { FormLabel, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ClientFormValues } from "../formSchema";
import { memo } from "react";

interface AddonsFormProps {
  form: UseFormReturn<ClientFormValues>;
  addons: any[];
  selectedAddons: string[];
  toggleAddon: (addonId: string) => void;
}

function AddonsForm({ form, addons, selectedAddons, toggleAddon }: AddonsFormProps) {
  // Ensure selectedAddons is always an array
  const safeSelectedAddons = Array.isArray(selectedAddons) ? selectedAddons : [];
  
  return (
    <CardContent className="pt-6">
      <FormLabel>Available Add-ons</FormLabel>
      <FormDescription className="mb-4">
        Select any additional services for this client
      </FormDescription>

      <div className="space-y-2">
        {addons.map((addon) => {
          const isSelected = safeSelectedAddons.includes(addon.id);
          
          return (
            <div
              key={addon.id}
              className={`flex items-start space-x-3 p-4 border rounded-md ${
                isSelected ? "border-primary bg-primary/5" : "border-gray-200"
              }`}
            >
              <Checkbox
                id={`addon-${addon.id}`}
                checked={isSelected}
                onCheckedChange={() => toggleAddon(addon.id)}
                className="mt-1"
              />
              
              <div className="flex-1">
                <label 
                  htmlFor={`addon-${addon.id}`}
                  className="font-medium cursor-pointer flex items-center"
                >
                  {addon.name} - ${addon.price}
                </label>
                <p className="text-sm text-muted-foreground mt-1">
                  {addon.description}
                </p>
                {addon.tags && addon.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {addon.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </CardContent>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(AddonsForm);
