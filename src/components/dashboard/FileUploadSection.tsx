
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUploader } from "@/components/onboarding/FileUploader";

interface FileUploadSectionProps {
  onFileUploadComplete: (file: any) => void;
  onVerificationStatusChange: (fileId: string, status: 'pending' | 'verified' | 'rejected') => void;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  onFileUploadComplete,
  onVerificationStatusChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Upload</CardTitle>
        <CardDescription>
          Upload your required documents for verification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileUploader 
          onUploadComplete={onFileUploadComplete}
          onVerificationStatusChange={onVerificationStatusChange}
        />
      </CardContent>
    </Card>
  );
};
