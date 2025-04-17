import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type SortingState,
} from "@tanstack/react-table";

import { getClients, calculateClientProgress } from "@/lib/client-management/client-query";
import { OnboardingClient } from "@/lib/types/client-types";
import { OnboardingStatus } from "@/lib/constants";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { ClientActions } from "./ClientActions";
import { ClientStatusBadge } from "./ClientStatusBadge";

type EnhancedClient = Omit<OnboardingClient, 'onboardingProgress'> & {
  onboardingProgress?: {
    percentage: number;
    completedSteps: number;
    totalSteps: number;
  };
  onboardingStatus?: string;
};

const ClientList = () => {
  const { toast } = useToast();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: clients = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({ queryKey: ["clients"], queryFn: getClients });

  const { data: enhancedClients = [], isLoading: isLoadingProgress } = useQuery({
    queryKey: ["clients-with-progress", clients],
    queryFn: async () => {
      try {
        return await Promise.all(
          clients.map(async (client) => {
            const progress = await calculateClientProgress(client.id);
            const onboardingStatus =
              progress.progress === 100 ? OnboardingStatus.COMPLETED :
              progress.progress > 0 ? OnboardingStatus.IN_PROGRESS :
              OnboardingStatus.NOT_STARTED;

            return {
              ...client,
              onboardingProgress: {
                percentage: progress.progress,
                completedSteps: progress.completedSteps,
                totalSteps: progress.totalSteps,
              },
              onboardingStatus,
            };
          })
        );
      } catch (error) {
        console.error("Error calculating client progress:", error);
        return clients.map((client) => ({
          ...client,
          onboardingProgress: {
            percentage: 0,
            completedSteps: 0,
            totalSteps: 0,
          },
          onboardingStatus: OnboardingStatus.NOT_STARTED,
        }));
      }
    },
    enabled: clients.length > 0,
  });

  const columnHelper = createColumnHelper<EnhancedClient>();

  const columns = [
    columnHelper.accessor("companyName", {
      header: "Company",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("contactPerson", {
      header: "Contact Person",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("position", {
      header: "Position",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("industry", {
      header: "Industry",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("companySize", {
      header: "Company Size",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("onboardingStatus", {
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
    }),
    columnHelper.accessor("id", {
      header: "Actions",
      cell: (info) => (
        <ClientActions
          clientId={info.getValue()}
          client={info.row.original}
          onSuccess={() => refetch()}
        />
      ),
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
        ...(industryFilter !== "all" ? [{ id: "industry", value: industryFilter }] : []),
        ...(statusFilter !== "all" ? [{ id: "onboardingStatus", value: statusFilter }] : []),
      ],
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  const uniqueIndustries = [...new Set(clients.map(c => c.industry).filter(Boolean))];

  if (isError) {
    toast({
      title: "Error loading clients",
      description: "There was a problem loading the client list. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Client List</CardTitle>
        <CardDescription>View and manage all client accounts</CardDescription>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by company or email..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {uniqueIndustries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={OnboardingStatus.NOT_STARTED}>Not Started</SelectItem>
                <SelectItem value={OnboardingStatus.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem value={OnboardingStatus.COMPLETED}>Completed</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" onClick={() => refetch()}>
              <Filter className="h-4 w-4" />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {(isLoading || isLoadingProgress) ? (
          <ClientListSkeleton />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map(row => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ClientListSkeleton = () => {
  return (
    <div className="p-6 space-y-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full rounded-md" />
      ))}
    </div>
  );
};

export default ClientList;
