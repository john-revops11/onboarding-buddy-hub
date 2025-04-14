
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const SUPABASE_URL = "https://zepvfisrhhfzlqflgwzb.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { teamMemberId, clientName } = await req.json();

    // Get team member information
    const { data: teamMember, error: teamMemberError } = await supabase
      .from("team_members")
      .select("*, clients(company_name)")
      .eq("id", teamMemberId)
      .single();

    if (teamMemberError) {
      return new Response(
        JSON.stringify({ error: "Could not find team member" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a token for this invitation
    const { data: tokenData, error: tokenGenError } = await supabase
      .rpc("generate_invitation_token");

    if (tokenGenError) {
      return new Response(
        JSON.stringify({ error: "Could not generate token" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Store the token
    const { error: tokenStoreError } = await supabase
      .from("invitation_tokens")
      .insert({
        team_member_id: teamMemberId,
        token: tokenData,
      });

    if (tokenStoreError) {
      return new Response(
        JSON.stringify({ error: "Could not store invitation token" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update team member status to invited
    await supabase
      .from("team_members")
      .update({ invitation_status: "sent" })
      .eq("id", teamMemberId);

    // Here, you would send the actual email using a service like Resend
    // For demonstration, we'll log the invitation information
    console.log(`Invitation sent to ${teamMember.email} for client ${teamMember.clients.company_name || clientName}`);
    console.log(`Invitation URL: ${SUPABASE_URL}/register?token=${tokenData}`);

    const inviteUrl = new URL("/auth/register", req.url);
    inviteUrl.searchParams.set("token", tokenData);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Invitation sent",
        inviteUrl: inviteUrl.toString(),
        email: teamMember.email,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Error sending invitation:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to send invitation" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
