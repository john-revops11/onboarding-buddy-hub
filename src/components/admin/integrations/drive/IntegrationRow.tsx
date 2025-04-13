
import React from "react";
import { StatusBadge } from "./StatusBadge";
import { ActionButtons } from "./ActionButtons";

interface IntegrationRowProps {
  name: string;
  service: string;
  isChecking: boolean;
  isActive: boolean;
  isError: boolean;
  lastUsed: string;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
}

export const IntegrationRow: React.FC<IntegrationRowProps> = ({
  name,
  service,
  isChecking,
  isActive,
  isError,
  lastUsed,
  onEdit,
  onView,
  onDelete
}) => {
  return (
    <tr className="border-t">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">{service}</span>
        </div>
      </td>
      <td className="py-3 px-4">{name}</td>
      <td className="py-3 px-4">
        <StatusBadge 
          isChecking={isChecking} 
          isActive={isActive} 
          isError={isError} 
          errorType={isError && !isActive ? "missing" : "connection"}
        />
      </td>
      <td className="py-3 px-4">{lastUsed}</td>
      <td className="py-3 px-4">
        <ActionButtons
          onEdit={onEdit}
          onView={onView}
          onDelete={onDelete}
          isActive={isActive}
          isError={isError}
        />
      </td>
    </tr>
  );
};
