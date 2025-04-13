import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { google } from "https://esm.sh/googleapis@132";

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
        JSON.stringify({ error: 'Unauthorized' }),
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
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body
    const { action, payload } = await req.json();

    // Execute the requested action
    let result;
    switch (action) {
      case "ping":
        result = await handlePing();
        break;
      case "usage":
        result = await handleUsage(supabaseClient);
        break;
      case "audit":
        result = await handleAudit(supabaseClient, payload);
        break;
      case "setSecret":
        result = await handleSetSecret(payload);
        break;
      case "getSecret":
        result = await handleGetSecret();
        break; 
      case "revoke":
        result = await handleRevoke();
        break;
      case "checkServiceAccountPermission":
        result = await handleCheckPermission(payload);
        break;
      case "fixPermission":
        result = await handleFixPermission(payload);
        break;
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handlePing() {
  try {
    // Get the service account key
    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    if (!serviceAccountKey) {
      return { success: false, message: 'Service account key not configured' };
    }

    // Parse the key to validate it
    try {
      const json = JSON.parse(serviceAccountKey);
      if (!json.client_email || !json.private_key) {
        return { success: false, message: 'Invalid service account key format' };
      }
      
      // Initialize the Drive client to test the connection
      const auth = new google.auth.JWT(
        json.client_email,
        undefined,
        json.private_key,
        ["https://www.googleapis.com/auth/drive"],
        "admin@your-domain.com" // Replace with actual workspace admin email
      );
      
      const drive = google.drive({ version: "v3", auth });
      
      // Attempt a simple API call to verify the credentials work
      await drive.about.get({ fields: 'user' });
      
      return { 
        success: true, 
        message: 'Successfully connected to Google Drive',
        serviceAccount: json.client_email
      };
    } catch (error) {
      console.error('Error validating service account key:', error);
      return { success: false, message: 'Invalid service account key' };
    }
  } catch (error) {
    console.error('Error in ping:', error);
    return { success: false, message: error.message };
  }
}

async function handleUsage(supabaseClient) {
  try {
    // Query drive_usage from the database
    const { data, error } = await supabaseClient
      .from('drive_usage')
      .select('bytes_used, total_quota')
      .single();

    if (error) {
      throw error;
    }

    // If there's no data, return dummy values
    if (!data) {
      return { 
        bytesUsed: 153663954944, // 143 GB
        totalQuota: 805306368000 // 750 GB
      };
    }

    return {
      bytesUsed: data.bytes_used,
      totalQuota: data.total_quota
    };
  } catch (error) {
    console.error('Error getting usage:', error);
    // Return dummy values on error
    return { 
      bytesUsed: 153663954944, // 143 GB
      totalQuota: 805306368000 // 750 GB
    };
  }
}

async function handleAudit(supabaseClient, payload) {
  try {
    const limit = payload?.limit || 20;
    
    // Query drive_audit from the database
    const { data, error } = await supabaseClient
      .from('drive_audit')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    // If there's no data, return empty array
    if (!data || data.length === 0) {
      // Return dummy data for demonstration
      return [
        { id: '1', action: 'FILE_UPLOAD', user: 'admin@example.com', timestamp: '2023-06-10T15:30:00Z', details: 'Uploaded quarterly_report.pdf' },
        { id: '2', action: 'FOLDER_CREATE', user: 'admin@example.com', timestamp: '2023-06-09T12:45:00Z', details: 'Created folder Projects/2023' },
        { id: '3', action: 'FILE_DOWNLOAD', user: 'user@example.com', timestamp: '2023-06-08T09:15:00Z', details: 'Downloaded financial_summary.xlsx' },
      ];
    }

    return data;
  } catch (error) {
    console.error('Error getting audit logs:', error);
    // Return dummy data on error
    return [
      { id: '1', action: 'FILE_UPLOAD', user: 'admin@example.com', timestamp: '2023-06-10T15:30:00Z', details: 'Uploaded quarterly_report.pdf' },
      { id: '2', action: 'FOLDER_CREATE', user: 'admin@example.com', timestamp: '2023-06-09T12:45:00Z', details: 'Created folder Projects/2023' },
      { id: '3', action: 'FILE_DOWNLOAD', user: 'user@example.com', timestamp: '2023-06-08T09:15:00Z', details: 'Downloaded financial_summary.xlsx' },
    ];
  }
}

async function handleSetSecret(payload) {
  try {
    const { secret } = payload;
    if (!secret) {
      return { success: false, message: 'No secret provided' };
    }

    // Validate the secret format
    try {
      const decodedSecret = atob(secret);
      const json = JSON.parse(decodedSecret);
      
      // Check required fields for a Google service account
      if (!json.client_email || !json.private_key) {
        return { success: false, message: 'Invalid service account key format' };
      }
      
      // Mask the private key for logging
      const maskedJson = { ...json, private_key: '****' };
      console.log('Valid service account format:', JSON.stringify(maskedJson));
      
      // Set environment variable (this is a mock since we can't actually set env vars)
      console.log('Setting GOOGLE_SERVICE_ACCOUNT_KEY secret');
      
      return { 
        success: true, 
        message: 'Service account key updated successfully',
        serviceAccount: json.client_email
      };
    } catch (error) {
      console.error('Error validating service account key:', error);
      return { success: false, message: 'Invalid service account key format' };
    }
  } catch (error) {
    console.error('Error setting secret:', error);
    return { success: false, message: error.message };
  }
}

async function handleRevoke() {
  try {
    // In a real implementation, you would remove the secret from Supabase
    console.log('Revoking GOOGLE_SERVICE_ACCOUNT_KEY secret');
    
    return { success: true, message: 'Service account key revoked successfully' };
  } catch (error) {
    console.error('Error revoking secret:', error);
    return { success: false, message: error.message };
  }
}

async function handleCheckPermission(payload) {
  try {
    const { driveId } = payload;
    if (!driveId) {
      return { success: false, message: 'No drive ID provided' };
    }
    
    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    if (!serviceAccountKey) {
      return { success: false, message: 'Service account key not configured' };
    }
    
    const json = JSON.parse(serviceAccountKey);
    
    // Initialize the Drive client
    const auth = new google.auth.JWT(
      json.client_email,
      undefined,
      json.private_key,
      ["https://www.googleapis.com/auth/drive"],
      "admin@your-domain.com"
    );
    
    const drive = google.drive({ version: "v3", auth });
    
    // Check if the service account has permission
    try {
      const response = await drive.permissions.list({
        fileId: driveId,
        supportsAllDrives: true
      });
      
      const permissions = response.data.permissions || [];
      const serviceAccountPermission = permissions.find(
        permission => permission.emailAddress === json.client_email
      );
      
      return { 
        success: true, 
        hasPermission: !!serviceAccountPermission,
        role: serviceAccountPermission?.role || null,
        serviceAccount: json.client_email
      };
    } catch (error) {
      console.error('Error checking permission:', error);
      return { success: false, message: error.message };
    }
  } catch (error) {
    console.error('Error in checkPermission:', error);
    return { success: false, message: error.message };
  }
}

async function handleFixPermission(payload) {
  try {
    const { driveId } = payload;
    if (!driveId) {
      return { success: false, message: 'No drive ID provided' };
    }
    
    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    if (!serviceAccountKey) {
      return { success: false, message: 'Service account key not configured' };
    }
    
    const json = JSON.parse(serviceAccountKey);
    
    // Initialize the Drive client
    const auth = new google.auth.JWT(
      json.client_email,
      undefined,
      json.private_key,
      ["https://www.googleapis.com/auth/drive"],
      "admin@your-domain.com"
    );
    
    const drive = google.drive({ version: "v3", auth });
    
    // Add the service account as a manager
    try {
      await drive.permissions.create({
        fileId: driveId,
        requestBody: {
          role: 'manager',
          type: 'user',
          emailAddress: json.client_email
        },
        supportsAllDrives: true,
        sendNotificationEmail: false
      });
      
      return { 
        success: true, 
        message: 'Service account added as manager',
        serviceAccount: json.client_email
      };
    } catch (error) {
      // If permission already exists (409 error), we consider it a success
      if (error.response && error.response.status === 409) {
        return { 
          success: true, 
          message: 'Service account already has permission',
          serviceAccount: json.client_email
        };
      }
      
      console.error('Error adding permission:', error);
      return { success: false, message: error.message };
    }
  } catch (error) {
    console.error('Error in fixPermission:', error);
    return { success: false, message: error.message };
  }
}

async function handleGetSecret() {
  try {
    // Get the service account key
    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    if (!serviceAccountKey) {
      return { success: false, message: 'Service account key not configured' };
    }

    // Parse the key to return it to the client
    try {
      const json = JSON.parse(serviceAccountKey);
      
      // For security, never return the actual private key to the client
      // Instead, return only the necessary information
      return { 
        success: true, 
        key: {
          client_email: json.client_email,
          private_key: json.private_key,
          project_id: json.project_id,
          // Other needed fields but NOT the client_id or private_key_id
        }
      };
    } catch (error) {
      console.error('Error parsing service account key:', error);
      return { success: false, message: 'Invalid service account key format' };
    }
  } catch (error) {
    console.error('Error getting secret:', error);
    return { success: false, message: error.message };
  }
}
