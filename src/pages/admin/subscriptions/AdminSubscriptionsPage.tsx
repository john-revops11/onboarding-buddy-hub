
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

const AdminSubscriptionsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState(MOCK_SUBSCRIPTIONS);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<string | null>(null);

  const handleDeleteSubscription = (id: string) => {
    // In a real implementation, this would call an API endpoint
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
    
    toast({
      title: "Subscription deleted",
      description: "The subscription has been removed successfully.",
    });
    
    setSubscriptionToDelete(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
          <Button
            onClick={() => navigate("/admin/subscriptions/create")}
            className="flex items-center gap-2"
          >
            <Plus size={18} /> New Subscription
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Subscription Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">{subscription.name}</TableCell>
                    <TableCell>{subscription.description}</TableCell>
                    <TableCell>${subscription.price}/mo</TableCell>
                    <TableCell>
                      <div className="max-w-[300px] truncate">
                        {subscription.features.join(", ")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/admin/subscriptions/edit/${subscription.id}`)}
                        >
                          <Edit size={16} />
                        </Button>
                        
                        <AlertDialog open={subscriptionToDelete === subscription.id} onOpenChange={(isOpen) => {
                          if (!isOpen) setSubscriptionToDelete(null);
                        }}>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setSubscriptionToDelete(subscription.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Subscription Plan</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the "{subscription.name}" plan? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground"
                                onClick={() => handleDeleteSubscription(subscription.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminSubscriptionsPage;
