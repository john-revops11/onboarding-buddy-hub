
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { SubscriptionForm } from "@/components/admin/subscription/SubscriptionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data - this would come from an API in a real implementation
const MOCK_SUBSCRIPTIONS = [
  {
    id: "1",
    name: "Basic",
    description: "Essential features for small businesses",
    price: "99.99",
    features: ["Basic reporting", "3 team members", "1 project"],
  },
  {
    id: "2",
    name: "Professional",
    description: "Advanced features for growing businesses",
    price: "199.99",
    features: [
      "Advanced reporting",
      "10 team members",
      "5 projects",
      "API access",
    ],
  },
  {
    id: "3",
    name: "Enterprise",
    description: "Complete solution for large organizations",
    price: "399.99",
    features: [
      "Custom reporting",
      "Unlimited team members",
      "Unlimited projects",
      "API access",
      "Dedicated support",
    ],
  },
];

const EditSubscriptionPage = () => {
  const { id } = useParams<{ id: string }>();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would be an API call
    const fetchSubscription = () => {
      const found = MOCK_SUBSCRIPTIONS.find((sub) => sub.id === id);
      
      if (found) {
        setSubscription(found);
      }
      
      setLoading(false);
    };

    fetchSubscription();
  }, [id]);

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
          <p>Subscription not found.</p>
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
