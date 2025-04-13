
import React, { useState, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { useDriveIntegration } from "@/hooks/useDriveIntegration";
import { useToast } from "@/hooks/use-toast";
import { formatRelativeTime } from "@/lib/utils";

interface DriveIntegrationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isActive: boolean;
}

export function DriveIntegrationDrawer({ 
  open, 
  onOpenChange, 
  isActive 
}: DriveIntegrationDrawerProps) {
  const { ping, usage, audit } = useDriveIntegration();
  const { toast } = useToast();
  const [driveUsage, setDriveUsage] = useState<{ bytesUsed: number; totalQuota: number } | null>(null);
  const [auditLogs, setAuditLogs] = useState<Array<{ id: string; action: string; user: string; timestamp: string; details: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && isActive) {
      fetchData();
    }
  }, [open, isActive]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch usage data
      const usageData = await usage();
      if (usageData.data) {
        setDriveUsage(usageData.data);
      }

      // Fetch audit logs
      const auditData = await audit();
      if (auditData.data) {
        setAuditLogs(auditData.data);
      }
    } catch (error) {
      console.error("Error fetching Google Drive data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      const response = await ping();
      if (response.data && response.data.success) {
        toast({
          title: "Connection successful",
          description: "Google Drive integration is working properly.",
          variant: "success",
        });
      } else {
        toast({
          title: "Connection failed",
          description: "Unable to connect to Google Drive. Please check your credentials.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: "An error occurred while testing the connection.",
        variant: "destructive",
      });
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Google Drive Integration</SheetTitle>
          <SheetDescription>
            Manage your Google Drive integration and view usage statistics
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-4">
          {/* Overview Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Connection Status</span>
                {isActive ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">
                    Missing key
                  </Badge>
                )}
              </div>

              {isActive && driveUsage && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Storage Used</span>
                    <span className="text-sm font-medium">
                      {formatBytes(driveUsage.bytesUsed)} / {formatBytes(driveUsage.totalQuota)}
                    </span>
                  </div>
                  <Progress 
                    value={(driveUsage.bytesUsed / driveUsage.totalQuota) * 100} 
                    className="h-2"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Controls Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Controls</h3>
            <div className="space-y-3">
              <Button 
                onClick={handleTestConnection} 
                variant="outline" 
                disabled={!isActive || isLoading} 
                className="w-full"
              >
                Test Connection
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                disabled={!isActive || isLoading}
                asChild
              >
                <a href="/admin/drive">Open Admin File Explorer</a>
              </Button>
            </div>
          </div>

          {/* Audit Log Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Audit Log</h3>
            <div className="border rounded-md overflow-hidden">
              <div className="max-h-80 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          Loading audit logs...
                        </TableCell>
                      </TableRow>
                    ) : auditLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          No audit logs available
                        </TableCell>
                      </TableRow>
                    ) : (
                      auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.action}</TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>{formatRelativeTime(new Date(log.timestamp))}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
