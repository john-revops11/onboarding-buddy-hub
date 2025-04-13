
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { google } from "https://esm.sh/googleapis@126.0.1";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { v4 as uuid } from "https://esm.sh/uuid@9";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Group email that should have manager access to all shared drives
const GROUP_EMAIL = "opssupport@revologyanalytics.com";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Starting create-shared-drive function");
    
    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Initialize Supabase client with auth header
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_ANON_KEY") || "",
      { global: { headers: { Authorization: authHeader } } }
    );
    
    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: userError?.message }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is an admin
    const { data: profile, error: profileError } = await supabase
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
    
    // Get the service account key
    let serviceAccountKey;
    
    // Try to get the secret from Supabase RPC first
    try {
      const { data: secretData, error: secretError } = await supabase.rpc('get_secret', {
        secret_name: 'GOOGLE_SERVICE_ACCOUNT_KEY'
      });
      
      if (secretError || !secretData) {
        console.warn('Error getting secret from Supabase, trying Deno environment:', secretError);
        serviceAccountKey = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
      } else {
        serviceAccountKey = secretData.value;
      }
    } catch (rpcError) {
      console.warn('Error calling get_secret RPC:', rpcError);
      serviceAccountKey = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
    }
    
    if (!serviceAccountKey) {
      throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not configured");
    }
    
    const sa = JSON.parse(serviceAccountKey);
    
    // Initialize Google Drive API with JWT authentication
    const auth = new google.auth.JWT(
      sa.client_email,
      undefined,
      sa.private_key,
      ["https://www.googleapis.com/auth/drive"],
      "admin@your-domain.com" // Replace with actual workspace admin email
    );
    
    const drive = google.drive({ version: "v3", auth });
    
    // Fetch clients missing a drive
    const { data: rows, error } = await supabase
      .from("clients")
      .select("id, company_name")
      .is("drive_id", null);
    
    if (error) {
      throw error;
    }
    
    if (!rows?.length) {
      console.log("No pending clients found");
      return new Response(
        JSON.stringify({ message: "No pending clients" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Found ${rows.length} clients needing drives`);
    
    const results = [];
    
    // Process each client
    for (const client of rows) {
      try {
        if (!client.company_name) {
          console.warn(`Client ${client.id} has no company name, skipping`);
          results.push({
            clientId: client.id,
            success: false,
            error: "No company name provided"
          });
          continue;
        }
        
        const requestId = client.id; // Using UUID as idempotent key
        const driveName = `${client.company_name} Drive`;
        
        console.log(`Creating drive for client ${client.id}: ${driveName}`);
        
        // Create the shared drive
        const { data } = await drive.drives.create({
          requestId,
          requestBody: { name: driveName }
        });
        
        console.log(`Drive created with ID: ${data.id}`);
        
        // Add service account as manager to the drive
        try {
          await drive.permissions.create({
            fileId: data.id,
            requestBody: {
              role: 'manager',
              type: 'user',
              emailAddress: sa.client_email
            },
            supportsAllDrives: true,
            sendNotificationEmail: false
          });
          
          console.log(`Added service account ${sa.client_email} as manager to drive ${data.id}`);
        } catch (permissionError) {
          // Ignore 409 errors (permission already exists)
          if (permissionError.response && permissionError.response.status === 409) {
            console.log(`Service account ${sa.client_email} already has permission on drive ${data.id}`);
          } else {
            console.error(`Error adding service account as manager to drive ${data.id}:`, permissionError);
            throw permissionError;
          }
        }
        
        // Add group email as manager to the drive
        try {
          await drive.permissions.create({
            fileId: data.id,
            requestBody: {
              role: 'manager',
              type: 'group',
              emailAddress: GROUP_EMAIL
            },
            supportsAllDrives: true,
            sendNotificationEmail: false
          });
          
          console.log(`Added group ${GROUP_EMAIL} as manager to drive ${data.id}`);
        } catch (groupPermissionError) {
          // Ignore 409 errors (permission already exists)
          if (groupPermissionError.response && groupPermissionError.response.status === 409) {
            console.log(`Group ${GROUP_EMAIL} already has permission on drive ${data.id}`);
          } else {
            console.error(`Error adding group as manager to drive ${data.id}:`, groupPermissionError);
            throw groupPermissionError;
          }
        }
        
        // Create standard folder structure in the drive
        const folders = [
          "Diagnostic Reviews",
          "Monthly Insights",
          "Data Uploads",
          "Resources"
        ];
        
        const createdFolders = [];
        
        for (const folderName of folders) {
          try {
            const folder = await drive.files.create({
              requestBody: {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [data.id]
              },
              supportsAllDrives: true,
              fields: 'id, name, webViewLink'
            });
            
            createdFolders.push({
              id: folder.data.id,
              name: folder.data.name,
              webViewLink: folder.data.webViewLink
            });
            
            console.log(`Created folder "${folderName}" with ID: ${folder.data.id} in drive ${data.id}`);
          } catch (folderError) {
            console.error(`Error creating folder "${folderName}" in drive ${data.id}:`, folderError);
          }
        }
        
        // Update the client record with drive info
        const { error: updateError } = await supabase
          .from("clients")
          .update({ 
            drive_id: data.id, 
            drive_name: driveName 
          })
          .eq("id", client.id);
        
        if (updateError) {
          console.error(`Error updating client ${client.id}:`, updateError);
          results.push({
            clientId: client.id,
            success: false,
            error: updateError.message
          });
        } else {
          // Log the drive creation in the audit table
          try {
            await supabase.from('drive_audit').insert({
              action: 'DRIVE_CREATED',
              user: user.email,
              timestamp: new Date().toISOString(),
              details: `Created drive "${driveName}" (${data.id}) for client ${client.company_name}`
            });
          } catch (auditError) {
            console.warn("Could not log drive creation in audit table:", auditError);
          }
          
          results.push({
            clientId: client.id,
            success: true,
            driveId: data.id,
            driveName,
            folders: createdFolders,
            serviceAccount: sa.client_email,
            groupEmail: GROUP_EMAIL
          });
        }
      } catch (err) {
        console.error(`Error processing client ${client.id}:`, err);
        results.push({
          clientId: client.id,
          success: false,
          error: err.message
        });
      }
    }
    
    return new Response(
      JSON.stringify({ 
        message: "Shared drives processing complete", 
        results 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in create-shared-drive function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
