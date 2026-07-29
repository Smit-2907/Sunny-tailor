import { useState } from "react";
import { POWorkflowDashboard } from "../purchase-order/po-workflow-dashboard";
import { POMeasurementView } from "../purchase-order/po-measurement-view";
import { PurchaseOrder } from "../purchase-order/purchase-order-types";
import { EmployeeData } from "../measurement-system/employee-excel-upload";
import { usePOData } from "@/app/contexts/po-data-context";
import { SizeAnalysisModal } from "./size-analysis-modal";

interface POBasedMeasurementDashboardProps {
  userRole: string;
  userEmail: string;
}

export function POBasedMeasurementDashboard({ 
  userRole, 
  userEmail 
}: POBasedMeasurementDashboardProps) {
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [showSizeAnalysis, setShowSizeAnalysis] = useState(false);
  const { getEmployeesForPO, updateEmployee, updatePurchaseOrder, purchaseOrders } = usePOData();

  const handleViewPODetails = (po: PurchaseOrder, _employees: EmployeeData[]) => {
    setSelectedPO(po);
  };

  const handleBackToList = () => {
    setSelectedPO(null);
  };

  const handleUpdateEmployee = (updatedEmployee: EmployeeData) => {
    if (!selectedPO) return;
    
    updateEmployee(selectedPO.id, updatedEmployee);
    
    // Recalculate PO progress
    const employees = getEmployeesForPO(selectedPO.id);
    const updatedList = employees.map(emp => 
      emp.uniqueSerialNumber === updatedEmployee.uniqueSerialNumber 
        ? updatedEmployee 
        : emp
    );

    const completed = updatedList.filter(e => e.measurementStatus === "completed").length;
    const inProgress = updatedList.filter(e => e.measurementStatus === "in-progress").length;

    const updatedPO = {
      ...selectedPO,
      measurementsCompleted: completed,
      measurementsInProgress: inProgress,
    };
    
    setSelectedPO(updatedPO);
    updatePurchaseOrder(updatedPO);
  };

  const currentEmployees = selectedPO ? getEmployeesForPO(selectedPO.id) : [];

  // Filter POs that have employees uploaded
  const availablePOs = purchaseOrders.filter(po => po.employeesUploaded > 0);

  return (
    <div>
      {selectedPO ? (
        <POMeasurementView
          purchaseOrder={selectedPO}
          employees={currentEmployees}
          onBack={handleBackToList}
          onUpdateEmployee={handleUpdateEmployee}
        />
      ) : (
        <POWorkflowDashboard
          userRole={userRole}
          userEmail={userEmail}
          onViewPODetails={handleViewPODetails}
          onOpenSizeAnalysis={() => setShowSizeAnalysis(true)}
        />
      )}

      <SizeAnalysisModal
        isOpen={showSizeAnalysis}
        onClose={() => setShowSizeAnalysis(false)}
        availablePOs={availablePOs}
      />
    </div>
  );
}