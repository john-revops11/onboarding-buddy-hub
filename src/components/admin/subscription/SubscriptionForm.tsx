
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
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
import { createSubscriptionTier, updateSubscriptionTier } from "@/lib/subscription-management";

const subscriptionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Price must be a valid non-negative number",
  }),
  features: z.array(z.string()).min(1, "Add at least one feature"),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  initialData?: SubscriptionFormValues & { id?: string };
  isEditing?: boolean;
  onUpdateSuccess?: () => void;
  onUpdateError?: (errorMsg: string) => void;
}

export function SubscriptionForm({ 
  initialData, 
  isEditing = false,
  onUpdateSuccess,
  onUpdateError 
}: SubscriptionFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  console.log("SubscriptionForm initialized with initialData:", initialData);
  console.log("isEditing:", isEditing);

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

  // Watch for form changes to enable/disable submit button
  useEffect(() => {
    const subscription = form.watch();
    
    if (initialData) {
      const changed = 
        subscription.name !== initialData.name ||
        subscription.description !== initialData.description ||
        subscription.price !== initialData.price ||
        JSON.stringify(subscription.features) !== JSON.stringify(initialData.features);
      
      console.log("Form change detected:", {
        current: subscription,
        initial: initialData,
        hasChanges: changed
      });
      
      setHasChanges(changed);
    } else {
      const filled = 
        subscription.name.trim() !== "" &&
        subscription.description.trim() !== "" &&
        subscription.price !== "" &&
        subscription.features.some(f => f.trim() !== "");
      
      setHasChanges(filled);
    }
  }, [form.watch(), initialData]);

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
    console.log("Form submitted with data:", data);
    
    try {
      const numericPrice = parseFloat(data.price);
      
      // Filter out empty features
      const filteredFeatures = data.features.filter(f => f.trim() !== "");
      
      const subscriptionData = {
        name: data.name,
        description: data.description,
        price: numericPrice,
        features: filteredFeatures
      };
      
      let result;
      
      if (isEditing && initialData?.id) {
        console.log("Updating subscription:", initialData.id, subscriptionData);
        result = await updateSubscriptionTier(initialData.id, subscriptionData);
      } else {
        console.log("Creating subscription:", subscriptionData);
        result = await createSubscriptionTier(subscriptionData);
      }
      
      if (!result) {
        const errorMsg = `Failed to ${isEditing ? 'update' : 'create'} subscription`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log("Subscription saved successfully:", result);
      
      // Show success toast
      toast({
        title: `Subscription ${isEditing ? "updated" : "created"} successfully`,
        description: `${data.name} subscription has been ${isEditing ? "updated" : "created"}.`,
        variant: "success",
      });
      
      // Call success callback if provided
      if (isEditing && onUpdateSuccess) {
        onUpdateSuccess();
      } else {
        navigate("/admin/subscriptions");
      }
    } catch (error) {
      console.error("Error submitting subscription:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      // Show error toast
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? "update" : "create"} subscription. ${errorMessage}`,
        variant: "destructive",
      });
      
      // Call error callback if provided
      if (isEditing && onUpdateError) {
        onUpdateError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-6 bg-soft-purple p-6 rounded-lg shadow-md"
      >
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

        <div className="flex justify-end gap-4 pt-4 border-t border-neutral-200">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/subscriptions")}
            className="flex items-center gap-2 text-primary-700 hover:bg-primary-50"
          >
            <ArrowLeft size={16} /> Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || !hasChanges} 
            className={`
              bg-brand-600 
              text-white 
              hover:bg-brand-700 
              focus:ring-2 
              focus:ring-brand-500 
              focus:ring-offset-2
              ${!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isSubmitting ? (
              "Saving..."
            ) : (
              <>
                <Save size={16} className="mr-1" />
                {isEditing ? "Save Changes" : "Create Subscription"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
