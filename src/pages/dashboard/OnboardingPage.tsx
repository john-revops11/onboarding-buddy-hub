
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { FileUploadSection } from "@/components/dashboard/FileUploadSection";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { toast } from "@/components/ui/use-toast";

export default function OnboardingPage() {
  const { state } = useAuth();
  const user = state.user;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUploadComplete = (file: File) => {
    toast({
      title: "File uploaded",
      description: `${file.name} has been uploaded and is pending review.`,
    });
  };

  const handleVerifyFiles = async () => {
    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Verification requested",
        description: "Your files have been submitted for verification.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "There was an error submitting your files. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if user has completed onboarding
  const isOnboardingComplete = user?.onboardingStatus === "Complete" || user?.onboardingStatus === 100;

  if (isOnboardingComplete) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Onboarding Complete</h1>
            <p className="text-muted-foreground">
              Your account has been fully set up and is ready to use.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>All Set!</CardTitle>
              <CardDescription>
                You have successfully completed all onboarding steps.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Your account is now fully configured and you have access to all features.
                You can upload additional files at any time through the Data Uploads section.
              </p>
              <Button asChild>
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </CardContent>
          </Card>
          
          <FileUploadSection 
            onFileUploadComplete={handleFileUploadComplete} 
          />
          
          <QuickActions 
            showOnboardingButton={false}
            supportUrl={user?.supportUrl || "#"}
            kbUrl={user?.kbUrl || "#"}
            meetingUrl={user?.meetingUrl || undefined}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Onboarding</h1>
          <p className="text-muted-foreground">
            Complete the setup process to get started with Revify
          </p>
        </div>

        <QuickActions 
          showOnboardingButton={true}
          supportUrl={user?.supportUrl || "#"}
          kbUrl={user?.kbUrl || "#"}
          meetingUrl={user?.meetingUrl || undefined}
        />

        <Card>
          <CardHeader>
            <CardTitle>Upload Required Documents</CardTitle>
            <CardDescription>
              Please upload the following required files to complete your onboarding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileUploadSection 
              onFileUploadComplete={handleFileUploadComplete} 
            />
            
            <div className="flex justify-end">
              <Button onClick={handleVerifyFiles} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Files for Verification"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
