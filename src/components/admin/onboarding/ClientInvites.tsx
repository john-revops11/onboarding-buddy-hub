
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

interface Invite {
  id: string;
  client_id: string;
  client_name: string;
  email: string;
  created_at: string;
  expires_at: string;
  status: "pending" | "used" | "revoked";
}

export function ClientInvites() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchInvites = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from an API
      // Mock data for this implementation
      const mockInvites: Invite[] = [
        {
          id: "1",
          client_id: "101",
          client_name: "Acme Corp",
          email: "john@acmecorp.com",
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
          status: "pending"
        },
        {
          id: "2",
          client_id: "102",
          client_name: "Globex Inc",
          email: "jane@globex.com",
          created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          expires_at: new Date(Date.now() + 82800000).toISOString(), // 23 hours from now
          status: "pending"
        },
        {
          id: "3",
          client_id: "103",
          client_name: "Initech",
          email: "mike@initech.com",
          created_at: new Date(Date.now() - 172800000).toISOString(), // 48 hours ago
          expires_at: new Date(Date.now() - 86400000).toISOString(), // 24 hours ago (expired)
          status: "used"
        }
      ];
      setInvites(mockInvites);
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

  const resendInvite = async (id: string) => {
    setProcessingId(id);
    try {
      // In a real implementation, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Invite Resent",
        description: "The invitation has been resent successfully."
      });
      
      // Update the invite in the UI with a new expiration date
      setInvites(prevInvites => 
        prevInvites.map(invite => 
          invite.id === id 
            ? {
                ...invite,
                expires_at: new Date(Date.now() + 86400000).toISOString(),
                created_at: new Date().toISOString()
              } 
            : invite
        )
      );
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
      // In a real implementation, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Invite Revoked",
        description: "The invitation has been revoked successfully."
      });
      
      // Update the invite status in the UI
      setInvites(prevInvites => 
        prevInvites.map(invite => 
          invite.id === id 
            ? { ...invite, status: "revoked" as const } 
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
                <TableHead>Expires</TableHead>
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
                      {new Date(invite.expires_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          invite.status === "pending" 
                            ? "default" 
                            : invite.status === "used" 
                              ? "success" 
                              : "destructive"
                        }
                      >
                        {invite.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {invite.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => resendInvite(invite.id)}
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
                      )}
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
