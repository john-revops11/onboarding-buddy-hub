import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="text-left"> {/* Added text-left class */}
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your account preferences and system settings
          </p>
        </div>
        {/* Your existing page content would go here */}
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
