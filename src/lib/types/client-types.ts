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
  tags?: string[];
}

export interface TeamMember {
  email: string;
  invitationStatus: string;
  userId?: string; // Added to link with auth.users
}

export interface OnboardingStep {
  id: string;
  stepName: string;
  stepOrder: number;
  completed: boolean;
  startedAt: string;
  completedAt?: string;
}

export interface FileRecord {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  category?: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: string;
  verifiedAt?: string;
  metadata?: Record<string, any>;
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
  onboardingProgress?: OnboardingStep[];
  files?: FileRecord[];
  assignedAdmin?: string;
  notes?: string;
  metadata?: Record<string, any>;
}

export interface ClientCreationResult {
  success: boolean;
  clientId?: string;
  error?: string;
}

// ClientFormValues type with required email in TeamMember
export interface ClientFormValues {
  email: string;
  companyName?: string;
  subscriptionTierId: string;
  addons: string[];
  teamMembers: { email: string }[];
}

// New type for tracking onboarding progress
export interface OnboardingProgressRecord {
  clientId: string;
  stepName: string;
  stepOrder: number;
  completed: boolean;
  startedAt: string;
  completedAt?: string;
}

// Updated type for file uploads
export interface FileUpload {
  id: string;
  clientId: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  category?: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedBy?: string;
  uploadedAt: string;
  verifiedAt?: string;
  metadata?: Record<string, any>;
}
