
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { OnboardingClient, Subscription, Addon } from "@/lib/types/client-types";

// Get a list of all clients
export async function getClients(): Promise<OnboardingClient[]> {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        id,
        email,
        company_name,
        status,
        created_at,
        subscription_id,
        onboarding_completed
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(client => ({
      id: client.id,
      email: client.email,
      companyName: client.company_name,
      status: client.status,
      created_at: client.created_at,
      onboardingProgress: [],
      subscriptionTier: { id: '', name: '', description: '', price: 0 } // Will be populated later
    }));
  } catch (error: any) {
    console.error("Error fetching clients:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to fetch clients",
      variant: "destructive",
    });
    return [];
  }
}

// Get client with subscription, addons, and team members
export async function getClientDetails(clientId: string): Promise<OnboardingClient | null> {
  try {
    // Get client data
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select(`
        id,
        email,
        company_name,
        status,
        created_at,
        subscription_id
      `)
      .eq('id', clientId)
      .single();
    
    if (clientError) throw clientError;
    
    // Get subscription data
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('id', client.subscription_id)
      .single();
    
    if (subscriptionError && subscriptionError.code !== 'PGRST116') throw subscriptionError;
    
    // Get addons data
    const { data: clientAddons, error: addonsError } = await supabase
      .from('client_addons')
      .select(`
        addon_id,
        addons (id, name, price, description)
      `)
      .eq('client_id', client.id);
    
    if (addonsError) throw addonsError;
    
    const addons: Addon[] = clientAddons?.map(item => ({
      id: item.addons.id,
      name: item.addons.name,
      price: item.addons.price,
      description: item.addons.description || ''
    })) || [];
    
    // Get team members
    const { data: teamMembers, error: teamError } = await supabase
      .from('team_members')
      .select('id, email, invitation_status')
      .eq('client_id', client.id);
    
    if (teamError) throw teamError;
    
    // Get onboarding progress
    const { data: progress, error: progressError } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('client_id', client.id)
      .order('step_order', { ascending: true });
    
    if (progressError) throw progressError;
    
    const subscriptionData: Subscription = subscription ? {
      id: subscription.id,
      name: subscription.name,
      price: subscription.price,
      description: subscription.description || '',
      features: subscription.features || []
    } : {
      id: '',
      name: 'Unknown Subscription',
      price: 0,
      description: ''
    };
    
    return {
      id: client.id,
      email: client.email,
      companyName: client.company_name,
      status: client.status,
      created_at: client.created_at,
      subscriptionTier: subscriptionData,
      addons: addons,
      teamMembers: teamMembers?.map(tm => ({
        id: tm.id,
        email: tm.email,
        invitationStatus: tm.invitation_status
      })) || [],
      onboardingProgress: progress?.map(p => ({
        stepId: p.step_name,
        completed: p.completed,
        startedAt: p.started_at,
        completedAt: p.completed_at
      })) || []
    };
  } catch (error: any) {
    console.error("Error fetching client details:", error);
    toast({
      title: "Error",
      description: error.message || "Failed to fetch client details",
      variant: "destructive",
    });
    return null;
  }
}
