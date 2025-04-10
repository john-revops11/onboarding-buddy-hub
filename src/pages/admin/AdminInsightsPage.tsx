
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Users,
  Plus,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Download,
  Filter,
  Search,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminInsightsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClient, setFilterClient] = useState("all");
  
  // Sample insights data
  const insights = [
    {
      id: "1",
      title: "Q2 Performance Analysis",
      clientName: "Acme Corp",
      date: "2023-06-28",
      status: "published",
      assignedTo: "John Smith",
      views: 15
    },
    {
      id: "2",
      title: "Market Penetration Strategy",
      clientName: "TechGlobal Inc",
      date: "2023-05-15",
      status: "published",
      assignedTo: "Sarah Johnson",
      views: 8
    },
    {
      id: "3",
      title: "Customer Retention Insights",
      clientName: "Retail Partners",
      date: "2023-04-10",
      status: "published",
      assignedTo: "John Smith",
      views: 12
    },
    {
      id: "4",
      title: "Q3 Planning Document",
      clientName: "Acme Corp",
      date: "2023-07-05",
      status: "draft",
      assignedTo: "Sarah Johnson",
      views: 0
    },
    {
      id: "5",
      title: "Product Strategy Review",
      clientName: "TechGlobal Inc",
      date: "2023-06-20",
      status: "draft",
      assignedTo: "Michael Brown",
      views: 0
    }
  ];
  
  // Sample clients
  const clients = [
    { id: "1", name: "Acme Corp" },
    { id: "2", name: "TechGlobal Inc" },
    { id: "3", name: "Retail Partners" },
    { id: "4", name: "Innovation Labs" },
    { id: "5", name: "Global Services Ltd" }
  ];
  
  // Sample consultants
  const consultants = [
    { id: "1", name: "John Smith" },
    { id: "2", name: "Sarah Johnson" },
    { id: "3", name: "Michael Brown" },
    { id: "4", name: "Emily Davis" }
  ];
  
  // Filter insights based on search and client filter
  const filteredInsights = insights.filter(insight => {
    const matchesSearch = 
      insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesClient = filterClient === "all" || insight.clientName === filterClient;
    
    return matchesSearch && matchesClient;
  });
  
  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case "draft":
        return <Badge variant="outline" className="bg-amber-50 text-amber-800">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Insights Management</h1>
            <p className="text-muted-foreground">
              Create and manage client insights and reports
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar size={16} />
              Schedule
            </Button>
            <Button size="sm" className="gap-2">
              <Plus size={16} />
              New Insight
            </Button>
          </div>
        </div>

        {/* Filter and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search insights..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-1.5 w-40">
                  <Label htmlFor="client-filter" className="text-xs">Client</Label>
                  <Select value={filterClient} onValueChange={setFilterClient}>
                    <SelectTrigger id="client-filter" className="h-10">
                      <SelectValue placeholder="All Clients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Clients</SelectItem>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={client.name}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5 w-40">
                  <Label htmlFor="status-filter" className="text-xs">Status</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="status-filter" className="h-10">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="ghost" className="self-end h-10" onClick={() => {
                  setSearchQuery("");
                  setFilterClient("all");
                }}>
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Insights</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Client Insights</CardTitle>
                <CardDescription>
                  {filteredInsights.length} insights found
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInsights.map((insight) => (
                      <TableRow key={insight.id}>
                        <TableCell className="font-medium">{insight.title}</TableCell>
                        <TableCell>{insight.clientName}</TableCell>
                        <TableCell>{new Date(insight.date).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(insight.status)}</TableCell>
                        <TableCell>{insight.assignedTo}</TableCell>
                        <TableCell>{insight.views}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="border-t p-4 flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {filteredInsights.length} of {insights.length} insights
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="published" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Published Insights</CardTitle>
                <CardDescription>
                  Insights that have been published to clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {insights
                      .filter(insight => insight.status === "published")
                      .map((insight) => (
                        <TableRow key={insight.id}>
                          <TableCell className="font-medium">{insight.title}</TableCell>
                          <TableCell>{insight.clientName}</TableCell>
                          <TableCell>{new Date(insight.date).toLocaleDateString()}</TableCell>
                          <TableCell>{insight.assignedTo}</TableCell>
                          <TableCell>{insight.views}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="drafts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Draft Insights</CardTitle>
                <CardDescription>
                  Insights that are still in progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Date Created</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {insights
                      .filter(insight => insight.status === "draft")
                      .map((insight) => (
                        <TableRow key={insight.id}>
                          <TableCell className="font-medium">{insight.title}</TableCell>
                          <TableCell>{insight.clientName}</TableCell>
                          <TableCell>{new Date(insight.date).toLocaleDateString()}</TableCell>
                          <TableCell>{insight.assignedTo}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" variant="destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Client Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Client Overview</CardTitle>
            <CardDescription>
              Insight engagement by client
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {clients.slice(0, 3).map((client) => {
                const clientInsights = insights.filter(i => i.clientName === client.name);
                const publishedCount = clientInsights.filter(i => i.status === "published").length;
                const totalViews = clientInsights.reduce((sum, i) => sum + i.views, 0);
                
                return (
                  <Card key={client.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Published</span>
                          <span className="font-medium">{publishedCount}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Total Views</span>
                          <span className="font-medium">{totalViews}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="ghost" size="sm" className="w-full">
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <Button variant="outline">View All Clients</Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminInsightsPage;
