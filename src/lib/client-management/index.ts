
// Export all client management functionality from a single entry point
export { createClient } from './client-create';
export { getClients, getClientById, getClientProgress, calculateClientProgress, getOnboardingClients } from './client-query';
export { sendClientInvitation } from './client-invitations';
export { completeClientOnboarding } from './client-status';

// Export file management functions
export {
  uploadFile,
  getClientFiles,
  updateFileStatus,
  deleteFile
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
