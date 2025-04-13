
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RevokeConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRevoke: () => Promise<void>;
}

export const RevokeConfirmDialog: React.FC<RevokeConfirmDialogProps> = ({
  open,
  onOpenChange,
  onRevoke,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will revoke the Google Drive integration. All connected functionality will stop working until a new service account key is uploaded.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onRevoke} className="bg-red-600 hover:bg-red-700">
            Yes, revoke integration
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
