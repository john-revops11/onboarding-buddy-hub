
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

/**
 * Gets the client status from localStorage
 * In a real implementation, this would come from the API
 */
export const getClientStatus = () => {
  const status = localStorage.getItem('clientStatus');
  return status || 'pending';
};

/**
 * Sets the client status in localStorage
 * In a real implementation, this would be done via API
 */
export const setClientStatus = (status: 'pending' | 'active') => {
  localStorage.setItem('clientStatus', status);
};

/**
 * Checks if the user should be redirected from onboarding to dashboard
 * based on client status and onboarding completion
 */
export const shouldRedirectToDashboard = () => {
  const onboardingComplete = isOnboardingComplete();
  const clientStatus = getClientStatus();
  
  // If onboarding is marked as complete by admin and client status is active
  return onboardingComplete && clientStatus === 'active';
};

/**
 * Get the onboarding steps progress
 * In a real implementation, this would come from the API
 */
export const getOnboardingProgress = () => {
  // Mock data for demonstration
  const completedSteps = localStorage.getItem('completedOnboardingSteps');
  const completedCount = completedSteps ? parseInt(completedSteps, 10) : 0;
  const totalSteps = 6; // Total number of onboarding steps
  
  return {
    completedCount,
    totalSteps,
    progress: Math.round((completedCount / totalSteps) * 100)
  };
};

/**
 * Updates the onboarding progress
 * In a real implementation, this would be done via API
 */
export const updateOnboardingProgress = (completedCount: number) => {
  localStorage.setItem('completedOnboardingSteps', completedCount.toString());
};

/**
 * Mark a specific onboarding step as complete
 * In a real implementation, this would be done via API
 */
export const completeOnboardingStep = (stepIndex: number) => {
  const { completedCount, totalSteps } = getOnboardingProgress();
  const newCompletedCount = Math.min(completedCount + 1, totalSteps);
  updateOnboardingProgress(newCompletedCount);
  
  // If all steps are complete, mark onboarding as complete locally
  if (newCompletedCount === totalSteps) {
    skipOnboarding();
  }
  
  return newCompletedCount;
};

/**
 * Add notification for the current user
 * In a real implementation, this would be done via API
 */
export const addNotification = (notification: any) => {
  const notifications = getPendingNotifications();
  
  // Add ID and timestamp to notification
  notification.id = Date.now().toString();
  notification.timestamp = new Date().toISOString();
  notification.read = false;
  
  notifications.push(notification);
  localStorage.setItem('pendingNotifications', JSON.stringify(notifications));
  
  return notification;
};

/**
 * Get pending notifications for the current user
 * In a real implementation, this would come from the API
 */
export const getPendingNotifications = () => {
  const notificationsJson = localStorage.getItem('pendingNotifications');
  
  if (!notificationsJson) {
    return [];
  }
  
  return JSON.parse(notificationsJson);
};

/**
 * Mark notification as read
 * In a real implementation, this would be done via API
 */
export const markNotificationAsRead = (notificationId: string) => {
  const notifications = getPendingNotifications();
  const updatedNotifications = notifications.map((n: any) => 
    n.id === notificationId ? { ...n, read: true } : n
  );
  
  localStorage.setItem('pendingNotifications', JSON.stringify(updatedNotifications));
  return true;
};

/**
 * Clear all notifications
 * In a real implementation, this would be done via API
 */
export const clearAllNotifications = () => {
  localStorage.setItem('pendingNotifications', JSON.stringify([]));
  return true;
};
