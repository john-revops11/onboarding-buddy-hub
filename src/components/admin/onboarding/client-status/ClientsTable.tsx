
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
import { Badge } from "@/components/ui/badge";
import { 
  MoreVertical, 
  ArrowUpDown, 
  CheckCircle, 
  Clock, 
  User, 
  Eye,
  ExternalLink 
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      <div className="flex items-center justify-center py-8 bg-white rounded-lg border border-neutral-200 shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading clients...</p>
        </div>
      </div>
    );
  }
  
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-white rounded-lg border border-neutral-200 shadow-sm">
        <User className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="mb-2 text-lg font-medium">No clients found</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          There are no clients matching your search criteria. Try adjusting your search or add a new client.
        </p>
        <Button onClick={() => navigate('/admin/onboarding')} className="gap-2">
          <User className="h-4 w-4" />
          Add New Client
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border border-neutral-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-50 hover:bg-neutral-50">
              <TableHead className="font-medium">
                <div className="flex items-center gap-1">
                  Client
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground ml-1" />
                </div>
              </TableHead>
              <TableHead className="font-medium">Email</TableHead>
              <TableHead className="font-medium">Subscription</TableHead>
              <TableHead className="font-medium">Addons</TableHead>
              <TableHead className="font-medium">
                <div className="flex items-center gap-1">
                  Progress
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground ml-1" />
                </div>
              </TableHead>
              <TableHead className="font-medium">
                <div className="flex items-center gap-1">
                  Status
                  <ArrowUpDown className="h-3 w-3 text-muted-foreground ml-1" />
                </div>
              </TableHead>
              <TableHead className="text-right font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client, index) => {
              const { progress, steps_completed, total_steps } = getClientProgress(client);
              const isComplete = client.status === 'active';
              
              return (
                <TableRow 
                  key={client.id} 
                  className={index % 2 === 0 ? "bg-white" : "bg-neutral-50"}
                >
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
                      <div className="flex flex-wrap gap-1">
                        {client.addons.map((addon, idx) => (
                          <TooltipProvider key={idx}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="bg-neutral-50">
                                  {addon.name}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{addon.description}</p>
                                <p className="text-xs font-medium">${addon.price}/year</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No addons</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <div className="w-[100px] h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#8ab454] rounded-full transition-all" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{progress}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {steps_completed} of {total_steps} steps
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={isComplete ? "default" : "outline"}
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
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(client.id)}
                        className="h-8 gap-1 text-neutral-700 hover:text-neutral-900"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Details</span>
                      </Button>

                      {!isComplete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onMarkComplete(client.id)}
                          disabled={processingId === client.id}
                          className={`h-8 gap-1 ${processingId === client.id ? "opacity-70" : ""}`}
                        >
                          {processingId === client.id ? (
                            <>
                              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                              <span className="hidden sm:inline">Processing...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Complete</span>
                            </>
                          )}
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => onViewDetails(client.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/admin/clients/${client.id}`)}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Client Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => onMarkComplete(client.id)}
                            disabled={processingId === client.id || isComplete}
                            className={isComplete ? "text-muted-foreground" : ""}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            {processingId === client.id ? "Processing..." : isComplete ? "Already Completed" : "Mark Complete"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
