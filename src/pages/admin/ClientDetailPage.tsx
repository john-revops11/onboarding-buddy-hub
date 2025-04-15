
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Building, 
  Mail, 
  Calendar, 
  User, 
  FileText, 
  Package, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type ClientStatus = "pending" | "active" | "inactive";

interface ClientDetail {
  id: string;
  email: string;
  companyName: string;
  created_at: string;
  status: ClientStatus;
  subscriptionTier: {
    id: string;
    name: string;
    price: number;
  };
  teamMembers: {
    email: string;
    invitationStatus: string;
  }[];
  addons: {
    id: string;
    name: string;
    price: number;
  }[];
  onboardingProgress?: {
    completed: number;
    total: number;
  };
}

const ClientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientDetails = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be an API call
        // For now, we'll simulate data
        const mockClient: ClientDetail = {
          id: id || "cl-001",
          email: "contact@acmeinc.com",
          companyName: "Acme Inc.",
          created_at: "2023-04-15T10:30:00Z",
          status: "active",
          subscriptionTier: {
            id: "tier-1",
            name: "Professional",
            price: 499
          },
          teamMembers: [
            { email: "john@acmeinc.com", invitationStatus: "accepted" },
            { email: "sarah@acmeinc.com", invitationStatus: "accepted" },
            { email: "mike@acmeinc.com", invitationStatus: "pending" }
          ],
          addons: [
            { id: "addon-1", name: "Priority Support", price: 99 },
            { id: "addon-2", name: "Additional Storage", price: 49 }
          ],
          onboardingProgress: {
            completed: 4,
            total: 6
          }
        };
        
        setClient(mockClient);
      } catch (error) {
        console.error("Error fetching client details:", error);
        toast({
          title: "Error",
          description: "Failed to load client details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClientDetails();
    }
  }, [id, toast]);

  const handleStatusChange = (newStatus: ClientStatus) => {
    if (client) {
      setClient({ ...client, status: newStatus });
      toast({
        title: "Status Updated",
        description: `Client status changed to ${newStatus}`,
      });
    }
  };

  const getStatusBadgeVariant = (status: ClientStatus) => {
    switch (status) {
      case "active": return "success";
      case "pending": return "warning";
      case "inactive": return "secondary";
      default: return "outline";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading client details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!client) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">Client not found</p>
          <Button onClick={() => navigate("/admin")}>Back to Dashboard</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate("/admin")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{client.companyName}</h1>
          <Badge variant={getStatusBadgeVariant(client.status)}>
            {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card className="standard-card md:col-span-2">
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>Basic company details and account information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Company Name</p>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{client.companyName}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{client.email}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Client ID</p>
                  <p className="font-mono text-sm">{client.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Created</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p>{new Date(client.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="font-medium">Subscription</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <p>{client.subscriptionTier.name}</p>
                  </div>
                  <p className="font-medium">${client.subscriptionTier.price}/month</p>
                </div>
              </div>
              
              {client.addons.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium">Add-ons</p>
                  {client.addons.map((addon) => (
                    <div key={addon.id} className="flex justify-between items-center">
                      <p className="text-sm">{addon.name}</p>
                      <p className="text-sm font-medium">${addon.price}/month</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-4 pt-4 border-t">
              <Button variant="outline">Edit Details</Button>
              <Button>Manage Subscription</Button>
            </CardFooter>
          </Card>
          
          <Card className="standard-card h-fit">
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Manage client account status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Current Status</p>
                <Badge 
                  variant={getStatusBadgeVariant(client.status)}
                  className="w-full flex justify-center py-2"
                >
                  {client.status.toUpperCase()}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Change Status</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={client.status === "pending" ? "border-yellow-500" : ""}
                    onClick={() => handleStatusChange("pending")}
                  >
                    Pending
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={client.status === "active" ? "border-green-500" : ""}
                    onClick={() => handleStatusChange("active")}
                  >
                    Active
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={client.status === "inactive" ? "border-gray-500" : ""}
                    onClick={() => handleStatusChange("inactive")}
                  >
                    Inactive
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="team" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>
          
          <TabsContent value="team">
            <Card className="standard-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage client team and access</CardDescription>
                </div>
                <Button size="sm">Add Member</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {client.teamMembers.map((member, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between py-2 border-b last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <User className="h-8 w-8 p-1 rounded-full bg-muted text-muted-foreground" />
                        <div>
                          <p className="font-medium">{member.email}</p>
                          <Badge variant={member.invitationStatus === "accepted" ? "success" : "warning"}>
                            {member.invitationStatus}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Manage</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="onboarding">
            <Card className="standard-card">
              <CardHeader>
                <CardTitle>Onboarding Progress</CardTitle>
                <CardDescription>Track client onboarding status</CardDescription>
              </CardHeader>
              <CardContent>
                {client.onboardingProgress ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p>Overall Progress</p>
                      <p className="font-medium">{client.onboardingProgress.completed} of {client.onboardingProgress.total} steps completed</p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${(client.onboardingProgress.completed / client.onboardingProgress.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="pt-4 flex justify-end">
                      <Button>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        View Onboarding Details
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Onboarding not started</p>
                    <Button className="mt-4">Start Onboarding</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="files">
            <Card className="standard-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Files</CardTitle>
                  <CardDescription>Documents and files uploaded by client</CardDescription>
                </div>
                <Button size="sm">Upload File</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Financial_Report_2023.pdf</p>
                        <p className="text-sm text-muted-foreground">Uploaded on April 12, 2023</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Contract_Agreement.docx</p>
                        <p className="text-sm text-muted-foreground">Uploaded on March 28, 2023</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Business_Proposal.pdf</p>
                        <p className="text-sm text-muted-foreground">Uploaded on February 15, 2023</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                <Button variant="link">View All Files</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ClientDetailPage;
