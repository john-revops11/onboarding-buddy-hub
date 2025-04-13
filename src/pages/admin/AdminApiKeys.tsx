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
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminApiKeys = () => {
  const [driveDrawerOpen, setDriveDrawerOpen] = useState(false);
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  const [newApiKeyOpen, setNewApiKeyOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("existing");
  const [isDriveActive, setIsDriveActive] = useState(false);
  const [isDriveInError, setIsDriveInError] = useState(false);
  const [isCheckingDrive, setIsCheckingDrive] = useState(true);
  const { ping } = useDriveIntegration();
  const { toast } = useToast();

  // Check if Google Drive integration is active on component mount
  useEffect(() => {
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

    checkDriveStatus();
  }, []);

  // Function to refresh integration status after successful upload/revoke
  const refreshDriveStatus = async () => {
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
      console.error("Error refreshing Drive status:", error);
      setIsDriveActive(false);
      setIsDriveInError(true);
    } finally {
      setIsCheckingDrive(false);
    }
  };

  const handleRetryCheck = () => {
    refreshDriveStatus();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">API Keys Management</h1>
        <p className="text-muted-foreground">
          Manage API keys for various integrations.
        </p>

        {isDriveInError && (
          <Alert className="bg-orange-50 border-orange-200">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertTitle className="text-orange-800">Connection Issue</AlertTitle>
            <AlertDescription className="space-y-2 text-orange-700">
              <p>
                Unable to connect to the Supabase Edge Function to verify integration status.
                This may be because the Edge Function is not deployed or there's a network issue.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRetryCheck}
                className="mt-2"
              >
                Retry Connection
              </Button>
            </AlertDescription>
          </Alert>
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
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="py-3 px-4 text-left">Service</th>
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Last Used</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Google Drive</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">File Upload Integration</td>
                    <td className="py-3 px-4">
                      {isCheckingDrive ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse mr-2"></div>
                            Checking...
                          </div>
                        </Badge>
                      ) : isDriveInError ? (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 hover:bg-orange-50">
                          Connection error
                        </Badge>
                      ) : isDriveActive ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                          Missing key
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">Today, 10:30 AM</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setDriveModalOpen(true)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setDriveDrawerOpen(true)}
                          disabled={isDriveInError}
                        >
                          View
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive"
                          disabled={!isDriveActive && !isDriveInError}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-t">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Notion</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">Knowledge Hub</td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                        Active
                      </Badge>
                    </td>
                    <td className="py-3 px-4">Yesterday, 3:45 PM</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
