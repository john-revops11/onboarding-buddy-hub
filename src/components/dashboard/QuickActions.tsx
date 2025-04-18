
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Calendar, 
  HelpCircle, 
  MessageSquare, 
  Upload, 
  FileText
} from "lucide-react";

export interface QuickActionsProps {
  showOnboardingButton: boolean;
  supportUrl: string;
  kbUrl: string;
  meetingUrl?: string;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  showOnboardingButton,
  supportUrl,
  kbUrl,
  meetingUrl,
}) => {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Documentation Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary/10 rounded mr-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Knowledge Resources</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Access guides, FAQs, and best practices for using Revify
                effectively.
              </p>
              <div className="mt-auto space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  asChild
                >
                  <a 
                    href={kbUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Knowledge Base
                  </a>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start" 
                  asChild
                >
                  <a 
                    href="https://docs.revify.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Documentation
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary/10 rounded mr-3">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Support</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Get help from our team when you need it.
              </p>
              <div className="mt-auto space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  asChild
                >
                  <a 
                    href={supportUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contact Support
                  </a>
                </Button>

                {meetingUrl && (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start" 
                    asChild
                  >
                    <a 
                      href={meetingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule a Meeting
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management Card */}
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex flex-col h-full">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-primary/10 rounded mr-3">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold">Data Management</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Upload data files and manage your account data.
              </p>
              <div className="mt-auto">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  asChild
                >
                  <a 
                    href="/dashboard/data-uploads" 
                    rel="noopener noreferrer"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Data
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
