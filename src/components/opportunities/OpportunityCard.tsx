
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OpportunityCardProps {
  title: string;
  description: string;
  impact: string;
  impactLevel: "high" | "medium" | "low";
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ 
  title, 
  description, 
  impact, 
  impactLevel 
}) => {
  const getBadgeClass = () => {
    switch (impactLevel) {
      case "high":
        return "bg-accentGreen-100 text-accentGreen-800";
      case "medium":
        return "bg-warning-100 text-warning-800";
      case "low":
        return "bg-neutral-100 text-neutral-800";
      default:
        return "bg-neutral-100 text-neutral-800";
    }
  };

  const getImpactLabel = () => {
    switch (impactLevel) {
      case "high":
        return "High Impact";
      case "medium":
        return "Medium Impact";
      case "low":
        return "Low Impact";
      default:
        return "Impact";
    }
  };

  return (
    <div className="p-4 border rounded-md hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-neutral-600">{description}</p>
        </div>
        <span className={`badge ${getBadgeClass()} px-2 py-1 rounded text-xs`}>
          {getImpactLabel()}
        </span>
      </div>
    </div>
  );
};
