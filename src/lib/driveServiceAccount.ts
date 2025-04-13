
import { google } from 'googleapis';
import { supabase } from "@/integrations/supabase/client";

// Group email that should have manager access to all shared drives
const GROUP_EMAIL = "ops-support@your-domain.com";

export async function getDriveClient() {
  try {
    // Fetch the service account key from Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('drive-admin', {
      body: { action: 'getSecret' }
    });
    
    if (error || !data?.key) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not configured');
    }

    const json = data.key;
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

export async function getServiceAccountEmail() {
  try {
    // Fetch the service account key from Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('drive-admin', {
      body: { action: 'ping' }
    });
    
    if (error || !data?.success) {
      return null;
    }
    
    return data.serviceAccount || null;
  } catch (error) {
    console.error('Error getting service account email:', error);
    return null;
  }
}

export function getGroupEmail() {
  return GROUP_EMAIL;
}

export async function addServiceAccountAsManager(driveId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('drive-admin', {
      body: { action: 'fixPermission', payload: { driveId } }
    });
    
    if (error) {
      throw error;
    }
    
    return { 
      success: data.success, 
      email: data.serviceAccount,
      groupEmail: data.groupEmail,
      alreadyExists: data.message === 'Service account already has permission'
    };
  } catch (error) {
    console.error('Error adding service account as manager:', error);
    return { success: false, error: error.message };
  }
}

export async function checkServiceAccountPermission(driveId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('drive-admin', {
      body: { action: 'checkServiceAccountPermission', payload: { driveId } }
    });
    
    if (error) {
      throw error;
    }
    
    return { 
      hasPermission: data.hasServiceAccountPermission,
      role: data.serviceAccountRole,
      hasGroupPermission: data.hasGroupPermission,
      groupRole: data.groupRole,
      groupEmail: data.groupEmail
    };
  } catch (error) {
    console.error('Error checking service account permission:', error);
    return { hasPermission: false, error: error.message };
  }
}
