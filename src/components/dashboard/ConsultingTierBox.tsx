
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Info, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConsultingTierBoxProps {
  tier: string;
  description: string;
  benefits?: string[];
  showDetails?: boolean;
}

const ConsultingTierBox: React.FC<ConsultingTierBoxProps> = ({
  tier,
  description,
  benefits = [],
  showDetails = false,
}) => {
  // Define tier colors
  const getTierColors = () => {
    switch (tier.toLowerCase()) {
      case 'elite':
        return {
          bgColor: 'bg-purple-100 dark:bg-purple-900/20',
          textColor: 'text-purple-700 dark:text-purple-400',
          iconBg: 'bg-purple-200 dark:bg-purple-800/30',
          iconColor: 'text-purple-700 dark:text-purple-400',
          badge: 'bg-purple-200 text-purple-800 border-purple-300'
        };
      case 'premium':
        return {
          bgColor: 'bg-amber-100 dark:bg-amber-900/20',
          textColor: 'text-amber-700 dark:text-amber-400',
          iconBg: 'bg-amber-200 dark:bg-amber-800/30',
          iconColor: 'text-amber-700 dark:text-amber-400',
          badge: 'bg-amber-200 text-amber-800 border-amber-300'
        };
      case 'standard':
        return {
          bgColor: 'bg-blue-100 dark:bg-blue-900/20',
          textColor: 'text-blue-700 dark:text-blue-400',
          iconBg: 'bg-blue-200 dark:bg-blue-800/30',
          iconColor: 'text-blue-700 dark:text-blue-400',
          badge: 'bg-blue-200 text-blue-800 border-blue-300'
        };
      default:
        return {
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          textColor: 'text-green-700 dark:text-green-400',
          iconBg: 'bg-green-200 dark:bg-green-800/30',
          iconColor: 'text-green-700 dark:text-green-400',
          badge: 'bg-green-200 text-green-800 border-green-300'
        };
    }
  };

  const colors = getTierColors();

  return (
    <Card className={`border overflow-hidden ${colors.bgColor}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full ${colors.iconBg} flex items-center justify-center`}>
              <Award className={`h-4 w-4 ${colors.iconColor}`} />
            </div>
            Your Consulting Tier
          </CardTitle>
          <Badge variant="outline" className={colors.badge}>
            {tier}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <p className={`text-sm ${colors.textColor}`}>{description}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                  <Info className="h-3.5 w-3.5" />
                  <span className="sr-only">Tier Info</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">Your consulting tier grants you specific benefits and service levels</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {showDetails && benefits && benefits.length > 0 && (
          <div className="border-t pt-3 mt-2">
            <p className="text-sm font-medium mb-2">Tier Benefits:</p>
            <ul className="text-sm space-y-1">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="link" size="sm" className={colors.textColor}>
            View Benefits
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultingTierBox;
