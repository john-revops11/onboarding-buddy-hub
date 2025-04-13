
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

// --- Helper function to generate a valid requestId based on company name ---
function generateRequestId(companyName: string) {
  // Clean the company name - remove spaces, special chars and convert to lowercase
  const cleanName = companyName.replace(/[^\w]/g, '').toLowerCase();
  
  // Add timestamp to ensure uniqueness even if the same company name is used multiple times
  const timestamp = Date.now().toString();
  
  // Combine for a unique but traceable ID
  return `drive-${cleanName}-${timestamp}`;
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

    // Generate request ID based on company name
    const requestId = generateRequestId(companyName);
    console.log(`Generated requestId: ${requestId}`);

    // Create Shared Drive - Using the correct API parameters
    const driveResponse = await driveService.drives.create({
      requestBody: {
        name: companyName,
      },
      requestId: requestId, // Using company name-based ID instead of timestamp
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
