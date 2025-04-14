
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { AddonForm } from "@/components/admin/addon/AddonForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getAddons } from "@/lib/addon-management";
import { Addon } from "@/lib/types/client-types";

const EditAddonPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [addon, setAddon] = useState<Addon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAddon = async () => {
      try {
        if (!id) {
          throw new Error("Addon ID is required");
        }
        
        const addons = await getAddons();
        const found = addons.find(a => a.id === id);
        
        if (found) {
          setAddon(found);
        } else {
          throw new Error("Addon not found");
        }
      } catch (err: any) {
        console.error("Error fetching addon:", err);
        setError(err.message || "Failed to load addon");
      } finally {
        setLoading(false);
      }
    };

    fetchAddon();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin/addons")}
              className="mr-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Edit Add-on</h1>
          </div>
          <Card>
            <CardContent className="p-8 flex justify-center">
              <p>Loading add-on details...</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !addon) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin/addons")}
              className="mr-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Edit Add-on</h1>
          </div>
          <Card>
            <CardContent className="p-8">
              <div className="text-center">
                <p className="text-destructive">{error || "Add-on not found"}</p>
                <Button 
                  onClick={() => navigate("/admin/addons")} 
                  className="mt-4"
                >
                  Return to Add-ons
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Convert addon to the format expected by AddonForm
  const formData = {
    id: addon.id,
    name: addon.name,
    description: addon.description || "",
    price: addon.price.toString(),
    tags: addon.tags || [],
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin/addons")}
            className="mr-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Add-on</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Edit {addon.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <AddonForm initialData={formData} isEditing />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditAddonPage;
