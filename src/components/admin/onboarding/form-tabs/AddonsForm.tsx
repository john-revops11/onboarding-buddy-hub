
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
  // Function to handle addon selection via click
  const handleAddonClick = (addonId: string) => (e: React.MouseEvent) => {
    // Prevent default behavior to avoid any unintended actions
    e.preventDefault();
    // Call the toggleAddon function from props
    toggleAddon(addonId);
  };

  return (
    <CardContent className="pt-6">
      <FormLabel>Available Add-ons</FormLabel>
      <FormDescription className="mb-4">
        Select any additional services for this client
      </FormDescription>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addons.map((addon) => {
          // Ensure selectedAddons is always treated as an array
          const safeSelectedAddons = Array.isArray(selectedAddons) ? selectedAddons : [];
          const isSelected = safeSelectedAddons.includes(addon.id);
          
          return (
            <div
              key={addon.id}
              className={`border rounded-md p-4 cursor-pointer transition-colors ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : "hover:border-muted-foreground"
              }`}
              onClick={handleAddonClick(addon.id)}
              aria-label={`Select ${addon.name} addon`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Checkbox
                    id={`addon-${addon.id}`}
                    checked={isSelected}
                    readOnly={true}
                    className="pointer-events-none data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                </div>
                
                <div className="flex-1">
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
          );
        })}
      </div>
    </CardContent>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(AddonsForm);
