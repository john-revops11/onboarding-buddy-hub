
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useClientList } from "./hooks/useClientList";
import { ClientListTable } from "./table/ClientListTable";
import { ClientListFilters } from "./filters/ClientListFilters";
import { ClientListPagination } from "./pagination/ClientListPagination";
import { ClientListSkeleton } from "./loading/ClientListSkeleton";

const ClientList = () => {
  const {
    table,
    isLoading,
    globalFilter,
    setGlobalFilter,
    industryFilter,
    setIndustryFilter,
    statusFilter,
    setStatusFilter,
    uniqueIndustries,
    refetch,
  } = useClientList();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Client List</CardTitle>
        <CardDescription>View and manage all client accounts</CardDescription>
        
        <ClientListFilters
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          industryFilter={industryFilter}
          setIndustryFilter={setIndustryFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          uniqueIndustries={uniqueIndustries}
          onRefresh={refetch}
        />
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <ClientListSkeleton />
        ) : (
          <>
            <ClientListTable table={table} />
            <ClientListPagination table={table} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientList;
