
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getClientFiles, getLatestFile } from "@/utils/googleDriveUtils";
import { InsightEmbed } from "@/components/insights/InsightEmbed";
import { InsightsList } from "@/components/insights/InsightsList";

interface InsightDocument {
  id: string;
  name: string;
  modifiedTime: string;
  webViewLink: string;
  embedLink: string;
}

const InsightsPage = () => {
  // State for the currently selected document (featured in the viewer)
  const [selectedInsight, setSelectedInsight] = useState<InsightDocument | null>(null);
  
  // State for the list of historical documents
  const [historicalInsights, setHistoricalInsights] = useState<InsightDocument[]>([]);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [isListLoading, setIsListLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Mock client ID - in a real implementation, this would come from auth context
  const clientId = "client-123";

  // Function to fetch the latest insight
  const fetchLatestInsight = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const latestFile = await getLatestFile(clientId, "insights");
      if (latestFile) {
        setSelectedInsight(latestFile as InsightDocument);
      }
    } catch (err) {
      setError("Failed to load the latest insight document.");
      console.error("Error fetching latest insight:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch historical insights
  const fetchHistoricalInsights = async () => {
    setIsListLoading(true);
    setListError(null);
    
    try {
      const files = await getClientFiles(clientId, "insights");
      
      // Filter out the currently selected insight if it exists
      const filteredFiles = selectedInsight 
        ? files.filter(file => file.id !== selectedInsight.id)
        : files;
      
      // Sort by modification date, newest first
      const sortedFiles = filteredFiles.sort((a, b) => 
        new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime()
      );
      
      setHistoricalInsights(sortedFiles as InsightDocument[]);
      
      // Calculate total pages
      setTotalPages(Math.ceil(sortedFiles.length / itemsPerPage));
    } catch (err) {
      setListError("Could not load historical insights.");
      console.error("Error fetching historical insights:", err);
    } finally {
      setIsListLoading(false);
    }
  };

  // Function to handle viewing a different insight
  const handleViewInsight = (insight: InsightDocument) => {
    setSelectedInsight(insight);
    
    // If the currently viewed document is changed, update the list of historical insights
    fetchHistoricalInsights();
  };

  // Function to handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get current insights for pagination
  const getCurrentInsights = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return historicalInsights.slice(startIndex, endIndex);
  };

  // Initial data fetching
  useEffect(() => {
    fetchLatestInsight();
  }, []);

  // Fetch historical insights once we have the latest insight
  useEffect(() => {
    if (!isLoading) {
      fetchHistoricalInsights();
    }
  }, [isLoading, selectedInsight]);

  // Extract month and year for display
  const getCurrentMonthYear = () => {
    if (selectedInsight) {
      // Try to extract from filename first (YYYY-MM format)
      const dateMatch = selectedInsight.name.match(/(\d{4})-(\d{2})/);
      if (dateMatch) {
        const year = dateMatch[1];
        const month = dateMatch[2];
        const months = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        return `${months[parseInt(month, 10) - 1]} ${year}`;
      }
      
      // Fallback to modification date
      const date = new Date(selectedInsight.modifiedTime);
      return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    }
    
    // Default if no document is selected
    const now = new Date();
    return `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Latest Insights</h1>
          <p className="text-muted-foreground">
            Your regular performance snapshots and strategic recommendations from Revify. (Updated Monthly)
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Current Monthly Insight ({getCurrentMonthYear()})</CardTitle>
            <CardDescription>
              View and download your latest performance insights document
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InsightEmbed 
              embedLink={selectedInsight?.embedLink || null}
              webViewLink={selectedInsight?.webViewLink || null}
              fileName={selectedInsight?.name || null}
              isLoading={isLoading}
              error={error}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Previous Insights</CardTitle>
            <CardDescription>
              Access your historical performance insights documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InsightsList 
              insights={getCurrentInsights()}
              isLoading={isListLoading}
              error={listError}
              onViewInsight={handleViewInsight}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InsightsPage;
