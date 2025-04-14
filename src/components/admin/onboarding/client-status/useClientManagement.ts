
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import { OnboardingClient } from "@/lib/types/client-types";
import { getClients, completeClientOnboarding } from "@/lib/client-management";
import { supabase } from "@/integrations/supabase/client";

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

  const retryDriveCreation = async (id: string, email: string, companyName: string) => {
    try {
      // Updated to use proper method with apiKey from Supabase client
      const { data, error } = await supabase.functions.invoke('create-google-drive', {
        body: {
          userEmail: email,
          companyName: companyName
        }
      });
      
      if (error) {
        console.error('Error creating Google Drive:', error);
        throw new Error(error.message || 'Failed to create Google Drive');
      }
      
      if (data && data.driveId) {
        // Update client with the drive ID
        const { error: updateError } = await supabase
          .from('clients')
          .update({ 
            drive_id: data.driveId,
            drive_name: data.simulated ? `(Simulated) ${companyName}` : companyName
          })
          .eq('id', id);
          
        if (updateError) {
          throw new Error(updateError.message);
        }
        
        // Update local state
        setClients(prevClients => 
          prevClients.map(client => 
            client.id === id 
              ? { 
                  ...client, 
                  drive_id: data.driveId,
                  drive_name: data.simulated ? `(Simulated) ${companyName}` : companyName
                } 
              : client
          )
        );
        
        toast({
          title: data.simulated ? "Simulated Drive Created" : "Drive Created",
          description: data.message || "Google Drive was created successfully.",
        });
        
        return true;
      } else {
        throw new Error('No drive ID returned');
      }
    } catch (error: any) {
      console.error('Failed to create Google Drive:', error);
      toast({
        title: "Drive Creation Failed",
        description: error.message || "Failed to create Google Drive. Please try again later.",
        variant: "destructive"
      });
      return false;
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
    retryDriveCreation,
    getClientProgress
  };
}
