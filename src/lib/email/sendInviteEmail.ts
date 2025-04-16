import nodemailer from "nodemailer";

type InviteEmailParams = {
  to: string;
  companyName: string;
  inviteLink: string;
};

export const sendInviteEmail = async ({
  to,
  companyName,
  inviteLink,
}: InviteEmailParams) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Revify Onboarding" <${process.env.SMTP_USER}>`,
    to,
    subject: `You're invited to onboard with ${companyName}`,
    html: `
      <h2>You're Invited to ${companyName}</h2>
      <p>Hello,</p>
      <p>You’ve been invited to onboard with <strong>${companyName}</strong>.</p>
      <p>Click below to confirm and set your password:</p>
      <a href="${inviteLink}" style="padding: 10px 15px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 4px;">Confirm My Access</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
};
