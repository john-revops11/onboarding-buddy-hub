
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
import { Input } from "@/components/ui/input";
import { ClientFormValues } from "../formSchema";

interface ClientInfoFormProps {
  form: UseFormReturn<ClientFormValues>;
}

export default function ClientInfoForm({ form }: ClientInfoFormProps) {
  return (
    <CardContent className="pt-6 space-y-4">
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Client Email *</FormLabel>
            <FormControl>
              <Input placeholder="client@company.com" {...field} />
            </FormControl>
            <FormDescription>
              Primary contact email for the client
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input placeholder="Acme Corp" {...field} />
            </FormControl>
            <FormDescription>
              Client's company or organization name (optional)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  );
}
