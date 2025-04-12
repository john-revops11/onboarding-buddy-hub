
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface InviteSearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onRefresh: () => void;
}

export function InviteSearchHeader({ 
  searchQuery, 
  setSearchQuery, 
  onRefresh 
}: InviteSearchHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <Input
        type="search"
        placeholder="Search by email or client..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-sm"
      />
      <Button onClick={onRefresh} variant="outline" size="sm">
        <RefreshCw className="mr-2 h-4 w-4" />
        Refresh
      </Button>
    </div>
  );
}
