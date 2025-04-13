
import { useNavigate } from "react-router-dom";
import { ClientStatusHeader } from "./client-status/ClientStatusHeader";
import { ClientsTable } from "./client-status/ClientsTable";
import { useClientManagement } from "./client-status/useClientManagement";
import { Button } from "@/components/ui/button";
import { useDriveIntegration } from "@/hooks/useDriveIntegration";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Icons } from "@/components/icons";

export function ClientStatus() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { triggerSharedDriveCreation, backfillPermissions } = useDriveIntegration();
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
    getClientProgress 
  } = useClientManagement();

  const viewClientDetails = (id: string) => {
    // Navigate to a client-specific view
    navigate(`/admin/clients/${id}`);
  };

  const handleCreateDrives = async () => {
    setIsCreatingDrives(true);
    try {
      const response = await triggerSharedDriveCreation();
      if (response.data) {
        toast({
          title: "Shared Drives Created",
          description: `Successfully processed ${response.data.results?.filter(r => r.success).length || 0} client drives.`,
          variant: "success",
        });
        fetchClients();
      }
    } catch (error) {
      console.error("Error creating shared drives:", error);
      toast({
        title: "Error",
        description: "Failed to create shared drives. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingDrives(false);
    }
  };

  const handleBackfillPermissions = async () => {
    setIsBackfilling(true);
    try {
      const response = await backfillPermissions();
      if (response.data && response.data.success) {
        toast({
          title: "Permissions Updated",
          description: response.data.message,
          variant: "success",
        });
      }
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
          onClick={handleCreateDrives}
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
      />
    </div>
  );
}
