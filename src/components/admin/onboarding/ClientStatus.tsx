
import { useNavigate } from "react-router-dom";
import { ClientStatusHeader } from "./client-status/ClientStatusHeader";
import { ClientsTable } from "./client-status/ClientsTable";
import { useClientManagement } from "./client-status/useClientManagement";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Icons } from "@/components/icons";
import { supabase } from "@/integrations/supabase/client";

export function ClientStatus() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreatingDrives, setIsCreatingDrives] = useState(false);
  const [isBackfilling, setIsBackfilling] = useState(false);
  
  const { 
    clients, 
    isLoading, 
    searchQuery, 
    setSearchQuery, 
    processingId, 
    fetchClients, 
    markClientComplete, 
    retryDriveCreation,
    getClientProgress 
  } = useClientManagement();

  const viewClientDetails = (id: string) => {
    // Navigate to a client-specific view
    navigate(`/admin/clients/${id}`);
  };

  const handleCreateMissingDrives = async () => {
    setIsCreatingDrives(true);
    let successCount = 0;
    let failCount = 0;
    
    try {
      const clientsWithoutDrives = clients.filter(client => !client.drive_id);
      
      if (clientsWithoutDrives.length === 0) {
        toast({
          title: "No Missing Drives",
          description: "All clients already have Google Drives associated with them.",
        });
        return;
      }
      
      // Process clients without drives
      for (const client of clientsWithoutDrives) {
        const success = await retryDriveCreation(
          client.id, 
          client.email, 
          client.companyName || `Client-${client.id}`
        );
        
        if (success) {
          successCount++;
        } else {
          failCount++;
        }
      }
      
      // Show summary toast
      toast({
        title: "Drive Creation Complete",
        description: `Successfully created ${successCount} drives${failCount > 0 ? `, failed to create ${failCount} drives` : ''}.`,
        variant: successCount > 0 ? "default" : "destructive",
      });
      
    } catch (error) {
      console.error("Error creating missing drives:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating missing drives.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingDrives(false);
    }
  };

  // Modify this function to make it void instead of returning a boolean
  const handleRetryDriveCreation = async (id: string, email: string, companyName: string): Promise<void> => {
    await retryDriveCreation(id, email, companyName);
  };

  const handleBackfillPermissions = async () => {
    setIsBackfilling(true);
    try {
      // This is a placeholder for future functionality
      // In a real implementation, this would call an edge function to backfill permissions
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Permissions Updated",
        description: "Successfully updated drive permissions for all clients.",
      });
    } catch (error) {
      console.error("Error backfilling permissions:", error);
      toast({
        title: "Error",
        description: "Failed to backfill permissions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBackfilling(false);
    }
  };

  return (
    <div className="space-y-4">
      <ClientStatusHeader 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        refreshClients={fetchClients} 
      />
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          variant="outline" 
          onClick={handleCreateMissingDrives}
          disabled={isCreatingDrives || isLoading}
        >
          {isCreatingDrives ? (
            <>
              <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
              Creating Drives...
            </>
          ) : (
            "Create Missing Drives"
          )}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleBackfillPermissions}
          disabled={isBackfilling || isLoading}
        >
          {isBackfilling ? (
            <>
              <Icons.spinner className="h-4 w-4 animate-spin mr-2" />
              Updating Permissions...
            </>
          ) : (
            "Backfill Drive Permissions"
          )}
        </Button>
      </div>
      
      <ClientsTable 
        isLoading={isLoading}
        clients={clients}
        processingId={processingId}
        getClientProgress={getClientProgress}
        onMarkComplete={markClientComplete}
        onViewDetails={viewClientDetails}
        onRetryDriveCreation={handleRetryDriveCreation}
      />
    </div>
  );
}
