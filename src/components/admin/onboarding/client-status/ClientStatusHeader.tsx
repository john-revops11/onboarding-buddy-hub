
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ClientStatusHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refreshClients: () => void;
}

export function ClientStatusHeader({ 
  searchQuery, 
  setSearchQuery, 
  refreshClients 
}: ClientStatusHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <Input
        type="search"
        placeholder="Search by client name or tier..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-sm"
      />
      <Button onClick={refreshClients} variant="outline" size="sm">
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh
      </Button>
    </div>
  );
}
