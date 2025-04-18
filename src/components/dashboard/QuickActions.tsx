
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, FileUp, HelpCircle, Book, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickActionsProps {
  showOnboardingButton: boolean;
  supportUrl: string;
  kbUrl: string;
  meetingUrl?: string;
}

export function QuickActions({ 
  showOnboardingButton, 
  supportUrl, 
  kbUrl, 
  meetingUrl 
}: QuickActionsProps) {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {showOnboardingButton && (
        <Card className="hover:shadow-md transition-shadow overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary-200/70 p-2">
                <FileUp className="h-5 w-5 text-primary-700" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold">Complete Onboarding</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">Finish setting up your account</p>
                <Button 
                  variant="ghost" 
                  className="mt-2 p-0 h-auto text-primary-700 hover:text-primary-900 hover:bg-transparent"
                  onClick={() => navigate('/onboarding')}
                >
                  <span className="mr-1">Continue Setup</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card className="hover:shadow-md transition-shadow overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-blue-100 p-2">
              <FileUp className="h-5 w-5 text-blue-700" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">Data Upload</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">Upload your data files</p>
              <Button 
                variant="ghost" 
                className="mt-2 p-0 h-auto text-blue-700 hover:text-blue-900 hover:bg-transparent"
                onClick={() => navigate('/dashboard/data-uploads')}
              >
                <span className="mr-1">Upload Files</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-amber-100 p-2">
              <HelpCircle className="h-5 w-5 text-amber-700" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">Support</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">Get help from our team</p>
              <Button 
                variant="ghost" 
                component="a"
                className="mt-2 p-0 h-auto text-amber-700 hover:text-amber-900 hover:bg-transparent"
                href={supportUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="mr-1">Contact Support</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="hover:shadow-md transition-shadow overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-green-100 p-2">
              <Book className="h-5 w-5 text-green-700" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold">Knowledge Base</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">Browse tutorials and guides</p>
              <Button 
                variant="ghost" 
                component="a"
                className="mt-2 p-0 h-auto text-green-700 hover:text-green-900 hover:bg-transparent"
                href={kbUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="mr-1">View Resources</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {meetingUrl && (
        <Card className="hover:shadow-md transition-shadow overflow-hidden md:col-span-2 lg:col-span-4">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-purple-100 p-2">
                <Calendar className="h-5 w-5 text-purple-700" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-semibold">Schedule a Strategy Session</h3>
                <p className="text-sm text-muted-foreground">
                  Book a meeting with our team to discuss your strategy and next steps.
                </p>
                <Button 
                  variant="outline"
                  component="a"
                  className="mt-2 text-purple-700 border-purple-200 hover:bg-purple-50"
                  href={meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
