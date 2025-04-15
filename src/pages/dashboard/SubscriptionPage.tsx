
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { CreditCard, LifeBuoy, Settings, Package } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import SubscriptionDetails from "@/components/dashboard/SubscriptionDetails";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function SubscriptionPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("subscription");
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Mock data for now - would be replaced with actual client data
          setUserData({
            subscriptionId: "subscription-id-here",
            addonIds: ["addon-id-1", "addon-id-2"],
            billingEmail: user.email,
            nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            paymentMethod: "Visa ending in 4242"
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
          <p className="text-muted-foreground">
            Manage your subscription, billing details, and add-ons
          </p>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden md:inline-block">Subscription</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden md:inline-block">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center gap-2">
              <LifeBuoy className="h-4 w-4" />
              <span className="hidden md:inline-block">Support</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline-block">Settings</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="subscription" className="space-y-4">
            <SubscriptionDetails 
              currentSubscriptionId={userData?.subscriptionId}
              currentAddonIds={userData?.addonIds}
              isReadOnly={false}
            />
          </TabsContent>
          
          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Manage your billing details and payment methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <p>Loading billing information...</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-2">Billing Contact</h3>
                        <p className="text-sm">{userData?.billingEmail}</p>
                        <Button variant="link" className="p-0 h-auto text-brand">
                          Change billing email
                        </Button>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Next Billing Date</h3>
                        <p className="text-sm">
                          {userData?.nextBillingDate 
                            ? new Date(userData.nextBillingDate).toLocaleDateString()
                            : 'Not available'}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Payment Method</h3>
                        <p className="text-sm">{userData?.paymentMethod || 'No payment method on file'}</p>
                        <Button variant="link" className="p-0 h-auto text-brand">
                          Update payment method
                        </Button>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Billing Address</h3>
                        <p className="text-sm">No billing address on file</p>
                        <Button variant="link" className="p-0 h-auto text-brand">
                          Add billing address
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="font-medium mb-2">Invoice History</h3>
                      <p className="text-sm text-muted-foreground">No invoices available yet</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="support" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Support</CardTitle>
                <CardDescription>Get help with your subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-2 hover:border-brand hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle className="text-lg">Contact Support</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">Need help with your subscription? Our support team is here to help.</p>
                      <Button variant="brand">Contact Support</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 hover:border-brand hover:shadow-md transition-all">
                    <CardHeader>
                      <CardTitle className="text-lg">Subscription FAQ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">Find answers to common questions about subscriptions and billing.</p>
                      <Button variant="outline" className="border-brand text-brand hover:bg-brand-50">
                        View FAQ
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Settings</CardTitle>
                <CardDescription>Manage your subscription preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Email Notifications</h3>
                    <p className="text-sm mb-2">Receive email notifications about your subscription</p>
                    <div className="flex space-x-4">
                      <Button variant="outline" className="border-brand text-brand hover:bg-brand-50">
                        Manage Email Preferences
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="font-medium mb-2 text-red-600">Cancel Subscription</h3>
                    <p className="text-sm mb-2">
                      Canceling your subscription will end all services at the end of your current billing period.
                    </p>
                    <Button variant="destructive">Cancel Subscription</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
