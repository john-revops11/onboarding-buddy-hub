
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw } from "lucide-react";

interface InviteSearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onRefresh: () => void;
}

export const InviteSearchHeader = ({
  searchQuery,
  setSearchQuery,
  onRefresh,
}: InviteSearchHeaderProps) => {
  return (
    <div className="flex space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by email or company name..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Button variant="outline" size="icon" onClick={onRefresh} title="Refresh invites">
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};
