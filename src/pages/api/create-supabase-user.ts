import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // secured in server-side env
);

export async function handler(req, res) {
  const { email, name, clientId } = req.body;

  const password = generateTempPassword();

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata: { name },
    email_confirm: false,
  });

  if (error) return res.status(500).json({ error: error.message });

  // Link auth_user_id to client record
  await supabaseAdmin
    .from('clients')
    .update({ auth_user_id: data.user.id })
    .eq('id', clientId);

  res.status(200).json({ user: data.user, password });
}

function generateTempPassword() {
  return Math.random().toString(36).slice(-8) + 'A1!';
}
