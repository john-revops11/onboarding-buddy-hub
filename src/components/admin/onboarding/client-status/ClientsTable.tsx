
import { Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OnboardingClient } from "@/lib/types/client-types";
import { ClientRow } from "./ClientRow";

interface ClientsTableProps {
  isLoading: boolean;
  clients: OnboardingClient[];
  processingId: string | null;
  getClientProgress: (client: OnboardingClient) => {
    progress: number;
    steps_completed: number;
    total_steps: number;
  };
  onMarkComplete: (id: string) => Promise<void>;
  onViewDetails: (id: string) => void;
}

export function ClientsTable({
  isLoading,
  clients,
  processingId,
  getClientProgress,
  onMarkComplete,
  onViewDetails,
}: ClientsTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <ClientRow
                key={client.id}
                client={client}
                processingId={processingId}
                getClientProgress={getClientProgress}
                onMarkComplete={onMarkComplete}
                onViewDetails={onViewDetails}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No clients found. Create a new client to begin the onboarding process.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
