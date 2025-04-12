import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";

const DataUploadsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="text-left"> {/* Added text-left class */}
          <h1 className="text-3xl font-bold tracking-tight">Data Uploads</h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage your business data files
          </p>
        </div>
        
      </div>
    </DashboardLayout>
  );
};

export default DataUploadsPage;
