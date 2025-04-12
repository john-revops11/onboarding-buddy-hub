import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";

const OpportunitiesPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="text-left"> {/* Added text-left class */}
          <h1 className="text-3xl font-bold tracking-tight">Opportunities</h1>
          <p className="text-muted-foreground mt-1">
            Discover and manage business opportunities
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-standard">
            <h2 className="text-xl font-semibold mb-4">Revenue Opportunities</h2>
            <p className="text-neutral-600 mb-6">
              Based on your data, we've identified potential revenue opportunities.
            </p>
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-primary-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Pricing Optimization</h3>
                    <p className="text-sm text-neutral-600">Potential impact: $24,500</p>
                  </div>
                  <span className="badge bg-accentGreen-100 text-accentGreen-800 px-2 py-1 rounded text-xs">
                    High Impact
                  </span>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Cross-Selling</h3>
                    <p className="text-sm text-neutral-600">Potential impact: $12,300</p>
                  </div>
                  <span className="badge bg-warning-100 text-warning-800 px-2 py-1 rounded text-xs">
                    Medium Impact
                  </span>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Customer Retention</h3>
                    <p className="text-sm text-neutral-600">Potential impact: $8,900</p>
                  </div>
                  <span className="badge bg-warning-100 text-warning-800 px-2 py-1 rounded text-xs">
                    Medium Impact
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card-standard">
            <h2 className="text-xl font-semibold mb-4">Efficiency Opportunities</h2>
            <p className="text-neutral-600 mb-6">
              Opportunities to improve operational efficiency and reduce costs.
            </p>
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-primary-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Process Automation</h3>
                    <p className="text-sm text-neutral-600">Est. savings: $18,200</p>
                  </div>
                  <span className="badge bg-accentGreen-100 text-accentGreen-800 px-2 py-1 rounded text-xs">
                    High Impact
                  </span>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Resource Allocation</h3>
                    <p className="text-sm text-neutral-600">Est. savings: $7,500</p>
                  </div>
                  <span className="badge bg-warning-100 text-warning-800 px-2 py-1 rounded text-xs">
                    Medium Impact
                  </span>
                </div>
              </div>
              
              <div className="p-4 border rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Inventory Management</h3>
                    <p className="text-sm text-neutral-600">Est. savings: $5,300</p>
                  </div>
                  <span className="badge bg-neutral-100 text-neutral-800 px-2 py-1 rounded text-xs">
                    Low Impact
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OpportunitiesPage;
