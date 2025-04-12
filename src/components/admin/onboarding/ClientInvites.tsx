
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
        onResend={resendInvite}
        onRevoke={revokeInvite}
      />
    </div>
  );
}
