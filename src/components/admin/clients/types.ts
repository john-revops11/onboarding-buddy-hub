
import { OnboardingClient } from "@/lib/types/client-types";

// Type for enhanced client data with onboarding progress
export type EnhancedClient = OnboardingClient & {
  contactPerson?: string | null;
  position?: string | null;
  industry?: string | null;
  companySize?: string | null;
  onboardingProgress?: {
    percentage: number;
    completedSteps: number;
    totalSteps: number;
  };
};
