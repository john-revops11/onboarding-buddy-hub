
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  Bar, 
  BarChart, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
  Legend,
  Tooltip
} from "recharts";
import { Loader2 } from "lucide-react";

interface AnalyticsData {
  subscriptionTierData: SubscriptionTierAddonData[];
  addonPopularityData: AddonPopularityData[];
}

interface SubscriptionTierAddonData {
  tierName: string;
  addonCount: number;
  color: string;
}

interface AddonPopularityData {
  name: string;
  count: number;
  color: string;
}

// Mock data generator - in a real app, this would come from your API
const generateMockAnalytics = (): AnalyticsData => {
  // This is temporary mock data - in a real implementation you'd fetch this from Supabase
  return {
    subscriptionTierData: [
      { tierName: "Basic", addonCount: 28, color: "#4ade80" },
      { tierName: "Standard", addonCount: 45, color: "#f97316" },
      { tierName: "Premium", addonCount: 65, color: "#8b5cf6" },
      { tierName: "Enterprise", addonCount: 82, color: "#ec4899" }
    ],
    addonPopularityData: [
      { name: "Priority Support", count: 56, color: "#3b82f6" },
      { name: "Advanced Analytics", count: 42, color: "#10b981" },
      { name: "Extended Storage", count: 38, color: "#f59e0b" },
      { name: "Custom Reports", count: 25, color: "#ef4444" },
      { name: "API Access", count: 19, color: "#8b5cf6" }
    ]
  };
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#4ade80"];

export const AddonAnalytics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(generateMockAnalytics());
  const [activeTab, setActiveTab] = useState("usage");

  // In a real implementation, you would fetch the actual data here
  // const fetchAnalyticsData = async () => {
  //   setIsLoading(true);
  //   try {
  //     const data = await fetchAddonAnalytics();
  //     setAnalyticsData(data);
  //   } catch (error) {
  //     console.error("Error fetching analytics:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchAnalyticsData();
  // }, []);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Add-on Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="usage">Usage by Tier</TabsTrigger>
            <TabsTrigger value="popularity">Addon Popularity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="usage" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-80">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.subscriptionTierData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis dataKey="tierName" />
                    <YAxis />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="font-medium">Tier:</div>
                                <div>{payload[0].payload.tierName}</div>
                                <div className="font-medium">Add-ons:</div>
                                <div>{payload[0].payload.addonCount}</div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="addonCount" name="Add-ons">
                      {analyticsData.subscriptionTierData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            <p className="text-sm text-muted-foreground text-center pt-2">
              Distribution of add-ons across subscription tiers
            </p>
          </TabsContent>
          
          <TabsContent value="popularity" className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-80">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.addonPopularityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsData.addonPopularityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [`${value} clients`, 'Usage']}
                      contentStyle={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <p className="text-sm text-muted-foreground text-center pt-2">
              Most popular add-ons by number of clients
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
