
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { AddonForm } from "@/components/admin/addon/AddonForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const EditAddonPage = () => {
  const { id } = useParams<{ id: string }>();
  const [addon, setAddon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would be an API call
    const fetchAddon = () => {
      const found = MOCK_ADDONS.find((a) => a.id === id);
      
      if (found) {
        setAddon(found);
      }
      
      setLoading(false);
    };

    fetchAddon();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <p>Loading add-on details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!addon) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <p>Add-on not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Add-on</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Edit {addon.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <AddonForm initialData={addon} isEditing />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EditAddonPage;
