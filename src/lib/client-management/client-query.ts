
import { supabase } from "@/integrations/supabase/client";
import { OnboardingClient, TeamMember, Addon, Subscription, OnboardingProgressItem, OnboardingProgress, OnboardingProgressRecord } from "../types/client-types";

export async function getClientById(clientId: string): Promise<OnboardingClient | null> {
  try {
    const { data: client, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (error) {
      console.error('Error fetching client:', error);
      return null;
    }

    if (!client) return null;

    // Fetch team members
    const { data: teamMembers, error: teamError } = await supabase
      .from('team_members')
      .select('*')
      .eq('client_id', clientId);

    if (teamError) {
      console.error('Error fetching team members:', teamError);
    }

    // Fetch client addon data
    const { data: clientAddons, error: addonError } = await supabase
      .from('client_addons')
      .select(`
        addons (*)
      `)
      .eq('client_id', clientId);

    if (addonError) {
      console.error('Error fetching client addons:', addonError);
    }

    // Fetch onboarding progress
    const { data: progress, error: progressError } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('client_id', clientId);

    if (progressError) {
      console.error('Error fetching onboarding progress:', progressError);
    }

    // Fetch client's subscription data
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('client_subscriptions')
      .select(`
        subscriptions (*)
      `)
      .eq('client_id', clientId)
      .single();

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      console.error('Error fetching client subscription:', subscriptionError);
    }

    // Process the data
    const addons: Addon[] = clientAddons
      ? clientAddons.map((item: any) => ({
          id: item.addons?.id || '',
          name: item.addons?.name || '',
          price: item.addons?.price || 0,
          description: item.addons?.description || '',
        }))
      : [];

    // Fixed subscription data handling - TypeScript was seeing this as an array but it's an object
    let subscription: Subscription = { id: '', name: 'Standard', price: 0, description: 'Standard plan' };
    
    if (subscriptionData && subscriptionData.subscriptions) {
      // Check if subscriptions is an object (expected case)
      const subData = subscriptionData.subscriptions;
      if (typeof subData === 'object' && !Array.isArray(subData)) {
        subscription = {
          id: subData.id || '',
          name: subData.name || 'Standard',
          price: subData.price || 0,
          description: subData.description || 'Standard plan',
        };
      }
      // If it's actually an array (unexpected case), take the first item if available
      else if (Array.isArray(subData) && subData.length > 0) {
        subscription = {
          id: subData[0].id || '',
          name: subData[0].name || 'Standard',
          price: subData[0].price || 0,
          description: subData[0].description || 'Standard plan',
        };
      }
      // Default is already set above
    }

    // Calculate progress percentage
    let onboardingProgress = progress || [];
    const totalSteps = 5; // Default number of steps
    const completedSteps = onboardingProgress.filter(s => s.completed).length;
    const progressPercentage = Math.round((completedSteps / totalSteps) * 100);

    // Prepare the client object
    const enhancedClient: OnboardingClient = {
      ...client,
      subscriptionTier: subscription,
      addons: addons || [],
      teamMembers: (teamMembers || []) as TeamMember[],
      onboardingProgress: onboardingProgress,
      createdAt: client.created_at,
    };

    return enhancedClient;
  } catch (err) {
    console.error("Error in getClientById:", err);
    return null;
  }
}

export async function getClients(): Promise<OnboardingClient[]> {
  try {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clients:', error);
      return [];
    }

    // Process each client to get additional data
    const enhancedClients = await Promise.all(
      clients.map(async (client) => {
        return await getClientById(client.id) as OnboardingClient;
      })
    );

    return enhancedClients.filter(c => c !== null) as OnboardingClient[];
  } catch (err) {
    console.error("Error in getClients:", err);
    return [];
  }
}

export async function calculateClientProgress(clientId: string): Promise<{progress: number; completedSteps: number; totalSteps: number}> {
  try {
    const progress = await getClientProgress(clientId);
    
    if (!progress || progress.length === 0) {
      return { progress: 0, completedSteps: 0, totalSteps: 0 };
    }
    
    const completedSteps = progress.filter(step => step.completed).length;
    const totalSteps = progress.length;
    const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
    
    return {
      progress: progressPercentage,
      completedSteps,
      totalSteps
    };
  } catch (error) {
    console.error("Error calculating client progress:", error);
    return { progress: 0, completedSteps: 0, totalSteps: 0 };
  }
}

export async function getClientProgress(clientId: string): Promise<OnboardingProgressRecord[]> {
  try {
    const { data, error } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('client_id', clientId)
      .order('step_order', { ascending: true });
    
    if (error) {
      console.error("Error fetching client progress:", error);
      return [];
    }
    
    return data.map(item => ({
      clientId: item.client_id,
      stepName: item.step_name,
      stepOrder: item.step_order,
      completed: item.completed,
      startedAt: item.started_at,
      completedAt: item.completed_at
    }));
  } catch (error) {
    console.error("Error in getClientProgress:", error);
    return [];
  }
}

export async function getOnboardingClients(): Promise<OnboardingClient[]> {
  try {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('*')
      .eq('onboarding_completed', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching onboarding clients:', error);
      return [];
    }

    // Process each client to get additional data
    const enhancedClients = await Promise.all(
      clients.map(async (client) => {
        return await getClientById(client.id) as OnboardingClient;
      })
    );

    return enhancedClients.filter(c => c !== null) as OnboardingClient[];
  } catch (err) {
    console.error("Error in getOnboardingClients:", err);
    return [];
  }
}
