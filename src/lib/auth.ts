
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { RegisterCredentials } from "@/types/auth";

export async function register(credentials: RegisterCredentials) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
        },
      },
    });
    
    if (error) throw error;
    
    return data;
  } catch (error: any) {
    toast({
      title: "Registration failed",
      description: error.message || "An error occurred during registration",
      variant: "destructive",
    });
    
    throw error;
  }
}

export async function registerClient(
  email: string, 
  password: string, 
  inviteId: string, 
  teamMemberId: string
) {
  try {
    // Register the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    
    if (error) throw error;
    
    // Update the team member record with the user ID
    const { error: updateError } = await supabase
      .from('team_members')
      .update({ 
        user_id: data.user?.id,
        invitation_status: 'accepted'
      })
      .eq('id', teamMemberId);
    
    if (updateError) throw updateError;
    
    return data;
  } catch (error: any) {
    toast({
      title: "Registration failed",
      description: error.message || "An error occurred during registration",
      variant: "destructive",
    });
    
    throw error;
  }
}
