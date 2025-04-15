
import { UploadedFile } from "@/types/onboarding";

export function checkRequiredDocuments(files: UploadedFile[], requiredCategories: string[]) {
  const uploaded = requiredCategories.filter(category =>
    files.some(file => file.category === category)
  );
  
  const verified = requiredCategories.filter(category =>
    files.some(file => file.category === category && file.status === 'verified')
  );
  
  const rejected = requiredCategories.filter(category =>
    files.some(file => file.category === category && file.status === 'rejected')
  );
  
  const missing = requiredCategories.filter(category =>
    !files.some(file => file.category === category)
  );
  
  return { 
    complete: missing.length === 0, 
    missing,
    uploaded,
    verified,
    rejected
  };
}
