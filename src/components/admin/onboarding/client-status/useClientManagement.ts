
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { OnboardingClient, getClients, completeClientOnboarding } from "@/lib/clients";

export function useClientManagement() {
  const [clients, setClients] = useState<OnboardingClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const clientsData = await getClients();
      setClients(clientsData);
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
        
        // Update the client status in the UI
        setClients(prevClients => 
          prevClients.map(client => 
            client.id === id 
              ? { 
                  ...client, 
                  status: "active"
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
    // Calculate progress based on completion of team invitations and onboarding steps
    // This would ideally come from a more complex calculation based on checklist completion
    const total_steps = 6;
    let steps_completed = 0;
    
    // Basic progress calculation
    if (client.email) steps_completed++;
    if (client.companyName) steps_completed++;
    if (client.subscriptionTier.id) steps_completed++;
    if (client.teamMembers.length > 0) steps_completed++;
    if (client.teamMembers.some(m => m.invitationStatus === 'accepted')) steps_completed++;
    if (client.status === 'active') steps_completed = total_steps;
    
    const progress = Math.round((steps_completed / total_steps) * 100);
    
    return { progress, steps_completed, total_steps };
  };

  const filteredClients = clients.filter(client => 
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.companyName && client.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    client.subscriptionTier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    clients: filteredClients,
    isLoading,
    searchQuery,
    setSearchQuery,
    processingId,
    fetchClients,
    markClientComplete,
    getClientProgress
  };
}
