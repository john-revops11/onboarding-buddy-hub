
import { useInviteManagement } from "./client-invites/useInviteManagement";
import { InviteSearchHeader } from "./client-invites/InviteSearchHeader";
import { InvitesTable } from "./client-invites/InvitesTable";

export function ClientInvites() {
  const {
    invites,
    isLoading,
    searchQuery,
    setSearchQuery,
    processingId,
    fetchInvites,
    resendInvite,
    revokeInvite
  } = useInviteManagement();

  // Create adapter functions that convert Promise<boolean> to Promise<void>
  const handleResend = async (id: string, clientId: string, email: string): Promise<void> => {
    await resendInvite(id, clientId, email);
  };

  const handleRevoke = async (id: string): Promise<void> => {
    await revokeInvite(id);
  };

  return (
    <div className="space-y-4">
      <InviteSearchHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onRefresh={fetchInvites}
      />
      
      <InvitesTable 
        invites={invites}
        isLoading={isLoading}
        processingId={processingId}
        onResend={handleResend}
        onRevoke={handleRevoke}
      />
    </div>
  );
}
