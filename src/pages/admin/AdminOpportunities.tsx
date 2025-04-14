
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { FileText, PlusCircle, Trash2, Save, UsersRound } from "lucide-react";

const AdminOpportunities = () => {
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState<string>("");
  
  // Empty arrays instead of mock data
  const clients: { id: string; name: string }[] = [];
  
  const [opportunities, setOpportunities] = useState<{
    id: number;
    title: string;
    description: string;
    priority: string;
  }[]>([]);
  
  const [newOpportunity, setNewOpportunity] = useState({
    title: "",
    description: "",
    priority: "medium"
  });
  
  const [presentations, setPresentations] = useState<{
    id: number;
    title: string;
    link: string;
  }[]>([]);
  
  const [newPresentation, setNewPresentation] = useState({
    title: "",
    link: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleAddOpportunity = () => {
    if (!newOpportunity.title || !newOpportunity.description) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setOpportunities([
      ...opportunities, 
      { 
        ...newOpportunity,
        id: Date.now()
      }
    ]);
    
    setNewOpportunity({
      title: "",
      description: "",
      priority: "medium"
    });
    
    toast({
      title: "Opportunity added",
      description: "The opportunity has been added successfully"
    });
  };
  
  const handleDeleteOpportunity = (id: number) => {
    setOpportunities(opportunities.filter(o => o.id !== id));
    
    toast({
      title: "Opportunity deleted",
      description: "The opportunity has been removed"
    });
  };
  
  const handleAddPresentation = () => {
    if (!newPresentation.title || !newPresentation.link) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setPresentations([
      ...presentations,
      {
        ...newPresentation,
        id: Date.now()
      }
    ]);
    
    setNewPresentation({
      title: "",
      link: ""
    });
    
    toast({
      title: "Presentation added",
      description: "The presentation link has been added successfully"
    });
  };
  
  const handleDeletePresentation = (id: number) => {
    setPresentations(presentations.filter(p => p.id !== id));
    
    toast({
      title: "Presentation deleted",
      description: "The presentation link has been removed"
    });
  };
  
  const handleSaveChanges = () => {
    toast({
      title: "Changes saved",
      description: "All changes have been saved successfully"
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Opportunities Management</h1>
        <p className="text-muted-foreground">
          Manage client opportunities and presentation links.
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle>Client Selection</CardTitle>
            <CardDescription>
              Select a client to manage their opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clients.length > 0 ? (
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="w-full md:w-80">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="bg-muted/30 p-6 rounded-lg text-center">
                <UsersRound size={36} className="mx-auto mb-2 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-1">No Clients Available</h3>
                <p className="text-muted-foreground mb-4">
                  There are no clients in the system yet. Clients need to be added before opportunities can be managed.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {selectedClient && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Manage Opportunities</CardTitle>
                <CardDescription>
                  Add, edit, or remove client opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {opportunities.length > 0 ? (
                    opportunities.map((opportunity) => (
                      <div key={opportunity.id} className="p-4 border rounded-lg bg-card flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{opportunity.title}</h3>
                            <div className={`px-2 py-1 text-xs rounded-full ${
                              opportunity.priority === 'high' 
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                                : opportunity.priority === 'medium'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            }`}>
                              {opportunity.priority.charAt(0).toUpperCase() + opportunity.priority.slice(1)}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{opportunity.description}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteOpportunity(opportunity.id)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-6 bg-muted/20 rounded-lg">
                      <p className="text-muted-foreground">No opportunities added yet.</p>
                    </div>
                  )}
                </div>
                
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h3 className="text-sm font-medium mb-3">Add New Opportunity</h3>
                  <div className="space-y-3">
                    <Input 
                      placeholder="Opportunity Title" 
                      value={newOpportunity.title}
                      onChange={(e) => setNewOpportunity({...newOpportunity, title: e.target.value})}
                    />
                    <Textarea 
                      placeholder="Opportunity Description" 
                      value={newOpportunity.description}
                      onChange={(e) => setNewOpportunity({...newOpportunity, description: e.target.value})}
                    />
                    <div className="flex flex-wrap gap-3">
                      <label className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          name="priority" 
                          checked={newOpportunity.priority === "high"} 
                          onChange={() => setNewOpportunity({...newOpportunity, priority: "high"})}
                          className="text-primary"
                        />
                        <span>High Priority</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          name="priority" 
                          checked={newOpportunity.priority === "medium"} 
                          onChange={() => setNewOpportunity({...newOpportunity, priority: "medium"})}
                          className="text-primary"
                        />
                        <span>Medium Priority</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          name="priority" 
                          checked={newOpportunity.priority === "low"} 
                          onChange={() => setNewOpportunity({...newOpportunity, priority: "low"})}
                          className="text-primary"
                        />
                        <span>Low Priority</span>
                      </label>
                    </div>
                    <Button onClick={handleAddOpportunity} className="w-full">
                      <PlusCircle size={16} className="mr-2" />
                      Add Opportunity
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Manage Presentations</CardTitle>
                <CardDescription>
                  Add or remove client presentation links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {presentations.length > 0 ? (
                    presentations.map((presentation) => (
                      <div key={presentation.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center">
                          <div className="mr-3 p-2 bg-primary/10 rounded">
                            <FileText size={18} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{presentation.title}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[300px] sm:max-w-[400px]">
                              {presentation.link}
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeletePresentation(presentation.id)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-6 bg-muted/20 rounded-lg">
                      <p className="text-muted-foreground">No presentations added yet.</p>
                    </div>
                  )}
                </div>
                
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h3 className="text-sm font-medium mb-3">Add New Presentation Link</h3>
                  <div className="space-y-3">
                    <Input 
                      placeholder="Presentation Title" 
                      value={newPresentation.title}
                      onChange={(e) => setNewPresentation({...newPresentation, title: e.target.value})}
                    />
                    <Input 
                      placeholder="Google Drive Link" 
                      value={newPresentation.link}
                      onChange={(e) => setNewPresentation({...newPresentation, link: e.target.value})}
                    />
                    <Button onClick={handleAddPresentation} className="w-full">
                      <PlusCircle size={16} className="mr-2" />
                      Add Presentation
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4">
                <Button onClick={handleSaveChanges} className="ml-auto">
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminOpportunities;
