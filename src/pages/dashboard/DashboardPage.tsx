
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
import { ChevronRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

const DashboardPage = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const user = state.user;
  const [completedItems, setCompletedItems] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [clientStatus, setClientStatus] = useState(getClientStatus());
  const [isLoading, setIsLoading] = useState(true);
  
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
    }
  }, []);
  
  // Fetch real checklist data
  useEffect(() => {
    const fetchChecklistData = async () => {
      setIsLoading(true);
      try {
        if (!user?.id) return;
        
        // Get client ID for the current user
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('id')
          .eq('email', user.email)
          .single();
        
        if (clientError) throw clientError;
        
        if (!clientData?.id) {
          setTotalItems(0);
          setCompletedItems(0);
          return;
        }
        
        // Get checklist items for the client
        const { data: checklistData, error: checklistError } = await supabase
          .from('client_checklists')
          .select(`
            checklist_id,
            completed,
            checklist:checklists(
              id,
              title
            )
          `)
          .eq('client_id', clientData.id);
        
        if (checklistError) throw checklistError;
        
        if (checklistData && checklistData.length > 0) {
          setTotalItems(checklistData.length);
          setCompletedItems(checklistData.filter(item => item.completed).length);
        } else {
          setTotalItems(0);
          setCompletedItems(0);
        }
      } catch (error) {
        console.error("Error fetching checklist data:", error);
        setTotalItems(0);
        setCompletedItems(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChecklistData();
  }, [user]);
  
  // Calculate progress percentage
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <DashboardBanner 
          userName={user?.name || "User"} 
          userRole={user?.role || "Member"}
        />
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg md:text-xl font-semibold">Progress Overview</CardTitle>
              <Badge variant="success" className="ml-2">Active</Badge>
            </CardHeader>
            <CardContent className="pt-2">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : totalItems > 0 ? (
                <ProgressOverview 
                  progress={progress} 
                  completedItems={completedItems} 
                  totalItems={totalItems} 
                />
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No progress items available</p>
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <motion.div
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-sm focus:ring-4 focus:ring-accentGreen-600/40 px-4 py-2"
                    onClick={() => navigate('/onboarding')}
                  >
                    <span className="mr-2">View Onboarding Details</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg md:text-xl font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <QuickActions />
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default DashboardPage;
