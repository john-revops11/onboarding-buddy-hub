
// Client and user types
export interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  tags?: string[];
}

export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  features?: string[];
}

// We're using Subscription instead of SubscriptionTier now
export type SubscriptionTier = Subscription;

export interface OnboardingTemplateStep {
  id?: string;
  template_id?: string;
  title: string;
  description?: string;
  order_index: number;
  required_document_categories?: string[];
}

export interface OnboardingTemplate {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  is_default?: boolean;
  steps?: OnboardingTemplateStep[];
}

export interface SubscriptionTemplate {
  id: string;
  subscription_id: string;
  template_id: string;
  is_default: boolean;
  created_at?: string;
}

export interface AddonTemplateStep {
  id?: string;
  addon_id: string;
  title: string;
  description?: string;
  order_index: number;
  required_document_categories?: string[];
}

export interface OnboardingProgressRecord {
  clientId: string;
  stepName: string;
  stepOrder: number;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
}

export interface ClientOnboardingStep {
  step_id: string;
  title: string;
  description?: string;
  order_index: number;
  required_document_categories?: string[];
  is_addon_step: boolean;
  addon_id?: string;
  addon_name?: string;
}

export interface OnboardingClient {
  id: string;
  email: string;
  companyName?: string;
  subscriptionTier: Subscription;
  addons?: Addon[];
  status: 'pending' | 'active';
  teamMembers?: TeamMember[];
  onboardingProgress?: OnboardingProgressItem[];
  created_at?: string;
}

export interface TeamMember {
  id: string;
  email: string;
  invitationStatus: 'pending' | 'accepted';
}

export interface OnboardingProgressItem {
  stepId: string;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
}

export interface FileUpload {
  id: string;
  clientId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  category: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: string;
  verifiedAt?: string;
  url: string;
}

export interface ClientFormValues {
  email: string;
  companyName?: string;
  subscriptionId: string;
  addons: string[];
  teamMembers: { email: string }[];
  notes?: string;
}

export interface ClientCreationResult {
  success: boolean;
  client?: OnboardingClient;
  error?: string;
}
