
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ClientFormValues } from "../formSchema";

interface TeamMembersFormProps {
  form: UseFormReturn<ClientFormValues>;
}

export default function TeamMembersForm({ form }: TeamMembersFormProps) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "teamMembers",
  });

  return (
    <CardContent className="pt-6 space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel>Team Member Emails</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ email: "" })}
          className="flex items-center gap-1"
        >
          <Plus size={16} /> Add Team Member
        </Button>
      </div>
      <FormDescription>
        Add emails of team members who should have access
      </FormDescription>

      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2">
          <FormField
            control={form.control}
            name={`teamMembers.${index}.email`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input 
                    placeholder="team.member@company.com" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => {
              if (fields.length > 1) {
                remove(index);
              }
            }}
            disabled={fields.length <= 1}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ))}
    </CardContent>
  );
}
