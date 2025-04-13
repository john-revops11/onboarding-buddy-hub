import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { google } from "https://esm.sh/googleapis@126.0.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GROUP_EMAIL = "opssupport@revologyanalytics.com";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create a Supabase client with the auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: userError?.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is an admin
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required', details: profileError?.message }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all clients that need drives
    const { data: clients, error: clientsError } = await supabaseClient
      .from('clients')
      .select('id, company_name, drive_id')
      .is('drive_id', null);
    
    if (clientsError) {
      throw new Error(`Error fetching clients: ${clientsError.message}`);
    }
    
    if (!clients || clients.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No clients without drives found', results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create drives for each client
    const results = [];
    const drive = await initializeDriveClient();
    
    for (const client of clients) {
      try {
        console.log(`Creating shared drive for client: ${client.company_name} (${client.id})`);
        
        // Create the shared drive
        const response = await drive.drives.create({
          requestId: `client-${client.id}-${Date.now()}`, // Unique requestId for idempotency
          requestBody: {
            name: `${client.company_name} - Files`,
          },
          fields: 'id,name,kind',
        });
        
        const driveId = response.data.id;
        const driveName = response.data.name;
        
        console.log(`Created drive with ID ${driveId}, name "${driveName}", and kind ${response.data.kind}`);
        
        // Add group permission
        try {
          await drive.permissions.create({
            fileId: driveId,
            supportsAllDrives: true,
            requestBody: {
              role: 'manager',
              type: 'group',
              emailAddress: GROUP_EMAIL
            }
          });
          
          console.log(`Added group ${GROUP_EMAIL} as manager to drive ${driveId}`);
        } catch (permissionError) {
          console.error(`Error adding group permission: ${permissionError.message}`);
        }
        
        // Update client with drive ID
        const { error: updateError } = await supabaseClient
          .from('clients')
          .update({ 
            drive_id: driveId,
            drive_name: driveName
          })
          .eq('id', client.id);
        
        if (updateError) {
          throw new Error(`Error updating client with drive ID: ${updateError.message}`);
        }
        
        // Log to audit table
        try {
          await supabaseClient.from('drive_audit').insert({
            id: `create-drive-${Date.now()}-${client.id}`,
            action: 'CREATE_SHARED_DRIVE',
            username: user.email,
            timestamp: new Date().toISOString(),
            details: `Created shared drive "${driveName}" (${driveId}) for client: ${client.company_name}`
          });
        } catch (auditError) {
          console.warn(`Error logging to audit table: ${auditError.message}`);
        }
        
        results.push({
          clientId: client.id,
          companyName: client.company_name,
          driveId,
          driveName,
          success: true
        });
      } catch (error) {
        console.error(`Error creating drive for client ${client.id}:`, error);
        
        results.push({
          clientId: client.id,
          companyName: client.company_name,
          success: false,
          error: error.message
        });
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Created ${results.filter(r => r.success).length} out of ${results.length} shared drives`,
        results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message, stack: error.stack }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function initializeDriveClient() {
  try {
    // Get the service account key
    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    if (!serviceAccountKey) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not configured');
    }

    // Parse the key
    const json = JSON.parse(serviceAccountKey);
    const auth = new google.auth.JWT(
      json.client_email,
      undefined,
      json.private_key,
      ['https://www.googleapis.com/auth/drive'],
      'admin@your-domain.com'  // Workspace admin to impersonate (has "Create shared drives" + "Content manager")
    );
    
    return google.drive({ version: 'v3', auth });
  } catch (error) {
    console.error('Error initializing Drive client:', error);
    throw error;
  }
}
