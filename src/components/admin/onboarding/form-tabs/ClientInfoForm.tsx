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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ClientFormValues } from "../formSchema";

interface ClientInfoFormProps {
  form: UseFormReturn<ClientFormValues>;
}

export default function ClientInfoForm({ form }: ClientInfoFormProps) {
  return (
    <CardContent className="pt-6 space-y-4">
      {/* Email */}
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

      {/* Company Name */}
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

      {/* Contact Person */}
      <FormField
        control={form.control}
        name="contactPerson"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Person</FormLabel>
            <FormControl>
              <Input placeholder="Full name of primary contact" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Position */}
      <FormField
        control={form.control}
        name="position"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Position</FormLabel>
            <FormControl>
              <Input placeholder="e.g. CEO, VP of Ops" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Industry */}
      <FormField
        control={form.control}
        name="industry"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Industry</FormLabel>
            <FormControl>
              <Input placeholder="e.g. SaaS, Healthcare, Finance" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Company Size */}
      <FormField
        control={form.control}
        name="companySize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Size</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1-10">1–10 employees</SelectItem>
                <SelectItem value="11-50">11–50 employees</SelectItem>
                <SelectItem value="51-250">51–250 employees</SelectItem>
                <SelectItem value="251-1000">251–1000 employees</SelectItem>
                <SelectItem value="1001+">1001+ employees</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  );
}
