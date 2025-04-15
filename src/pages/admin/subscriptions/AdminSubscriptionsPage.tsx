
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
import { getSubscriptionTiers, deleteSubscriptionTier } from "@/lib/subscription-management";
import { SubscriptionTier } from "@/lib/types/client-types";

const AdminSubscriptionsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscriptions, setSubscriptions] = useState<SubscriptionTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionToDelete, setSubscriptionToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const subscriptionData = await getSubscriptionTiers();
      setSubscriptions(subscriptionData);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
      toast({
        title: "Error",
        description: "Failed to load subscription plans. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    try {
      setIsDeleting(true);
      const success = await deleteSubscriptionTier(id);
      
      if (!success) throw new Error("Failed to delete subscription");
      
      // Update the local state
      setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
      
      toast({
        title: "Subscription deleted",
        description: "The subscription has been removed successfully.",
      });
      
      setSubscriptionToDelete(null);
    } catch (error) {
      console.error("Error deleting subscription:", error);
      toast({
        title: "Error",
        description: "Failed to delete subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
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
            {isLoading ? (
              <div className="text-center py-4">Loading subscription plans...</div>
            ) : subscriptions.length === 0 ? (
              <div className="text-center py-4">
                No subscription plans found. Add your first subscription plan!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscriptions.map((subscription) => (
                    <TableRow key={subscription.id}>
                      <TableCell className="font-medium">{subscription.name}</TableCell>
                      <TableCell>{subscription.description}</TableCell>
                      <TableCell>${subscription.price}/mo</TableCell>
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
                                  disabled={isDeleting}
                                >
                                  {isDeleting ? "Deleting..." : "Delete"}
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
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminSubscriptionsPage;
