
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
import { 
  FileText, 
  PlusCircle, 
  Trash2, 
  Save, 
  UsersRound,
  InfoIcon,
  AlertTriangle
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
        <div className="flex flex-col space-y-1.5">
          <h1 className="text-3xl font-bold tracking-tight">Opportunities Management</h1>
          <p className="text-muted-foreground">
            Manage client opportunities and presentation links.
          </p>
        </div>
        
        <Card className="border-primary/10 shadow-md">
          <CardHeader className="pb-3 bg-gradient-to-r from-primary-50 to-transparent">
            <CardTitle className="flex items-center gap-2">
              <UsersRound size={20} className="text-primary" />
              Client Selection
            </CardTitle>
            <CardDescription>
              Select a client to manage their opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clients.length > 0 ? (
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger className="w-full md:w-80 focus:ring-primary/40">
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="bg-muted/30 p-8 rounded-lg text-center border border-dashed border-muted-foreground/30">
                <UsersRound size={40} className="mx-auto mb-3 text-muted-foreground/70" />
                <h3 className="text-lg font-medium mb-2">No Clients Available</h3>
                <p className="text-muted-foreground mb-5 max-w-md mx-auto">
                  There are no clients in the system yet. Clients need to be added before opportunities can be managed.
                </p>
                <Button 
                  variant="outline"
                  className="bg-primary/5 hover:bg-primary/10 border-primary/20"
                  onClick={() => window.location.href = '/admin/clients'}
                >
                  Go to Client Management
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {selectedClient && (
          <>
            <Card className="border-primary/10 shadow-md">
              <CardHeader className="pb-3 bg-gradient-to-r from-primary-50 to-transparent">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <span>Manage Opportunities</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon size={16} className="text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>Add, edit, or remove opportunities that could impact the client's business.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                    <CardDescription>
                      Add, edit, or remove client opportunities
                    </CardDescription>
                  </div>
                  <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                    Total: {opportunities.length}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {opportunities.length > 0 ? (
                    <div className="grid gap-3">
                      {opportunities.map((opportunity) => (
                        <div 
                          key={opportunity.id} 
                          className="p-4 border rounded-lg bg-card hover:shadow-sm transition-shadow flex justify-between items-start"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
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
                            <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-destructive hover:text-white hover:bg-destructive"
                              >
                                <Trash2 size={18} />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="end">
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 text-destructive">
                                  <AlertTriangle size={18} />
                                  <h4 className="font-medium">Confirm deletion</h4>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Are you sure you want to delete this opportunity? This action cannot be undone.
                                </p>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm">Cancel</Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleDeleteOpportunity(opportunity.id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-muted/20 rounded-lg border border-dashed border-muted-foreground/30">
                      <p className="text-muted-foreground">No opportunities added yet.</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add your first opportunity using the form below.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="border rounded-lg p-5 bg-muted/10 shadow-sm">
                  <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                    <PlusCircle size={18} className="text-primary" />
                    Add New Opportunity
                  </h3>
                  <div className="space-y-4">
                    <div className="form-group">
                      <label htmlFor="opp-title" className="text-sm font-medium block mb-1.5">
                        Opportunity Title <span className="text-destructive">*</span>
                      </label>
                      <Input 
                        id="opp-title"
                        placeholder="E.g., Increase conversion rate" 
                        value={newOpportunity.title}
                        onChange={(e) => setNewOpportunity({...newOpportunity, title: e.target.value})}
                        className="focus-visible:ring-primary/40"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="opp-desc" className="text-sm font-medium block mb-1.5">
                        Opportunity Description <span className="text-destructive">*</span>
                      </label>
                      <Textarea 
                        id="opp-desc"
                        placeholder="Describe the opportunity in detail" 
                        value={newOpportunity.description}
                        onChange={(e) => setNewOpportunity({...newOpportunity, description: e.target.value})}
                        className="min-h-[100px] focus-visible:ring-primary/40"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="text-sm font-medium block mb-1.5">
                        Priority Level
                      </label>
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="priority" 
                            checked={newOpportunity.priority === "high"} 
                            onChange={() => setNewOpportunity({...newOpportunity, priority: "high"})}
                            className="text-primary"
                          />
                          <span className="text-sm">High Priority</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="priority" 
                            checked={newOpportunity.priority === "medium"} 
                            onChange={() => setNewOpportunity({...newOpportunity, priority: "medium"})}
                            className="text-primary"
                          />
                          <span className="text-sm">Medium Priority</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name="priority" 
                            checked={newOpportunity.priority === "low"} 
                            onChange={() => setNewOpportunity({...newOpportunity, priority: "low"})}
                            className="text-primary"
                          />
                          <span className="text-sm">Low Priority</span>
                        </label>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleAddOpportunity} 
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      <PlusCircle size={16} className="mr-2" />
                      Add Opportunity
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-primary/10 shadow-md">
              <CardHeader className="pb-3 bg-gradient-to-r from-primary-50 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <FileText size={20} className="text-primary" />
                  Manage Presentations
                </CardTitle>
                <CardDescription>
                  Add or remove client presentation links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {presentations.length > 0 ? (
                    <div className="grid gap-3">
                      {presentations.map((presentation) => (
                        <div 
                          key={presentation.id} 
                          className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-center">
                            <div className="mr-3 p-2 bg-primary/10 rounded-full">
                              <FileText size={18} className="text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{presentation.title}</p>
                              <a 
                                href={presentation.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-xs text-primary underline underline-offset-2 hover:text-primary/80 truncate max-w-[300px] sm:max-w-[400px] inline-block"
                              >
                                {presentation.link}
                              </a>
                            </div>
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-destructive hover:text-white hover:bg-destructive"
                              >
                                <Trash2 size={18} />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="end">
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 text-destructive">
                                  <AlertTriangle size={18} />
                                  <h4 className="font-medium">Confirm deletion</h4>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Are you sure you want to delete this presentation link? This action cannot be undone.
                                </p>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" size="sm">Cancel</Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleDeletePresentation(presentation.id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8 bg-muted/20 rounded-lg border border-dashed border-muted-foreground/30">
                      <p className="text-muted-foreground">No presentations added yet.</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Add your first presentation link using the form below.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="border rounded-lg p-5 bg-muted/10 shadow-sm">
                  <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                    <PlusCircle size={18} className="text-primary" />
                    Add New Presentation Link
                  </h3>
                  <div className="space-y-4">
                    <div className="form-group">
                      <label htmlFor="pres-title" className="text-sm font-medium block mb-1.5">
                        Presentation Title <span className="text-destructive">*</span>
                      </label>
                      <Input 
                        id="pres-title"
                        placeholder="E.g., Q1 2025 Performance Review" 
                        value={newPresentation.title}
                        onChange={(e) => setNewPresentation({...newPresentation, title: e.target.value})}
                        className="focus-visible:ring-primary/40"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="pres-link" className="text-sm font-medium block mb-1.5">
                        Google Drive Link <span className="text-destructive">*</span>
                      </label>
                      <Input 
                        id="pres-link"
                        placeholder="https://drive.google.com/..." 
                        value={newPresentation.link}
                        onChange={(e) => setNewPresentation({...newPresentation, link: e.target.value})}
                        className="focus-visible:ring-primary/40"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Make sure the link has appropriate sharing permissions
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleAddPresentation} 
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      <PlusCircle size={16} className="mr-2" />
                      Add Presentation
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4 bg-muted/10">
                <Button 
                  onClick={handleSaveChanges} 
                  className="ml-auto bg-accentGreen-600 hover:bg-accentGreen-600/90"
                >
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
