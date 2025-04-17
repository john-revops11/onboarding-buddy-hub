
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus, Download } from "lucide-react";
import { Link } from "react-router-dom";
import ClientList from "@/components/admin/clients/ClientList";

const ClientsListPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-5 bg-neutral-50 p-5 min-h-screen">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
            <p className="text-muted-foreground">
              Manage your clients, their subscriptions, and onboarding progress
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/onboarding">
                <UserPlus className="mr-2 h-4 w-4" />
                Onboard New Client
              </Link>
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export List
            </Button>
          </div>
        </div>
        
        <ClientList />
      </div>
    </DashboardLayout>
  );
};

export default ClientsListPage;
