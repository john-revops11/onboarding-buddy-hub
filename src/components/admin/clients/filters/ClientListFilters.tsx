
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface ClientListFiltersProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  industryFilter: string;
  setIndustryFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  uniqueIndustries: string[];
  onRefresh: () => void;
}

export const ClientListFilters: React.FC<ClientListFiltersProps> = ({
  globalFilter,
  setGlobalFilter,
  industryFilter,
  setIndustryFilter,
  statusFilter,
  setStatusFilter,
  uniqueIndustries,
  onRefresh,
}) => {
  return (
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
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="icon" onClick={onRefresh}>
          <Filter className="h-4 w-4" />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>
    </div>
  );
};
