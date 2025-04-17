
import { createColumnHelper } from "@tanstack/react-table";
import { EnhancedClient } from "../types";
import { ClientStatusBadge } from "../ClientStatusBadge";
import { ClientActions } from "../ClientActions";

export function useClientColumns(onRefetch: () => void) {
  const columnHelper = createColumnHelper<EnhancedClient>();

  const columns = [
    columnHelper.accessor("companyName", {
      header: "Company",
      cell: (info) => info.getValue() || "-",
      enableSorting: true,
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("contactPerson", {
      id: "contactPerson",
      header: "Contact Person",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("position", {
      id: "position",
      header: "Position",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("industry", {
      id: "industry",
      header: "Industry",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("companySize", {
      id: "companySize",
      header: "Company Size",
      cell: (info) => info.getValue() || "-",
      enableSorting: true,
    }),
    columnHelper.accessor((row) => row.onboardingProgress?.percentage || 0, {
      id: "onboardingStatus",
      header: "Onboarding Status",
      cell: (info) => {
        const progress = info.row.original.onboardingProgress;
        return (
          <ClientStatusBadge 
            progress={progress?.percentage || 0} 
            completedSteps={progress?.completedSteps || 0} 
            totalSteps={progress?.totalSteps || 0} 
          />
        );
      },
      enableSorting: true,
    }),
    columnHelper.accessor("id", {
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <ClientActions 
          clientId={info.getValue()} 
          client={info.row.original}
          onSuccess={onRefetch}
        />
      ),
      enableSorting: false,
    }),
  ];

  return columns;
}
