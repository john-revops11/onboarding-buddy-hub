
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, X, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const addonSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Price must be a valid number",
  }),
  tags: z.array(z.string()),
});

type AddonFormValues = z.infer<typeof addonSchema>;

interface AddonFormProps {
  initialData?: AddonFormValues;
  isEditing?: boolean;
}

export function AddonForm({ initialData, isEditing = false }: AddonFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const defaultValues: AddonFormValues = initialData || {
    name: "",
    description: "",
    price: "",
    tags: [],
  };

  const form = useForm<AddonFormValues>({
    resolver: zodResolver(addonSchema),
    defaultValues,
  });

  const tags = form.watch("tags");

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues("tags");
      if (!currentTags.includes(tagInput.trim())) {
        form.setValue("tags", [...currentTags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((t) => t !== tag)
    );
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const onSubmit = async (data: AddonFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert price string to number
      const numericPrice = parseFloat(data.price);
      
      // Prepare data for insertion/update
      const addonData = {
        name: data.name,
        description: data.description,
        price: numericPrice,
        tags: data.tags,
      };
      
      let result;
      
      if (isEditing && initialData) {
        // Update existing addon
        const { data: updatedData, error } = await supabase
          .from('addons')
          .update(addonData)
          .eq('name', initialData.name)
          .select();
          
        if (error) throw error;
        result = updatedData;
      } else {
        // Insert new addon
        const { data: insertedData, error } = await supabase
          .from('addons')
          .insert(addonData)
          .select();
          
        if (error) throw error;
        result = insertedData;
      }
      
      console.log("Add-on saved:", result);
      
      toast({
        title: `Add-on ${isEditing ? "updated" : "created"} successfully`,
        description: `${data.name} add-on has been ${isEditing ? "updated" : "created"}.`,
      });
      
      // Navigate back to add-ons list
      navigate("/admin/addons");
    } catch (error) {
      console.error("Error submitting add-on:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} add-on. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add-on Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Weekly Reports" {...field} />
              </FormControl>
              <FormDescription>
                The name of the add-on service
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what this add-on offers"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description of the add-on service
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="49.99" {...field} />
              </FormControl>
              <FormDescription>
                Monthly add-on price
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      size={14}
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter tag (e.g., reporting, premium)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addTag}
                >
                  <Plus size={16} />
                </Button>
              </div>
              <FormDescription>
                Categories or tags to organize add-ons
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/addons")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-primary-700 text-white hover:bg-primary-600">
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Save size={18} className="mr-1" />
                {isEditing ? "Update Add-on" : "Save Add-on"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
