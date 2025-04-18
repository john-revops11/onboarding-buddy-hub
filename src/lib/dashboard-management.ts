
export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  url: string;
  type: string;
}

// This is a placeholder implementation
// In a real application, this would likely fetch data from a backend service
export async function getDashboardsByTier(tier: string, clientId: string): Promise<Dashboard[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock data based on tier
  const dashboards: Dashboard[] = [];
  
  if (tier === "Standard" || tier === "Premium" || tier === "Enterprise") {
    dashboards.push({
      id: "1",
      name: "Performance Overview",
      description: "High-level KPIs and performance metrics",
      url: "https://tableau.example.com/overview",
      type: "tableau"
    });
    
    dashboards.push({
      id: "2",
      name: "Revenue Analysis",
      description: "Detailed revenue breakdown and trends",
      url: "https://tableau.example.com/revenue",
      type: "tableau"
    });
  }

  // Add premium dashboards for higher tiers
  if (tier === "Premium" || tier === "Enterprise") {
    dashboards.push({
      id: "3",
      name: "Competitive Analysis",
      description: "Market positioning and competitive landscape",
      url: "https://tableau.example.com/competitive",
      type: "tableau"
    });
  }

  // Add enterprise-only dashboards
  if (tier === "Enterprise") {
    dashboards.push({
      id: "4",
      name: "Executive Dashboard",
      description: "C-level metrics and strategic indicators",
      url: "https://tableau.example.com/executive",
      type: "tableau"
    });
    
    dashboards.push({
      id: "5",
      name: "Predictive Analytics",
      description: "AI-powered forecasting and predictions",
      url: "https://tableau.example.com/predictive",
      type: "tableau"
    });
  }

  return dashboards;
}
