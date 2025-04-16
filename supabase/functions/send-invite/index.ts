// supabase/functions/send-invite/index.ts
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createTransport } from "npm:nodemailer";

serve(async (req) => {
  try {
    const { email, companyName } = await req.json();

    const inviteLink = `https://onboarding.myrevify.com/confirm?email=${encodeURIComponent(email)}`;

    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: Deno.env.get("SMTP_USER"),
        pass: Deno.env.get("SMTP_PASS"),
      },
    });

    await transporter.sendMail({
      from: `"Revify Onboarding" <${Deno.env.get("SMTP_USER")}>`,
      to: email,
      subject: `You're invited to onboard with ${companyName}`,
      html: `
        <h2>You're Invited to ${companyName}</h2>
        <p>Click below to get started:</p>
        <a href="${inviteLink}" target="_blank">Confirm Your Access</a>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Invite error", err);
    return new Response(JSON.stringify({ error: "Failed to send invite" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

