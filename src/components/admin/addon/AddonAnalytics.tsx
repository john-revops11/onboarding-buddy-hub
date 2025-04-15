import { useState, useEffect } from "react";
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
import { fetchAddonAnalytics } from "@/lib/addon-management";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  subscriptionTierData: {
    tierName: string;
    addonCount: number;
    color: string;
  }[];
  addonPopularityData: {
    name: string;
    count: number;
    color: string;
  }[];
}

export const AddonAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    subscriptionTierData: [],
    addonPopularityData: []
  });
  const [activeTab, setActiveTab] = useState("usage");
  const { toast } = useToast();

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAddonAnalytics();
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast({
          title: "Error",
          description: "Failed to load add-on analytics",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalyticsData();
  }, [toast]);

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
            ) : analyticsData.subscriptionTierData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No data available for subscription tiers
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
            ) : analyticsData.addonPopularityData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No data available for addon popularity
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
                        <Cell key={`cell-${index}`} fill={entry.color} />
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
