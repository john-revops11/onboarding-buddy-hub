
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, Filter, SlidersHorizontal } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuCheckboxItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface ClientStatusHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refreshClients: () => void;
  totalClients?: number;
}

export function ClientStatusHeader({ 
  searchQuery, 
  setSearchQuery, 
  refreshClients,
  totalClients = 0
}: ClientStatusHeaderProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="text-lg font-medium">Client Management</div>
        
        {totalClients > 0 && (
          <span className="text-sm text-muted-foreground bg-neutral-100 px-2 py-1 rounded-md">
            {totalClients} {totalClients === 1 ? 'client' : 'clients'}
          </span>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuCheckboxItem checked>
                Show Active Clients
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked>
                Show Pending Clients
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshClients} 
            className="flex items-center gap-1 ml-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
