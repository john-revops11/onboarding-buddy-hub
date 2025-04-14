
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check, ExternalLink, RefreshCw } from "lucide-react";
import { OnboardingClient } from "@/lib/types/client-types";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ClientsTableProps {
  clients: OnboardingClient[];
  isLoading: boolean;
  processingId: string | null;
  getClientProgress: (client: OnboardingClient) => { progress: number, steps_completed: number, total_steps: number };
  onMarkComplete: (id: string) => Promise<void>;
  onViewDetails: (id: string) => void;
  onRetryDriveCreation?: (id: string, email: string, companyName: string) => Promise<void>;
}

export function ClientsTable({ 
  clients, 
  isLoading, 
  processingId, 
  getClientProgress, 
  onMarkComplete,
  onViewDetails,
  onRetryDriveCreation
}: ClientsTableProps) {
  const [retryingDriveId, setRetryingDriveId] = useState<string | null>(null);

  const handleRetryDriveCreation = async (id: string, email: string, companyName: string) => {
    if (onRetryDriveCreation) {
      setRetryingDriveId(id);
      try {
        await onRetryDriveCreation(id, email, companyName);
      } finally {
        setRetryingDriveId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No clients found. Create a new client to get started.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Subscription</TableHead>
            <TableHead>Add-ons</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Google Drive</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => {
            const { progress } = getClientProgress(client);
            return (
              <TableRow key={client.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{client.email}</div>
                    {client.companyName && (
                      <div className="text-sm text-muted-foreground">{client.companyName}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{client.subscriptionTier.name}</TableCell>
                <TableCell>
                  {client.addons.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {client.addons.map((addon: any) => (
                        <Badge key={addon.id} variant="outline" className="text-xs">
                          {addon.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">None</span>
                  )}
                </TableCell>
                <TableCell>
                  {client.teamMembers.length > 0 ? (
                    <span className="text-muted-foreground text-sm">
                      {client.teamMembers.length} member{client.teamMembers.length !== 1 ? 's' : ''}
                    </span>
                  ) : (
                    <span className="text-muted-foreground text-sm">No members</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={client.status === 'active' ? "success" : "outline"}>
                    {client.status === 'active' ? 'Active' : 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {client.drive_id ? (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
                        Created
                      </Badge>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Open Drive</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100">
                        Missing
                      </Badge>
                      {onRetryDriveCreation && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => handleRetryDriveCreation(
                            client.id, 
                            client.email, 
                            client.companyName || `Client-${client.id}`
                          )}
                          disabled={!!retryingDriveId}
                        >
                          {retryingDriveId === client.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3 w-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(client.id)}
                    >
                      View
                    </Button>
                    {client.status !== 'active' && (
                      <Button
                        size="sm"
                        onClick={() => onMarkComplete(client.id)}
                        disabled={processingId === client.id}
                      >
                        {processingId === client.id ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing
                          </>
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Complete
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
