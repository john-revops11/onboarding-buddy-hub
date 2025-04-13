
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { google } from "https://esm.sh/googleapis@132";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Starting create-shared-drive function");
    
    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );
    
    // Get the service account key from environment
    const serviceAccountKey = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
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
          results.push({
            clientId: client.id,
            success: true,
            driveId: data.id,
            driveName,
            serviceAccount: sa.client_email
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
