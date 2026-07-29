// Mock data for payroll management

export interface SalaryStructure {
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  bankAccount: string;
  panNumber: string;
  pfNumber: string;
  esiNumber?: string;
  dateOfJoining: string;
  
  // CTC Components
  ctc: number;
  
  // Earnings
  basic: number;
  hra: number;
  conveyance: number;
  medical: number;
  specialAllowance: number;
  
  // Gross Salary
  grossSalary: number;
  
  // Deductions
  pf: number;
  esi: number;
  professionalTax: number;
  tds: number;
  otherDeductions: number;
  
  // Net Salary
  netSalary: number;
}

export interface PayslipRecord {
  id: string;
  employeeId: string;
  month: string;
  year: string;
  salaryStructure: SalaryStructure;
  workingDays: number;
  presentDays: number;
  paidDays: number;
  lopDays: number; // Loss of Pay
  overtimeHours: number;
  overtimeAmount: number;
  bonus: number;
  remarks?: string;
}

// Function to calculate TDS based on annual income
const calculateTDS = (annualIncome: number): number => {
  // New Tax Regime 2024-25
  let tax = 0;
  
  if (annualIncome <= 300000) {
    tax = 0;
  } else if (annualIncome <= 700000) {
    tax = (annualIncome - 300000) * 0.05;
  } else if (annualIncome <= 1000000) {
    tax = 20000 + (annualIncome - 700000) * 0.10;
  } else if (annualIncome <= 1200000) {
    tax = 50000 + (annualIncome - 1000000) * 0.15;
  } else if (annualIncome <= 1500000) {
    tax = 80000 + (annualIncome - 1200000) * 0.20;
  } else {
    tax = 140000 + (annualIncome - 1500000) * 0.30;
  }
  
  // Monthly TDS
  return Math.round(tax / 12);
};

// Function to calculate salary structure from CTC
const calculateSalaryStructure = (
  employeeId: string,
  employeeName: string,
  designation: string,
  department: string,
  ctc: number,
  dateOfJoining: string
): SalaryStructure => {
  // Calculate components
  const basic = Math.round(ctc * 0.40); // 40% of CTC
  const hra = Math.round(basic * 0.50); // 50% of Basic
  const conveyance = 1600; // Fixed
  const medical = 1250; // Fixed
  
  // Calculate gross salary (excluding employer contributions)
  const monthlyCtc = Math.round(ctc / 12);
  const specialAllowance = monthlyCtc - basic - hra - conveyance - medical;
  const grossSalary = basic + hra + conveyance + medical + specialAllowance;
  
  // Calculate deductions
  const pf = Math.round(basic * 0.12); // 12% of Basic
  const esi = grossSalary < 21000 ? Math.round(grossSalary * 0.0075) : 0; // 0.75% if gross < 21000
  const professionalTax = 200; // Standard PT
  const tds = calculateTDS(grossSalary * 12); // Based on annual income
  const otherDeductions = 0;
  
  const totalDeductions = pf + esi + professionalTax + tds + otherDeductions;
  const netSalary = grossSalary - totalDeductions;
  
  return {
    employeeId,
    employeeName,
    designation,
    department,
    bankAccount: `BANK${employeeId.replace("EMP", "")}xxxxx`,
    panNumber: `${employeeId}PAN`,
    pfNumber: `PF/${employeeId}/2024`,
    esiNumber: esi > 0 ? `ESI/${employeeId}/2024` : undefined,
    dateOfJoining,
    ctc,
    basic,
    hra,
    conveyance,
    medical,
    specialAllowance,
    grossSalary,
    pf,
    esi,
    professionalTax,
    tds,
    otherDeductions,
    netSalary,
  };
};

// Generate salary structures for all 25 employees
export const mockSalaryStructures: SalaryStructure[] = [
  calculateSalaryStructure("EMP001", "Rajesh Kumar", "Senior Production Manager", "Production", 720000, "2020-03-15"),
  calculateSalaryStructure("EMP002", "Priya Sharma", "HR Manager", "Human Resources", 650000, "2019-07-22"),
  calculateSalaryStructure("EMP003", "Amit Patel", "Measurement Expert", "Quality Control", 480000, "2021-01-10"),
  calculateSalaryStructure("EMP004", "Sunita Verma", "Accountant", "Finance", 550000, "2020-11-05"),
  calculateSalaryStructure("EMP005", "Vikram Singh", "Fabric Store Manager", "Inventory", 520000, "2018-09-18"),
  calculateSalaryStructure("EMP006", "Anjali Desai", "Production Supervisor", "Production", 420000, "2021-05-12"),
  calculateSalaryStructure("EMP007", "Rahul Gupta", "Raw Material Manager", "Inventory", 500000, "2019-12-20"),
  calculateSalaryStructure("EMP008", "Kavita Reddy", "Dispatch Manager", "Logistics", 480000, "2020-08-14"),
  calculateSalaryStructure("EMP009", "Sanjay Mehta", "Quality Inspector", "Quality Control", 380000, "2022-02-28"),
  calculateSalaryStructure("EMP010", "Neha Joshi", "HR Executive", "Human Resources", 360000, "2021-10-03"),
  calculateSalaryStructure("EMP011", "Arjun Nair", "Production Operator", "Production", 300000, "2022-06-15"),
  calculateSalaryStructure("EMP012", "Pooja Iyer", "Accounts Assistant", "Finance", 320000, "2022-03-22"),
  calculateSalaryStructure("EMP013", "Manoj Pillai", "Fabric Store Executive", "Inventory", 280000, "2023-01-10"),
  calculateSalaryStructure("EMP014", "Rekha Menon", "Measurement Assistant", "Quality Control", 260000, "2023-04-18"),
  calculateSalaryStructure("EMP015", "Deepak Rao", "Dispatch Executive", "Logistics", 290000, "2022-11-25"),
  calculateSalaryStructure("EMP016", "Swati Kulkarni", "Production Operator", "Production", 300000, "2022-09-08"),
  calculateSalaryStructure("EMP017", "Karthik Bhat", "Quality Control Operator", "Quality Control", 285000, "2023-02-14"),
  calculateSalaryStructure("EMP018", "Divya Nambiar", "HR Assistant", "Human Resources", 275000, "2023-05-20"),
  calculateSalaryStructure("EMP019", "Suresh Shetty", "Raw Material Executive", "Inventory", 295000, "2022-12-05"),
  calculateSalaryStructure("EMP020", "Lakshmi Kamath", "Accounts Executive", "Finance", 340000, "2022-07-12"),
  calculateSalaryStructure("EMP021", "Anil Hegde", "Production Helper", "Production", 240000, "2023-08-22"),
  calculateSalaryStructure("EMP022", "Malini Pai", "Fabric Inspector", "Inventory", 255000, "2023-06-15"),
  calculateSalaryStructure("EMP023", "Ramesh Shenoy", "Dispatch Helper", "Logistics", 235000, "2023-09-10"),
  calculateSalaryStructure("EMP024", "Usha Prabhu", "Office Assistant", "Administration", 230000, "2023-07-28"),
  calculateSalaryStructure("EMP025", "Ganesh Acharya", "Security Supervisor", "Security", 270000, "2022-10-18"),
];

// Generate payslip records for current month
const generatePayslipRecords = (): PayslipRecord[] => {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear().toString();
  
  return mockSalaryStructures.map((salary, index) => {
    // Simulate some variations in attendance
    const workingDays = 26;
    const presentDays = 26 - (index % 3); // Some employees have LOP
    const lopDays = workingDays - presentDays;
    const paidDays = presentDays;
    
    // Calculate pro-rated salary based on attendance
    const salaryFactor = paidDays / workingDays;
    
    // Some employees have overtime
    const overtimeHours = index % 5 === 0 ? 10 + (index % 3) * 5 : 0;
    const overtimeRate = Math.round(salary.basic / 208); // Basic per hour (26 days * 8 hours)
    const overtimeAmount = Math.round(overtimeHours * overtimeRate * 2); // 2x rate
    
    // Bonus for some employees
    const bonus = index % 7 === 0 ? 2000 : 0;
    
    return {
      id: `PAY-${salary.employeeId}-${currentMonth}-${currentYear}`,
      employeeId: salary.employeeId,
      month: currentMonth,
      year: currentYear,
      salaryStructure: salary,
      workingDays,
      presentDays,
      paidDays,
      lopDays,
      overtimeHours,
      overtimeAmount,
      bonus,
      remarks: lopDays > 0 ? `LOP for ${lopDays} days` : undefined,
    };
  });
};

export const mockPayslipRecords = generatePayslipRecords();

// Salary statistics by department
export const calculateDepartmentWiseSalary = () => {
  const deptMap: { [key: string]: { count: number; total: number; avgSalary: number } } = {};
  
  mockSalaryStructures.forEach((salary) => {
    if (!deptMap[salary.department]) {
      deptMap[salary.department] = { count: 0, total: 0, avgSalary: 0 };
    }
    deptMap[salary.department].count += 1;
    deptMap[salary.department].total += salary.netSalary;
  });
  
  // Calculate averages
  Object.keys(deptMap).forEach((dept) => {
    deptMap[dept].avgSalary = Math.round(deptMap[dept].total / deptMap[dept].count);
  });
  
  return deptMap;
};

// Monthly payroll summary
export const calculateMonthlyPayrollSummary = () => {
  const totalGross = mockSalaryStructures.reduce((sum, s) => sum + s.grossSalary, 0);
  const totalDeductions = mockSalaryStructures.reduce(
    (sum, s) => sum + s.pf + s.esi + s.professionalTax + s.tds + s.otherDeductions,
    0
  );
  const totalNet = mockSalaryStructures.reduce((sum, s) => sum + s.netSalary, 0);
  const totalEmployees = mockSalaryStructures.length;
  const avgSalary = Math.round(totalNet / totalEmployees);
  
  return {
    totalGross,
    totalDeductions,
    totalNet,
    totalEmployees,
    avgSalary,
    totalPF: mockSalaryStructures.reduce((sum, s) => sum + s.pf, 0),
    totalESI: mockSalaryStructures.reduce((sum, s) => sum + s.esi, 0),
    totalPT: mockSalaryStructures.reduce((sum, s) => sum + s.professionalTax, 0),
    totalTDS: mockSalaryStructures.reduce((sum, s) => sum + s.tds, 0),
  };
};

// Employer contribution calculation
export const calculateEmployerContribution = (salary: SalaryStructure) => {
  const employerPF = Math.round(salary.basic * 0.12); // 12% employer contribution
  const employerESI = salary.esi > 0 ? Math.round(salary.grossSalary * 0.0325) : 0; // 3.25% employer contribution
  const gratuity = Math.round((salary.basic * 4.81) / 100); // 4.81% of basic (approx)
  const bonus = Math.round(salary.basic * 0.0833); // 8.33% of basic (annual bonus pro-rated)
  
  return {
    employerPF,
    employerESI,
    gratuity,
    bonus,
    totalEmployerCost: employerPF + employerESI + gratuity + bonus,
  };
};
