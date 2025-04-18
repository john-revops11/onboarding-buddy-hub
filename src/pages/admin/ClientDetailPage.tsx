// ✅ File: src/pages/admin/ClientDetailPage.tsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ClientDetailPage from "@/components/admin/clients/ClientDetailPage";
import ClientEditModal from "@/components/admin/clients/ClientEditModal";
import { getClientById } from "@/lib/client-management/client-query";

const AdminClientDetailPage = () => {
  const { clientId } = useParams();
  const [editOpen, setEditOpen] = useState(false);

  const { data: client, refetch, isLoading } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClientById(clientId as string),
    enabled: !!clientId,
  });

  if (isLoading) return <div>Loading...</div>;
  if (!client) return <div>Client not found.</div>;

  return (
    <>
      <ClientDetailPage client={client} onEdit={() => setEditOpen(true)} />
      <ClientEditModal
        open={editOpen}
        setOpen={setEditOpen}
        client={client}
        onSuccess={() => {
          setEditOpen(false);
          refetch();
        }}
      />
    </>
  );
};

// ✅ Use only one default export
export default AdminClientDetailPage;
