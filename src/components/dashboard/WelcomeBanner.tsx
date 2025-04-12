
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface WelcomeBannerProps {
  userName: string;
  daysActive?: number;
}

export const WelcomeBanner = ({ userName, daysActive = 1 }: WelcomeBannerProps) => {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
              >
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
                  New Account
                </Badge>
              </motion.div>
            </div>
            
            <motion.h1 
              className="text-2xl font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Welcome to Revify, {userName}!
            </motion.h1>
            
            <motion.p 
              className="text-muted-foreground max-w-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Complete your onboarding journey to unlock the full power of Revify's analytics platform. 
              We're excited to help you gain valuable insights from your data.
            </motion.p>
          </div>
          
          <motion.div 
            className="flex items-center space-x-2 mt-4 md:mt-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="bg-white p-2 rounded-full shadow-sm">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium">Account Age</p>
              <p className="text-sm text-muted-foreground">{daysActive} day{daysActive !== 1 ? 's' : ''}</p>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
};
