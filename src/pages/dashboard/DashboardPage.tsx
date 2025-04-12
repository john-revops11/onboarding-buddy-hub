
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressOverview } from "@/components/dashboard/ProgressOverview";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { useAuth } from "@/contexts/auth-context";
import { 
  isOnboardingComplete, 
  skipOnboarding, 
  getClientStatus, 
  getPendingNotifications,
  addNotification
} from "@/utils/onboardingUtils";
import { DashboardBanner } from "@/components/dashboard/DashboardBanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const DashboardPage = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const user = state.user;
  const [completedItems, setCompletedItems] = useState(2);
  const [totalItems, setTotalItems] = useState(6);
  const [clientStatus, setClientStatus] = useState(getClientStatus());
  
  // Check if we should redirect to onboarding
  useEffect(() => {
    const onboardingComplete = isOnboardingComplete();
    
    // If onboarding is not complete and client status is pending
    if (!onboardingComplete && clientStatus === 'pending') {
      navigate('/onboarding');
    }
  }, [navigate, clientStatus]);
  
  // Skip onboarding on load for demo purposes
  // In a real app, this would be based on client state
  useEffect(() => {
    if (!isOnboardingComplete()) {
      skipOnboarding();
    }
  }, []);
  
  // Add a welcome notification when dashboard is first loaded (demo purpose)
  useEffect(() => {
    const notifications = getPendingNotifications();
    
    // Only add welcome notification if there are no notifications yet
    if (notifications.length === 0) {
      addNotification({
        title: "Welcome to the Dashboard",
        message: "Your onboarding process has been started. Complete all steps to get started.",
        type: "info"
      });
      
      // Add additional demo notifications
      setTimeout(() => {
        addNotification({
          title: "New Team Member Invited",
          message: "You've successfully invited a team member to join your workspace.",
          type: "success"
        });
      }, 15000);
      
      setTimeout(() => {
        addNotification({
          title: "Onboarding Step Completed",
          message: "You've completed the Account Setup step. 5 more steps to go!",
          type: "success"
        });
      }, 30000);
    }
  }, []);
  
  // Calculate progress percentage
  const progress = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <DashboardLayout>
        <div className="space-y-6">
          <DashboardBanner 
            userName={user?.name || "User"} 
            userRole={user?.role || "Member"}
          />
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-semibold">Progress Overview</CardTitle>
                <Badge variant="success" className="ml-2">Active</Badge>
              </CardHeader>
              <CardContent className="pt-2">
                <ProgressOverview 
                  progress={progress} 
                  completedItems={completedItems} 
                  totalItems={totalItems} 
                />
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-sm"
                    onClick={() => navigate('/onboarding')}
                  >
                    View Onboarding Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <QuickActions />
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </div>
  );
};

export default DashboardPage;
