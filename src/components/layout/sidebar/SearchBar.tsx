
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";

interface SearchBarProps {
  showSearchIconOnly?: boolean;
  onSearchOpen?: Dispatch<SetStateAction<boolean>>;
  searchOpen?: boolean;
}

export function SearchBar({ 
  showSearchIconOnly = false, 
  onSearchOpen, 
  searchOpen = false 
}: SearchBarProps = {}) {
  const [searchQuery, setSearchQuery] = useState("");
  
  if (showSearchIconOnly && !searchOpen) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden"
        onClick={() => onSearchOpen && onSearchOpen(true)}
      >
        <Search className="h-5 w-5" />
      </Button>
    );
  }
  
  return (
    <div className={`relative ${searchOpen ? 'w-full md:w-auto' : 'mb-6'}`}>
      <Input 
        placeholder="Search..." 
        className="w-full bg-sidebar-accent/20 border-sidebar-border pl-9"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
      
      {searchOpen && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
          onClick={() => {
            setSearchQuery("");
            if (onSearchOpen) onSearchOpen(false);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
