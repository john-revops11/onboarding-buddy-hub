
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Loader2, RefreshCw, Mail, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
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
import { sendClientInvitation } from "@/lib/client-management";

interface Invite {
  id: string;
  client_id: string;
  client_name: string;
  email: string;
  created_at: string;
  invitation_status: string;
}

export function ClientInvites() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchInvites = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          id,
          client_id,
          email,
          invitation_status,
          created_at,
          clients:client_id (
            company_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedInvites: Invite[] = data.map((invite) => ({
        id: invite.id,
        client_id: invite.client_id,
        client_name: invite.clients?.company_name || 'Unknown Client',
        email: invite.email,
        created_at: invite.created_at,
        invitation_status: invite.invitation_status
      }));
      
      setInvites(formattedInvites);
    } catch (error) {
      console.error("Error fetching invites:", error);
      toast({
        title: "Error",
        description: "Failed to load invites. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const resendInvite = async (id: string, clientId: string, email: string) => {
    setProcessingId(id);
    try {
      const success = await sendClientInvitation(clientId, email);
      
      if (success) {
        toast({
          title: "Invite Resent",
          description: "The invitation has been resent successfully."
        });
        
        setInvites(prevInvites => 
          prevInvites.map(invite => 
            invite.id === id 
              ? {
                  ...invite,
                  invitation_status: 'sent',
                  created_at: new Date().toISOString()
                } 
              : invite
          )
        );
      }
    } catch (error) {
      console.error("Error resending invite:", error);
      toast({
        title: "Error",
        description: "Failed to resend invite. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const revokeInvite = async (id: string) => {
    setProcessingId(id);
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ invitation_status: 'revoked' })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Invite Revoked",
        description: "The invitation has been revoked successfully."
      });
      
      setInvites(prevInvites => 
        prevInvites.map(invite => 
          invite.id === id 
            ? { ...invite, invitation_status: 'revoked' } 
            : invite
        )
      );
    } catch (error) {
      console.error("Error revoking invite:", error);
      toast({
        title: "Error",
        description: "Failed to revoke invite. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const filteredInvites = invites.filter(invite => 
    invite.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invite.client_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          type="search"
          placeholder="Search by email or client..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={fetchInvites} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : (
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
              {filteredInvites.length > 0 ? (
                filteredInvites.map((invite) => (
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
                            onClick={() => resendInvite(invite.id, invite.client_id, invite.email)}
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
                                  onClick={() => revokeInvite(invite.id)}
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
      )}
    </div>
  );
}
