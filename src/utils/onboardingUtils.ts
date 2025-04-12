
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
 * Get onboarding templates from localStorage
 * In a real implementation, this would come from the API
 */
export const getOnboardingTemplates = () => {
  const templatesJson = localStorage.getItem('onboardingTemplates');
  
  if (!templatesJson) {
    // Create default templates if none exist
    const defaultTemplates = [
      {
        id: '1',
        name: 'Standard Onboarding',
        description: 'Default onboarding process for most clients',
        steps: [
          { id: '1-1', title: 'Account Setup', description: 'Set up your account details' },
          { id: '1-2', title: 'Service Selection', description: 'Choose the services you need' },
          { id: '1-3', title: 'Team Invitation', description: 'Invite your team members' },
          { id: '1-4', title: 'Initial Data Upload', description: 'Upload your initial data' },
          { id: '1-5', title: 'Training Session', description: 'Complete your training session' },
          { id: '1-6', title: 'Final Review', description: 'Review your setup and confirm' }
        ]
      },
      {
        id: '2',
        name: 'Enterprise Onboarding',
        description: 'Comprehensive onboarding for enterprise clients',
        steps: [
          { id: '2-1', title: 'Account Setup', description: 'Set up your enterprise account' },
          { id: '2-2', title: 'Department Configuration', description: 'Configure your departments' },
          { id: '2-3', title: 'User Management', description: 'Set up user roles and permissions' },
          { id: '2-4', title: 'Data Integration', description: 'Integrate your existing systems' },
          { id: '2-5', title: 'Custom Configuration', description: 'Set up custom features' },
          { id: '2-6', title: 'Team Training', description: 'Complete team training sessions' },
          { id: '2-7', title: 'Compliance Review', description: 'Review compliance settings' },
          { id: '2-8', title: 'Final Deployment', description: 'Deploy to your organization' }
        ]
      },
      {
        id: '3',
        name: 'Quick Start',
        description: 'Streamlined onboarding for small businesses',
        steps: [
          { id: '3-1', title: 'Basic Setup', description: 'Quick account setup' },
          { id: '3-2', title: 'Feature Selection', description: 'Select essential features' },
          { id: '3-3', title: 'Data Import', description: 'Import your basic data' },
          { id: '3-4', title: 'Confirmation', description: 'Confirm and start using the platform' }
        ]
      }
    ];
    
    localStorage.setItem('onboardingTemplates', JSON.stringify(defaultTemplates));
    return defaultTemplates;
  }
  
  return JSON.parse(templatesJson);
};

/**
 * Save onboarding template to localStorage
 * In a real implementation, this would be done via API
 */
export const saveOnboardingTemplate = (template: any) => {
  const templates = getOnboardingTemplates();
  const existingIndex = templates.findIndex((t: any) => t.id === template.id);
  
  if (existingIndex >= 0) {
    // Update existing template
    templates[existingIndex] = template;
  } else {
    // Add new template with generated ID
    template.id = Date.now().toString();
    templates.push(template);
  }
  
  localStorage.setItem('onboardingTemplates', JSON.stringify(templates));
  return template;
};

/**
 * Delete onboarding template from localStorage
 * In a real implementation, this would be done via API
 */
export const deleteOnboardingTemplate = (templateId: string) => {
  const templates = getOnboardingTemplates();
  const filteredTemplates = templates.filter((t: any) => t.id !== templateId);
  
  localStorage.setItem('onboardingTemplates', JSON.stringify(filteredTemplates));
  return true;
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
 * Add a notification for the current user
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
