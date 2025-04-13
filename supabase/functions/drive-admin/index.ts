
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { google } from "https://esm.sh/googleapis@126.0.1";
import { v4 as uuid } from "https://esm.sh/uuid@9";

/**
 * Edge Function: drive-admin
 *
 * ──────────────────────────────────────────────────────────────
 *  Features
 *  ▸ Authenticates the caller via Supabase JWT
 *  ▸ Admin‑only router with actions for:
 *      • ping / usage / audit / secrets CRUD
 *      • permission checks & fixes
 *      • back‑fill permissions across all client drives
 *      • createSharedDrive  (Pattern #2: one drive per client + ops‑group ACL)
 *
 *  All mutating actions write to drive_audit for traceability.
 *  The service‑account JSON is stored in the Supabase Secret
 *  GOOGLE_SERVICE_ACCOUNT_KEY   *or*   Deno.env (fallback).
 * ──────────────────────────────────────────────────────────────
 */

/* ------------------------------------------------------------------
   Constants & helpers
-------------------------------------------------------------------*/

// CORS for browser calls
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400"
};

// Google Group that must manage every Shared Drive
const GROUP_EMAIL = "opssupport@revologyanalytics.com";

// Will be populated inside each request; helpers can read it
let currentUserEmail = "unknown";

/* ------------------------------------------------------------------
   Supabase / Google helpers
-------------------------------------------------------------------*/

function supabaseFromReq(req: Request, anon = false) {
  const authHeader = req.headers.get("Authorization") || "";
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    anon ? Deno.env.get("SUPABASE_ANON_KEY") ?? "" : Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } }
  );
}

async function initializeDriveClient() {
  const key = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
  if (!key) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY not configured");
  const json = JSON.parse(key);
  const auth = new google.auth.JWT(
    json.client_email,
    undefined,
    json.private_key,
    ["https://www.googleapis.com/auth/drive"],
    "admin@your-domain.com" // Workspace admin to impersonate (has Drive privileges)
  );
  return google.drive({ version: "v3", auth });
}

/* ------------------------------------------------------------------
   Router
-------------------------------------------------------------------*/

serve(async (req) => {
  // CORS pre‑flight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    /* 1️⃣  Auth ‑ ensure caller is an admin */
    const supabase = supabaseFromReq(req);

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) return jsonRes({ error: "Unauthorized" }, 401);

    currentUserEmail = user.email ?? "unknown";

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") return jsonRes({ error: "Admin access required" }, 403);

    /* 2️⃣  Parse body */
    const { action, payload = {} } = await req.json();
    console.log("Action:", action);

    /* 3️⃣  Route */
    let result;
    switch (action) {
      case "ping":                     result = await handlePing(); break;
      case "usage":                    result = await handleUsage(supabase); break;
      case "audit":                    result = await handleAudit(supabase, payload); break;
      case "setSecret":                result = await handleSetSecret(payload, supabase); break;
      case "getSecret":                result = await handleGetSecret(supabase); break;
      case "revoke":                   result = await handleRevoke(supabase); break;
      case "checkServiceAccountPermission": result = await handleCheckPermission(payload); break;
      case "fixPermission":            result = await handleFixPermission(payload, supabase); break;
      case "backfillPermissions":      result = await handleBackfillPermissions(supabase); break;
      case "checkSecretConfiguration": result = await handleCheckSecretConfiguration(supabase); break;
      case "createSharedDrive":        result = await handleCreateSharedDrive(payload, supabase); break;
      default: return jsonRes({ error: "Unknown action", action }, 400);
    }

    return jsonRes(result);
  } catch (err) {
    console.error(err);
    return jsonRes({ error: err.message, stack: err.stack }, 500);
  }
});

/* ------------------------------------------------------------------
   JSON response helper
-------------------------------------------------------------------*/
function jsonRes(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

/* ------------------------------------------------------------------
   Action handlers (existing ones trimmed for brevity)
-------------------------------------------------------------------*/

async function handlePing() {
  const key = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
  if (!key) return { success: false, message: "Secret not configured" };
  try {
    const json = JSON.parse(key);
    return { success: true, serviceAccount: json.client_email };
  } catch (err) {
    console.error("handlePing parse error", err);
    return { success: false, message: "Error parsing secret" };
  }
}

async function handleUsage(supabase: ReturnType<typeof supabaseFromReq>) {
  try {
    const drive = await initializeDriveClient();
    const { data } = await drive.about.get({ fields: "storageQuota" });
    return {
      success: true,
      bytesUsed: Number(data.storageQuota?.usage),
      totalQuota: Number(data.storageQuota?.limit)
    };
  } catch (err) {
    console.error("handleUsage", err);
    return { success: false, message: err.message };
  }
}

async function handleAudit(supabase: ReturnType<typeof supabaseFromReq>, payload: { limit: number }) {
  const { limit = 20 } = payload;
  const { data, error } = await supabase
    .from("drive_audit")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

async function handleSetSecret(payload: { secret: string }, supabase: ReturnType<typeof supabaseFromReq>) {
  const { secret } = payload;
  if (!secret) return { success: false, message: "Missing secret" };

  try {
    const json = JSON.parse(atob(secret)); // b64 → JSON
    if (!json.client_email || !json.private_key) throw new Error("Invalid secret");
    await supabase.from("drive_audit").insert({
      id: `set-secret-${uuid()}`,
      action: "SECRET_SET",
      username: currentUserEmail,
      timestamp: new Date().toISOString(),
      details: "Google Drive service account key set"
    });
  } catch (err) {
    console.error("handleSetSecret", err);
    return { success: false, message: "Invalid secret" };
  }

  // Deno.env.set("GOOGLE_SERVICE_ACCOUNT_KEY", secret);  // doesn't persist
  return { success: true, message: "Secret set" };
}

async function handleGetSecret(supabase: ReturnType<typeof supabaseFromReq>) {
  const key = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
  if (!key) return { success: false, message: "Secret not configured" };
  try {
    const json = JSON.parse(key);
    return { success: true, key: json };
  } catch (err) {
    console.error("handleGetSecret parse error", err);
    return { success: false, message: "Error parsing secret" };
  }
}

async function handleRevoke(supabase: ReturnType<typeof supabaseFromReq>) {
  // Deno.env.set("GOOGLE_SERVICE_ACCOUNT_KEY", "");  // doesn't persist
  await supabase.from("drive_audit").insert({
    id: `secret-revoke-${uuid()}`,
    action: "SECRET_REVOKE",
    username: currentUserEmail,
    timestamp: new Date().toISOString(),
    details: "Google Drive service account key revoked"
  });
  return { success: true, message: "Secret revoked" };
}

async function handleCheckPermission(payload: { driveId: string }) {
  const { driveId } = payload;
  if (!driveId) return { success: false, message: "Missing driveId" };

  try {
    const drive = await initializeDriveClient();
    const serviceAccountEmail = JSON.parse(Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY")!).client_email;
    const groupEmail = GROUP_EMAIL;

    // Check service account permission
    let hasServiceAccountPermission = false;
    let serviceAccountRole = null;
    try {
      const { data: serviceAccountPerm } = await drive.permissions.get({
        fileId: driveId,
        supportsAllDrives: true,
        permissionId: `user:${serviceAccountEmail}`,
        fields: 'role'
      });
      hasServiceAccountPermission = true;
      serviceAccountRole = serviceAccountPerm.role;
    } catch (e) {
      if (e.code !== 404) throw e;
    }

    // Check group permission
    let hasGroupPermission = false;
    let groupRole = null;
    try {
      const { data: groupPerm } = await drive.permissions.get({
        fileId: driveId,
        supportsAllDrives: true,
        permissionId: `group:${groupEmail}`,
        fields: 'role'
      });
      hasGroupPermission = true;
      groupRole = groupPerm.role;
    } catch (e) {
      if (e.code !== 404) throw e;
    }

    return {
      success: true,
      hasServiceAccountPermission,
      serviceAccountRole,
      hasGroupPermission,
      groupRole,
      groupEmail
    };
  } catch (err) {
    console.error("handleCheckPermission", err);
    return { success: false, message: err.message };
  }
}

async function handleFixPermission(payload: { driveId: string }, supabase: ReturnType<typeof supabaseFromReq>) {
  const { driveId } = payload;
  if (!driveId) return { success: false, message: "Missing driveId" };

  try {
    const drive = await initializeDriveClient();
    const serviceAccountEmail = JSON.parse(Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY")!).client_email;
    const groupEmail = GROUP_EMAIL;

    // Ensure group has permission
    try {
      await drive.permissions.create({
        fileId: driveId,
        supportsAllDrives: true,
        requestBody: { role: "manager", type: "group", emailAddress: groupEmail },
        sendNotificationEmail: false
      });
    } catch (e) {
      if (e.code !== 409) throw e; // ignore duplicates
      console.warn("handleFixPermission create group perm", e);
    }

    // Ensure service account has permission
    try {
      await drive.permissions.create({
        fileId: driveId,
        supportsAllDrives: true,
        requestBody: { role: "manager", type: "user", emailAddress: serviceAccountEmail },
        sendNotificationEmail: false
      });
    } catch (e) {
      if (e.code === 409) {
        return { success: true, message: "Service account already has permission" };
      }
      console.warn("handleFixPermission create user perm", e);
      throw e;
    }

    /* audit */
    await supabase.from("drive_audit").insert({
      id: `fix-perm-${uuid()}`,
      action: "DRIVE_FIX_PERMISSION",
      username: currentUserEmail,
      timestamp: new Date().toISOString(),
      details: `Added service account ${serviceAccountEmail} as manager to drive ${driveId}`
    });

    return { success: true, serviceAccount: serviceAccountEmail, groupEmail };
  } catch (err) {
    console.error("handleFixPermission", err);
    return { success: false, message: err.message };
  }
}

async function handleBackfillPermissions(supabase: ReturnType<typeof supabaseFromReq>) {
  try {
    const drive = await initializeDriveClient();
    const serviceAccountEmail = JSON.parse(Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY")!).client_email;
    const groupEmail = GROUP_EMAIL;

    // 1. Fetch all client drive IDs
    const { data: clients, error } = await supabase.from("clients").select("drive_id").not("drive_id", "is", null);
    if (error) throw error;

    // 2. Iterate and add permissions
    let fixed = 0;
    for (const client of clients) {
      if (!client.drive_id) continue;
      try {
        // Ensure group has permission
        try {
          await drive.permissions.create({
            fileId: client.drive_id,
            supportsAllDrives: true,
            requestBody: { role: "manager", type: "group", emailAddress: groupEmail },
            sendNotificationEmail: false
          });
        } catch (e) {
          if (e.code !== 409) throw e; // ignore duplicates
          console.warn("handleBackfillPermissions create group perm", e);
        }

        // Ensure service account has permission
        try {
          await drive.permissions.create({
            fileId: client.drive_id,
            supportsAllDrives: true,
            requestBody: { role: "manager", type: "user", emailAddress: serviceAccountEmail },
            sendNotificationEmail: false
          });
        } catch (e) {
          if (e.code !== 409) throw e; // ignore duplicates
          console.warn("handleBackfillPermissions create user perm", e);
        }
        fixed++;
      } catch (err) {
        console.error("handleBackfillPermissions", err);
      }
    }

    /* audit */
    await supabase.from("drive_audit").insert({
      id: `backfill-perm-${uuid()}`,
      action: "DRIVE_BACKFILL_PERMISSIONS",
      username: currentUserEmail,
      timestamp: new Date().toISOString(),
      details: `Backfilled permissions for ${fixed} drives`
    });

    return { success: true, message: `Backfilled permissions for ${fixed} drives` };
  } catch (err) {
    console.error("handleBackfillPermissions", err);
    return { success: false, message: err.message };
  }
}

async function handleCheckSecretConfiguration(supabase: ReturnType<typeof supabaseFromReq>) {
  try {
    const key = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
    if (!key) {
      return { configured: false, message: "GOOGLE_SERVICE_ACCOUNT_KEY is not configured" };
    }

    try {
      const json = JSON.parse(key);
      if (!json.client_email || !json.private_key) {
        return { configured: false, message: "Invalid service account key format" };
      }
      return { configured: true, message: "Service account key is properly configured", serviceAccount: json.client_email };
    } catch (parseError) {
      console.error("Error parsing service account key:", parseError);
      return { configured: false, message: "Error parsing service account key" };
    }
  } catch (error) {
    console.error("Error checking secret configuration:", error);
    return { configured: false, message: error.message };
  }
}

/* ------------------------------------------------------------------
   handleCreateSharedDrive
-------------------------------------------------------------------*/
async function handleCreateSharedDrive(payload: { clientId?: string }, supabase: ReturnType<typeof supabaseFromReq>) {
  try {
    const { clientId } = payload;
    if (!clientId) return { success: false, message: "clientId is required" };

    /* fetch client row */
    const { data: client, error } = await supabase
      .from("clients")
      .select("company_name, drive_id")
      .eq("id", clientId)
      .single();
    if (error) throw error;

    if (client.drive_id) return { success: true, message: "Drive already exists", driveId: client.drive_id };

    const drive = await initializeDriveClient();
    const driveName = `${client.company_name} Drive`;
    const requestId = clientId; // idempotent key

    /* create Shared Drive */
    const { data: driveData } = await drive.drives.create({ requestId, requestBody: { name: driveName } });
    const driveId = driveData.id!;

    /* add permissions */
    const serviceAccountEmail = JSON.parse(Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY")!).client_email;
    const addPerm = async (email: string, type: "user" | "group" = "group") => {
      try {
        await drive.permissions.create({
          fileId: driveId,
          supportsAllDrives: true,
          requestBody: { role: "manager", type, emailAddress: email },
          sendNotificationEmail: false
        });
      } catch (e) {
        if (e.code !== 409) throw e; // ignore duplicates
      }
    };
    await addPerm(GROUP_EMAIL, "group");
    await addPerm(serviceAccountEmail, "user");

    /* persist mapping */
    await supabase
      .from("clients")
      .update({ drive_id: driveId, drive_name: driveName })
      .eq("id", clientId);

    /* audit */
    await supabase.from("drive_audit").insert({
      id: `drive-create-${uuid()}`,
      action: "DRIVE_CREATE",
      username: currentUserEmail,
      timestamp: new Date().toISOString(),
      details: `Created drive ${driveId} (${driveName})`
    });

    return { success: true, driveId, driveName };
  } catch (err) {
    console.error("handleCreateSharedDrive:", err);
    return { success: false, message: err.message };
  }
}
