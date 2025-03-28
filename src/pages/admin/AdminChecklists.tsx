
import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminChecklists = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Checklist Management
        </h1>
        <p className="text-muted-foreground">
          Create, edit, and assign checklists to users.
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Onboarding Checklists</h2>
          </div>
          <Button>Create Checklist</Button>
        </div>

        <Tabs defaultValue="templates">
          <TabsList>
            <TabsTrigger value="templates">Checklist Templates</TabsTrigger>
            <TabsTrigger value="assigned">Assigned Checklists</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Available Templates</CardTitle>
                <CardDescription>
                  Manage your checklist templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">New Client Onboarding</h3>
                      <p className="text-sm text-muted-foreground">
                        10 items - Standard onboarding process for new clients
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Duplicate
                      </Button>
                      <Button size="sm">Assign</Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Enterprise Client Onboarding</h3>
                      <p className="text-sm text-muted-foreground">
                        15 items - Extended onboarding for enterprise clients
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Duplicate
                      </Button>
                      <Button size="sm">Assign</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assigned" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Checklists</CardTitle>
                <CardDescription>
                  View checklists assigned to users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="py-3 px-4 text-left">User</th>
                        <th className="py-3 px-4 text-left">Checklist</th>
                        <th className="py-3 px-4 text-left">Progress</th>
                        <th className="py-3 px-4 text-left">Assigned Date</th>
                        <th className="py-3 px-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="py-3 px-4">Test User</td>
                        <td className="py-3 px-4">New Client Onboarding</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="bg-gray-200 w-24 h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-primary h-full rounded-full"
                                style={{ width: "30%" }}
                              ></div>
                            </div>
                            <span className="text-xs">30%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">2023-06-15</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminChecklists;
