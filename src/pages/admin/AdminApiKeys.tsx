
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
import { DriveIntegrationDrawer } from "@/components/admin/integrations/DriveIntegrationDrawer";
import { DriveIntegrationModal } from "@/components/admin/integrations/DriveIntegrationModal";
import { useDriveIntegration } from "@/hooks/useDriveIntegration";
import { ConnectionErrorAlert } from "@/components/admin/integrations/ConnectionErrorAlert";
import { ApiKeysTable } from "@/components/admin/integrations/ApiKeysTable";
import { Icons } from "@/components/icons";

const AdminApiKeys = () => {
  const [driveDrawerOpen, setDriveDrawerOpen] = useState(false);
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  const [isDriveActive, setIsDriveActive] = useState(false);
  const [isDriveInError, setIsDriveInError] = useState(false);
  const [isCheckingDrive, setIsCheckingDrive] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isCreatingDrives, setIsCreatingDrives] = useState(false);
  const { ping, triggerSharedDriveCreation, checkSecretConfiguration } = useDriveIntegration();

  // API integrations data
  const [integrations, setIntegrations] = useState([
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
  ]);

  // Check if Google Drive integration is active on component mount
  useEffect(() => {
    checkDriveStatus();
  }, []);

  // Update integrations when drive status changes
  useEffect(() => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === "google-drive" 
          ? {
              ...integration,
              isChecking: isCheckingDrive,
              isActive: isDriveActive,
              isError: isDriveInError
            }
          : integration
      )
    );
  }, [isCheckingDrive, isDriveActive, isDriveInError]);

  // Function to check Drive integration status
  const checkDriveStatus = async () => {
    setIsCheckingDrive(true);
    setConnectionError(null);
    try {
      // First try to check configuration which is more reliable
      const configStatus = await checkSecretConfiguration();
      
      if (configStatus.isNetworkError) {
        setIsDriveInError(true);
        setIsDriveActive(false);
        setConnectionError("Network error connecting to Edge Function. Please check your connection and try again.");
        setIsCheckingDrive(false);
        return;
      }
      
      // If config is properly set up, the drive is active
      if (configStatus.configured) {
        setIsDriveActive(true);
        setIsDriveInError(false);
        setIsCheckingDrive(false);
        return;
      }
      
      // Fallback to ping which is less reliable but still useful
      const response = await ping();
      
      if (response.error) {
        if (response.error.isNetworkError) {
          setIsDriveInError(true);
          setIsDriveActive(false);
          setConnectionError("Network error connecting to Edge Function. Please check your connection and try again.");
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
      setConnectionError(error.message || "Unknown error occurred");
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

  const handleCreateSharedDrives = async () => {
    setIsCreatingDrives(true);
    try {
      await triggerSharedDriveCreation();
    } catch (error) {
      console.error("Error creating shared drives:", error);
    } finally {
      setIsCreatingDrives(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">API Integrations</h1>
          
          {isDriveActive && (
            <Button 
              onClick={handleCreateSharedDrives}
              disabled={isCreatingDrives}
            >
              {isCreatingDrives ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Creating Shared Drives...
                </>
              ) : (
                "Create Shared Drives"
              )}
            </Button>
          )}
        </div>
        
        <p className="text-muted-foreground">
          Manage integrations with external services and APIs.
        </p>

        {isDriveInError && connectionError && (
          <ConnectionErrorAlert 
            onRetry={handleRetryCheck} 
            error={connectionError}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Available Integrations</CardTitle>
            <CardDescription>
              Connect to external services to extend your application's functionality.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApiKeysTable 
              integrations={integrations}
              onEdit={handleEditIntegration}
              onView={handleViewIntegration}
              onDelete={() => {}}
            />
          </CardContent>
        </Card>
      </div>

      {/* Google Drive Integration Drawer */}
      <DriveIntegrationDrawer 
        open={driveDrawerOpen} 
        onOpenChange={setDriveDrawerOpen}
        isActive={isDriveActive}
        onSuccessfulAction={refreshDriveStatus}
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
