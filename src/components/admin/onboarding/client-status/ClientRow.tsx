
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OnboardingClient } from "@/lib/clients";
import { ClientProgressIndicator } from "./ClientProgressIndicator";
import { CompleteOnboardingButton } from "./CompleteOnboardingButton";

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
}

export function ClientRow({
  client,
  processingId,
  getClientProgress,
  onMarkComplete,
  onViewDetails,
}: ClientRowProps) {
  const navigate = useNavigate();
  const { progress, steps_completed, total_steps } = getClientProgress(client);

  return (
    <TableRow key={client.id}>
      <TableCell className="font-medium">
        {client.companyName || client.email}
      </TableCell>
      <TableCell>{client.subscriptionTier.name}</TableCell>
      <TableCell>
        <ClientProgressIndicator 
          progress={progress} 
          stepsCompleted={steps_completed} 
          totalSteps={total_steps} 
        />
      </TableCell>
      <TableCell>
        {new Date(client.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <Badge 
          variant={client.status === "active" ? "success" : "default"}
        >
          {client.status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(client.id)}
          className="mr-2"
        >
          <ClipboardList className="h-4 w-4 mr-1" />
          Details
        </Button>
        
        {client.status === "pending" && (
          <CompleteOnboardingButton 
            clientId={client.id}
            progress={progress}
            isProcessing={processingId === client.id}
            onComplete={onMarkComplete}
          />
        )}
        
        {client.status === "active" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/clients/${client.id}`)}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
