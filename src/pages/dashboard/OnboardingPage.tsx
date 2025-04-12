
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, ChevronRight, Save } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { 
  completeOnboardingStep, 
  getOnboardingProgress, 
  shouldRedirectToDashboard 
} from "@/utils/onboardingUtils";
import { toast } from "@/hooks/use-toast";

// Define onboarding steps
const ONBOARDING_STEPS = [
  {
    id: "welcome",
    title: "Welcome to Revify",
    description: "Let's get you set up with Revify's powerful data analysis platform."
  },
  {
    id: "contract",
    title: "Contract & Terms",
    description: "Review and agree to our terms of service."
  },
  {
    id: "questionnaire",
    title: "Data Questionnaire",
    description: "Tell us about your data so we can better serve your needs."
  },
  {
    id: "upload",
    title: "Initial Data Upload",
    description: "Upload your first dataset to get started."
  },
  {
    id: "integration",
    title: "Integration Setup",
    description: "Configure any necessary integrations with your existing systems."
  },
  {
    id: "training",
    title: "Schedule Training",
    description: "Schedule a training session for your team."
  }
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [activeStep, setActiveStep] = useState(ONBOARDING_STEPS[0].id);
  const [progress, setProgress] = useState(getOnboardingProgress());
  
  // Redirect if onboarding is complete and client is active
  useEffect(() => {
    if (shouldRedirectToDashboard()) {
      toast({
        title: "Onboarding Complete",
        description: "You've completed onboarding and your account is now active."
      });
      navigate("/dashboard");
    }
  }, [navigate]);
  
  const handleContinue = () => {
    const currentIndex = ONBOARDING_STEPS.findIndex(step => step.id === activeStep);
    
    // Mark the current step as complete
    completeOnboardingStep(currentIndex);
    
    // Update progress
    setProgress(getOnboardingProgress());
    
    // Move to next step if not at the end
    if (currentIndex < ONBOARDING_STEPS.length - 1) {
      setActiveStep(ONBOARDING_STEPS[currentIndex + 1].id);
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
  
  // Get the current step index
  const currentStepIndex = ONBOARDING_STEPS.findIndex(step => step.id === activeStep);
  const isLastStep = currentStepIndex === ONBOARDING_STEPS.length - 1;
  
  // Check if current step is completed
  const isCurrentStepCompleted = currentStepIndex < progress.completedCount;
  
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
                <div className="text-2xl font-bold">{progress.progress}%</div>
                <div className="text-sm text-muted-foreground">
                  {progress.completedCount} of {progress.totalSteps} steps completed
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress.progress} className="h-2 mb-6" />
            
            <div className="grid gap-4">
              {ONBOARDING_STEPS.map((step, index) => (
                <button
                  key={step.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    activeStep === step.id 
                      ? "border-primary bg-primary/5" 
                      : index < progress.completedCount 
                        ? "border-green-200 bg-green-50"
                        : "border-muted-foreground/20"
                  }`}
                  onClick={() => setActiveStep(step.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index < progress.completedCount 
                        ? "bg-green-100 text-green-600" 
                        : "bg-muted-foreground/10 text-muted-foreground"
                    }`}>
                      {index < progress.completedCount ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm text-muted-foreground">{step.description}</div>
                    </div>
                  </div>
                  {activeStep === step.id && (
                    <ChevronRight className="h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleFinishLater}>
              <Save className="mr-2 h-4 w-4" />
              Finish Later
            </Button>
            <Button onClick={handleContinue} disabled={isLastStep && isCurrentStepCompleted}>
              {isLastStep ? "Complete Onboarding" : "Continue"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{ONBOARDING_STEPS[currentStepIndex].title}</CardTitle>
            <CardDescription>
              {ONBOARDING_STEPS[currentStepIndex].description}
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
                <div className="min-h-[200px] border rounded-lg p-6 flex items-center justify-center">
                  {activeStep === "welcome" && (
                    <div className="text-center space-y-4">
                      <h2 className="text-2xl font-bold">Welcome to Revify!</h2>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        We're excited to have you onboard. Complete this onboarding process
                        to get started with our powerful data analysis platform.
                      </p>
                    </div>
                  )}
                  
                  {activeStep === "contract" && (
                    <div className="space-y-4 w-full">
                      <h2 className="text-xl font-semibold">Terms of Service</h2>
                      <div className="bg-muted p-4 rounded-lg h-40 overflow-y-auto text-sm">
                        <p>
                          This is a placeholder for the Terms of Service document.
                          In a real implementation, this would include the actual legal text.
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="agree" className="rounded" />
                        <label htmlFor="agree">I agree to the terms and conditions</label>
                      </div>
                    </div>
                  )}
                  
                  {activeStep === "questionnaire" && (
                    <div className="text-center">
                      <p className="text-muted-foreground">
                        This is where the data questionnaire form would appear.
                      </p>
                    </div>
                  )}
                  
                  {activeStep === "upload" && (
                    <div className="text-center">
                      <p className="text-muted-foreground">
                        This is where the data upload interface would appear.
                      </p>
                    </div>
                  )}
                  
                  {activeStep === "integration" && (
                    <div className="text-center">
                      <p className="text-muted-foreground">
                        This is where the integration setup options would appear.
                      </p>
                    </div>
                  )}
                  
                  {activeStep === "training" && (
                    <div className="text-center">
                      <p className="text-muted-foreground">
                        This is where the training scheduling interface would appear.
                      </p>
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
