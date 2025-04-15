
// If this file doesn't exist, we'll create it

export type DocumentCategory = 
  | "id_verification" 
  | "address_proof" 
  | "business_certificate" 
  | "company_logo" 
  | "tax_document" 
  | "contract_agreement";

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  order: number;
  requiredDocuments: DocumentCategory[];
  isAddonStep?: boolean;
  addonId?: string;
  addonName?: string;
}

export interface OnboardingClient {
  id: string;
  email: string;
  companyName?: string;
  subscriptionTier?: string;
  addons?: string[];
  status: 'pending' | 'active';
  teamMembers?: TeamMember[];
  onboardingProgress?: OnboardingProgressItem[];
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

export interface OnboardingTemplate {
  id: string;
  name: string;
  description?: string;
  steps: OnboardingTemplateStep[];
}

export interface OnboardingTemplateStep {
  id: string;
  title: string;
  description?: string;
  orderIndex: number;
  requiredDocuments?: DocumentCategory[];
}
