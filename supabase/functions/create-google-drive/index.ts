
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { google } from 'npm:googleapis@118';
import { createClient } from 'npm:@supabase/supabase-js@2.38.4';

console.log('Create Google Drive function starting...');

// CORS headers to allow cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get environment variables for Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || 'https://zepvfisrhhfzlqflgwzb.supabase.co';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Create a Supabase client with the Service Role Key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
  // This creates a simpler, more consistent ID that's still unique to the company
  return `drive-${companyName.replace(/[^\w]/g, '').toLowerCase()}`;
}

// --- Helper function to log drive creation attempts to database ---
async function logDriveCreationAttempt(userEmail: string, companyName: string, status: string, driveId?: string, errorMessage?: string) {
  try {
    // Log this attempt to the console for debugging
    console.log(`Drive creation attempt: ${userEmail}, ${companyName}, Status: ${status}`);
    if (errorMessage) {
      console.error(`Error details: ${errorMessage}`);
    }
    
    // Log to the database
    const { error } = await supabase
      .from('google_drive_logs')
      .insert({
        user_email: userEmail,
        company_name: companyName,
        status: status,
        drive_id: driveId || null,
        error_message: errorMessage || null
      });
    
    if (error) {
      console.error('Failed to log to database:', error);
    }
  } catch (error) {
    console.error('Failed to log drive creation attempt:', error);
  }
}

// --- Helper function to simulate drive creation for development/testing ---
async function simulateDriveCreation(companyName: string) {
  // Generate a fake drive ID using the company name and a timestamp
  const timestamp = new Date().getTime();
  const simulatedDriveId = `sim-drive-${companyName.replace(/[^\w]/g, '')}-${timestamp}`;
  
  // Return a simulated success response
  return {
    id: simulatedDriveId,
    name: companyName,
    simulated: true
  };
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders 
    });
  }

  let userEmail = "unknown";
  let companyName = "unknown";
  
  try {
    // Parse incoming request data
    const requestData = await req.json();
    userEmail = requestData.userEmail || "unknown";
    companyName = requestData.companyName || "unknown";
    
    if (!userEmail || !companyName) {
      const errorMsg = 'Missing userEmail or companyName';
      await logDriveCreationAttempt(userEmail, companyName, "failure", undefined, errorMsg);
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: errorMsg 
      }), {
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      });
    }

    console.log(`Processing request for: ${userEmail}, Company: ${companyName}`);

    // Check if we should simulate drive creation (for development/testing)
    const shouldSimulate = Deno.env.get('SIMULATE_DRIVE_CREATION') === 'true';
    
    if (shouldSimulate) {
      console.log('Using simulation mode for drive creation');
      const simulatedDrive = await simulateDriveCreation(companyName);
      
      await logDriveCreationAttempt(userEmail, companyName, "success", simulatedDrive.id, "Simulated creation");
      
      return new Response(JSON.stringify({ 
        success: true, 
        driveId: simulatedDrive.id,
        message: `Simulated Shared Drive created for ${companyName}`,
        simulated: true
      }), {
        status: 200,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      });
    }

    // Get Service Account Credentials
    const credentials = getServiceAccountCredentials();

    // Authenticate Google API Client
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    const authClient = await auth.getClient();
    const driveService = google.drive({ version: 'v3', auth: authClient });

    // Generate consistent request ID based on company name
    const requestId = generateRequestId(companyName);
    console.log(`Generated requestId: ${requestId}`);

    try {
      // Create Shared Drive with consistent naming
      // Fix: Pass requestId as a query parameter, not in the requestBody
      const driveResponse = await driveService.drives.create({
        requestBody: {
          name: companyName, // Use the company name directly as the drive name
        },
        requestId: requestId, // Properly pass the requestId as a separate parameter
        fields: 'id,name',
      });

      const sharedDriveId = driveResponse.data.id;
      console.log(`Created Shared Drive: ${sharedDriveId}`);
      
      // Log successful creation
      await logDriveCreationAttempt(userEmail, companyName, "success", sharedDriveId);

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
    } catch (driveError) {
      // Handle specific Google API errors
      console.error('Google Drive API error:', driveError);
      
      let errorMessage = driveError.message || 'Unknown Google Drive API error';
      let errorCode = 500;
      
      // Check for common errors
      if (errorMessage.includes('already exists')) {
        errorMessage = `A drive with the requestId '${requestId}' already exists. Please use a different company name.`;
      } else if (errorMessage.includes('cannot create') || errorMessage.includes('permission')) {
        errorMessage = 'The service account lacks permission to create shared drives. The Google Workspace admin needs to grant "Create shared drives" permission to the service account.';
        // This is not a server error but a configuration issue, so use 403
        errorCode = 403;
      } else if (errorMessage.includes('quota')) {
        errorMessage = 'Drive creation quota exceeded. Please try again later.';
      }
      
      // Log specific drive creation error
      await logDriveCreationAttempt(userEmail, companyName, "failure", undefined, errorMessage);
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: errorMessage
      }), {
        status: errorCode,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      });
    }

  } catch (error) {
    console.error('Error in Google Drive creation:', error);
    
    // Log failed creation attempt
    await logDriveCreationAttempt(userEmail, companyName, "failure", undefined, error.message);
    
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
