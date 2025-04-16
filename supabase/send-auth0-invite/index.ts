import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Supabase setup
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Auth0 config
const AUTH0_DOMAIN = Deno.env.get("AUTH0_DOMAIN")!;
const AUTH0_CLIENT_ID = Deno.env.get("AUTH0_CLIENT_ID")!;
const AUTH0_CLIENT_SECRET = Deno.env.get("AUTH0_CLIENT_SECRET")!;
const AUTH0_CONNECTION = "Username-Password-Authentication"; // Or your DB connection

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { email, name, role } = await req.json();

    // 1. Insert user in Supabase table
    const table = role === "client" ? "clients" : "team_members";

    const { data: userRecord, error: insertError } = await supabase
      .from(table)
      .insert([{ email, name }])
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to save user in Supabase." }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // 2. Get Auth0 Management API token
    const tokenRes = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "client_credentials",
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      }),
    });

    const { access_token } = await tokenRes.json();

    if (!access_token) {
      return new Response(JSON.stringify({ error: "Failed to authorize with Auth0" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    // 3. Create user in Auth0
    const auth0Res = await fetch(`https://${AUTH0_DOMAIN}/api/v2/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        connection: AUTH0_CONNECTION,
        email_verified: false,
        verify_email: true,
        user_metadata: { name, role },
      }),
    });

    const auth0User = await auth0Res.json();

    if (!auth0Res.ok) {
      console.error("Auth0 error:", auth0User);
      return new Response(JSON.stringify({ error: "Failed to create Auth0 user." }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    // 4. Return success
    return new Response(
      JSON.stringify({
        success: true,
        message: "User invited via Auth0",
        email,
        auth0_id: auth0User.user_id,
        supabase_id: userRecord.id,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
});
