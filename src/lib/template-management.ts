
import { supabase } from "@/integrations/supabase/client";
import { OnboardingTemplate, OnboardingTemplateStep, SubscriptionTemplate, AddonTemplateStep } from "@/lib/types/client-types";

// Fetch all onboarding templates
export async function getOnboardingTemplates(): Promise<OnboardingTemplate[]> {
  try {
    const { data, error } = await supabase
      .from('onboarding_templates')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error("Error fetching onboarding templates:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching onboarding templates:", error);
    return [];
  }
}

// Fetch a single template with its steps
export async function getTemplateWithSteps(templateId: string): Promise<OnboardingTemplate | null> {
  try {
    // Get the template
    const { data: template, error: templateError } = await supabase
      .from('onboarding_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (templateError) {
      console.error("Error fetching template:", templateError);
      throw templateError;
    }
    
    // Get the template steps
    const { data: steps, error: stepsError } = await supabase
      .from('onboarding_template_steps')
      .select('*')
      .eq('template_id', templateId)
      .order('order_index', { ascending: true });
    
    if (stepsError) {
      console.error("Error fetching template steps:", stepsError);
      throw stepsError;
    }
    
    return {
      ...template,
      steps: steps || []
    };
  } catch (error) {
    console.error("Error fetching template with steps:", error);
    return null;
  }
}

// Create a new onboarding template
export async function createOnboardingTemplate(template: Omit<OnboardingTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<OnboardingTemplate | null> {
  try {
    const { data: newTemplate, error: templateError } = await supabase
      .from('onboarding_templates')
      .insert({
        name: template.name,
        description: template.description,
        is_default: template.is_default
      })
      .select()
      .single();
    
    if (templateError) {
      console.error("Error creating template:", templateError);
      throw templateError;
    }
    
    // If there are steps to add
    if (template.steps && template.steps.length > 0) {
      const stepsToInsert = template.steps.map((step, index) => ({
        template_id: newTemplate.id,
        title: step.title,
        description: step.description,
        order_index: step.order_index || index + 1,
        required_document_categories: step.required_document_categories
      }));
      
      const { error: stepsError } = await supabase
        .from('onboarding_template_steps')
        .insert(stepsToInsert);
      
      if (stepsError) {
        console.error("Error adding template steps:", stepsError);
        throw stepsError;
      }
    }
    
    return newTemplate;
  } catch (error) {
    console.error("Error creating onboarding template:", error);
    return null;
  }
}

// Update an existing template
export async function updateOnboardingTemplate(
  templateId: string, 
  template: Partial<OnboardingTemplate>
): Promise<OnboardingTemplate | null> {
  try {
    // Update template details
    const { data: updatedTemplate, error: templateError } = await supabase
      .from('onboarding_templates')
      .update({
        name: template.name,
        description: template.description,
        is_default: template.is_default,
        updated_at: new Date().toISOString()
      })
      .eq('id', templateId)
      .select()
      .single();
    
    if (templateError) {
      console.error("Error updating template:", templateError);
      throw templateError;
    }
    
    // If there are steps to update, we use a replace all approach
    if (template.steps && template.steps.length > 0) {
      // Delete all existing steps
      const { error: deleteError } = await supabase
        .from('onboarding_template_steps')
        .delete()
        .eq('template_id', templateId);
      
      if (deleteError) {
        console.error("Error deleting existing steps:", deleteError);
        throw deleteError;
      }
      
      // Insert new steps
      const stepsToInsert = template.steps.map((step, index) => ({
        template_id: templateId,
        title: step.title,
        description: step.description,
        order_index: step.order_index || index + 1,
        required_document_categories: step.required_document_categories
      }));
      
      const { error: stepsError } = await supabase
        .from('onboarding_template_steps')
        .insert(stepsToInsert);
      
      if (stepsError) {
        console.error("Error adding updated template steps:", stepsError);
        throw stepsError;
      }
    }
    
    return updatedTemplate;
  } catch (error) {
    console.error("Error updating onboarding template:", error);
    return null;
  }
}

// Delete a template
export async function deleteOnboardingTemplate(templateId: string): Promise<boolean> {
  try {
    // The steps will be automatically deleted due to the CASCADE constraint
    const { error } = await supabase
      .from('onboarding_templates')
      .delete()
      .eq('id', templateId);
    
    if (error) {
      console.error("Error deleting template:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting onboarding template:", error);
    return false;
  }
}

// Link a template to a subscription tier
export async function linkTemplateToSubscription(
  subscriptionId: string,
  templateId: string,
  isDefault: boolean = true
): Promise<SubscriptionTemplate | null> {
  try {
    // Check if a default template already exists for this subscription
    if (isDefault) {
      // Set all existing templates for this subscription to non-default
      const { error: updateError } = await supabase
        .from('subscription_templates')
        .update({ is_default: false })
        .eq('subscription_id', subscriptionId);
      
      if (updateError) {
        console.error("Error updating existing templates:", updateError);
        throw updateError;
      }
    }
    
    // Create the new subscription-template link
    const { data, error } = await supabase
      .from('subscription_templates')
      .insert({
        subscription_id: subscriptionId,
        template_id: templateId,
        is_default: isDefault
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error linking template to subscription:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error linking template to subscription:", error);
    return null;
  }
}

// Get client onboarding steps based on subscription and add-ons
export async function getClientOnboardingSteps(clientId: string) {
  try {
    const { data, error } = await supabase
      .rpc('get_client_template_steps', { client_id: clientId });
    
    if (error) {
      console.error("Error fetching client onboarding steps:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching client onboarding steps:", error);
    return [];
  }
}

// Get addon specific steps
export async function getAddonTemplateSteps(addonId: string): Promise<AddonTemplateStep[]> {
  try {
    const { data, error } = await supabase
      .from('addon_template_steps')
      .select('*')
      .eq('addon_id', addonId)
      .order('order_index', { ascending: true });
    
    if (error) {
      console.error("Error fetching addon template steps:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching addon template steps:", error);
    return [];
  }
}

// Create or update addon template steps
export async function saveAddonTemplateSteps(
  addonId: string,
  steps: Omit<AddonTemplateStep, 'id'>[]
): Promise<boolean> {
  try {
    // Delete existing steps for this addon
    const { error: deleteError } = await supabase
      .from('addon_template_steps')
      .delete()
      .eq('addon_id', addonId);
    
    if (deleteError) {
      console.error("Error deleting existing addon steps:", deleteError);
      throw deleteError;
    }
    
    // Only insert if there are steps
    if (steps.length > 0) {
      // Insert new steps
      const stepsToInsert = steps.map((step, index) => ({
        addon_id: addonId,
        title: step.title,
        description: step.description,
        order_index: step.order_index || index + 1,
        required_document_categories: step.required_document_categories
      }));
      
      const { error: insertError } = await supabase
        .from('addon_template_steps')
        .insert(stepsToInsert);
      
      if (insertError) {
        console.error("Error adding addon steps:", insertError);
        throw insertError;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error saving addon template steps:", error);
    return false;
  }
}
