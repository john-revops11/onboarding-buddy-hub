
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Loader2, RefreshCw, CheckCircle, ClipboardList, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { getClients, completeClientOnboarding, OnboardingClient } from "@/lib/clients";
import { useChecklist } from "@/hooks/useChecklist";

export function ClientStatus() {
  const [clients, setClients] = useState<OnboardingClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const clientsData = await getClients();
      setClients(clientsData);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast({
        title: "Error",
        description: "Failed to load clients. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const markClientComplete = async (id: string) => {
    setProcessingId(id);
    try {
      const success = await completeClientOnboarding(id);
      
      if (success) {
        toast({
          title: "Onboarding Completed",
          description: "The client's onboarding has been marked as complete."
        });
        
        // Update the client status in the UI
        setClients(prevClients => 
          prevClients.map(client => 
            client.id === id 
              ? { 
                  ...client, 
                  status: "active"
                } 
              : client
          )
        );
      }
    } catch (error) {
      console.error("Error marking client as complete:", error);
      toast({
        title: "Error",
        description: "Failed to update client status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const viewClientDetails = (id: string) => {
    // Navigate to a client-specific view
    navigate(`/admin/clients/${id}`);
  };

  const getClientProgress = (client: OnboardingClient): {progress: number, steps_completed: number, total_steps: number} => {
    // Calculate progress based on completion of team invitations and onboarding steps
    // This would ideally come from a more complex calculation based on checklist completion
    const total_steps = 6;
    let steps_completed = 0;
    
    // Basic progress calculation
    if (client.email) steps_completed++;
    if (client.companyName) steps_completed++;
    if (client.subscriptionTier.id) steps_completed++;
    if (client.teamMembers.length > 0) steps_completed++;
    if (client.teamMembers.some(m => m.invitationStatus === 'accepted')) steps_completed++;
    if (client.status === 'active') steps_completed = total_steps;
    
    const progress = Math.round((steps_completed / total_steps) * 100);
    
    return { progress, steps_completed, total_steps };
  };

  const filteredClients = clients.filter(client => 
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.companyName && client.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    client.subscriptionTier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input
          type="search"
          placeholder="Search by client name or tier..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={fetchClients} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => {
                  const { progress, steps_completed, total_steps } = getClientProgress(client);
                  
                  return (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        {client.companyName || client.email}
                      </TableCell>
                      <TableCell>{client.subscriptionTier.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={progress} className="h-2 w-[100px]" />
                          <span className="text-xs text-muted-foreground">
                            {steps_completed}/{total_steps}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(client.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={client.status === "active" ? "success" : "default"}
                        >
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewClientDetails(client.id)}
                          className="mr-2"
                        >
                          <ClipboardList className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        
                        {client.status === "pending" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={!!processingId || progress < 100}
                                className={progress === 100 ? "bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 border-green-200" : ""}
                              >
                                {processingId === client.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                )}
                                Complete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Complete Onboarding</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to mark this client's onboarding as complete?
                                  This will grant them full access to the dashboard.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => markClientComplete(client.id)}
                                  className="bg-green-600 text-white hover:bg-green-700"
                                >
                                  Complete Onboarding
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        
                        {client.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/clients/${client.id}`)}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No clients found. Create a new client to begin the onboarding process.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
