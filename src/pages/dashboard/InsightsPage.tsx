
import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { InsightEmbed } from "@/components/insights/InsightEmbed";
import { InsightsList } from "@/components/insights/InsightsList";
import { getClientFiles, getLatestFile } from "@/utils/googleDriveUtils";
import { format } from "date-fns";

// Interface for insight documents
interface InsightDocument {
  id: string;
  name: string;
  modifiedTime: string;
  size: string;
  webViewLink: string;
  embedLink: string;
  type?: string;
}

const InsightsPage = () => {
  const [latestInsight, setLatestInsight] = useState<InsightDocument | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<InsightDocument | null>(null);
  const [insights, setInsights] = useState<InsightDocument[]>([]);
  const [isLoadingLatest, setIsLoadingLatest] = useState(true);
  const [isLoadingArchive, setIsLoadingArchive] = useState(true);
  const [latestError, setLatestError] = useState<string | null>(null);
  const [archiveError, setArchiveError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLatestInsight = async () => {
      setIsLoadingLatest(true);
      try {
        // In a real implementation, this would use the authenticated user's client ID
        const clientId = "current-client";
        const latest = await getLatestFile(clientId, "insights");
        setLatestInsight(latest);
        setSelectedInsight(latest); // Set the latest as the initially selected
        setLatestError(null);
      } catch (err) {
        console.error("Error fetching latest insight:", err);
        setLatestError("Could not load the latest insight document.");
      } finally {
        setIsLoadingLatest(false);
      }
    };

    const fetchInsightsList = async () => {
      setIsLoadingArchive(true);
      try {
        // In a real implementation, this would use the authenticated user's client ID
        const clientId = "current-client";
        const allInsights = await getClientFiles(clientId, "insights");
        
        // Remove the latest insight from the list if it exists
        if (latestInsight) {
          const filteredInsights = allInsights.filter(
            insight => insight.id !== latestInsight.id
          );
          setInsights(filteredInsights);
        } else {
          // If no latest insight is set yet, show all and set pages
          setInsights(allInsights.slice(1)); // Assuming the first one is the latest
        }
        
        // Calculate total pages
        setTotalPages(Math.ceil(
          (latestInsight ? allInsights.length - 1 : allInsights.length) / itemsPerPage
        ));
        
        setArchiveError(null);
      } catch (err) {
        console.error("Error fetching insights list:", err);
        setArchiveError("Could not load historical insights.");
      } finally {
        setIsLoadingArchive(false);
      }
    };

    fetchLatestInsight();
    fetchInsightsList();
  }, []);

  // Function to format the current month and year
  const formatCurrentMonthYear = (document: InsightDocument | null) => {
    if (!document) return "Current Monthly Insight";
    
    // Try to extract date from filename (e.g., "2025-04-insight.pdf")
    const dateMatch = document.name.match(/(\d{4})-(\d{2})/);
    if (dateMatch) {
      const year = dateMatch[1];
      const month = dateMatch[2];
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return `${format(date, 'MMMM yyyy')} Insight`;
    }
    
    // Fallback to using the modified date
    try {
      const modifiedDate = new Date(document.modifiedTime);
      return `${format(modifiedDate, 'MMMM yyyy')} Insight`;
    } catch (e) {
      return "Current Monthly Insight";
    }
  };

  const handleViewInsight = (insight: InsightDocument) => {
    setSelectedInsight(insight);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Get current page items
  const getCurrentPageInsights = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return insights.slice(startIndex, endIndex);
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Latest Insights</h1>
          <p className="text-muted-foreground mt-2">
            Your regular performance snapshots and strategic recommendations from Revify. (Updated Monthly)
          </p>
        </div>
        
        {/* Latest Insight Document */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg md:text-xl">
              <Calendar className="mr-2" size={20} />
              {formatCurrentMonthYear(selectedInsight)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InsightEmbed 
              embedLink={selectedInsight?.embedLink || null}
              webViewLink={selectedInsight?.webViewLink || null}
              fileName={selectedInsight?.name || null}
              isLoading={isLoadingLatest}
              error={latestError}
            />
          </CardContent>
        </Card>
        
        {/* Previous Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg md:text-xl">
              <FileText className="mr-2" size={20} />
              Previous Insights
            </CardTitle>
            <CardDescription>
              Access your historical performance reports and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InsightsList 
              insights={getCurrentPageInsights()}
              isLoading={isLoadingArchive}
              error={archiveError}
              onViewInsight={handleViewInsight}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
};

export default InsightsPage;
