
import { supabase } from "@/integrations/supabase/client";
import { OnboardingProgressRecord } from "@/lib/types/client-types";

/**
 * Get onboarding progress for a client
 * @param clientId The client ID
 * @returns Promise with the client's onboarding progress
 */
export async function getOnboardingProgress(clientId: string): Promise<OnboardingProgressRecord[]> {
  try {
    const { data, error } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('client_id', clientId)
      .order('step_order', { ascending: true });
    
    if (error) throw error;
    
    return data.map(record => ({
      clientId: record.client_id,
      stepName: record.step_name,
      stepOrder: record.step_order,
      completed: record.completed,
      startedAt: record.started_at,
      completedAt: record.completed_at
    }));
  } catch (error: any) {
    console.error('Error getting onboarding progress:', error);
    throw error;
  }
}

/**
 * Update onboarding step status
 * @param clientId The client ID
 * @param stepName The step name
 * @param completed Whether the step is completed
 * @returns Promise with the updated progress record
 */
export async function updateOnboardingStep(
  clientId: string,
  stepName: string,
  completed: boolean
): Promise<OnboardingProgressRecord> {
  try {
    const { data, error } = await supabase
      .from('onboarding_progress')
      .update({
        completed,
        completed_at: completed ? new Date().toISOString() : null
      })
      .eq('client_id', clientId)
      .eq('step_name', stepName)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      clientId: data.client_id,
      stepName: data.step_name,
      stepOrder: data.step_order,
      completed: data.completed,
      startedAt: data.started_at,
      completedAt: data.completed_at
    };
  } catch (error: any) {
    console.error('Error updating onboarding step:', error);
    throw error;
  }
}

/**
 * Calculate overall onboarding progress percentage
 * @param clientId The client ID
 * @returns Promise with the progress percentage
 */
export async function calculateOnboardingProgress(clientId: string): Promise<number> {
  try {
    const progress = await getOnboardingProgress(clientId);
    
    if (progress.length === 0) return 0;
    
    const completedSteps = progress.filter(step => step.completed).length;
    return Math.round((completedSteps / progress.length) * 100);
  } catch (error: any) {
    console.error('Error calculating onboarding progress:', error);
    return 0;
  }
}

/**
 * Mark client onboarding as complete
 * @param clientId The client ID
 * @returns Promise<boolean> indicating success
 */
export async function completeClientOnboarding(clientId: string): Promise<boolean> {
  try {
    // Update all onboarding steps to completed
    const { error: stepsError } = await supabase
      .from('onboarding_progress')
      .update({
        completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('client_id', clientId);
    
    if (stepsError) throw stepsError;
    
    // Update client record
    const { error: clientError } = await supabase
      .from('clients')
      .update({
        onboarding_completed: true,
        status: 'active'
      })
      .eq('id', clientId);
    
    if (clientError) throw clientError;
    
    return true;
  } catch (error: any) {
    console.error('Error completing client onboarding:', error);
    return false;
  }
}
