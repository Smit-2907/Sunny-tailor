import { useState } from "react";
import { POUploadScreen, POData } from "./po-upload-screen";
import { EmployeeData } from "./employee-excel-upload";
import { EmployeeMasterSheet } from "./employee-master-sheet";
import { MeasurementEntryForm } from "./measurement-entry-form";
import { MeasurementAIAssistant } from "./measurement-ai-assistant";

type SystemStep = "po-upload" | "master-sheet" | "measurement-entry";

export function MeasurementSystemContainer() {
  const [currentStep, setCurrentStep] = useState<SystemStep>("po-upload");
  const [poData, setPOData] = useState<POData | null>(null);
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);

  const handleDataProcessed = (data: POData, employeeData: EmployeeData[]) => {
    setPOData(data);
    setEmployees(employeeData);
    setCurrentStep("master-sheet");
  };

  const handleSelectEmployee = (employee: EmployeeData) => {
    setSelectedEmployee(employee);
    setCurrentStep("measurement-entry");
  };

  const handleSaveMeasurement = (updatedEmployee: EmployeeData) => {
    // Update the employee in the list
    const updatedEmployees = employees.map(emp =>
      emp.uniqueSerialNumber === updatedEmployee.uniqueSerialNumber
        ? updatedEmployee
        : emp
    );
    setEmployees(updatedEmployees);
    setSelectedEmployee(null);
    setCurrentStep("master-sheet");
  };

  const handleCancelMeasurement = () => {
    setSelectedEmployee(null);
    setCurrentStep("master-sheet");
  };

  const handleBackToPOUpload = () => {
    setCurrentStep("po-upload");
    setPOData(null);
    setEmployees([]);
    setSelectedEmployee(null);
  };

  return (
    <>
      {currentStep === "po-upload" && (
        <POUploadScreen onDataProcessed={handleDataProcessed} />
      )}

      {currentStep === "master-sheet" && poData && (
        <EmployeeMasterSheet
          poData={poData}
          employees={employees}
          onSelectEmployee={handleSelectEmployee}
          onUpdateEmployees={setEmployees}
          onBack={handleBackToPOUpload}
        />
      )}

      {currentStep === "measurement-entry" && selectedEmployee && (
        <MeasurementEntryForm
          employee={selectedEmployee}
          onSave={handleSaveMeasurement}
          onCancel={handleCancelMeasurement}
        />
      )}

      {/* AI Measurement Assistant - Always Available */}
      <MeasurementAIAssistant />
    </>
  );
}