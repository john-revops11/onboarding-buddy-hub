
/**
 * Utility functions for handling onboarding state
 */

/**
 * Sets the default selected service without showing the onboarding screen
 */
export const skipOnboarding = () => {
  // Set a default service if none was previously selected
  if (!localStorage.getItem('selectedService')) {
    localStorage.setItem('selectedService', 'consulting');
  }
  
  // Mark onboarding as complete
  localStorage.setItem('onboardingComplete', 'true');
};

/**
 * Check if the user has completed onboarding
 */
export const isOnboardingComplete = () => {
  return localStorage.getItem('onboardingComplete') === 'true';
};
