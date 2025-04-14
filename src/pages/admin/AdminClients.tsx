
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClientsTable } from "@/components/admin/onboarding/client-status/ClientsTable";
import { useClientManagement } from "@/components/admin/onboarding/client-status/useClientManagement";
import { ClientStatusHeader } from "@/components/admin/onboarding/client-status/ClientStatusHeader";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminClients = () => {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("all");
  const {
    clients,
    isLoading,
    searchQuery,
    setSearchQuery,
    processingId,
    getClientProgress,
    markClientComplete,
    fetchClients
  } = useClientManagement();

  const handleAddNewClient = () => {
    navigate("/admin/onboarding");
  };

  const handleMarkComplete = (id: string) => {
    markClientComplete(id);
  };

  const handleViewDetails = (id: string) => {
    navigate(`/admin/clients/${id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
            <p className="text-muted-foreground mt-1">
              View and manage all client accounts
            </p>
          </div>
          <Button onClick={handleAddNewClient}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Client
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
            <CardDescription>
              Browse and manage client accounts in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-2/3">
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full sm:w-1/3">
                <Select
                  value={filterStatus}
                  onValueChange={setFilterStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    <SelectItem value="active">Active Clients</SelectItem>
                    <SelectItem value="pending">Pending Onboarding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ClientsTable
              isLoading={isLoading}
              clients={clients}
              processingId={processingId}
              getClientProgress={getClientProgress}
              onMarkComplete={handleMarkComplete}
              onViewDetails={handleViewDetails}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminClients;
