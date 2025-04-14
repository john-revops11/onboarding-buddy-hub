
// Export all client management functionality from a single entry point
export { createClient } from './create-client';
export { getClients } from './client-query';
export { sendClientInvitation } from './client-invitations';
export { completeClientOnboarding } from './client-status';
export { addClient, addRevologyAnalyticsClient } from './add-client';
export { initializeDefaultData } from './setup-defaults';

// Export file management functions
export {
  uploadClientFile,
  getClientFiles,
  updateFileStatus
} from './file-upload';

// Export onboarding progress management functions
export {
  getOnboardingProgress,
  updateOnboardingStep,
  calculateOnboardingProgress,
  completeClientOnboarding as finalizeClientOnboarding
} from './onboarding-progress';

// Export subscription-related functions
export {
  createSubscriptionTier,
  updateSubscriptionTier,
  deleteSubscriptionTier,
  getSubscriptionTiers,
} from '../subscription-management';

// Export addon-related functions
export {
  createAddon,
  updateAddon,
  deleteAddon,
  getAddons,
} from '../addon-management';
