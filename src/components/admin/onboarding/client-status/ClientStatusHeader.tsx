
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";

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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4">
      <div className="relative flex-1 max-w-sm w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
      
      <div className="flex items-center gap-2">
        {totalClients > 0 && (
          <span className="text-sm text-muted-foreground mr-2">
            {totalClients} {totalClients === 1 ? 'client' : 'clients'}
          </span>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshClients} 
          className="flex items-center gap-1"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>
    </div>
  );
}
