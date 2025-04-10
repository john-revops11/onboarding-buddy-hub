
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

// Mock data - this would come from an API in a real implementation
const MOCK_ADDONS = [
  {
    id: "1",
    name: "Weekly Reports",
    description: "Receive detailed reports every week",
    price: "49.99",
    tags: ["reporting", "analytics"],
  },
  {
    id: "2",
    name: "Dedicated Consultant",
    description: "Get a dedicated consultant for your business",
    price: "199.99",
    tags: ["consulting", "premium"],
  },
  {
    id: "3",
    name: "Custom Dashboard",
    description: "Customized dashboard for your business needs",
    price: "79.99",
    tags: ["dashboard", "customization"],
  },
  {
    id: "4",
    name: "API Access",
    description: "Full API access for integrations",
    price: "99.99",
    tags: ["api", "development", "integration"],
  },
];

const AdminAddonsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addons, setAddons] = useState(MOCK_ADDONS);
  const [addonToDelete, setAddonToDelete] = useState<string | null>(null);

  const handleDeleteAddon = (id: string) => {
    // In a real implementation, this would call an API endpoint
    setAddons((prev) => prev.filter((addon) => addon.id !== id));
    
    toast({
      title: "Add-on deleted",
      description: "The add-on has been removed successfully.",
    });
    
    setAddonToDelete(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Add-ons</h1>
          <Button
            onClick={() => navigate("/admin/addons/create")}
            className="flex items-center gap-2"
          >
            <Plus size={18} /> New Add-on
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Available Add-ons</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {addons.map((addon) => (
                  <TableRow key={addon.id}>
                    <TableCell className="font-medium">{addon.name}</TableCell>
                    <TableCell>{addon.description}</TableCell>
                    <TableCell>${addon.price}/mo</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {addon.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/admin/addons/edit/${addon.id}`)}
                        >
                          <Edit size={16} />
                        </Button>
                        
                        <AlertDialog open={addonToDelete === addon.id} onOpenChange={(isOpen) => {
                          if (!isOpen) setAddonToDelete(null);
                        }}>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setAddonToDelete(addon.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Add-on</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the "{addon.name}" add-on? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground"
                                onClick={() => handleDeleteAddon(addon.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
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

export default AdminAddonsPage;
