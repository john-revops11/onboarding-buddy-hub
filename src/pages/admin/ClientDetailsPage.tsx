
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const ClientDetailsPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    // Simulate loading client data
    const timer = setTimeout(() => {
      setClient({
        id: clientId,
        companyName: 'Sample Company LLC',
        email: 'contact@samplecompany.com',
        subscription: 'Enterprise',
        addons: ['Advanced Analytics', 'Priority Support'],
        onboardingProgress: 70,
        joinDate: '2023-10-15',
        teamMembers: [
          { id: '1', name: 'John Doe', email: 'john@samplecompany.com', role: 'Admin' },
          { id: '2', name: 'Jane Smith', email: 'jane@samplecompany.com', role: 'User' }
        ]
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [clientId]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Client Details</h1>
            <p className="text-muted-foreground mt-1">
              View and manage client details
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/admin/clients')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Clients
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[300px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Company Name</div>
                  <div className="font-medium">{client.companyName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Email</div>
                  <div className="font-medium">{client.email}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Subscription</div>
                  <div className="font-medium">{client.subscription}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Join Date</div>
                  <div className="font-medium">{client.joinDate}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Add-ons</div>
                  <div className="font-medium">
                    {client.addons.length > 0 ? client.addons.join(', ') : 'None'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {client.teamMembers.map((member: any) => (
                    <div key={member.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.email}</div>
                      </div>
                      <div className="text-sm bg-muted px-2.5 py-0.5 rounded-md">
                        {member.role}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientDetailsPage;
