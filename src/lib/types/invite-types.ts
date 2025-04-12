
// Types for client invitations

export interface Invite {
  id: string;
  client_id: string;
  client_name: string;
  email: string;
  created_at: string;
  invitation_status: string;
}
