
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  return (
    <div className="mb-6 relative">
      <Input 
        placeholder="Search..." 
        className="w-full bg-sidebar-accent/20 border-sidebar-border pl-9"
      />
      <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
    </div>
  );
}
