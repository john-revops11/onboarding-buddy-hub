
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Save } from "lucide-react";
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
import { createAddon, updateAddon } from "@/lib/addon-management";

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
  initialData?: AddonFormValues & { id?: string };
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
    if (tagInput.trim() === "") return;
    
    const currentTags = form.getValues("tags");
    // Prevent duplicate tags
    if (!currentTags.includes(tagInput.trim())) {
      form.setValue("tags", [...currentTags, tagInput.trim()]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((t) => t !== tag)
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
      
      if (isEditing && initialData?.id) {
        // Update existing addon
        result = await updateAddon(initialData.id, addonData);
      } else {
        // Insert new addon
        result = await createAddon(addonData);
      }
      
      if (!result) {
        throw new Error("Failed to save addon");
      }
      
      console.log("Addon saved:", result);
      
      toast({
        title: `Add-on ${isEditing ? "updated" : "created"} successfully`,
        description: `${data.name} add-on has been ${isEditing ? "updated" : "created"}.`,
      });
      
      // Navigate back to addons list
      navigate("/admin/addons");
    } catch (error) {
      console.error("Error submitting addon:", error);
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
                <Input placeholder="99.99" {...field} />
              </FormControl>
              <FormDescription>
                Monthly add-on price
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Tags</FormLabel>
          <FormDescription>
            Add tags to categorize this add-on (e.g., reporting, analytics)
          </FormDescription>
          
          <div className="flex gap-2">
            <Input 
              placeholder="Enter a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={addTag}
              className="flex items-center gap-1"
            >
              <Plus size={16} /> Add
            </Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-xs hover:text-destructive"
                  >
                    <Trash2 size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

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
