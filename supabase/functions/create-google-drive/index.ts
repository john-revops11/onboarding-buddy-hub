
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { google } from 'npm:googleapis@118'; // Use npm specifier for Node module

console.log('Create Google Drive function starting...');

// CORS headers to allow cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- Helper function to get Service Account credentials ---
function getServiceAccountCredentials() {
  const credsJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
  if (!credsJson) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY environment variable not set.');
  }
  try {
    return JSON.parse(credsJson);
  } catch (error) {
    console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY:', error);
    throw new Error('Invalid format for GOOGLE_SERVICE_ACCOUNT_KEY.');
  }
}

serve(async (req: Request) => {
  // 1. Handle CORS preflight requests (essential for browser calls, good practice)
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // 2. Parse incoming request data
    const { userEmail, companyName } = await req.json();
    if (!userEmail || !companyName) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing userEmail or companyName' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Processing request for: ${userEmail}, Company: ${companyName}`);

    // 3. Get Service Account Credentials
    const credentials = getServiceAccountCredentials();

    // 4. Authenticate Google API Client
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive'], // The required scope
    });
    const authClient = await auth.getClient();
    const driveService = google.drive({ version: 'v3', auth: authClient });

    // 5. Generate a unique ID for the request (Idempotency)
    const requestId = `drive-${companyName.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`;

    // 6. Create the Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    // Using built-in fetch for Deno instead of importing a client
    const createLogEntry = async (status: string, driveId?: string, errorMessage?: string) => {
      const response = await fetch(`${supabaseUrl}/rest/v1/google_drive_logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
          user_email: userEmail,
          company_name: companyName,
          status,
          drive_id: driveId,
          error_message: errorMessage
        })
      });
      
      if (!response.ok) {
        console.error('Failed to create log entry:', await response.text());
      }
    };
    
    // Create initial pending log entry
    await createLogEntry('pending');

    // 7. *** ACTUAL API CALL: Create the Shared Drive ***
    console.log(`Creating Shared Drive named: ${companyName}`);
    let sharedDriveId: string | null | undefined;
    try {
      const driveResponse = await driveService.drives.create({
        requestId: requestId,
        requestBody: {
          name: companyName,
        },
        fields: 'id, name', // Request only the fields you need
      });
      sharedDriveId = driveResponse.data.id;
      console.log(`Successfully created Shared Drive ID: ${sharedDriveId}, Name: ${driveResponse.data.name}`);
    } catch(driveError: any) {
      console.error(`Failed to create Shared Drive "${companyName}":`, driveError.message);
      // Log the error
      await createLogEntry('failure', undefined, `Drive creation error: ${driveError.message}`);
      throw new Error(`Google Drive API Error (Create Drive): ${driveError.message}`);
    }

    if (!sharedDriveId) {
      const error = "Failed to obtain Shared Drive ID after creation attempt.";
      await createLogEntry('failure', undefined, error);
      throw new Error(error);
    }

    // 8. *** ACTUAL API CALL: Share the Drive with the user ***
    console.log(`Sharing Drive ${sharedDriveId} with ${userEmail}`);
    try {
      await driveService.permissions.create({
        fileId: sharedDriveId, // Use the Drive ID here
        requestBody: {
          type: 'user',
          role: 'fileOrganizer', // CHOOSE ROLE: 'organizer', 'fileOrganizer', 'writer', 'commenter', 'reader'
          emailAddress: userEmail,
        },
        supportsAllDrives: true, // MUST be true for Shared Drives
        sendNotificationEmail: true,
      });
      console.log(`Successfully shared Drive ${sharedDriveId} with ${userEmail}`);
    } catch (permissionError: any) {
      console.error(`Failed to share Drive ${sharedDriveId} with ${userEmail}:`, permissionError.message);
      // Log the error but continue since the drive was created
      await createLogEntry('partial_success', sharedDriveId, `Drive created but sharing failed: ${permissionError.message}`);
      throw new Error(`Google Drive API Error (Share Drive): ${permissionError.message}`);
    }

    // 9. Update Supabase DB with the drive ID
    try {
      const updateResponse = await fetch(`${supabaseUrl}/rest/v1/clients`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          google_drive_id: sharedDriveId
        })
      });
      
      if (!updateResponse.ok) {
        console.error('Failed to update client record:', await updateResponse.text());
      }
    } catch (dbError: any) {
      console.error('Error updating database:', dbError.message);
      // Don't fail the whole operation if DB update fails
    }

    // 10. Log success
    await createLogEntry('success', sharedDriveId);

    // 11. Return Success Response
    return new Response(JSON.stringify({ 
      success: true, 
      driveId: sharedDriveId, 
      message: `Drive created and shared with ${userEmail}` 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
