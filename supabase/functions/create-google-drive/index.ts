
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS headers to allow cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  try {
    // Authenticate with Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse the request body
    const { userEmail, companyName } = await req.json()

    // Validate input
    if (!userEmail || !companyName) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Missing userEmail or companyName' 
      }), {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
        status: 400
      })
    }

    // Retrieve Google Service Account credentials
    const { data: secretData, error: secretError } = await supabase
      .rpc('get_secret', { secret_name: 'GOOGLE_SERVICE_ACCOUNT_KEY' })

    if (secretError || !secretData.found) {
      throw new Error('Google Service Account credentials not found')
    }

    // Parse the service account JSON
    const serviceAccount = JSON.parse(secretData.value)

    // Simulate Google Drive creation (replace with actual Google Drive API call)
    const driveId = `drive_${crypto.randomUUID()}`

    // Log the drive creation in Supabase
    const { error: logError } = await supabase
      .from('google_drive_logs')
      .update({ 
        status: 'success', 
        drive_id: driveId 
      })
      .eq('user_email', userEmail)
      .eq('company_name', companyName)

    // Update the clients table with the new drive ID
    const { error: clientUpdateError } = await supabase
      .from('clients')
      .update({ google_drive_id: driveId })
      .eq('email', userEmail)

    return new Response(JSON.stringify({ 
      success: true, 
      driveId: driveId 
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      }
    })

  } catch (error) {
    console.error('Google Drive Creation Error:', error)

    // Log the error in Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    await supabase
      .from('google_drive_logs')
      .insert({
        user_email: error.userEmail || 'unknown',
        company_name: error.companyName || 'unknown',
        status: 'failure',
        error_message: error.message
      })

    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      },
      status: 500
    })
  }
})
