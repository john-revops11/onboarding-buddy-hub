import { UseFormReturn } from "react-hook-form";
import { ClientFormValues } from "../formSchema";
import { CardContent } from "@/components/ui/card";

type AddonsFormProps = {
  form: UseFormReturn<ClientFormValues>;
  addons: { id: string; name: string; price: number }[];
  selectedAddons: string[];
  toggleAddon: (addonId: string) => void;
};

export default function AddonsForm({
  form,
  addons,
  selectedAddons,
  toggleAddon,
}: AddonsFormProps) {
  return (
    <CardContent className="pt-6 space-y-4">
      <ul className="space-y-3">
        {addons.map((addon) => {
          const checked = selectedAddons.includes(addon.id);
          return (
            <li key={addon.id}>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAddon(addon.id)}
                  className="form-checkbox h-5 w-5 text-primary border-gray-300"
                />
                <span className="text-sm">
                  {addon.name} - ${addon.price}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </CardContent>
  );
}
