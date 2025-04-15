
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { SubscriptionForm } from "@/components/admin/subscription/SubscriptionForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSubscriptionTiers } from "@/lib/subscription-management";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionTier } from "@/lib/types/client-types";

// Define a type for the formatted subscription data expected by the form
type FormattedSubscription = {
  id?: string;
  name: string;
  description?: string;
  price: string;  // SubscriptionForm expects price as string
  features: string[];
};

const EditSubscriptionPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<FormattedSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!id) {
        setLoading(false);
        setError("No subscription ID provided");
        return;
      }
      
      try {
        console.log("Fetching subscription data for ID:", id);
        const subscriptions = await getSubscriptionTiers();
        const subscriptionData = subscriptions.find(sub => sub.id === id);
        
        if (subscriptionData) {
          console.log("Found subscription data:", subscriptionData);
          
          // Format data for the form - convert price to string for the form
          const formattedData: FormattedSubscription = {
            id: subscriptionData.id,
            name: subscriptionData.name,
            description: subscriptionData.description,
            price: subscriptionData.price.toString(), // Convert number to string for the form
            features: subscriptionData.features || []
          };
          
          console.log("Formatted subscription data for form:", formattedData);
          setSubscription(formattedData);
        } else {
          console.error("Subscription not found for ID:", id);
          setError("Subscription not found");
          toast({
            title: "Error",
            description: "The requested subscription plan could not be found.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
        setError("Failed to load subscription details");
        toast({
          title: "Error",
          description: "Failed to load subscription details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [id, toast]);

  const handleUpdateSuccess = () => {
    console.log("Subscription update successful");
    toast({
      title: "Subscription Updated",
      description: "Subscription plan has been successfully updated.",
      variant: "success", // Using success variant for positive feedback
    });
    
    // Navigate back to subscriptions list after successful update
    navigate("/admin/subscriptions");
  };

  const handleUpdateError = (errorMsg: string) => {
    console.error("Update error:", errorMsg);
    toast({
      title: "Update Failed",
      description: errorMsg || "Failed to update subscription. Please try again.",
      variant: "destructive",
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <p>Loading subscription details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !subscription) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Subscription Not Found</h1>
          <p>{error || "The subscription plan you are looking for does not exist."}</p>
          <Button onClick={() => navigate("/admin/subscriptions")}>
            Return to Subscriptions
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Subscription Plan</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Edit {subscription.name} Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <SubscriptionForm 
              initialData={subscription} 
              isEditing={true}
              onUpdateSuccess={handleUpdateSuccess}
              onUpdateError={handleUpdateError}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditSubscriptionPage;
