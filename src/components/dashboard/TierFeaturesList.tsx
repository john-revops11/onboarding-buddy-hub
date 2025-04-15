
import React from "react";
import { ChevronRight, Check } from "lucide-react";

interface TierFeaturesListProps {
  features: string[];
  colorScheme: {
    textColor: string;
    iconColor?: string;
  };
  compact?: boolean;
}

const TierFeaturesList: React.FC<TierFeaturesListProps> = ({ 
  features, 
  colorScheme,
  compact = false
}) => {
  if (!features || features.length === 0) {
    return null;
  }

  return (
    <div className={compact ? "mt-2" : "border-t pt-3 mt-2"}>
      {!compact && <p className="text-sm font-medium mb-2">Tier Benefits:</p>}
      <ul className="text-sm space-y-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            {compact ? (
              <Check className={`h-3 w-3 flex-shrink-0 ${colorScheme.iconColor || colorScheme.textColor}`} />
            ) : (
              <ChevronRight className={`h-3 w-3 flex-shrink-0 ${colorScheme.iconColor || colorScheme.textColor}`} />
            )}
            <span className={colorScheme.textColor}>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TierFeaturesList;
