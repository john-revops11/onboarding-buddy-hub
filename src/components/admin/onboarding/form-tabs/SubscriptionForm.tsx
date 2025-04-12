
import { UseFormReturn } from "react-hook-form";
import { CardContent } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClientFormValues } from "../formSchema";

interface SubscriptionFormProps {
  form: UseFormReturn<ClientFormValues>;
  subscriptions: any[];
}

export default function SubscriptionForm({ form, subscriptions }: SubscriptionFormProps) {
  return (
    <CardContent className="pt-6">
      <FormField
        control={form.control}
        name="subscriptionTierId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subscription Tier *</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subscription tier" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {subscriptions.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id}>
                    {sub.name} - ${sub.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Choose the subscription plan for this client
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  );
}
