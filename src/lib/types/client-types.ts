
export interface SubscriptionTier {
  id: string;
  name: string;
  description?: string;
  price: number;
}

export interface Addon {
  id: string;
  name: string;
  description?: string;
  price: number;
}

export interface TeamMember {
  email: string;
  invitationStatus: string;
}

export interface OnboardingClient {
  id: string;
  email: string;
  companyName?: string;
  subscriptionTier: SubscriptionTier;
  addons: Addon[];
  teamMembers: TeamMember[];
  status: string;
  created_at: string;
}

export interface ClientCreationResult {
  success: boolean;
  clientId?: string;
  error?: string;
}

// Add ClientFormValues type from formSchema.ts
export interface ClientFormValues {
  email: string;
  companyName?: string;
  subscriptionTierId: string;
  addons: string[];
  teamMembers: { email: string }[];
}
