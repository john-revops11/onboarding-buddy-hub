
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface SubscriptionData {
  name: string;
  count: number;
  revenue: number;
  color: string;
}

interface AddonData {
  name: string;
  count: number;
  revenue: number;
  color: string;
}

interface SubscriptionAnalyticsProps {
  subscriptionData: SubscriptionData[];
  addonData: AddonData[];
}

export function SubscriptionAnalytics({ subscriptionData, addonData }: SubscriptionAnalyticsProps) {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const totalRevenue = subscriptionData.reduce((sum, item) => sum + item.revenue, 0) + 
                       addonData.reduce((sum, item) => sum + item.revenue, 0);
  
  const totalSubscribers = subscriptionData.reduce((sum, item) => sum + item.count, 0);
  
  const averageRevenuePerUser = totalSubscribers ? (totalRevenue / totalSubscribers) : 0;

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total MRR</CardTitle>
            <CardDescription>Monthly Recurring Revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand">{formatCurrency(totalRevenue)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Subscribers</CardTitle>
            <CardDescription>Active subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand">{totalSubscribers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Revenue</CardTitle>
            <CardDescription>Per subscriber</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-brand">{formatCurrency(averageRevenuePerUser)}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Subscription Distribution</CardTitle>
            <CardDescription>Breakdown by subscription tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subscriptionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={isMobile ? 80 : 100}
                    dataKey="count"
                    nameKey="name"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {subscriptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [value, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Subscription Revenue</CardTitle>
            <CardDescription>Monthly revenue by tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subscriptionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Bar dataKey="revenue" name="Revenue">
                    {subscriptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Add-on Popularity</CardTitle>
          <CardDescription>Revenue from add-on services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={addonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="revenue" name="Revenue">
                  {addonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
