import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
  type SortingState,
} from "@tanstack/react-table";

import { getClients, calculateClientProgress } from "@/lib/client-management/client-query";
import { OnboardingClient } from "@/lib/types/client-types";

import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui/card";
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink
} from "@/components/ui/pagination";
import { Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ClientActions } from "./ClientActions";
import { ClientStatusBadge } from "./ClientStatusBadge";

// Type for enriched client with progress
type EnhancedClient = Omit<OnboardingClient, "onboardingProgress"> & {
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

  const {
    data: enhancedClients = [],
    isLoading: isLoadingProgress
  } = useQuery({
    queryKey: ["clients-with-progress", clients],
    queryFn: async () => {
      const enriched = await Promise.all(clients.map(async (client) => {
        const progress = await calculateClientProgress(client.id);
        const status =
          progress.progress === 100
            ? "completed"
            : progress.progress > 0
              ? "in_progress"
              : "not_started";

        return {
          ...client,
          onboardingProgress: {
            percentage: progress.progress,
            completedSteps: progress.completedSteps,
            totalSteps: progress.totalSteps,
          },
          onboardingStatus: status,
        };
      }));
      return enriched;
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
      header: "Onboarding",
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
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
      columnFilters: [
        ...(industryFilter !== "all" ? [{ id: "industry", value: industryFilter }] : []),
        ...(statusFilter !== "all" ? [{ id: "onboardingStatus", value: statusFilter }] : []),
      ],
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const uniqueIndustries = [...new Set(clients.map(c => c.industry).filter(Boolean))];

  if (isError) {
    toast({
      title: "Error loading clients",
      description: "There was a problem loading the client list.",
      variant: "destructive",
    });
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Client List</CardTitle>
        <CardDescription>View and manage client accounts</CardDescription>

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
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="not_started">Not Started</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
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
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center h-24">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex justify-end mt-4">
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ClientListSkeleton = () => (
  <div className="p-6 space-y-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton key={i} className="h-6 w-full rounded" />
    ))}
  </div>
);

export default ClientList;
