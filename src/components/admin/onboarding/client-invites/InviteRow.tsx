
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Ban } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Invite } from "@/lib/types/invite-types";

interface InviteRowProps {
  invite: Invite;
  processingId: string | null;
  onResend: (id: string, clientId: string, email: string) => Promise<void>;
  onRevoke: (id: string) => Promise<void>;
}

export function InviteRow({ invite, processingId, onResend, onRevoke }: InviteRowProps) {
  return (
    <TableRow key={invite.id}>
      <TableCell className="font-medium">{invite.client_name}</TableCell>
      <TableCell>{invite.email}</TableCell>
      <TableCell>
        {new Date(invite.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <Badge 
          variant={
            invite.invitation_status === "pending" 
              ? "default" 
              : invite.invitation_status === "accepted" 
                ? "success" 
                : "destructive"
          }
        >
          {invite.invitation_status}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        {invite.invitation_status === "pending" || invite.invitation_status === "sent" ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onResend(invite.id, invite.client_id, invite.email)}
              disabled={!!processingId}
              className="mr-2"
            >
              {processingId === invite.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4 mr-1" />
              )}
              Resend
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!!processingId}
                >
                  {processingId === invite.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Ban className="h-4 w-4 mr-1" />
                  )}
                  Revoke
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Revoke Invitation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to revoke this invitation? 
                    This will prevent the user from using this invitation link.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onRevoke(invite.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Revoke
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : null}
      </TableCell>
    </TableRow>
  );
}
