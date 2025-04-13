
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DriveIntegrationDrawer } from "@/components/admin/integrations/DriveIntegrationDrawer";
import { DriveIntegrationModal } from "@/components/admin/integrations/DriveIntegrationModal";
import { useDriveIntegration } from "@/hooks/useDriveIntegration";
import { ConnectionErrorAlert } from "@/components/admin/integrations/ConnectionErrorAlert";
import { ApiKeysTable } from "@/components/admin/integrations/ApiKeysTable";

const AdminApiKeys = () => {
  const [driveDrawerOpen, setDriveDrawerOpen] = useState(false);
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  const [newApiKeyOpen, setNewApiKeyOpen] = useState(false);
  const [isDriveActive, setIsDriveActive] = useState(false);
  const [isDriveInError, setIsDriveInError] = useState(false);
  const [isCheckingDrive, setIsCheckingDrive] = useState(true);
  const { ping } = useDriveIntegration();

  // API integrations data
  const integrations = [
    {
      id: "google-drive",
      service: "Google Drive",
      name: "File Upload Integration",
      isChecking: isCheckingDrive,
      isActive: isDriveActive,
      isError: isDriveInError,
      lastUsed: "Today, 10:30 AM"
    },
    {
      id: "notion",
      service: "Notion",
      name: "Knowledge Hub",
      isChecking: false,
      isActive: true,
      isError: false,
      lastUsed: "Yesterday, 3:45 PM"
    }
  ];

  // Check if Google Drive integration is active on component mount
  useEffect(() => {
    checkDriveStatus();
  }, []);

  // Function to check Drive integration status
  const checkDriveStatus = async () => {
    setIsCheckingDrive(true);
    try {
      const response = await ping();
      
      if (response.error) {
        if (response.error.isNetworkError) {
          setIsDriveInError(true);
          setIsDriveActive(false);
        } else {
          setIsDriveInError(false);
          setIsDriveActive(false);
        }
      } else {
        setIsDriveActive(response.data?.success || false);
        setIsDriveInError(false);
      }
    } catch (error) {
      console.error("Error checking Drive status:", error);
      setIsDriveActive(false);
      setIsDriveInError(true);
    } finally {
      setIsCheckingDrive(false);
    }
  };

  // Function to refresh integration status after successful upload/revoke
  const refreshDriveStatus = async () => {
    await checkDriveStatus();
  };

  const handleRetryCheck = () => {
    refreshDriveStatus();
  };

  const handleEditIntegration = (id: string) => {
    if (id === "google-drive") {
      setDriveModalOpen(true);
    }
  };

  const handleViewIntegration = (id: string) => {
    if (id === "google-drive") {
      setDriveDrawerOpen(true);
    }
  };

  const handleDeleteIntegration = (id: string) => {
    // This would handle deletion logic
    console.log(`Delete integration with id: ${id}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">API Keys Management</h1>
        <p className="text-muted-foreground">
          Manage API keys for various integrations.
        </p>

        {isDriveInError && (
          <ConnectionErrorAlert onRetry={handleRetryCheck} />
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Integration Keys</h2>
          </div>
          <Dialog open={newApiKeyOpen} onOpenChange={setNewApiKeyOpen}>
            <DialogTrigger asChild>
              <Button>Add New API Key</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New API Key</DialogTitle>
                <DialogDescription>
                  Enter the details for the new API key integration.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="service">Service</Label>
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Coming soon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google-drive">Google Drive</SelectItem>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="gemini">Gemini</SelectItem>
                      <SelectItem value="pinecone">Pinecone</SelectItem>
                      <SelectItem value="notion">Notion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Key Name</Label>
                  <Input id="name" placeholder="e.g. Production Google Drive" disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="key">API Key</Label>
                  <Input id="key" type="password" disabled />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled>Coming Soon</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Secure keys for third-party service integrations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApiKeysTable 
              integrations={integrations}
              onEdit={handleEditIntegration}
              onView={handleViewIntegration}
              onDelete={handleDeleteIntegration}
            />
          </CardContent>
        </Card>
      </div>

      {/* Google Drive Integration Drawer */}
      <DriveIntegrationDrawer 
        open={driveDrawerOpen} 
        onOpenChange={setDriveDrawerOpen}
        isActive={isDriveActive}
      />

      {/* Google Drive Integration Modal */}
      <DriveIntegrationModal 
        open={driveModalOpen} 
        onOpenChange={setDriveModalOpen}
        onSuccess={refreshDriveStatus}
      />
    </DashboardLayout>
  );
};

export default AdminApiKeys;
