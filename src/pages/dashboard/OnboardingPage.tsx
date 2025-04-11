
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Check, Calendar, ExternalLink, Upload, FileText, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import ConsultingTierBox from "@/components/dashboard/ConsultingTierBox";
import { useToast } from "@/components/ui/use-toast";

const OnboardingPage = () => {
  const { state } = useAuth();
  const { toast } = useToast();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  
  // Mock data - in a real app this would come from an API
  const [onboardingItems, setOnboardingItems] = useState([
    {
      id: "contract",
      title: "Contract Signed",
      description: "Revify agreement finalized.",
      status: "complete",
      icon: <FileText className="h-5 w-5 text-green-500" />,
      date: "Completed on Apr 5, 2025"
    },
    {
      id: "questionnaire",
      title: "Complete Data Questionnaire",
      description: "Provide details about your data sources and structure.",
      status: "pending",
      icon: <FileText className="h-5 w-5 text-amber-500" />,
      action: {
        label: "Open Questionnaire",
        url: "https://docs.google.com/forms/d/e/1FAIpQLSdG8wss8NTjT-1_3S2vM-0iJ7xJEFrX7J0sxSx4c4vKT_E0rg/viewform"
      },
      date: "Due by Apr 15, 2025"
    },
    {
      id: "data-submission",
      title: "Initial Data Submission",
      description: "Upload your initial dataset via the Data Uploads module.",
      status: "pending",
      icon: <Upload className="h-5 w-5 text-blue-500" />,
      action: {
        label: "Upload Files",
        url: "/data-uploads"
      },
      date: "Due by Apr 20, 2025"
    },
    {
      id: "health-check",
      title: "Data Health Check Review",
      description: "Revify team reviews data quality and completeness.",
      status: "pending",
      icon: <Clock className="h-5 w-5 text-purple-500" />,
      revifyAction: true,
      date: "Expected by Apr 25, 2025"
    },
    {
      id: "activate",
      title: "Activate Revify Analytics",
      description: "Your core dashboards and analytics are being prepared.",
      status: "pending",
      icon: <Clock className="h-5 w-5 text-purple-500" />,
      revifyAction: true,
      date: "Expected by May 1, 2025"
    },
    {
      id: "diagnostic",
      title: "Schedule Initial Diagnostic Review",
      description: "Book your first strategy session with your Revify consultant.",
      status: "pending",
      icon: <Calendar className="h-5 w-5 text-green-500" />,
      action: {
        label: "Schedule Now",
        url: "https://calendly.com/revify-team/diagnostic-review"
      },
      date: "Available after May 3, 2025"
    }
  ]);
  
  // Consulting tier data
  const [consultingTier, setConsultingTier] = useState({
    tier: "Elite",
    description: "You have our premium Elite tier with enhanced features and support.",
    benefits: [
      "Priority support with 4-hour response time",
      "Weekly consulting sessions",
      "Custom dashboard development",
      "Advanced data integration features",
      "Dedicated account manager"
    ]
  });
  
  // Calculate progress
  const completedCount = onboardingItems.filter(item => item.status === "complete").length;
  const progress = Math.round((completedCount / onboardingItems.length) * 100);
  
  const toggleItem = (itemId: string) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };
  
  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return <Badge variant="success">Complete</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-muted-foreground">Pending</Badge>;
      default:
        return null;
    }
  };
  
  // Handle support contact
  const handleContactSupport = () => {
    toast({
      title: "Support request sent",
      description: "A support representative will contact you shortly.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="space-y-0.5">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to Revify!</h1>
          <p className="text-muted-foreground">
            Let's get your account set up. Follow the steps below to complete your onboarding.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            {/* Onboarding Checklist */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Your Onboarding Journey</CardTitle>
                <CardDescription>
                  Complete these steps to unlock the full power of your Revify portal.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress: {completedCount} of {onboardingItems.length} complete</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                {/* Checklist Items */}
                <div className="space-y-3 mt-4">
                  {onboardingItems.map((item) => (
                    <div 
                      key={item.id}
                      className={cn(
                        "border rounded-lg p-4 transition-all",
                        item.status === "complete" 
                          ? "bg-muted/30 border-muted-foreground/20" 
                          : "border-border hover:border-primary/30"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className={cn(
                              "font-medium",
                              item.status === "complete" && "text-muted-foreground"
                            )}>
                              {item.title}
                            </h3>
                            {getStatusBadge(item.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                          
                          {item.date && (
                            <p className={cn(
                              "text-xs mt-2",
                              item.date.includes("Due") ? "text-amber-600" : 
                              item.date.includes("Completed") ? "text-green-600" : 
                              "text-muted-foreground"
                            )}>
                              {item.date}
                            </p>
                          )}
                          
                          {item.revifyAction && (
                            <div className="mt-2">
                              <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                                Revify Action
                              </Badge>
                            </div>
                          )}
                          
                          {item.action && (
                            <div className="mt-3">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-sm"
                                onClick={() => window.location.href = item.action!.url}
                              >
                                {item.action.label.includes("Questionnaire") || item.action.label.includes("Schedule") ? 
                                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> : 
                                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                                }
                                {item.action.label}
                              </Button>
                            </div>
                          )}
                        </div>
                        {item.status === "complete" && (
                          <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Check className="w-3 h-3 text-green-500" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Service Tier Display */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Your Revify Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Platform Tier */}
                <ConsultingTierBox
                  tier={consultingTier.tier}
                  description={consultingTier.description}
                  benefits={consultingTier.benefits}
                  showDetails={false}
                />
                
                {/* Consulting Add-On Display */}
                <div className="border rounded-lg p-4 mt-4">
                  <h3 className="font-medium">Consulting Add-On</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    4 Hours/Month Retainer
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Dedicated monthly consulting hours for strategic support.
                  </p>
                  <Button 
                    variant="link" 
                    className="text-sm p-0 h-auto mt-2"
                    onClick={() => window.open('https://revify.com/consulting', '_blank')}
                  >
                    Explore Consulting Options →
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleContactSupport}
                >
                  Contact Support
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.open('https://calendly.com/revify-team/support-call', '_blank')}
                >
                  Schedule Ad-hoc Call
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => window.location.href = '/knowledge-hub'}
                >
                  Access Knowledge Base
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OnboardingPage;
