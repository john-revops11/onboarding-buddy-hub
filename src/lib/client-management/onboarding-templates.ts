
import { supabase } from "@/integrations/supabase/client";

/**
 * Assign a template to a client based on their subscription
 * @param clientId The client ID
 * @returns Promise indicating success
 */
export async function assignTemplateToClient(clientId: string): Promise<boolean> {
  try {
    // Get the client's subscription ID
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('subscription_id')
      .eq('id', clientId)
      .single();
    
    if (clientError) throw clientError;
    
    if (!client.subscription_id) {
      console.error('Client has no subscription, cannot assign template');
      return false;
    }
    
    // Find the default template for this subscription
    const { data: subscriptionTemplate, error: templateError } = await supabase
      .from('subscription_templates')
      .select('template_id')
      .eq('subscription_id', client.subscription_id)
      .eq('is_default', true)
      .single();
    
    if (templateError) {
      // If no default template for this subscription, find the global default
      const { data: defaultTemplate, error: defaultError } = await supabase
        .from('onboarding_templates')
        .select('id')
        .eq('is_default', true)
        .single();
      
      if (defaultError) {
        console.error('No default template found');
        return false;
      }
      
      // Create onboarding progress entries for the global default template
      return await createOnboardingProgressFromTemplate(clientId, defaultTemplate.id);
    }
    
    // Create onboarding progress entries for the subscription's template
    return await createOnboardingProgressFromTemplate(clientId, subscriptionTemplate.template_id);
  } catch (error: any) {
    console.error('Error assigning template to client:', error);
    return false;
  }
}

/**
 * Create onboarding progress entries for a client based on a template
 * @param clientId The client ID
 * @param templateId The template ID
 * @returns Promise indicating success
 */
export async function createOnboardingProgressFromTemplate(
  clientId: string,
  templateId: string
): Promise<boolean> {
  try {
    // Get template steps
    const { data: steps, error: stepsError } = await supabase
      .from('onboarding_template_steps')
      .select('*')
      .eq('template_id', templateId)
      .order('order_index', { ascending: true });
    
    if (stepsError) throw stepsError;
    
    // Create progress entries for each step
    const progressEntries = steps.map((step, index) => ({
      client_id: clientId,
      step_name: step.title,
      step_order: step.order_index,
      completed: false
    }));
    
    // Insert progress entries
    const { error: insertError } = await supabase
      .from('onboarding_progress')
      .insert(progressEntries);
    
    if (insertError) throw insertError;
    
    // Get addon steps
    const { data: clientAddons, error: addonsError } = await supabase
      .from('client_addons')
      .select('addon_id')
      .eq('client_id', clientId);
    
    if (addonsError) throw addonsError;
    
    // If client has addons, add those steps too
    if (clientAddons && clientAddons.length > 0) {
      for (const { addon_id } of clientAddons) {
        const { data: addonSteps, error: addonStepsError } = await supabase
          .from('addon_template_steps')
          .select('*')
          .eq('addon_id', addon_id)
          .order('order_index', { ascending: true });
        
        if (addonStepsError) throw addonStepsError;
        
        if (addonSteps && addonSteps.length > 0) {
          const addonProgressEntries = addonSteps.map(step => ({
            client_id: clientId,
            step_name: step.title,
            step_order: steps.length + step.order_index, // Add after base template steps
            completed: false
          }));
          
          const { error: addonInsertError } = await supabase
            .from('onboarding_progress')
            .insert(addonProgressEntries);
          
          if (addonInsertError) throw addonInsertError;
        }
      }
    }
    
    return true;
  } catch (error: any) {
    console.error('Error creating onboarding progress from template:', error);
    return false;
  }
}

/**
 * Update client onboarding progress
 * @param clientId The client ID
 * @param stepOrder The step order
 * @param completed Whether the step is completed
 * @returns Promise indicating success
 */
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
  } catch (error: any) {
    console.error('Error updating client progress:', error);
    return false;
  }
}
