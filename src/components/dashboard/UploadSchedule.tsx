
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Check, Clock } from "lucide-react";

export const UploadSchedule = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="mr-2" size={20} />
          Expected Upload Schedule
        </CardTitle>
        <CardDescription>
          Reference for your agreed-upon data submission cadence
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-muted rounded-md">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Weekly Data</p>
              <p className="text-xs text-muted-foreground">Every Monday</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-muted rounded-md">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Monthly Data</p>
              <p className="text-xs text-muted-foreground">By the 5th of each month</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 bg-muted rounded-md">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <Check className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Quarterly Sales Report</p>
              <p className="text-xs text-muted-foreground">Within 15 days of quarter end</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
