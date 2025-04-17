// Custom client management modules
export { createClient } from './client-create';
export { getOnboardingClients, getClients, getClientProgress, calculateClientProgress } from './client-query';
export { sendClientInvitation } from './client-invitations';
export { completeClientOnboarding } from './client-status';

// File upload management
export {
  uploadFile,
  getClientFiles,
  updateFileStatus,
  deleteFile
} from './file-upload';

// Onboarding progress management
export {
  getOnboardingProgress,
  updateOnboardingStep,
  calculateOnboardingProgress,
  completeClientOnboarding as finalizeClientOnboarding
} from './onboarding-progress';

// Subscription management
export {
  createSubscriptionTier,
  updateSubscriptionTier,
  deleteSubscriptionTier,
  getSubscriptionTiers,
} from '../subscription-management';

// Addon management
export {
  createAddon,
  updateAddon,
  deleteAddon,
  getAddons,
} from '../addon-management';