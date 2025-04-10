
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
  Plus,
  Calendar,
  Edit,
  Trash2,
  Eye,
  Download,
  Search,
  Users,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminDiagnosticReviewsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample diagnostic reviews data
  const reviews = [
    {
      id: "1",
      title: "Q2 2023 Strategic Diagnostic",
      clientName: "Acme Corp",
      date: "2023-06-15",
      status: "completed",
      assignedTo: "John Smith",
      recommendations: 5,
      kpis: 8,
      nextReviewDate: "2023-09-15"
    },
    {
      id: "2",
      title: "Annual Business Review",
      clientName: "TechGlobal Inc",
      date: "2023-01-10",
      status: "completed",
      assignedTo: "Sarah Johnson",
      recommendations: 12,
      kpis: 15,
      nextReviewDate: "2024-01-15"
    },
    {
      id: "3",
      title: "Market Positioning Analysis",
      clientName: "Retail Partners",
      date: "2022-09-22",
      status: "completed",
      assignedTo: "John Smith",
      recommendations: 7,
      kpis: 6,
      nextReviewDate: "2023-03-22"
    },
    {
      id: "4",
      title: "Q3 2023 Strategic Planning",
      clientName: "Acme Corp",
      status: "scheduled",
      date: "2023-09-10",
      assignedTo: "Michael Brown",
      recommendations: 0,
      kpis: 0,
      nextReviewDate: ""
    },
    {
      id: "5",
      title: "Product Strategy Review",
      clientName: "Innovation Labs",
      status: "in-progress",
      date: "2023-07-05",
      assignedTo: "Sarah Johnson",
      recommendations: 3,
      kpis: 4,
      nextReviewDate: ""
    }
  ];
  
  // Filter reviews based on search
  const filteredReviews = reviews.filter(review => 
    review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case "scheduled":
        return <Badge variant="outline" className="bg-amber-50 text-amber-800">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Upcoming reviews (scheduled or in progress)
  const upcomingReviews = reviews.filter(r => r.status === 'scheduled' || r.status === 'in-progress');
  
  // Sample clients with review statistics
  const clientReviewStats = [
    { 
      clientName: "Acme Corp", 
      completedReviews: 2, 
      scheduledReviews: 1,
      lastReview: "2023-06-15",
      nextReview: "2023-09-10"
    },
    { 
      clientName: "TechGlobal Inc", 
      completedReviews: 1, 
      scheduledReviews: 0,
      lastReview: "2023-01-10",
      nextReview: ""
    },
    { 
      clientName: "Retail Partners", 
      completedReviews: 1, 
      scheduledReviews: 0,
      lastReview: "2022-09-22",
      nextReview: ""
    },
    { 
      clientName: "Innovation Labs", 
      completedReviews: 0, 
      scheduledReviews: 1,
      lastReview: "",
      nextReview: "2023-07-05"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Diagnostic Reviews</h1>
            <p className="text-muted-foreground">
              Manage strategic reviews and client assessments
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar size={16} />
              Schedule Review
            </Button>
            <Button size="sm" className="gap-2">
              <Plus size={16} />
              New Review
            </Button>
          </div>
        </div>

        {/* Upcoming Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Reviews</CardTitle>
            <CardDescription>
              Scheduled and in-progress diagnostic reviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingReviews.length > 0 ? (
                upcomingReviews.map(review => (
                  <Card key={review.id} className="hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{review.title}</CardTitle>
                        {getStatusBadge(review.status)}
                      </div>
                      <CardDescription>{review.clientName}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex justify-between gap-3 text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{review.assignedTo}</span>
                        </div>
                      </div>
                      <div className="flex justify-between gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View
                        </Button>
                        <Button size="sm" className="flex-1">
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  <p>No upcoming reviews scheduled</p>
                  <Button variant="outline" className="mt-4">
                    Schedule a Review
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-1.5 w-40">
                  <Label htmlFor="status-filter" className="text-xs">Status</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="status-filter" className="h-10">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="ghost" className="self-end h-10" onClick={() => setSearchQuery("")}>
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* All Reviews */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Reviews</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>All Diagnostic Reviews</CardTitle>
                <CardDescription>
                  {filteredReviews.length} reviews found
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
                      <TableHead className="text-center">Recommendations</TableHead>
                      <TableHead className="text-center">KPIs</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">{review.title}</TableCell>
                        <TableCell>{review.clientName}</TableCell>
                        <TableCell>{new Date(review.date).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(review.status)}</TableCell>
                        <TableCell>{review.assignedTo}</TableCell>
                        <TableCell className="text-center">{review.recommendations}</TableCell>
                        <TableCell className="text-center">{review.kpis}</TableCell>
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
                  Showing {filteredReviews.length} of {reviews.length} reviews
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completed Reviews</CardTitle>
                <CardDescription>
                  Finalized diagnostic reviews with recommendations
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
                      <TableHead className="text-center">Recommendations</TableHead>
                      <TableHead className="text-center">KPIs</TableHead>
                      <TableHead>Next Review</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews
                      .filter(review => review.status === "completed")
                      .map((review) => (
                        <TableRow key={review.id}>
                          <TableCell className="font-medium">{review.title}</TableCell>
                          <TableCell>{review.clientName}</TableCell>
                          <TableCell>{new Date(review.date).toLocaleDateString()}</TableCell>
                          <TableCell>{review.assignedTo}</TableCell>
                          <TableCell className="text-center">{review.recommendations}</TableCell>
                          <TableCell className="text-center">{review.kpis}</TableCell>
                          <TableCell>{review.nextReviewDate ? new Date(review.nextReviewDate).toLocaleDateString() : "-"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
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
          
          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Reviews</CardTitle>
                <CardDescription>
                  Scheduled and in-progress reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews
                      .filter(review => review.status === "scheduled" || review.status === "in-progress")
                      .map((review) => (
                        <TableRow key={review.id}>
                          <TableCell className="font-medium">{review.title}</TableCell>
                          <TableCell>{review.clientName}</TableCell>
                          <TableCell>{new Date(review.date).toLocaleDateString()}</TableCell>
                          <TableCell>{getStatusBadge(review.status)}</TableCell>
                          <TableCell>{review.assignedTo}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
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
        
        {/* Client Review Status */}
        <Card>
          <CardHeader>
            <CardTitle>Client Review Status</CardTitle>
            <CardDescription>
              Overview of reviews by client
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-center">Completed Reviews</TableHead>
                  <TableHead className="text-center">Upcoming Reviews</TableHead>
                  <TableHead>Last Review</TableHead>
                  <TableHead>Next Review</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientReviewStats.map((client, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{client.clientName}</TableCell>
                    <TableCell className="text-center">{client.completedReviews}</TableCell>
                    <TableCell className="text-center">{client.scheduledReviews}</TableCell>
                    <TableCell>
                      {client.lastReview ? new Date(client.lastReview).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell>
                      {client.nextReview ? new Date(client.nextReview).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDiagnosticReviewsPage;
