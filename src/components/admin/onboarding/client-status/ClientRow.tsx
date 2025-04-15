
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, ExternalLink, CheckCircle, Clock, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OnboardingClient } from "@/types/onboarding";
import { ClientProgressIndicator } from "./ClientProgressIndicator";
import { CompleteOnboardingButton } from "./CompleteOnboardingButton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ClientRowProps {
  client: OnboardingClient;
  processingId: string | null;
  getClientProgress: (client: OnboardingClient) => {
    progress: number;
    steps_completed: number;
    total_steps: number;
  };
  onMarkComplete: (id: string) => Promise<void>;
  onViewDetails: (id: string) => void;
  isAlternate?: boolean;
}

export function ClientRow({
  client,
  processingId,
  getClientProgress,
  onMarkComplete,
  onViewDetails,
  isAlternate = false,
}: ClientRowProps) {
  const navigate = useNavigate();
  const { progress, steps_completed, total_steps } = getClientProgress(client);
  const isComplete = client.status === "active";

  return (
    <TableRow className={isAlternate ? "bg-neutral-50" : ""}>
      <TableCell className="font-medium">
        {client.companyName || client.email}
      </TableCell>
      <TableCell>{client.subscriptionTier}</TableCell>
      <TableCell>
        <ClientProgressIndicator 
          progress={progress} 
          stepsCompleted={steps_completed} 
          totalSteps={total_steps} 
        />
      </TableCell>
      <TableCell>
        {/* Use a placeholder date if not available */}
        {new Date().toLocaleDateString()}
      </TableCell>
      <TableCell>
        <Badge 
          variant={client.status === "active" ? "default" : "outline"}
          className={`${
            isComplete 
              ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" 
              : "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
          }`}
        >
          {isComplete ? (
            <span className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              Active
            </span>
          ) : (
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              Pending
            </span>
          )}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex justify-end items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(client.id)}
                  className="h-8"
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View Details</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View client details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {client.status === "pending" && (
            <CompleteOnboardingButton 
              clientId={client.id}
              progress={progress}
              isProcessing={processingId === client.id}
              onComplete={onMarkComplete}
            />
          )}
          
          {client.status === "active" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/admin/clients/${client.id}`)}
                    className="h-8"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go to client dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
