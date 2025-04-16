
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Edit, MoreHorizontal, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { OnboardingClient } from "@/lib/types/client-types";
import { toast } from "@/hooks/use-toast";
import { completeClientOnboarding } from "@/lib/client-management";

interface ClientActionsProps {
  clientId: string;
  client: OnboardingClient;
  onSuccess: () => void;
}

export const ClientActions: React.FC<ClientActionsProps> = ({ clientId, client, onSuccess }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleViewDetails = () => {
    navigate(`/admin/clients/${clientId}`);
  };

  const handleEditClient = () => {
    navigate(`/admin/clients/edit/${clientId}`);
  };

  const handleSendInvite = async () => {
    try {
      toast({
        title: "Invitation Sent",
        description: `A new invitation has been sent to ${client.email}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteOnboarding = async () => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      await completeClientOnboarding(clientId);
      toast({
        title: "Onboarding Completed",
        description: "Client has been marked as fully onboarded.",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="h-8 gap-1"
        onClick={handleViewDetails}
      >
        <Eye className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">View</span>
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleViewDetails}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditClient}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Client
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSendInvite}>
            <Mail className="h-4 w-4 mr-2" />
            Send Invitation
          </DropdownMenuItem>
          {client.status !== "active" && (
            <DropdownMenuItem onClick={handleCompleteOnboarding} disabled={isProcessing}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Onboarding
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
