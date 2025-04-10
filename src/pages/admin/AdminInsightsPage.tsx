
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Link,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Trash2,
  Upload,
} from "lucide-react";
import { LineChart } from "@/components/ui/charts/LineChart";

// Sample insights data
const insightDocuments = [
  {
    id: "ins-001",
    title: "Q2 2023 Performance Analysis",
    client: "Acme Corporation",
    date: "2023-05-15",
    type: "quarterly",
    status: "published",
    views: 24,
    documentLink: "#",
  },
  {
    id: "ins-002",
    title: "Market Penetration Strategy",
    client: "TechStart Inc",
    date: "2023-04-22",
    type: "strategy",
    status: "published",
    views: 18,
    documentLink: "#",
  },
  {
    id: "ins-003",
    title: "Customer Retention Analysis",
    client: "Global Partners LLC",
    date: "2023-03-10",
    type: "analysis",
    status: "published",
    views: 32,
    documentLink: "#",
  },
  {
    id: "ins-004",
    title: "Financial Forecasting Report",
    client: "DataFlow Systems",
    date: "2023-02-05",
    type: "financial",
    status: "draft",
    views: 0,
    documentLink: "#",
  },
  {
    id: "ins-005",
    title: "Competitive Analysis Summary",
    client: "Retail Solutions Co",
    date: "2023-01-18",
    type: "analysis",
    status: "published",
    views: 45,
    documentLink: "#",
  },
];

// Sample view data for chart
const viewsData = [
  { name: "Jan", views: 120, documents: 4 },
  { name: "Feb", views: 145, documents: 5 },
  { name: "Mar", views: 190, documents: 6 },
  { name: "Apr", views: 210, documents: 5 },
  { name: "May", views: 240, documents: 7 },
  { name: "Jun", views: 280, documents: 8 },
];

const AdminInsightsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Filter logic for insights
  const filteredInsights = insightDocuments.filter((insight) => {
    const matchesSearch =
      insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || insight.type === filterType;
    const matchesStatus = filterStatus === "all" || insight.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Insights Management</h1>
            <p className="text-muted-foreground">
              Create and manage insights documents for clients
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar size={16} />
              Schedule
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus size={16} />
                  New Insight
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Create New Insight Document</DialogTitle>
                  <DialogDescription>
                    Create a new insight document for a client
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Title
                    </Label>
                    <Input
                      id="title"
                      placeholder="Enter document title"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="client" className="text-right">
                      Client
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acme">Acme Corporation</SelectItem>
                        <SelectItem value="techstart">TechStart Inc</SelectItem>
                        <SelectItem value="global">Global Partners LLC</SelectItem>
                        <SelectItem value="dataflow">DataFlow Systems</SelectItem>
                        <SelectItem value="retail">Retail Solutions Co</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quarterly">Quarterly Report</SelectItem>
                        <SelectItem value="strategy">Strategy Document</SelectItem>
                        <SelectItem value="analysis">Analysis Report</SelectItem>
                        <SelectItem value="financial">Financial Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <div className="col-span-3 flex w-full max-w-sm items-center space-x-2">
                      <Input
                        type="date"
                        id="date"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="documentLink" className="text-right">
                      Document Link
                    </Label>
                    <div className="col-span-3 flex w-full max-w-sm items-center space-x-2">
                      <Input
                        id="documentLink"
                        placeholder="Google Drive document link"
                        className="col-span-2 flex-1"
                      />
                      <Button variant="outline" size="sm">
                        <Link className="h-4 w-4 mr-2" />
                        Browse
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="summary" className="text-right">
                      Summary
                    </Label>
                    <Textarea
                      id="summary"
                      placeholder="Brief summary of the document"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Document</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Analytics Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>
              Document views and creation trends over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <LineChart
              data={viewsData}
              categories={["views", "documents"]}
              index="name"
            />
          </CardContent>
        </Card>

        {/* Insights Documents Table */}
        <Card>
          <CardHeader className="px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle>Insight Documents</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span>Filter</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex w-full max-w-sm items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Search documents..."
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" size="sm" variant="ghost">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="strategy">Strategy</SelectItem>
                    <SelectItem value="analysis">Analysis</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInsights.map((insight) => (
                  <TableRow key={insight.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-blue-500" />
                        {insight.title}
                      </div>
                    </TableCell>
                    <TableCell>{insight.client}</TableCell>
                    <TableCell>{insight.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{insight.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          insight.status === "published"
                            ? "success"
                            : "secondary"
                        }
                      >
                        {insight.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{insight.views}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between p-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredInsights.length} of {insightDocuments.length} documents
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminInsightsPage;
