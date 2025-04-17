
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  SortingState, 
  getCoreRowModel, 
  getPaginationRowModel, 
  getSortedRowModel, 
  getFilteredRowModel,
  useReactTable
} from "@tanstack/react-table";
import { getClients, calculateClientProgress } from "@/lib/client-management/client-query";
import { toast } from "@/hooks/use-toast";
import { useClientColumns } from "./useClientColumns";
import { EnhancedClient } from "../types";

export function useClientList() {
  // State for table sorting
  const [sorting, setSorting] = useState<SortingState>([]);
  
  // State for global filtering
  const [globalFilter, setGlobalFilter] = useState("");
  
  // State for column filters
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Query to fetch clients data
  const {
    data: clients = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  // Fetch onboarding progress for each client
  const { data: enhancedClients = [], isLoading: isLoadingProgress } = useQuery({
    queryKey: ["clients-with-progress", clients],
    queryFn: async () => {
      try {
        const clientsWithProgress = await Promise.all(
          clients.map(async (client) => {
            const progress = await calculateClientProgress(client.id);
            return {
              ...client,
              onboardingProgress: {
                percentage: progress.progress,
                completedSteps: progress.completedSteps,
                totalSteps: progress.totalSteps,
              },
            };
          })
        );
        return clientsWithProgress as EnhancedClient[];
      } catch (error) {
        console.error("Error loading client progress:", error);
        return clients.map(client => ({
          ...client,
          onboardingProgress: {
            percentage: 0,
            completedSteps: 0,
            totalSteps: 0,
          },
        })) as EnhancedClient[];
      }
    },
    enabled: clients.length > 0,
  });

  // Extract unique industry values for filter
  const uniqueIndustries = [...new Set(clients.map(client => client.industry).filter(Boolean))];

  // Define columns with the refetch callback
  const columns = useClientColumns(() => refetch());

  // Setup React Table instance
  const table = useReactTable({
    data: enhancedClients,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
      globalFilter,
      columnFilters: [
        ...(industryFilter !== "all" ? [{ id: 'industry', value: industryFilter }] : []),
        ...(statusFilter !== "all" ? [{ id: 'status', value: statusFilter }] : []),
      ],
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  // Handle errors in data fetching
  if (isError) {
    toast({
      title: "Error loading clients",
      description: "There was a problem loading the client list. Please try again.",
      variant: "destructive",
    });
  }

  return {
    table,
    isLoading: isLoading || isLoadingProgress,
    globalFilter,
    setGlobalFilter,
    industryFilter,
    setIndustryFilter,
    statusFilter,
    setStatusFilter,
    uniqueIndustries,
    refetch,
  };
}
