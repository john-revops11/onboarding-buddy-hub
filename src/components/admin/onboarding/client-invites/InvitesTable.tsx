
import { Loader2 } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { InviteRow } from "./InviteRow";
import { Invite } from "@/lib/types/invite-types";

interface InvitesTableProps {
  invites: Invite[];
  isLoading: boolean;
  processingId: string | null;
  onResend: (id: string, clientId: string, email: string) => Promise<void>;
  onRevoke: (id: string) => Promise<void>;
}

export function InvitesTable({ 
  invites, 
  isLoading, 
  processingId, 
  onResend, 
  onRevoke 
}: InvitesTableProps) {
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
            <TableHead>Email</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invites.length > 0 ? (
            invites.map((invite) => (
              <InviteRow
                key={invite.id}
                invite={invite}
                processingId={processingId}
                onResend={onResend}
                onRevoke={onRevoke}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No invites found. Create a new client to send invitations.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
