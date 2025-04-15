
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, ChevronRight, Save, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/hooks/use-toast";
import { useChecklist } from "@/hooks/useChecklist";
import { supabase } from "@/integrations/supabase/client";
import { ChecklistItem } from "@/types/onboarding";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const userId = state?.user?.id || "demo-user";
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  
  const {
    checklist,
    updateTaskCompletion,
    areRequiredDocumentsUploaded,
    getProgress,
    isLoading
  } = useChecklist(userId);
  
  // Redirect if onboarding is complete and client is active
  useEffect(() => {
    const checkClientStatus = async () => {
      if (userId && userId !== "demo-user") {
        const { data, error } = await supabase
          .from('clients')
          .select('onboarding_completed, status')
          .eq('id', userId)
          .single();
        
        if (!error && data && data.onboarding_completed && data.status === 'active') {
          toast({
            title: "Onboarding Complete",
            description: "You've completed onboarding and your account is now active."
          });
          navigate("/dashboard");
        }
      }
    };
    
    checkClientStatus();
  }, [navigate, userId]);
  
  const handleContinue = () => {
    const currentStep = checklist[activeStepIndex] as ChecklistItem;
    
    // Mark the current step as complete
    if (currentStep && !currentStep.completed) {
      updateTaskCompletion(currentStep.id, true);
    }
    
    // Move to next step if not at the end
    if (activeStepIndex < checklist.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    } else {
      toast({
        title: "Onboarding Steps Completed",
        description: "Your administrator will review and activate your account soon."
      });
    }
  };
  
  const handleFinishLater = () => {
    toast({
      title: "Progress Saved",
      description: "Your onboarding progress has been saved. You can continue later."
    });
    navigate("/dashboard");
  };
  
  // Get the current step
  const currentStep = checklist[activeStepIndex] as ChecklistItem || {};
  const isLastStep = activeStepIndex === checklist.length - 1;
  
  // Check if current step is completed
  const isCurrentStepCompleted = currentStep?.completed || false;
  
  // Get progress percentage
  const progress = getProgress();
  const completedCount = checklist.filter(item => (item as ChecklistItem).completed).length;
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container max-w-5xl py-6 flex justify-center items-center min-h-[70vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">Loading your onboarding checklist...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="container max-w-5xl py-6 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome to Revify</h1>
          <p className="text-muted-foreground mt-2">
            Complete the following steps to set up your account and get started with Revify.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Onboarding Progress</CardTitle>
                <CardDescription>
                  Complete these steps to get started with Revify.
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{progress}%</div>
                <div className="text-sm text-muted-foreground">
                  {completedCount} of {checklist.length} steps completed
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2 mb-6" />
            
            <div className="grid gap-4">
              {checklist.map((step, index) => {
                const typedStep = step as ChecklistItem;
                return (
                  <button
                    key={typedStep.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      activeStepIndex === index 
                        ? "border-primary bg-primary/5" 
                        : index < completedCount 
                          ? "border-green-200 bg-green-50"
                          : "border-muted-foreground/20"
                    }`}
                    onClick={() => setActiveStepIndex(index)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        typedStep.completed 
                          ? "bg-green-100 text-green-600" 
                          : "bg-muted-foreground/10 text-muted-foreground"
                      }`}>
                        {typedStep.completed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{typedStep.title}</div>
                        <div className="text-sm text-muted-foreground">{typedStep.description}</div>
                        {typedStep.isAddonStep && typedStep.addonName && (
                          <div className="mt-1">
                            <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                              {typedStep.addonName} Add-on
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {activeStepIndex === index && (
                      <ChevronRight className="h-5 w-5 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleFinishLater}>
              <Save className="mr-2 h-4 w-4" />
              Finish Later
            </Button>
            <Button 
              onClick={handleContinue} 
              disabled={isLastStep && isCurrentStepCompleted}
            >
              {isLastStep ? "Complete Onboarding" : "Continue"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{(currentStep as ChecklistItem).title || "Welcome"}</CardTitle>
            <CardDescription>
              {(currentStep as ChecklistItem).description || "Complete the onboarding steps to get started."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="form">
              <TabsList className="mb-4">
                <TabsTrigger value="form">Form</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="help">Help</TabsTrigger>
              </TabsList>
              
              <TabsContent value="form" className="space-y-4">
                {/* This would be replaced with actual form components for each step */}
                <div className="min-h-[200px] border rounded-lg p-6">
                  {(currentStep as ChecklistItem).requiredDocuments && (currentStep as ChecklistItem).requiredDocuments.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-amber-600">
                        <AlertCircle className="h-5 w-5" />
                        <p className="font-medium">This step requires document uploads</p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="font-medium">Required documents:</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {(currentStep as ChecklistItem).requiredDocuments.map((doc, i) => (
                            <li key={i} className="text-muted-foreground">
                              {doc.replace(/_/g, ' ')}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button
                        onClick={() => navigate("/dashboard/documents")}
                        className="mt-4"
                      >
                        Upload Documents
                      </Button>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center space-y-4 max-w-md">
                        <h2 className="text-xl font-semibold">{(currentStep as ChecklistItem).title || "Welcome to Revify"}</h2>
                        <p className="text-muted-foreground">
                          {(currentStep as ChecklistItem).description || "Complete this step to continue with your onboarding process."}
                        </p>
                        
                        {(currentStep as ChecklistItem).isAddonStep && (currentStep as ChecklistItem).addonName && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-blue-700">
                              This step is required for the {(currentStep as ChecklistItem).addonName} add-on you selected.
                            </p>
                          </div>
                        )}
                        
                        <Button
                          onClick={handleContinue}
                          className="mt-4"
                        >
                          {(currentStep as ChecklistItem).completed ? "Already Completed" : "Mark as Complete"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="resources">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Helpful Resources</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Documentation for this step</li>
                    <li>Video tutorials</li>
                    <li>FAQ about this process</li>
                    <li>Best practices guide</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="help">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Need Help?</h3>
                  <p className="text-sm mb-4">
                    If you're having trouble with this step, you can:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Contact your account manager</li>
                    <li>Schedule a call with our support team</li>
                    <li>Email support@revify.com</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OnboardingPage;
