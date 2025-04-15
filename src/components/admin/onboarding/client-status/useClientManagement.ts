import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { OnboardingClient } from "@/lib/types/client-types";
import { getClients, completeClientOnboarding } from "@/lib/client-management";

export function useClientManagement() {
  const [clients, setClients] = useState<OnboardingClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const clientsData = await getClients();
      console.log("Fetched clients:", clientsData);
      const typedClientsData = clientsData.map(client => ({
        ...client,
        status: client.status as "pending" | "active"
      }));
      setClients(typedClientsData);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Error",
        description: "Failed to load clients. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const markClientComplete = async (id: string) => {
    setProcessingId(id);
    try {
      const success = await completeClientOnboarding(id);
      
      if (success) {
        toast({
          title: "Onboarding Completed",
          description: "The client's onboarding has been marked as complete."
        });
        
        setClients(prevClients => 
          prevClients.map(client => 
            client.id === id 
              ? { 
                  ...client, 
                  status: "active" as const
                } 
              : client
          )
        );
      }
    } catch (error) {
      console.error("Error marking client as complete:", error);
      toast({
        title: "Error",
        description: "Failed to update client status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getClientProgress = (client: OnboardingClient): {progress: number, steps_completed: number, total_steps: number} => {
    const total_steps = 6;
    let steps_completed = 0;
    
    if (client.onboardingProgress && client.onboardingProgress.length > 0) {
      const completedSteps = client.onboardingProgress.filter(step => step.completed).length;
      const totalSteps = client.onboardingProgress.length;
      const progressPercent = Math.round((completedSteps / totalSteps) * 100);
      
      return {
        progress: progressPercent,
        steps_completed: completedSteps,
        total_steps: totalSteps
      };
    }
    
    if (client.email) steps_completed++;
    if (client.companyName) steps_completed++;
    if (client.subscriptionTier.id) steps_completed++;
    if (client.teamMembers.length > 0) steps_completed++;
    if (client.teamMembers.some(m => m.invitationStatus === 'accepted')) steps_completed++;
    if (client.status === 'active') steps_completed = total_steps;
    
    const progress = Math.round((steps_completed / total_steps) * 100);
    
    return { progress, steps_completed, total_steps };
  };

  const filteredClients = clients.filter(client => {
    const searchLower = searchQuery.toLowerCase();
    
    return (
      client.email.toLowerCase().includes(searchLower) ||
      (client.companyName && client.companyName.toLowerCase().includes(searchLower)) ||
      client.subscriptionTier.name.toLowerCase().includes(searchLower) ||
      client.addons.some(addon => addon.name.toLowerCase().includes(searchLower))
    );
  });

  return {
    clients: filteredClients,
    allClients: clients,
    isLoading,
    searchQuery,
    setSearchQuery,
    processingId,
    fetchClients,
    markClientComplete,
    getClientProgress
  };
}
