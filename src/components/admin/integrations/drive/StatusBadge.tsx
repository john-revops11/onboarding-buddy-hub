
import React from "react";
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  isChecking: boolean;
  isActive: boolean;
  isError: boolean;
  errorType?: "connection" | "missing";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  isChecking,
  isActive,
  isError,
  errorType = "connection"
}) => {
  if (isChecking) {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse mr-2"></div>
          Checking...
        </div>
      </Badge>
    );
  }

  if (isError) {
    return (
      <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-50">
        {errorType === "connection" ? "Connection error" : "Error"}
      </Badge>
    );
  }

  if (isActive) {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
        Active
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
      Missing key
    </Badge>
  );
};
