import { useState } from "react";
import { DispatchManagementDashboard } from "@/app/components/dispatch-system/dispatch-management-dashboard";
import { DispatchSheetWithBags } from "@/app/components/dispatch-system/dispatch-sheet-with-bags";
import { DispatchAIAssistant } from "@/app/components/dispatch/dispatch-ai-assistant";

export function DispatchDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<{
    poNumber: string;
    companyName: string;
  } | null>(null);

  const handleManageBags = (poNumber: string, companyName: string) => {
    setSelectedOrder({ poNumber, companyName });
  };

  const handleBackToOverview = () => {
    setSelectedOrder(null);
  };

  return (
    <>
      {!selectedOrder ? (
        <DispatchManagementDashboard onManageBags={handleManageBags} />
      ) : (
        <DispatchSheetWithBags 
          poNumber={selectedOrder.poNumber}
          companyName={selectedOrder.companyName}
          onBack={handleBackToOverview}
        />
      )}
      <DispatchAIAssistant />
    </>
  );
}