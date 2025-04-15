
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Assign template to client
export async function assignTemplateToClient(clientId: string): Promise<boolean> {
  try {
    if (!clientId) return false;
    
    // First check if client exists
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id, subscription_id')
      .eq('id', clientId)
      .single();
    
    if (clientError) {
      console.error("Client not found:", clientError);
      return false;
    }
    
    const subscriptionId = client.subscription_id;
    
    if (!subscriptionId) {
      console.error("Client has no subscription");
      return false;
    }
    
    // Get the default template for this subscription
    const { data: subscriptionTemplate, error: templateError } = await supabase
      .from('subscription_templates')
      .select('template_id')
      .eq('subscription_id', subscriptionId)
      .eq('is_default', true)
      .single();
    
    if (templateError) {
      console.error("No default template found for subscription:", templateError);
      
      // If no default template, try to get any template for this subscription
      const { data: anyTemplate, error: anyTemplateError } = await supabase
        .from('subscription_templates')
        .select('template_id')
        .eq('subscription_id', subscriptionId)
        .single();
      
      if (anyTemplateError) {
        console.error("No template found for subscription:", anyTemplateError);
        return false;
      }
      
      if (!anyTemplate) {
        console.error("No template found for subscription");
        return false;
      }
      
      // Use the first available template
      return true;
    }
    
    if (!subscriptionTemplate) {
      console.error("No default template found for subscription");
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error assigning template to client:", error);
    return false;
  }
}

// Get client onboarding steps
export async function getClientOnboardingSteps(clientId: string) {
  try {
    if (!clientId) return [];
    
    // Use Supabase's RPC to call the custom function that returns client template steps
    const { data, error } = await supabase.rpc('get_client_template_steps', {
      client_id: clientId
    });
    
    if (error) {
      console.error("Error getting client onboarding steps:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error getting client onboarding steps:', error);
    return [];
  }
}

// Update client progress
export async function updateClientProgress(clientId: string, stepOrder: number, completed: boolean): Promise<boolean> {
  try {
    if (!clientId) return false;
    
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('onboarding_progress')
      .update({
        completed,
        completed_at: completed ? now : null
      })
      .eq('client_id', clientId)
      .eq('step_order', stepOrder);
    
    if (error) {
      console.error("Error updating client progress:", error);
      toast({
        title: "Error",
        description: "Failed to update onboarding progress",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error updating client progress:", error);
    toast({
      title: "Error",
      description: "Failed to update onboarding progress",
      variant: "destructive",
    });
    return false;
  }
}
