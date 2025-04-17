export const OnboardingStatus = {
  NOT_STARTED: "not_started",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export type OnboardingStatusType =
  typeof OnboardingStatus[keyof typeof OnboardingStatus];
