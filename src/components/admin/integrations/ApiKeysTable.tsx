
import React from "react";
import { IntegrationRow } from "./drive/IntegrationRow";
import { 
  Table, 
  TableHeader, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";

interface ApiKeysTableProps {
  integrations: Array<{
    id: string;
    service: string;
    name: string;
    isChecking: boolean;
    isActive: boolean;
    isError: boolean;
    lastUsed: string;
  }>;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ApiKeysTable: React.FC<ApiKeysTableProps> = ({
  integrations,
  onEdit,
  onView,
  onDelete
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Used</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {integrations.map((integration) => (
            <IntegrationRow
              key={integration.id}
              service={integration.service}
              name={integration.name}
              isChecking={integration.isChecking}
              isActive={integration.isActive}
              isError={integration.isError}
              lastUsed={integration.lastUsed}
              onEdit={() => onEdit(integration.id)}
              onView={() => onView(integration.id)}
              onDelete={() => onDelete(integration.id)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
