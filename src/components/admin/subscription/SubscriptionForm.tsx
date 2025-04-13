
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
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const subscriptionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Price must be a valid number",
  }),
  features: z.array(z.string()).min(1, "Add at least one feature"),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  initialData?: SubscriptionFormValues;
  isEditing?: boolean;
}

export function SubscriptionForm({ initialData, isEditing = false }: SubscriptionFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultValues: SubscriptionFormValues = initialData || {
    name: "",
    description: "",
    price: "",
    features: [""],
  };

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues,
  });

  const features = form.watch("features");

  const addFeature = () => {
    const currentFeatures = form.getValues("features");
    form.setValue("features", [...currentFeatures, ""]);
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues("features");
    if (currentFeatures.length > 1) {
      form.setValue(
        "features",
        currentFeatures.filter((_, i) => i !== index)
      );
    }
  };

  const onSubmit = async (data: SubscriptionFormValues) => {
    setIsSubmitting(true);
    try {
      // Convert price string to number
      const numericPrice = parseFloat(data.price);
      
      // Prepare data for insertion/update
      const subscriptionData = {
        name: data.name,
        description: data.description,
        price: numericPrice,
        // Features are stored as part of the subscription in a real implementation
        // Here we're just logging them as they would typically be in a separate table
        // or as a JSON field
      };
      
      let result;
      
      if (isEditing && initialData) {
        // Update existing subscription
        const { data: updatedData, error } = await supabase
          .from('subscriptions')
          .update(subscriptionData)
          .eq('name', initialData.name)
          .select();
          
        if (error) throw error;
        result = updatedData;
      } else {
        // Insert new subscription
        const { data: insertedData, error } = await supabase
          .from('subscriptions')
          .insert(subscriptionData)
          .select();
          
        if (error) throw error;
        result = insertedData;
      }
      
      console.log("Subscription saved:", result);
      
      toast({
        title: `Subscription ${isEditing ? "updated" : "created"} successfully`,
        description: `${data.name} subscription has been ${isEditing ? "updated" : "created"}.`,
      });
      
      // Navigate back to subscriptions list
      navigate("/admin/subscriptions");
    } catch (error) {
      console.error("Error submitting subscription:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} subscription. Please try again.`,
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
              <FormLabel>Subscription Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Basic Plan" {...field} />
              </FormControl>
              <FormDescription>
                The name of the subscription tier
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
                  placeholder="Describe what this subscription offers"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description of the subscription tier
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
                Monthly subscription price
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel>Features</FormLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFeature}
              className="flex items-center gap-1"
            >
              <Plus size={16} /> Add Feature
            </Button>
          </div>

          {features.map((_, index) => (
            <div key={index} className="flex gap-2">
              <FormField
                control={form.control}
                name={`features.${index}`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Feature description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeFeature(index)}
                disabled={features.length <= 1}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/subscriptions")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-primary-700 text-white hover:bg-primary-600">
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Save size={18} className="mr-1" />
                {isEditing ? "Update Subscription" : "Save Subscription"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
