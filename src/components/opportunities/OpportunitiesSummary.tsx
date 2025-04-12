
import React from "react";
import { OpportunityCard } from "./OpportunityCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Opportunity {
  id: string;
  area: string;
  description: string;
  annualValue: string;
  impactLevel: "high" | "medium" | "low";
}

interface OpportunitiesSummaryProps {
  opportunities: Opportunity[];
  isLoading: boolean;
}

export const OpportunitiesSummary: React.FC<OpportunitiesSummaryProps> = ({ 
  opportunities, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Key Strategic Opportunities Summary</h2>
        <p className="text-neutral-600 mb-6">
          A structured overview of the most impactful areas for improvement, targets, and potential 
          value, as defined during major Revify reviews. This table is updated periodically by 
          your Revify team following strategic sessions.
        </p>
      </div>

      <div className="space-y-4">
        {opportunities.map((opportunity) => (
          <OpportunityCard
            key={opportunity.id}
            title={opportunity.area}
            description={opportunity.description}
            impact={opportunity.annualValue}
            impactLevel={opportunity.impactLevel}
          />
        ))}
      </div>
    </div>
  );
};
