// Centralized mock employee data with comprehensive fields
// This data is shared across Employee Master Sheet, Measurement Sheet, and Dispatch Sheet

export interface EmployeeData {
  srNo: number;
  employeeId: string;
  employeeName: string;
  branch: string;
  department: string;
  designation: string;
  gender: "Male" | "Female";
  joiningDate: string;
  uniqueSerialNumber: string;
  measurements?: {
    shirt: ShirtMeasurements;
    pant: PantMeasurements;
  };
  photo?: string;
  remarks?: string;
  measurementStatus: "not-measured" | "in-progress" | "completed";
  measuredBy?: string;
  measurementDate?: string;
  qualityCheck?: "passed" | "pending" | "failed";
  productionStatus?: "completed" | "in-progress" | "not-started";
  shirtSizingMode?: "measurement" | "fixed";
  shirtFixedSize?: string;
  pantSizingMode?: "measurement" | "fixed";
  pantFixedSize?: string;
}

export interface ShirtMeasurements {
  length: string;
  shoulder: string;
  chest: string;
  waist: string;
  sleeve: string;
  neck: string;
  front?: string;
  collar?: string;
  cuff?: string;
}

export interface PantMeasurements {
  length: string;
  waist: string;
  hip: string;
  thigh: string;
  inseam: string;
  round?: string;
  bottom?: string;
}

// Empty employee data - all data will come from uploaded files or Supabase
export const mockEmployeeData: EmployeeData[] = [];

// Helper functions
export const getEmployeesByStatus = (status: "not-measured" | "in-progress" | "completed") => {
  return mockEmployeeData.filter(emp => emp.measurementStatus === status);
};

export const getEmployeesByBranch = (branch: string) => {
  return mockEmployeeData.filter(emp => emp.branch === branch);
};

export const getUniqueBranches = () => {
  return Array.from(new Set(mockEmployeeData.map(emp => emp.branch)));
};

export const getUniqueDepartments = () => {
  return Array.from(new Set(mockEmployeeData.map(emp => emp.department)));
};