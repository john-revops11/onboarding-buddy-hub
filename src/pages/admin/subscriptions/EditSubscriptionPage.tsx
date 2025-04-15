
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

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        const subscriptions = await getSubscriptionTiers();
        const subscriptionData = subscriptions.find(sub => sub.id === id);
        
        if (subscriptionData) {
          // Format data for the form - convert price to string for the form
          const formattedData: FormattedSubscription = {
            id: subscriptionData.id,
            name: subscriptionData.name,
            description: subscriptionData.description,
            price: subscriptionData.price.toString(), // Convert number to string for the form
            features: subscriptionData.features || []
          };
          
          setSubscription(formattedData);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <p>Loading subscription details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!subscription) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Subscription Not Found</h1>
          <p>The subscription plan you are looking for does not exist.</p>
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
            <SubscriptionForm initialData={subscription} isEditing />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditSubscriptionPage;
