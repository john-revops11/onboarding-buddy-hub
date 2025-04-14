
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { getAddons, deleteAddon } from "@/lib/addon-management";
import { Addon } from "@/lib/types/client-types";

const AdminAddonsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addons, setAddons] = useState<Addon[]>([]);
  const [loading, setLoading] = useState(true);
  const [addonToDelete, setAddonToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddons = async () => {
      try {
        const data = await getAddons();
        setAddons(data);
      } catch (error) {
        console.error("Error fetching addons:", error);
        toast({
          title: "Error",
          description: "Failed to load add-ons. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAddons();
  }, [toast]);

  const handleDeleteAddon = async (id: string) => {
    try {
      const success = await deleteAddon(id);
      
      if (success) {
        setAddons((prev) => prev.filter((addon) => addon.id !== id));
        
        toast({
          title: "Add-on deleted",
          description: "The add-on has been removed successfully.",
        });
      } else {
        throw new Error("Failed to delete addon");
      }
    } catch (error) {
      console.error("Error deleting addon:", error);
      toast({
        title: "Error",
        description: "Failed to delete the add-on. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddonToDelete(null);
    }
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
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading add-ons...</span>
              </div>
            ) : addons.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No add-ons found. Create your first add-on to get started.</p>
                <Button
                  onClick={() => navigate("/admin/addons/create")}
                  className="mt-4"
                >
                  <Plus size={16} className="mr-2" /> Create Add-on
                </Button>
              </div>
            ) : (
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
                          {addon.tags && addon.tags.map((tag) => (
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
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setAddonToDelete(addon.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
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
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminAddonsPage;
