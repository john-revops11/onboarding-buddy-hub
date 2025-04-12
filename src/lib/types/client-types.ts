
// Common types for client management

export interface ClientFormValues {
  email: string;
  companyName?: string;
  subscriptionTierId: string;
  addons: string[];
  teamMembers: {
    email: string;
  }[];
}

export interface OnboardingClient {
  id: string;
  email: string;
  companyName: string | null;
  subscriptionTier: {
    id: string;
    name: string;
  };
  addons: {
    id: string;
    name: string;
  }[];
  teamMembers: {
    email: string;
    invitationStatus: string;
  }[];
  status: string;
  created_at: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  description: string | null;
  price: number;
}

export interface Addon {
  id: string;
  name: string;
  description: string | null;
  price: number;
  tags?: string[] | null;
}
