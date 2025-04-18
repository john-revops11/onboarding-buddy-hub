
import { supabase } from "@/integrations/supabase/client";
import { OnboardingClient, TeamMember, Addon, Subscription } from "../types/client-types";

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
          id: item.addons.id,
          name: item.addons.name,
          price: item.addons.price,
          description: item.addons.description,
        }))
      : [];

    const subscription: Subscription = subscriptionData?.subscriptions 
      ? {
          id: subscriptionData.subscriptions.id,
          name: subscriptionData.subscriptions.name,
          price: subscriptionData.subscriptions.price,
          description: subscriptionData.subscriptions.description,
        }
      : { id: '', name: 'Standard', price: 0, description: 'Standard plan' };

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
