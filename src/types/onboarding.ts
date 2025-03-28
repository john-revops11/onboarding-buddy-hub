
export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  order: number;
}

export interface Checklist {
  id: string;
  title: string;
  description?: string;
  items: ChecklistItem[];
  assignedTo?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserOnboarding {
  userId: string;
  checklistId: string;
  progress: number;
  completedItems: string[];
  startedAt: string;
  lastUpdatedAt: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  userId: string;
  uploadedAt: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  service: "google" | "openai" | "gemini" | "pinecone" | "notion";
  createdAt: string;
  lastUsed?: string;
}
