
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { OpportunitiesSummary } from "@/components/opportunities/OpportunitiesSummary";
import { DocumentLibrary } from "@/components/opportunities/DocumentLibrary";
import { FileText, TrendingUp } from "lucide-react";
import { toast } from "sonner";

// Mock opportunities data - would come from an API in a real implementation
const MOCK_OPPORTUNITIES = [
  {
    id: "1",
    area: "Pricing Optimization",
    description: "Potential impact: $24,500",
    annualValue: "$24.5K",
    impactLevel: "high" as const
  },
  {
    id: "2",
    area: "Cross-Selling",
    description: "Potential impact: $12,300",
    annualValue: "$12.3K",
    impactLevel: "medium" as const
  },
  {
    id: "3",
    area: "Customer Retention",
    description: "Potential impact: $8,900",
    annualValue: "$8.9K",
    impactLevel: "medium" as const
  },
  {
    id: "4",
    area: "Process Automation",
    description: "Est. savings: $18,200",
    annualValue: "$18.2K",
    impactLevel: "high" as const
  },
  {
    id: "5",
    area: "Resource Allocation",
    description: "Est. savings: $7,500",
    annualValue: "$7.5K",
    impactLevel: "medium" as const
  },
  {
    id: "6",
    area: "Inventory Management",
    description: "Est. savings: $5,300",
    annualValue: "$5.3K",
    impactLevel: "low" as const
  }
];

// Mock documents data - would come from an API in a real implementation
const MOCK_DOCUMENTS = [
  {
    id: "1",
    name: "Q1 2025 Diagnostic Review",
    type: "diagnostic",
    date: "March 15, 2025",
    url: "https://example.com/documents/1"
  },
  {
    id: "2",
    name: "Pricing Strategy Analysis",
    type: "report",
    date: "February 28, 2025",
    url: "https://example.com/documents/2"
  },
  {
    id: "3",
    name: "Customer Retention Analysis",
    type: "report",
    date: "January 15, 2025",
    url: "https://example.com/documents/3"
  },
  {
    id: "4",
    name: "Q4 2024 Performance Review",
    type: "presentation",
    date: "December 10, 2024",
    url: "https://example.com/documents/4"
  },
  {
    id: "5",
    name: "Market Opportunity Analysis",
    type: "report",
    date: "November 5, 2024",
    url: "https://example.com/documents/5"
  }
];

const OpportunitiesPage = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [opportunities, setOpportunities] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, these would be API calls
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setOpportunities(MOCK_OPPORTUNITIES);
        setDocuments(MOCK_DOCUMENTS);
      } catch (error) {
        console.error("Error fetching opportunities data:", error);
        toast.error("Failed to load opportunities data", {
          description: "Please try again later."
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="text-left">
          <h1 className="text-3xl font-bold tracking-tight">Top Opportunities</h1>
          <p className="text-muted-foreground mt-1">
            Review key strategic opportunities identified by Revify and access related diagnostic reports and presentations.
          </p>
        </div>
        
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="summary">
              <TrendingUp className="h-4 w-4 mr-2" />
              Opportunities Summary
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="h-4 w-4 mr-2" />
              Document Library
            </TabsTrigger>
          </TabsList>
          
          <Card className="mt-6">
            <CardContent className="pt-6">
              <TabsContent value="summary" className="m-0">
                <OpportunitiesSummary 
                  opportunities={opportunities} 
                  isLoading={isLoading} 
                />
              </TabsContent>
              
              <TabsContent value="documents" className="m-0">
                <DocumentLibrary 
                  documents={documents} 
                  isLoading={isLoading} 
                />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default OpportunitiesPage;
