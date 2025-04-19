import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // must be SERVICE_ROLE key
);

export default async function handler(req, res) {
  const { email, name } = req.body;

  const password = generateTempPassword(); // auto-generated

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { name },
    email_confirm: false,
  });

  if (error) return res.status(500).json({ error: error.message });

  // Optional: send invite email
  await supabase.auth.admin.inviteUserByEmail(email);

  res.status(200).json({ user: data.user, password });
}

function generateTempPassword() {
  return Math.random().toString(36).slice(-8) + 'A1!';
}
