import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { getClients, calculateClientProgress } from "@/lib/client-management/client-query";
import { OnboardingClient } from "@/lib/types/client-types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { ClientActions } from "./ClientActions";
import { ClientStatusBadge } from "./ClientStatusBadge";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Filter } from "lucide-react";

const OnboardingStatus = {
  NOT_STARTED: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
} as const;

type OnboardingStatusType = typeof OnboardingStatus[keyof typeof OnboardingStatus];

type EnhancedClient = Omit<OnboardingClient, 'onboardingProgress'> & {
  onboardingProgress?: {
    percentage: number;
    completedSteps: number;
    totalSteps: number;
  };
  onboardingStatus?: OnboardingStatusType;
};

const ClientList = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const {
    data: clients = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const { data: enhancedClients = [], isLoading: isLoadingProgress } = useQuery({
    queryKey: ["clients-with-progress", clients],
    queryFn: async () => {
      try {
        const clientsWithProgress = await Promise.all(
          clients.map(async (client) => {
            const progress = await calculateClientProgress(client.id);
            const percentage = progress.progress;
            const onboardingStatus = percentage === 100 ? OnboardingStatus.COMPLETED : OnboardingStatus.NOT_STARTED;
            return {
              ...client,
              onboardingProgress: {
                percentage,
                completedSteps: progress.completedSteps,
                totalSteps: progress.totalSteps,
              },
              onboardingStatus,
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
          onboardingStatus: OnboardingStatus.NOT_STARTED,
        })) as EnhancedClient[];
      }
    },
    enabled: clients.length > 0,
  });

  const columnHelper = createColumnHelper<EnhancedClient>();
  const columns = [
    columnHelper.accessor("companyName", {
      header: "Company",
      cell: (info) => info.getValue() || "-",
      enableSorting: true,
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor((row) => row.contactPerson || "", {
      id: "contactPerson",
      header: "Contact Person",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor((row) => row.position || "", {
      id: "position",
      header: "Position",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor((row) => row.industry || "", {
      id: "industry",
      header: "Industry",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor((row) => row.companySize || "", {
      id: "companySize",
      header: "Company Size",
      cell: (info) => info.getValue() || "-",
      enableSorting: true,
    }),
    columnHelper.accessor("onboardingStatus", {
      id: "onboardingStatus",
      header: "Onboarding Status",
      cell: (info) => {
        const progress = info.row.original.onboardingProgress;
        return (
          <ClientStatusBadge 
            progress={progress?.percentage || 0} 
            completedSteps={progress?.completedSteps || 0} 
            totalSteps={progress?.totalSteps || 0} 
          />
        );
      },
      enableSorting: true,
    }),
    columnHelper.accessor("id", {
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <ClientActions 
          clientId={info.getValue()} 
          client={info.row.original as unknown as OnboardingClient}
          onSuccess={() => refetch()}
        />
      ),
      enableSorting: false,
    }),
  ];

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
        ...(statusFilter !== "all" ? [{ id: 'onboardingStatus', value: parseInt(statusFilter) }] : []),
      ],
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const uniqueIndustries = [...new Set(clients.map(client => client.industry).filter(Boolean))];

  if (isError) {
    toast({
      title: "Error loading clients",
      description: "There was a problem loading the client list. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <Card className="w-full">
      {/* ... rest of your UI rendering logic remains here ... */}
    </Card>
  );
};

export default ClientList;
