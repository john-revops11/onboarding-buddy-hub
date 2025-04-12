
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { Invite } from "@/lib/types/invite-types";
import { supabase } from "@/integrations/supabase/client";
import { sendClientInvitation } from "@/lib/client-management";

export function useInviteManagement() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchInvites = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchInvites();
  }, [fetchInvites]);

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

  return {
    invites: filteredInvites,
    isLoading,
    searchQuery,
    setSearchQuery,
    processingId,
    fetchInvites,
    resendInvite,
    revokeInvite
  };
}
