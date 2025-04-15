
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, CheckSquare, User, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getChecklistWithItems } from "@/lib/checklist-management/checklist-query";
import { getClientsForAssignment } from "@/lib/checklist-management/checklist-actions";
import { useChecklistManagement } from "@/hooks/useChecklistManagement";

interface Client {
  id: string;
  email: string;
  company_name: string | null;
}

const AssignChecklist = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { assignChecklist, isSubmitting } = useChecklistManagement();
  
  const [checklist, setChecklist] = useState<any>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  
  // Load checklist and clients data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load checklist
        if (id) {
          const checklistData = await getChecklistWithItems(id);
          setChecklist(checklistData);
        }
        
        // Load clients
        const clientsData = await getClientsForAssignment();
        setClients(clientsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  // Toggle client selection
  const toggleClientSelection = (clientId: string) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  // Handle assignment
  const handleAssign = async () => {
    if (selectedClients.length === 0) {
      return;
    }
    
    // Assign checklist to each selected client
    const assignments = await Promise.all(
      selectedClients.map(clientId => assignChecklist(id!, clientId))
    );
    
    const successful = assignments.filter(result => result.success).length;
    const failed = assignments.length - successful;
    
    if (successful > 0) {
      navigate("/admin/checklists");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/checklists")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Assign Checklist
          </h1>
        </div>

        {checklist && (
          <Card>
            <CardHeader>
              <CardTitle>Checklist Information</CardTitle>
              <CardDescription>
                You're about to assign this checklist to clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <CheckSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{checklist.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {checklist.description || "No description provided"}
                    </p>
                    <p className="text-sm mt-1">
                      {checklist.items?.length || 0} items to complete
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Select Clients</CardTitle>
            <CardDescription>
              Choose which clients to assign this checklist to
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {clients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No clients available for assignment.
              </div>
            ) : (
              clients.map((client) => (
                <div 
                  key={client.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${
                    selectedClients.includes(client.id) ? "bg-primary/5 border-primary/30" : ""
                  }`}
                  onClick={() => toggleClientSelection(client.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={""} />
                      <AvatarFallback>
                        {client.company_name 
                          ? client.company_name.charAt(0) 
                          : client.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{client.company_name || client.email}</p>
                      {client.company_name && (
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-md border flex items-center justify-center">
                    {selectedClients.includes(client.id) && (
                      <CheckSquare className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
          <CardFooter className="flex justify-between pt-2">
            <div>
              <p className="text-sm font-medium">
                {selectedClients.length} client(s) selected
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/checklists")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAssign}
                disabled={selectedClients.length === 0 || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  "Assign Checklist"
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AssignChecklist;
