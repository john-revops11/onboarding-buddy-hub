
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
  try {
    // We'll use the existing Supabase Edge Function to send the email
    const response = await fetch(
      "https://zepvfisrhhfzlqflgwzb.supabase.co/functions/v1/send-invite",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: to,
          companyName: companyName || "Your Company",
          inviteLink,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to send invite email: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending invite email:", error);
    throw error;
  }
};
