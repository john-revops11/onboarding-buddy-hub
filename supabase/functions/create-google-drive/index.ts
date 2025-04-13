
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { google } from 'npm:googleapis@118';

console.log('Create Google Drive function starting...');

// CORS headers to allow cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- Helper function to get Service Account credentials ---
function getServiceAccountCredentials() {
  const credsJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON');
  if (!credsJson) {
    console.error('GOOGLE_SERVICE_ACCOUNT_JSON environment variable not set.');
    throw new Error('Google Service Account credentials not found');
  }
  try {
    return JSON.parse(credsJson);
  } catch (error) {
    console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:', error);
    throw new Error('Invalid format for Google Service Account credentials');
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders 
    });
  }

  try {
    // Parse incoming request data
    const { userEmail, companyName } = await req.json();
    
    if (!userEmail || !companyName) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing userEmail or companyName' 
      }), {
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      });
    }

    console.log(`Processing request for: ${userEmail}, Company: ${companyName}`);

    // Get Service Account Credentials
    const credentials = getServiceAccountCredentials();

    // Authenticate Google API Client
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    const authClient = await auth.getClient();
    const driveService = google.drive({ version: 'v3', auth: authClient });

    // Create Shared Drive - Using the correct API parameters
    const driveResponse = await driveService.drives.create({
      requestBody: {
        name: companyName,
      },
      // Fix for "Missing required parameters: requestId"
      requestId: `create-drive-${Date.now()}`, // Add a unique request ID
      fields: 'id,name',
    });

    const sharedDriveId = driveResponse.data.id;
    console.log(`Created Shared Drive: ${sharedDriveId}`);

    // Return successful response
    return new Response(JSON.stringify({ 
      success: true, 
      driveId: sharedDriveId,
      message: `Shared Drive created for ${companyName}` 
    }), {
      status: 200,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });

  } catch (error) {
    console.error('Error in Google Drive creation:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
    });
  }
});
