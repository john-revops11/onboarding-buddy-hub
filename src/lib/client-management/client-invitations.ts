
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Send client invitation
export async function sendClientInvitation(teamMemberId: string, email: string, clientName?: string) {
  try {
    // Call our edge function to handle the invitation process
    const { data, error } = await supabase.functions.invoke("send-invitation", {
      body: { teamMemberId, clientName },
    });
    
    if (error) throw error;
    
    if (data?.success) {
      toast({
        title: "Invitation sent",
        description: `Invitation has been sent to ${email}`,
      });
    } else {
      throw new Error(data?.message || "Failed to send invitation");
    }
    
    return true;
  } catch (error: any) {
    console.error("Error sending invitation:", error);
    toast({
      title: "Error sending invitation",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
}

// Verify invitation token
export async function verifyInvitationToken(token: string) {
  try {
    const { data, error } = await supabase
      .from('invitation_tokens')
      .select(`
        *,
        team_members(
          *,
          clients(*)
        )
      `)
      .eq('token', token)
      .eq('is_valid', true)
      .lt('expires_at', new Date().toISOString())
      .maybeSingle();
    
    if (error) throw error;
    
    if (!data) {
      return { valid: false, message: "Invalid or expired invitation" };
    }
    
    return {
      valid: true,
      teamMember: data.team_members,
      clientId: data.team_members.client_id,
      clientName: data.team_members.clients?.company_name,
      email: data.team_members.email,
      tokenId: data.id
    };
  } catch (error: any) {
    console.error("Error verifying token:", error);
    return {
      valid: false,
      message: error.message || "Failed to verify invitation"
    };
  }
}

// Register invited user
export async function registerInvitedUser(tokenId: string, password: string, email: string) {
  try {
    // Create the user account
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (signupError) throw signupError;
    
    // Mark the token as used
    const { error: tokenUpdateError } = await supabase
      .from('invitation_tokens')
      .update({
        used_at: new Date().toISOString(),
        is_valid: false
      })
      .eq('id', tokenId);
    
    if (tokenUpdateError) throw tokenUpdateError;
    
    // Update the team member with the user ID
    const { error: teamMemberUpdateError } = await supabase
      .from('team_members')
      .update({
        user_id: signupData.user?.id,
        invitation_status: 'accepted'
      })
      .eq('email', email);
    
    if (teamMemberUpdateError) throw teamMemberUpdateError;
    
    return { success: true };
  } catch (error: any) {
    console.error("Error registering user:", error);
    return {
      success: false,
      message: error.message || "Failed to register user"
    };
  }
}
