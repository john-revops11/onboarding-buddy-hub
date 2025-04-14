
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface ClientDetails {
  id: string;
  email: string;
  company_name: string;
  onboarding_completed: boolean;
  status: string;
  created_at: string;
  subscription: string;
  addons: string[];
  joinDate: string;
}

const ClientDetailsPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchClientDetails = async () => {
      setIsLoading(true);
      
      try {
        // Fetch client data
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select(`
            id, 
            email, 
            company_name, 
            onboarding_completed, 
            status, 
            created_at,
            subscription:subscription_id(name)
          `)
          .eq('id', clientId)
          .single();
        
        if (clientError) throw clientError;
        
        if (!clientData) {
          toast.error("Client not found");
          navigate('/admin/clients');
          return;
        }
        
        // Fetch client add-ons
        const { data: addonData, error: addonError } = await supabase
          .from('client_addons')
          .select(`
            addon:addon_id(name)
          `)
          .eq('client_id', clientId);
        
        if (addonError) throw addonError;
        
        // Fetch team members
        const { data: teamData, error: teamError } = await supabase
          .from('team_members')
          .select(`
            id,
            email,
            invitation_status,
            user:user_id(name, email, role)
          `)
          .eq('client_id', clientId);
        
        if (teamError) throw teamError;
        
        // Format the client data
        const formattedClient: ClientDetails = {
          ...clientData,
          subscription: clientData.subscription?.name || 'No Subscription',
          addons: addonData?.map(addon => addon.addon?.name) || [],
          joinDate: clientData.created_at ? new Date(clientData.created_at).toISOString().split('T')[0] : 'Unknown'
        };
        
        // Format team members data
        const formattedTeamMembers: TeamMember[] = teamData?.map(member => ({
          id: member.id,
          name: member.user?.name || 'Pending User',
          email: member.email,
          role: member.user?.role || 'Pending',
          status: member.invitation_status
        })) || [];
        
        setClient(formattedClient);
        setTeamMembers(formattedTeamMembers);
        
      } catch (error) {
        console.error("Error fetching client details:", error);
        toast.error("Failed to load client details");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (clientId) {
      fetchClientDetails();
    }
  }, [clientId, navigate]);

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
        ) : client ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Company Name</div>
                  <div className="font-medium">{client.company_name || 'Not provided'}</div>
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
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <div className="font-medium capitalize">{client.status}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Onboarding</div>
                  <div className="font-medium">{client.onboarding_completed ? 'Completed' : 'In Progress'}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                {teamMembers.length > 0 ? (
                  <div className="space-y-3">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                        <div className="text-sm bg-muted px-2.5 py-0.5 rounded-md">
                          {member.status === 'pending' ? 'Pending' : member.role}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <p>No team members found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No client data found</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientDetailsPage;
