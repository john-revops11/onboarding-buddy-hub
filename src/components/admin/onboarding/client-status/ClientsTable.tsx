
import React from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingClient } from "@/lib/types/client-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, ArrowRight, CheckCircle, Clock, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ClientsTableProps {
  isLoading: boolean;
  clients: OnboardingClient[];
  processingId: string | null;
  getClientProgress: (client: OnboardingClient) => { progress: number, steps_completed: number, total_steps: number };
  onMarkComplete: (id: string) => Promise<void>;
  onViewDetails: (id: string) => void;
}

export function ClientsTable({ 
  isLoading, 
  clients, 
  processingId, 
  getClientProgress, 
  onMarkComplete, 
  onViewDetails 
}: ClientsTableProps) {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading clients...</p>
        </div>
      </div>
    );
  }
  
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <User className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="mb-2 text-lg font-medium">No clients found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          There are no clients matching your search criteria.
        </p>
        <Button onClick={() => navigate('/admin/onboarding')}>
          Add New Client
        </Button>
      </div>
    );
  }
  
  return (
    <div className="relative overflow-x-auto shadow-md rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subscription</TableHead>
            <TableHead>Addons</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => {
            const { progress, steps_completed, total_steps } = getClientProgress(client);
            const isComplete = client.status === 'active';
            
            return (
              <TableRow key={client.id} className="hover:bg-muted/30">
                <TableCell className="font-medium">{client.companyName || 'N/A'}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{client.subscriptionTier.name}</span>
                    <span className="text-xs text-muted-foreground">${client.subscriptionTier.price}/year</span>
                  </div>
                </TableCell>
                <TableCell>
                  {client.addons && client.addons.length > 0 ? (
                    <div className="space-y-1">
                      {client.addons.map((addon, idx) => (
                        <Badge key={idx} variant="outline" className="mr-1">
                          {addon.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">No addons</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="w-[150px]" />
                    <span className="text-xs font-medium">{progress}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{steps_completed} of {total_steps} steps</p>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={isComplete ? "success" : "default"}
                    className={`badge-status-${client.status}`}
                  >
                    {isComplete ? (
                      <span className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> Pending
                      </span>
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onViewDetails(client.id)}>
                        View Details
                        <ArrowRight className="ml-auto h-4 w-4" />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onMarkComplete(client.id)}
                        disabled={processingId === client.id || isComplete}
                        className={isComplete ? "text-muted-foreground" : ""}
                      >
                        {processingId === client.id ? "Marking Complete..." : isComplete ? "Already Completed" : "Mark Complete"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
