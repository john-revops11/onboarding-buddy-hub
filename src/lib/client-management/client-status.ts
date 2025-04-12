
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Complete client onboarding
export async function completeClientOnboarding(clientId: string) {
  try {
    const { error } = await supabase
      .from('clients')
      .update({ 
        status: 'active',
        onboarding_completed: true 
      })
      .eq('id', clientId);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    toast({
      title: "Error completing onboarding",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
}
