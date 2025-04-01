
import React from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award } from "lucide-react";

interface ConsultingTierBoxProps {
  tier: string;
  description: string;
}

const ConsultingTierBox: React.FC<ConsultingTierBoxProps> = ({
  tier,
  description,
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Your Consulting Tier</h3>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {tier}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultingTierBox;
