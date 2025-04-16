
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

// Type for enhanced client data with onboarding progress
// Instead of extending OnboardingClient, define a separate type to avoid conflicts
type EnhancedClient = {
  id: string;
  email: string;
  companyName?: string;
  subscriptionTier: {
    id: string;
    name: string;
    price: number;
    description: string;
  };
  addons: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
  }>;
  status: 'pending' | 'active';
  teamMembers: Array<any>;
  contactPerson?: string;
  position?: string;
  industry?: string;
  companySize?: string;
  createdAt?: string;
  onboardingProgress?: {
    percentage: number;
    completedSteps: number;
    totalSteps: number;
  };
};

const ClientList = () => {
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

  // Define column helper
  const columnHelper = createColumnHelper<EnhancedClient>();

  // Define table columns
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
    columnHelper.accessor((row) => row.onboardingProgress?.percentage || 0, {
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

  // Extract unique industry values for filter
  const uniqueIndustries = [...new Set(clients.map(client => client.industry).filter(Boolean))];

  // Handle errors in data fetching
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
                  <SelectItem key={industry} value={industry as string}>
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
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
        {isLoading || isLoadingProgress ? (
          <ClientListSkeleton />
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="whitespace-nowrap">
                          {header.isPlaceholder ? null : (
                            <div
                              className={header.column.getCanSort() ? "cursor-pointer select-none flex items-center gap-1" : ""}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: " 🔼",
                                desc: " 🔽",
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className="h-24 text-center">
                        No results found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 flex items-center justify-end space-x-2 py-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => table.previousPage()}
                      aria-disabled={!table.getCanPreviousPage()}
                      className={!table.getCanPreviousPage() ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: table.getPageCount() }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => table.setPageIndex(i)}
                        isActive={table.getState().pagination.pageIndex === i}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => table.nextPage()}
                      aria-disabled={!table.getCanNextPage()}
                      className={!table.getCanNextPage() ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Loading skeleton
const ClientListSkeleton = () => {
  return (
    <div className="space-y-3">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: 8 }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-6 w-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: 8 }).map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ClientList;
