
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Send,
  XCircle,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Invite } from "@/lib/types/invite-types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/date-utils";

interface InvitesTableProps {
  invites: Invite[];
  isLoading: boolean;
  processingId: string | null;
  onResend: (id: string, clientId: string, email: string) => Promise<void>;
  onRevoke: (id: string) => Promise<void>;
}

export const InvitesTable = ({
  invites,
  isLoading,
  processingId,
  onResend,
  onRevoke,
}: InvitesTableProps) => {
  // Helper function to render the status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "sent":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Send className="h-3 w-3 mr-1" />
            Sent
          </Badge>
        );
      case "accepted":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Accepted
          </Badge>
        );
      case "revoked":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Revoked
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading invitations...</span>
      </div>
    );
  }

  if (invites.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No invitations found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Team Member Email</TableHead>
            <TableHead>Invited</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invites.map((invite) => (
            <TableRow key={invite.id}>
              <TableCell className="font-medium">{invite.client_name}</TableCell>
              <TableCell>{invite.email}</TableCell>
              <TableCell>{formatDate(invite.created_at)}</TableCell>
              <TableCell>{renderStatusBadge(invite.invitation_status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {invite.invitation_status !== "accepted" && invite.invitation_status !== "revoked" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onResend(invite.id, invite.client_id, invite.email)}
                        disabled={processingId === invite.id}
                      >
                        {processingId === invite.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <Send className="h-4 w-4 mr-1" />
                        )}
                        Resend
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRevoke(invite.id)}
                        disabled={processingId === invite.id}
                      >
                        {processingId === invite.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-1" />
                        )}
                        Revoke
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
