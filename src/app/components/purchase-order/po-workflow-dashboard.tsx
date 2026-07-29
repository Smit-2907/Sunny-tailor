import { useState } from "react";
import { PurchaseOrder } from "./purchase-order-types";
import { DetailedPOCreationForm } from "./detailed-po-creation-form";
import { POList } from "./po-list";
import { POEmployeeUpload } from "./po-employee-upload";
import { POTemplatePreview } from "./po-template-preview";
import { POUpload } from "./po-upload";
import { EmployeeData } from "../measurement-system/employee-excel-upload";
import { usePOData } from "@/app/contexts/po-data-context";

interface POWorkflowDashboardProps {
  userRole: string;
  userEmail: string;
  onViewPODetails: (po: PurchaseOrder, employees: EmployeeData[]) => void;
  onOpenSizeAnalysis?: () => void;
}

type WorkflowView = "list" | "create-detailed-po" | "upload-po" | "upload-employees" | "preview-po";

export function POWorkflowDashboard({ 
  userRole, 
  userEmail,
  onViewPODetails,
  onOpenSizeAnalysis
}: POWorkflowDashboardProps) {
  const [currentView, setCurrentView] = useState<WorkflowView>("list");
  const [selectedPOForUpload, setSelectedPOForUpload] = useState<PurchaseOrder | null>(null);
  const [selectedPOForPreview, setSelectedPOForPreview] = useState<PurchaseOrder | null>(null);

  const {
    purchaseOrders,
    addPurchaseOrder,
    updatePurchaseOrder,
    setEmployeesForPO,
    getEmployeesForPO,
  } = usePOData();

  const handleCreatePO = (newPO: PurchaseOrder) => {
    addPurchaseOrder(newPO);
    setCurrentView("list");
  };

  const handleSelectPO = (po: PurchaseOrder) => {
    const employees = getEmployeesForPO(po.id);
    onViewPODetails(po, employees);
  };

  const handleUploadEmployees = (po: PurchaseOrder) => {
    setSelectedPOForUpload(po);
    setCurrentView("upload-employees");
  };

  const handleViewPOTemplate = (po: PurchaseOrder) => {
    setSelectedPOForPreview(po);
    setCurrentView("preview-po");
  };

  const handleEmployeesUploaded = (employees: EmployeeData[]) => {
    if (!selectedPOForUpload) return;
    
    setEmployeesForPO(selectedPOForUpload.id, employees);

    const updatedPO: PurchaseOrder = {
      ...selectedPOForUpload,
      status: "in-measurement",
      employeesUploaded: employees.length,
      updatedDate: new Date().toISOString(),
    };
    updatePurchaseOrder(updatedPO);
    onViewPODetails(updatedPO, employees);
  };

  return (
    <div>
      {currentView === "create-detailed-po" ? (
        <DetailedPOCreationForm
          onSave={handleCreatePO}
          onCancel={() => setCurrentView("list")}
          currentUserEmail={userEmail}
        />
      ) : currentView === "upload-po" ? (
        <POUpload
          onSave={handleCreatePO}
          onCancel={() => setCurrentView("list")}
        />
      ) : currentView === "upload-employees" && selectedPOForUpload ? (
        <POEmployeeUpload
          purchaseOrder={selectedPOForUpload}
          onBack={() => setCurrentView("list")}
          onEmployeesUploaded={handleEmployeesUploaded}
        />
      ) : currentView === "preview-po" && selectedPOForPreview ? (
        <POTemplatePreview
          purchaseOrder={selectedPOForPreview}
          onClose={() => setCurrentView("list")}
        />
      ) : (
        <POList
          purchaseOrders={purchaseOrders}
          onCreateDetailedPO={() => setCurrentView("create-detailed-po")}
          onUploadPO={() => setCurrentView("upload-po")}
          onSelectPO={handleSelectPO}
          onUploadEmployees={handleUploadEmployees}
          onViewPOTemplate={handleViewPOTemplate}
          userRole={userRole}
          onOpenSizeAnalysis={onOpenSizeAnalysis}
        />
      )}
    </div>
  );
}