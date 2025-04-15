
import { useState, useEffect } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { SubscriptionAnalytics } from "@/components/admin/subscription/SubscriptionAnalytics";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { getSubscriptionTiers } from "@/lib/subscription-management";
import { getAddons } from "@/lib/addon-management";

// These would come from an API endpoint in a real app
const mockAnalytics = {
  subscriptions: [
    { id: "1", name: "Basic", count: 45, revenue: 2250, color: "#4ade80" },
    { id: "2", name: "Premium", count: 32, revenue: 3200, color: "#f97316" },
    { id: "3", name: "Enterprise", count: 18, revenue: 2700, color: "#8b5cf6" },
  ],
  addons: [
    { id: "1", name: "Advanced Analytics", count: 24, revenue: 1200, color: "#06b6d4" },
    { id: "2", name: "Priority Support", count: 37, revenue: 925, color: "#f43f5e" },
    { id: "3", name: "Custom Integrations", count: 12, revenue: 1800, color: "#eab308" },
    { id: "4", name: "Extended Storage", count: 28, revenue: 560, color: "#6366f1" },
  ]
};

export default function SubscriptionAnalyticsPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [subscriptionData, setSubscriptionData] = useState(mockAnalytics.subscriptions);
  const [addonData, setAddonData] = useState(mockAnalytics.addons);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real application, this would fetch actual analytics data
        // Instead, we'll use mock data with real subscription/addon names
        const [subscriptions, addons] = await Promise.all([
          getSubscriptionTiers(),
          getAddons()
        ]);
        
        // Map real subscription names to our mock data
        if (subscriptions.length > 0) {
          const updatedSubscriptionData = mockAnalytics.subscriptions.map((item, index) => {
            const sub = subscriptions[index % subscriptions.length];
            return {
              ...item,
              id: sub.id,
              name: sub.name
            };
          });
          setSubscriptionData(updatedSubscriptionData);
        }
        
        // Map real addon names to our mock data
        if (addons.length > 0) {
          const updatedAddonData = mockAnalytics.addons.map((item, index) => {
            const addon = addons[index % addons.length];
            return {
              ...item,
              id: addon.id,
              name: addon.name
            };
          });
          setAddonData(updatedAddonData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const exportAnalytics = () => {
    // Mock export functionality
    alert("Exporting analytics data...");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subscription Analytics</h1>
            <p className="text-muted-foreground">
              Monitor performance of your subscription plans and add-ons
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <CalendarIcon className="h-4 w-4" />
                  <span>{format(date, "MMMM yyyy")}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  defaultMonth={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={exportAnalytics}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-80">
            <p>Loading analytics data...</p>
          </div>
        ) : (
          <SubscriptionAnalytics 
            subscriptionData={subscriptionData} 
            addonData={addonData} 
          />
        )}
      </div>
    </DashboardLayout>
  );
}
