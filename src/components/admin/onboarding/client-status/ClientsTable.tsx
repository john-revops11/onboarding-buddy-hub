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
import { MoreVertical, ArrowRight } from "lucide-react";
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
    return <p>Loading clients...</p>;
  }
  
  if (clients.length === 0) {
    return <p>No clients found.</p>;
  }
  
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Subscription</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => {
            const { progress, steps_completed, total_steps } = getClientProgress(client);
            const isComplete = client.status === 'active';
            
            return (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.companyName || 'N/A'}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.subscriptionTier.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={progress} className="w-[150px]" />
                    <span>{progress}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{steps_completed} of {total_steps} steps</p>
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
                      >
                        {processingId === client.id ? "Marking Complete..." : "Mark Complete"}
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
