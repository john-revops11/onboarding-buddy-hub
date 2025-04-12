
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Send client invitation
export async function sendClientInvitation(clientId: string, email: string) {
  try {
    // In a real implementation, this would call a server function to send an email
    // For now, we'll just update the status
    const { error } = await supabase
      .from('team_members')
      .update({ invitation_status: 'sent' })
      .eq('client_id', clientId)
      .eq('email', email);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    toast({
      title: "Error sending invitation",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
}
