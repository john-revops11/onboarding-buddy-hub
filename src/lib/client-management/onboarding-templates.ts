
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
    // First, check if the client already has a template
    const { data: progressData, error: progressError } = await supabase
      .from('onboarding_progress')
      .select('id')
      .eq('client_id', clientId)
      .limit(1);
    
    if (progressError) throw progressError;
    
    // If progress data exists, the client already has a template assigned
    if (progressData && progressData.length > 0) {
      return true; // Template already assigned
    }
    
    // Get client's subscription to find the appropriate template
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('subscription_id')
      .eq('id', clientId)
      .single();
    
    if (clientError) throw clientError;
    
    // Find subscription template
    const { data: templateData, error: templateError } = await supabase
      .from('subscription_templates')
      .select('template_id')
      .eq('subscription_id', clientData.subscription_id)
      .eq('is_default', true)
      .single();
    
    if (templateError) {
      // If no specific template for this subscription, use global default
      const { data: defaultTemplate, error: defaultError } = await supabase
        .from('onboarding_templates')
        .select('id')
        .eq('is_default', true)
        .single();
      
      if (defaultError) throw defaultError;
      
      if (!defaultTemplate) {
        // No default template found
        console.error("No default template found");
        return false;
      }
      
      // Use default template
      return createClientProgressFromTemplate(clientId, defaultTemplate.id);
    }
    
    // Use subscription's template
    return createClientProgressFromTemplate(clientId, templateData.template_id);
  } catch (error) {
    console.error("Error assigning template to client:", error);
    return false;
  }
}

// Create client progress records from template
async function createClientProgressFromTemplate(clientId: string, templateId: string): Promise<boolean> {
  try {
    // Get template steps
    const { data: steps, error: stepsError } = await supabase
      .from('onboarding_template_steps')
      .select('title, order_index, description')
      .eq('template_id', templateId)
      .order('order_index', { ascending: true });
    
    if (stepsError) throw stepsError;
    
    if (!steps || steps.length === 0) {
      console.error("Template has no steps");
      return false;
    }
    
    // Create progress records for each step
    const progressRecords = steps.map(step => ({
      client_id: clientId,
      step_name: step.title,
      step_order: step.order_index,
      description: step.description,
      completed: false
    }));
    
    const { error: insertError } = await supabase
      .from('onboarding_progress')
      .insert(progressRecords);
    
    if (insertError) throw insertError;
    
    return true;
  } catch (error) {
    console.error("Error creating client progress from template:", error);
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
    const updateData = {
      completed,
      completed_at: completed ? new Date().toISOString() : null
    };
    
    const { error } = await supabase
      .from('onboarding_progress')
      .update(updateData)
      .eq('client_id', clientId)
      .eq('step_order', stepOrder);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error updating client progress:", error);
    return false;
  }
}

// Get all onboarding templates
export async function getOnboardingTemplates() {
  try {
    const { data, error } = await supabase
      .from('onboarding_templates')
      .select(`
        id, name, description, is_default, created_at,
        onboarding_template_steps (
          id, title, description, order_index, required_document_categories
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      isDefault: template.is_default,
      createdAt: template.created_at,
      steps: (template.onboarding_template_steps || []).map(step => ({
        id: step.id,
        title: step.title,
        description: step.description,
        orderIndex: step.order_index,
        requiredDocumentCategories: step.required_document_categories
      }))
    }));
  } catch (error) {
    console.error("Error fetching onboarding templates:", error);
    return [];
  }
}
