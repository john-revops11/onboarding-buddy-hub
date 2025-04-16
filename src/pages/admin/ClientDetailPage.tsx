
import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Building, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  Upload, 
  Users, 
  Package, 
  Check, 
  CreditCard, 
  ChevronRight,
  Edit,
  AlertTriangle,
  Shield,
  Clock,
  CheckCircle
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import ConsultingTierBox from "@/components/dashboard/ConsultingTierBox";

// Mock client data - in a real app, this would come from an API call
const clientData = {
  id: "client123",
  name: "Acme Corporation",
  email: "contact@acmecorp.com",
  phone: "+1 (555) 123-4567",
  address: "123 Business Ave, Suite 500, San Francisco, CA 94107",
  logo: "/lovable-uploads/dea409e6-aeec-4b1c-9742-d95c742d338a.png",
  status: "active",
  industry: "Technology",
  createdAt: "2023-10-15",
  subscription: {
    plan: "Enterprise",
    status: "active",
    billingCycle: "annual",
    renewalDate: "2024-10-15",
    price: "$15,000/year"
  },
  onboarding: {
    progress: 75,
    completedSteps: 6,
    totalSteps: 8,
    lastActivity: "2023-11-01"
  },
  team: [
    { id: "u1", name: "John Smith", email: "john@acmecorp.com", role: "Admin", lastActive: "1 hour ago" },
    { id: "u2", name: "Sarah Johnson", email: "sarah@acmecorp.com", role: "Editor", lastActive: "3 days ago" },
    { id: "u3", name: "Michael Brown", email: "michael@acmecorp.com", role: "Viewer", lastActive: "1 week ago" }
  ],
  files: [
    { id: "f1", name: "Q3_Financial_Data.xlsx", type: "Excel", uploadedBy: "John Smith", date: "2023-10-25" },
    { id: "f2", name: "Marketing_Plan_2024.pdf", type: "PDF", uploadedBy: "Sarah Johnson", date: "2023-10-20" },
    { id: "f3", name: "Customer_Survey_Results.csv", type: "CSV", uploadedBy: "Michael Brown", date: "2023-10-18" }
  ]
};

const ClientDetailPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  const tierBenefits = [
    "Priority access to support",
    "Custom reporting dashboards",
    "24/7 emergency response",
    "Quarterly strategy sessions",
    "Custom training sessions"
  ];

  const handleTierChange = (newTier: string) => {
    console.log(`Tier changed to: ${newTier}`);
    // In a real app, you would call an API to update the tier
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-5 bg-neutral-50 p-5 min-h-screen">
        <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{clientData.name}</h1>
            <p className="text-muted-foreground">
              Client ID: {clientData.id}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit Client
            </Button>
            <Button size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Contact
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
          <TabsList className="bg-white rounded-md shadow-sm p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-5">
            <div className="grid gap-5 grid-cols-1 md:grid-cols-3">
              {/* Client Info Card */}
              <Card className="md:col-span-2 standard-card">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={clientData.logo} alt={clientData.name} />
                      <AvatarFallback>{clientData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{clientData.name}</CardTitle>
                      <CardDescription>{clientData.industry}</CardDescription>
                      <div className="flex items-center mt-1">
                        <Badge variant={clientData.status === "active" ? "success" : "outline"} className="capitalize">
                          {clientData.status === "active" ? (
                            <>
                              <Check className="mr-1 h-3 w-3" />
                              Active
                            </>
                          ) : (
                            "Inactive"
                          )}
                        </Badge>
                        <Badge variant="outline" className="ml-2">
                          <Calendar className="mr-1 h-3 w-3" />
                          {new Date(clientData.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{clientData.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{clientData.phone}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{clientData.address}</span>
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm">{clientData.subscription.plan} Plan</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3 flex justify-end">
                  <Button variant="outline" size="sm">
                    View Full Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Platform Tier Box */}
              <ConsultingTierBox
                tier="Premium"
                description="Enhanced features and dedicated support"
                benefits={tierBenefits}
                isEditable={true}
                onChange={handleTierChange}
              />
            </div>
            
            {/* Onboarding Progress */}
            <Card className="standard-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Onboarding Progress</CardTitle>
                  <CardDescription>
                    Client has completed {clientData.onboarding.completedSteps} of {clientData.onboarding.totalSteps} onboarding steps
                  </CardDescription>
                </div>
                <Badge variant={clientData.onboarding.progress === 100 ? "success" : "secondary"}>
                  {clientData.onboarding.progress === 100 ? (
                    <>
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Complete
                    </>
                  ) : (
                    <>
                      <Clock className="mr-1 h-4 w-4" />
                      In Progress
                    </>
                  )}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{clientData.onboarding.progress}%</span>
                  </div>
                  <Progress value={clientData.onboarding.progress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Last activity: {clientData.onboarding.lastActivity}
                  </p>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="border rounded-md p-3 bg-white">
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Check className="mr-1 h-3 w-3" />
                        Complete
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm mt-2">Initial Setup</h4>
                    <p className="text-xs text-muted-foreground mt-1">Account configuration complete</p>
                  </div>
                  
                  <div className="border rounded-md p-3 bg-white">
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <Check className="mr-1 h-3 w-3" />
                        Complete
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm mt-2">Data Integration</h4>
                    <p className="text-xs text-muted-foreground mt-1">Data sources connected</p>
                  </div>
                  
                  <div className="border rounded-md p-3 bg-white">
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Pending
                      </Badge>
                    </div>
                    <h4 className="font-medium text-sm mt-2">Team Training</h4>
                    <p className="text-xs text-muted-foreground mt-1">Scheduled for next week</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3 flex justify-end">
                <Button>
                  Manage Onboarding
                </Button>
              </CardFooter>
            </Card>
            
            {/* Recent Activity */}
            <div className="grid gap-5 md:grid-cols-2">
              <Card className="standard-card">
                <CardHeader>
                  <CardTitle>Recent Team Activity</CardTitle>
                  <CardDescription>Latest actions from client team members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between border-b pb-2">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>JS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">John Smith</p>
                          <p className="text-xs text-muted-foreground">Uploaded financial data</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex items-start justify-between border-b pb-2">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>SJ</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">Sarah Johnson</p>
                          <p className="text-xs text-muted-foreground">Updated company profile</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">Yesterday</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>MB</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">Michael Brown</p>
                          <p className="text-xs text-muted-foreground">Downloaded report</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">3 days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="standard-card">
                <CardHeader>
                  <CardTitle>Latest Files</CardTitle>
                  <CardDescription>Recently uploaded documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {clientData.files.map(file => (
                      <div key={file.id} className="flex items-start justify-between border-b pb-2 last:border-0">
                        <div className="flex items-center">
                          <div className="mr-3 p-2 bg-neutral-100 rounded">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {file.type} • Uploaded by {file.uploadedBy}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{file.date}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-3 flex justify-center">
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New File
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-5">
            <Card className="standard-card">
              <CardHeader>
                <CardTitle>Subscription Details</CardTitle>
                <CardDescription>Information about the client's current plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="border rounded-md p-4 bg-white">
                    <h4 className="text-sm font-medium text-muted-foreground">Current Plan</h4>
                    <p className="text-lg font-bold mt-1">{clientData.subscription.plan}</p>
                  </div>
                  <div className="border rounded-md p-4 bg-white">
                    <h4 className="text-sm font-medium text-muted-foreground">Billing Cycle</h4>
                    <p className="text-lg font-bold mt-1 capitalize">{clientData.subscription.billingCycle}</p>
                  </div>
                  <div className="border rounded-md p-4 bg-white">
                    <h4 className="text-sm font-medium text-muted-foreground">Price</h4>
                    <p className="text-lg font-bold mt-1">{clientData.subscription.price}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-3">
                    <div>
                      <h4 className="font-medium">Renewal Date</h4>
                      <p className="text-sm text-muted-foreground">{clientData.subscription.renewalDate}</p>
                    </div>
                    <Badge variant={clientData.subscription.status === "active" ? "success" : "outline"}>
                      {clientData.subscription.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center border-b pb-3">
                    <div>
                      <h4 className="font-medium">Data Storage</h4>
                      <p className="text-sm text-muted-foreground">50 GB used of 100 GB</p>
                    </div>
                    <div className="w-1/3">
                      <Progress value={50} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">User Seats</h4>
                      <p className="text-sm text-muted-foreground">3 used of 10 available</p>
                    </div>
                    <div className="w-1/3">
                      <Progress value={30} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3 flex justify-between">
                <Button variant="outline">
                  <Package className="mr-2 h-4 w-4" />
                  Change Plan
                </Button>
                <Button>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Billing
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-5">
            <Card className="standard-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage client team access and permissions</CardDescription>
                </div>
                <Button size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Add Team Member
                </Button>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientData.team.map(member => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              {member.name}
                            </div>
                          </TableCell>
                          <TableCell>{member.email}</TableCell>
                          <TableCell>
                            <Badge variant={member.role === "Admin" ? "secondary" : "outline"}>
                              {member.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{member.lastActive}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Edit</Button>
                            <Button variant="ghost" size="sm" className="text-red-500">Remove</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="files" className="space-y-5">
            <Card className="standard-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Client Files</CardTitle>
                  <CardDescription>Documents and data files uploaded by the client</CardDescription>
                </div>
                <Button size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Uploaded By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientData.files.map(file => (
                        <TableRow key={file.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <div className="mr-3 p-2 bg-neutral-100 rounded">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              </div>
                              {file.name}
                            </div>
                          </TableCell>
                          <TableCell>{file.type}</TableCell>
                          <TableCell>{file.uploadedBy}</TableCell>
                          <TableCell>{file.date}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Download</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ClientDetailPage;
