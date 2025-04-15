
import { supabase } from "@/integrations/supabase/client";
import { ClientOnboardingStep } from "@/lib/types/client-types";

// Get onboarding steps for a client
export async function getClientOnboardingSteps(clientId: string): Promise<ClientOnboardingStep[]> {
  try {
    const { data, error } = await supabase.rpc('get_client_template_steps', {
      client_id: clientId
    });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching client onboarding steps:", error);
    return [];
  }
}

// Assign a template to a client
export async function assignTemplateToClient(clientId: string): Promise<boolean> {
  try {
    // Get the client's subscription
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('subscription_id')
      .eq('id', clientId)
      .single();
    
    if (clientError || !client.subscription_id) {
      console.error("Error getting client subscription:", clientError);
      return false;
    }
    
    // Get the default template for this subscription
    const { data: templates, error: templateError } = await supabase
      .from('subscription_templates')
      .select('template_id')
      .eq('subscription_id', client.subscription_id)
      .eq('is_default', true)
      .limit(1);
    
    if (templateError || !templates || templates.length === 0) {
      console.error("Error getting subscription template:", templateError);
      return false;
    }
    
    // Check if onboarding progress already exists for this client
    const { data: progress, error: progressError } = await supabase
      .from('onboarding_progress')
      .select('id')
      .eq('client_id', clientId)
      .limit(1);
    
    if (!progressError && progress && progress.length > 0) {
      // Already has onboarding progress
      return true;
    }
    
    // Get template steps
    const { data: steps, error: stepsError } = await supabase
      .from('onboarding_template_steps')
      .select('*')
      .eq('template_id', templates[0].template_id)
      .order('order_index', { ascending: true });
    
    if (stepsError || !steps) {
      console.error("Error getting template steps:", stepsError);
      return false;
    }
    
    // Create onboarding progress records
    const progressRecords = steps.map(step => ({
      client_id: clientId,
      step_name: step.title,
      step_order: step.order_index,
      completed: false
    }));
    
    const { error: insertError } = await supabase
      .from('onboarding_progress')
      .insert(progressRecords);
    
    if (insertError) {
      console.error("Error creating onboarding progress:", insertError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error assigning template to client:", error);
    return false;
  }
}

// Update client progress
export async function updateClientProgress(
  clientId: string, 
  stepOrder: number, 
  completed: boolean
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('onboarding_progress')
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null
      })
      .eq('client_id', clientId)
      .eq('step_order', stepOrder);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error updating client progress:", error);
    return false;
  }
}
