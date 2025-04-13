
import { google } from 'googleapis';

export async function getDriveClient() {
  const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
  if (!serviceAccountKey) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not configured');
  }

  const json = JSON.parse(serviceAccountKey);
  const auth = new google.auth.JWT(
    json.client_email,
    undefined,
    json.private_key,
    ['https://www.googleapis.com/auth/drive'],
    'admin@your-domain.com'  // Workspace admin to impersonate (has "Create shared drives" + "Content manager")
  );
  
  return google.drive({ version: 'v3', auth });
}

export function getServiceAccountEmail() {
  const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
  if (!serviceAccountKey) {
    return null;
  }
  
  try {
    const json = JSON.parse(serviceAccountKey);
    return json.client_email;
  } catch (error) {
    console.error('Error parsing service account key:', error);
    return null;
  }
}

export async function addServiceAccountAsManager(driveId: string) {
  try {
    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    if (!serviceAccountKey) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY is not configured');
    }
    
    const json = JSON.parse(serviceAccountKey);
    const drive = await getDriveClient();
    
    await drive.permissions.create({
      fileId: driveId,
      requestBody: {
        role: 'manager',        // full edit rights
        type: 'user',
        emailAddress: json.client_email   // the service-account address
      },
      supportsAllDrives: true,
      sendNotificationEmail: false
    });
    
    return { success: true, email: json.client_email };
  } catch (error) {
    // Ignore 409 errors (permission already exists)
    if (error.response && error.response.status === 409) {
      const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
      const json = JSON.parse(serviceAccountKey!);
      return { success: true, email: json.client_email, alreadyExists: true };
    }
    
    console.error('Error adding service account as manager:', error);
    return { success: false, error: error.message };
  }
}

export async function checkServiceAccountPermission(driveId: string) {
  try {
    const serviceAccountEmail = getServiceAccountEmail();
    if (!serviceAccountEmail) {
      return { hasPermission: false };
    }
    
    const drive = await getDriveClient();
    
    const response = await drive.permissions.list({
      fileId: driveId,
      supportsAllDrives: true
    });
    
    const permissions = response.data.permissions || [];
    const serviceAccountPermission = permissions.find(
      permission => permission.emailAddress === serviceAccountEmail
    );
    
    return { 
      hasPermission: !!serviceAccountPermission,
      role: serviceAccountPermission?.role || null
    };
  } catch (error) {
    console.error('Error checking service account permission:', error);
    return { hasPermission: false, error: error.message };
  }
}
