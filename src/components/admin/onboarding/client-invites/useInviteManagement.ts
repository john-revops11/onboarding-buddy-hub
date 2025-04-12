
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Invite } from "@/lib/types/invite-types";
import { toast } from "@/hooks/use-toast";

export const useInviteManagement = () => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    setIsLoading(true);
    try {
      // Fetch team members with pending invitations
      const { data: teamMembers, error } = await supabase
        .from("team_members")
        .select(`
          id,
          email,
          invitation_status,
          created_at,
          client_id,
          clients (
            id,
            email,
            company_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Format the data
      const formattedInvites: Invite[] = teamMembers.map((member: any) => ({
        id: member.id,
        client_id: member.client_id,
        client_name: member.clients ? member.clients.company_name || member.clients.email : "Unknown",
        email: member.email,
        created_at: member.created_at,
        invitation_status: member.invitation_status,
      }));

      setInvites(formattedInvites);
    } catch (error: any) {
      console.error("Error fetching invites:", error.message);
      toast({
        title: "Error fetching invites",
        description: error.message || "Could not load invitations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendInvitation = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .update({ invitation_status: "sent" })
        .eq("id", inviteId);

      if (error) throw error;

      // Update local state
      setInvites(
        invites.map((invite) =>
          invite.id === inviteId
            ? { ...invite, invitation_status: "sent" }
            : invite
        )
      );

      toast({
        title: "Invitation resent",
        description: "The invitation has been resent successfully",
      });

      return true;
    } catch (error: any) {
      console.error("Error resending invitation:", error.message);
      toast({
        title: "Error resending invitation",
        description: error.message || "Could not resend the invitation",
        variant: "destructive",
      });
      return false;
    }
  };

  const revokeInvitation = async (inviteId: string) => {
    try {
      const { error } = await supabase
        .from("team_members")
        .update({ invitation_status: "revoked" })
        .eq("id", inviteId);

      if (error) throw error;

      // Update local state
      setInvites(
        invites.map((invite) =>
          invite.id === inviteId
            ? { ...invite, invitation_status: "revoked" }
            : invite
        )
      );

      toast({
        title: "Invitation revoked",
        description: "The invitation has been revoked successfully",
      });

      return true;
    } catch (error: any) {
      console.error("Error revoking invitation:", error.message);
      toast({
        title: "Error revoking invitation",
        description: error.message || "Could not revoke the invitation",
        variant: "destructive",
      });
      return false;
    }
  };

  const filteredInvites = invites.filter((invite) => {
    const matchesSearch =
      invite.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invite.client_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || invite.invitation_status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return {
    invites: filteredInvites,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    resendInvitation,
    revokeInvitation,
    refreshInvites: fetchInvites,
  };
};
