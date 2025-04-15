
// Onboarding types

export type DocumentCategory = 
  | "id_verification" 
  | "address_proof" 
  | "business_certificate" 
  | "company_logo" 
  | "tax_document" 
  | "contract_agreement"
  | "general";

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
  id?: string;
  title: string; // This is required
  description?: string;
  orderIndex: number;
  requiredDocuments?: DocumentCategory[];
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  category?: DocumentCategory;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  userId: string;  // Added for AdminFiles.tsx
  userEmail?: string;
  notes?: string;
}

// Add constants for document categories and required documents
export const DOCUMENT_CATEGORIES: Record<DocumentCategory, string> = {
  id_verification: "ID Verification",
  address_proof: "Address Proof",
  business_certificate: "Business Certificate",
  company_logo: "Company Logo",
  tax_document: "Tax Document",
  contract_agreement: "Contract Agreement",
  general: "General Document"
};

export const REQUIRED_DOCUMENTS: DocumentCategory[] = [
  "id_verification",
  "address_proof",
  "business_certificate"
];
