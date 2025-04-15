
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Info, ChevronRight, ChevronDown, ChevronUp, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface ConsultingTierBoxProps {
  tier: string;
  description: string;
  benefits?: string[];
  showDetails?: boolean;
  onChange?: (newTier: string) => void;
  isEditable?: boolean;
}

const ConsultingTierBox: React.FC<ConsultingTierBoxProps> = ({
  tier,
  description,
  benefits = [],
  showDetails: initialShowDetails = false,
  onChange,
  isEditable = false,
}) => {
  const [showDetails, setShowDetails] = useState(initialShowDetails);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Define tier colors - Using more subtle styling
  const getTierColors = () => {
    switch (tier.toLowerCase()) {
      case 'elite':
        return {
          bgColor: 'bg-white dark:bg-neutral-900',
          textColor: 'text-purple-700 dark:text-purple-400',
          iconBg: 'bg-purple-50 dark:bg-purple-900/20',
          iconColor: 'text-purple-600 dark:text-purple-400',
          badge: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:border-purple-800'
        };
      case 'premium':
        return {
          bgColor: 'bg-white dark:bg-neutral-900',
          textColor: 'text-amber-700 dark:text-amber-400',
          iconBg: 'bg-amber-50 dark:bg-amber-900/20',
          iconColor: 'text-amber-600 dark:text-amber-400',
          badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800'
        };
      case 'standard':
        return {
          bgColor: 'bg-white dark:bg-neutral-900',
          textColor: 'text-blue-700 dark:text-blue-400',
          iconBg: 'bg-blue-50 dark:bg-blue-900/20',
          iconColor: 'text-blue-600 dark:text-blue-400',
          badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800'
        };
      default:
        return {
          bgColor: 'bg-white dark:bg-neutral-900',
          textColor: 'text-green-700 dark:text-green-400',
          iconBg: 'bg-green-50 dark:bg-green-900/20',
          iconColor: 'text-green-600 dark:text-green-400',
          badge: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:border-green-800'
        };
    }
  };

  const colors = getTierColors();
  
  const availableTiers = ['standard', 'premium', 'elite'];
  
  const handleTierChange = (newTier: string) => {
    if (onChange) {
      onChange(newTier);
    }
    setDialogOpen(false);
  };

  return (
    <Card className={`border-2 ${colors.bgColor} shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full ${colors.iconBg} flex items-center justify-center border ${tier.toLowerCase() === 'elite' ? 'border-purple-200 dark:border-purple-800' : 'border-transparent'}`}>
              <Award className={`h-4 w-4 ${colors.iconColor}`} />
            </div>
            Platform Tier
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={colors.badge}>
              {tier}
            </Badge>
            {isEditable && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Edit className="h-3.5 w-3.5" />
                    <span className="sr-only">Edit Tier</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Consulting Tier</DialogTitle>
                    <DialogDescription>
                      Select a new consulting tier for this user or client.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    {availableTiers.map((availableTier) => (
                      <Button
                        key={availableTier}
                        variant={tier.toLowerCase() === availableTier ? "default" : "outline"}
                        onClick={() => handleTierChange(availableTier)}
                        className="justify-start"
                      >
                        <span className="capitalize">{availableTier}</span>
                      </Button>
                    ))}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
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
        
        {benefits && benefits.length > 0 && (
          <div className={`border-t pt-3 mt-2 ${!showDetails ? 'hidden' : ''}`}>
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
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        {benefits && benefits.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${colors.textColor} flex items-center`}
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? (
              <>
                Hide Benefits
                <ChevronUp className="ml-1 h-4 w-4" />
              </>
            ) : (
              <>
                View Benefits
                <ChevronDown className="ml-1 h-4 w-4" />
              </>
            )}
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="sm" 
          className={colors.textColor}
          onClick={() => window.open('/profile?section=tier', '_self')}
        >
          Tier Details
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConsultingTierBox;
