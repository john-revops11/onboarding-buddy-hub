
import { useNavigate } from "react-router-dom";
import { ClientStatusHeader } from "./client-status/ClientStatusHeader";
import { ClientsTable } from "./client-status/ClientsTable";
import { useClientManagement } from "./client-status/useClientManagement";

export function ClientStatus() {
  const navigate = useNavigate();
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

  return (
    <div className="space-y-4">
      <ClientStatusHeader 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        refreshClients={fetchClients} 
      />
      
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
