
import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface DashboardBannerProps {
  userName: string;
  userRole?: string;
}

export function DashboardBanner({ userName, userRole }: DashboardBannerProps) {
  return (
    <Card className="bg-primary-700 text-white relative overflow-hidden">
      <div className="relative z-10 p-6">
        <div className="flex flex-col gap-1 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Welcome back, {userName}
          </h1>
          <p className="text-white/80 font-medium">
            {userRole === "admin" ? "Administrator" : "Team Member"}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ y: 0, scale: 0.98 }}
          >
            <Button 
              variant="outline" 
              className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white px-5 py-2.5"
            >
              <span className="mr-2">REVIEW INSIGHTS</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ y: 0, scale: 0.98 }}
          >
            <Button 
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white px-5 py-2.5"
            >
              <span className="mr-2">COMPLETE PROFILE</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </Card>
  );
};
