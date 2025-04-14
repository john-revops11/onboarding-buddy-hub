
import React, { useState } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    system: {
      maintenanceMode: false,
      debugMode: false,
      allowNewRegistrations: true,
    },
    email: {
      sendWelcomeEmails: true,
      sendNotificationEmails: true,
      emailFooterText: "Powered by our platform",
    },
    security: {
      requireStrongPasswords: true,
      enableTwoFactor: false,
      sessionTimeout: 30,
    }
  });

  const handleSave = () => {
    // In a real app, you would save these settings to a backend
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    
    toast({
      title: "Settings saved",
      description: "System settings have been updated successfully.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
          <p className="text-muted-foreground">
            Configure system-wide settings and preferences.
          </p>
        </div>

        <Tabs defaultValue="system" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure core system functionality.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Temporarily disable the application for all users.
                    </p>
                  </div>
                  <Switch
                    id="maintenance"
                    checked={settings.system.maintenanceMode}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      system: { ...settings.system, maintenanceMode: checked }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="debug">Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable detailed logging and error messages.
                    </p>
                  </div>
                  <Switch
                    id="debug"
                    checked={settings.system.debugMode}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      system: { ...settings.system, debugMode: checked }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="registrations">Allow New Registrations</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable new user registrations.
                    </p>
                  </div>
                  <Switch
                    id="registrations"
                    checked={settings.system.allowNewRegistrations}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      system: { ...settings.system, allowNewRegistrations: checked }
                    })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>
                  Configure system email notifications and templates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="welcomeEmails">Welcome Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Send welcome emails to new users.
                    </p>
                  </div>
                  <Switch
                    id="welcomeEmails"
                    checked={settings.email.sendWelcomeEmails}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      email: { ...settings.email, sendWelcomeEmails: checked }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notificationEmails">Notification Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Send system notification emails to users.
                    </p>
                  </div>
                  <Switch
                    id="notificationEmails"
                    checked={settings.email.sendNotificationEmails}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      email: { ...settings.email, sendNotificationEmails: checked }
                    })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security policies and options.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="strongPasswords">Require Strong Passwords</Label>
                    <p className="text-sm text-muted-foreground">
                      Enforce strong password requirements for all users.
                    </p>
                  </div>
                  <Switch
                    id="strongPasswords"
                    checked={settings.security.requireStrongPasswords}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      security: { ...settings.security, requireStrongPasswords: checked }
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactor">Enable Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require two-factor authentication for all admin users.
                    </p>
                  </div>
                  <Switch
                    id="twoFactor"
                    checked={settings.security.enableTwoFactor}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      security: { ...settings.security, enableTwoFactor: checked }
                    })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSave}>Save settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
