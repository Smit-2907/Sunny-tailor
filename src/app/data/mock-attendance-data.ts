// Mock data for attendance and leave management

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: "present" | "absent" | "half-day" | "week-off" | "on-leave" | "holiday";
  clockIn?: string;
  clockOut?: string;
  isLate?: boolean;
  isEarlyLeave?: boolean;
  workHours?: number;
  overtime?: number;
  remarks?: string;
}

export interface LeaveApplication {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: "casual" | "sick" | "earned" | "compensatory" | "maternity" | "paternity";
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedOn: string;
  approvedBy?: string;
  approvedOn?: string;
  rejectionReason?: string;
  documents?: string[];
}

export interface LeaveBalance {
  employeeId: string;
  employeeName: string;
  casual: {
    total: number;
    used: number;
    available: number;
  };
  sick: {
    total: number;
    used: number;
    available: number;
  };
  earned: {
    total: number;
    used: number;
    available: number;
  };
  compensatory: {
    total: number;
    used: number;
    available: number;
  };
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
  type: "national" | "regional" | "company";
  isOptional: boolean;
}

// Generate attendance data for current month
const generateAttendanceData = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const employees = [
    { id: "EMP001", name: "Rajesh Kumar" },
    { id: "EMP002", name: "Priya Sharma" },
    { id: "EMP003", name: "Amit Patel" },
    { id: "EMP004", name: "Sunita Verma" },
    { id: "EMP005", name: "Vikram Singh" },
    { id: "EMP006", name: "Anjali Desai" },
    { id: "EMP007", name: "Rahul Gupta" },
    { id: "EMP008", name: "Kavita Reddy" },
    { id: "EMP009", name: "Sanjay Mehta" },
    { id: "EMP010", name: "Neha Joshi" },
    { id: "EMP011", name: "Arjun Nair" },
    { id: "EMP012", name: "Pooja Iyer" },
    { id: "EMP013", name: "Manoj Pillai" },
    { id: "EMP014", name: "Rekha Menon" },
    { id: "EMP015", name: "Deepak Rao" },
    { id: "EMP016", name: "Swati Kulkarni" },
    { id: "EMP017", name: "Karthik Bhat" },
    { id: "EMP018", name: "Divya Nambiar" },
    { id: "EMP019", name: "Suresh Shetty" },
    { id: "EMP020", name: "Lakshmi Kamath" },
    { id: "EMP021", name: "Anil Hegde" },
    { id: "EMP022", name: "Malini Pai" },
    { id: "EMP023", name: "Ramesh Shenoy" },
    { id: "EMP024", name: "Usha Prabhu" },
    { id: "EMP025", name: "Ganesh Acharya" },
  ];

  // Generate last 30 days of attendance
  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = new Date();
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toISOString().split("T")[0];
    const dayOfWeek = date.getDay();

    employees.forEach((emp, index) => {
      let status: AttendanceRecord["status"];
      let clockIn: string | undefined;
      let clockOut: string | undefined;
      let isLate = false;
      let isEarlyLeave = false;
      let workHours: number | undefined;
      let overtime: number | undefined;

      // Sunday is week-off
      if (dayOfWeek === 0) {
        status = "week-off";
      }
      // Some employees on leave
      else if (dayOffset < 5 && index === 3) {
        status = "on-leave";
      } else if (dayOffset >= 10 && dayOffset < 15 && index === 7) {
        status = "on-leave";
      }
      // Random absences (5% chance)
      else if (Math.random() < 0.05) {
        status = "absent";
      }
      // Half day (3% chance)
      else if (Math.random() < 0.03) {
        status = "half-day";
        clockIn = "09:00 AM";
        clockOut = "01:30 PM";
        workHours = 4.5;
      }
      // Present
      else {
        status = "present";
        
        // Clock in time (some late arrivals)
        const isLatePerson = Math.random() < 0.15;
        const clockInHour = isLatePerson ? 9 + Math.floor(Math.random() * 2) : 9;
        const clockInMin = Math.floor(Math.random() * 60);
        clockIn = `${String(clockInHour).padStart(2, "0")}:${String(clockInMin).padStart(2, "0")} AM`;
        isLate = isLatePerson;

        // Clock out time
        const clockOutHour = 18 + Math.floor(Math.random() * 2);
        const clockOutMin = Math.floor(Math.random() * 60);
        const clockOutPeriod = clockOutHour >= 12 ? "PM" : "AM";
        const displayHour = clockOutHour > 12 ? clockOutHour - 12 : clockOutHour;
        clockOut = `${String(displayHour).padStart(2, "0")}:${String(clockOutMin).padStart(2, "0")} ${clockOutPeriod}`;

        // Calculate work hours
        workHours = 9 + Math.random() * 2;
        if (workHours > 9) {
          overtime = workHours - 9;
        }
        workHours = parseFloat(workHours.toFixed(1));
        overtime = overtime ? parseFloat(overtime.toFixed(1)) : undefined;
      }

      records.push({
        id: `ATT-${emp.id}-${dateStr}`,
        employeeId: emp.id,
        employeeName: emp.name,
        date: dateStr,
        status,
        clockIn,
        clockOut,
        isLate,
        isEarlyLeave,
        workHours,
        overtime,
      });
    });
  }

  return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Generate leave applications
export const mockLeaveApplications: LeaveApplication[] = [
  {
    id: "LV-001",
    employeeId: "EMP003",
    employeeName: "Amit Patel",
    leaveType: "casual",
    fromDate: "2025-02-05",
    toDate: "2025-02-07",
    totalDays: 3,
    reason: "Family function",
    status: "pending",
    appliedOn: "2025-01-25",
  },
  {
    id: "LV-002",
    employeeId: "EMP007",
    employeeName: "Rahul Gupta",
    leaveType: "sick",
    fromDate: "2025-01-28",
    toDate: "2025-01-29",
    totalDays: 2,
    reason: "Fever and cold",
    status: "pending",
    appliedOn: "2025-01-27",
  },
  {
    id: "LV-003",
    employeeId: "EMP012",
    employeeName: "Pooja Iyer",
    leaveType: "earned",
    fromDate: "2025-02-10",
    toDate: "2025-02-14",
    totalDays: 5,
    reason: "Vacation trip to Goa",
    status: "pending",
    appliedOn: "2025-01-20",
  },
  {
    id: "LV-004",
    employeeId: "EMP004",
    employeeName: "Sunita Verma",
    leaveType: "casual",
    fromDate: "2025-01-22",
    toDate: "2025-01-24",
    totalDays: 3,
    reason: "Personal work",
    status: "approved",
    appliedOn: "2025-01-15",
    approvedBy: "HR Manager",
    approvedOn: "2025-01-16",
  },
  {
    id: "LV-005",
    employeeId: "EMP008",
    employeeName: "Kavita Reddy",
    leaveType: "sick",
    fromDate: "2025-01-17",
    toDate: "2025-01-19",
    totalDays: 3,
    reason: "Medical procedure",
    status: "approved",
    appliedOn: "2025-01-10",
    approvedBy: "HR Manager",
    approvedOn: "2025-01-11",
  },
  {
    id: "LV-006",
    employeeId: "EMP015",
    employeeName: "Deepak Rao",
    leaveType: "casual",
    fromDate: "2025-01-10",
    toDate: "2025-01-10",
    totalDays: 1,
    reason: "House shifting",
    status: "rejected",
    appliedOn: "2025-01-08",
    approvedBy: "HR Manager",
    approvedOn: "2025-01-09",
    rejectionReason: "Insufficient leave balance",
  },
  {
    id: "LV-007",
    employeeId: "EMP020",
    employeeName: "Lakshmi Kamath",
    leaveType: "earned",
    fromDate: "2025-01-05",
    toDate: "2025-01-09",
    totalDays: 5,
    reason: "Home town visit",
    status: "approved",
    appliedOn: "2024-12-28",
    approvedBy: "HR Manager",
    approvedOn: "2024-12-29",
  },
];

// Generate leave balances for all employees
export const mockLeaveBalances: LeaveBalance[] = [
  { employeeId: "EMP001", employeeName: "Rajesh Kumar", casual: { total: 12, used: 2, available: 10 }, sick: { total: 12, used: 0, available: 12 }, earned: { total: 15, used: 5, available: 10 }, compensatory: { total: 4, used: 0, available: 4 } },
  { employeeId: "EMP002", employeeName: "Priya Sharma", casual: { total: 12, used: 4, available: 8 }, sick: { total: 12, used: 1, available: 11 }, earned: { total: 15, used: 0, available: 15 }, compensatory: { total: 0, used: 0, available: 0 } },
  { employeeId: "EMP003", employeeName: "Amit Patel", casual: { total: 12, used: 1, available: 11 }, sick: { total: 12, used: 2, available: 10 }, earned: { total: 15, used: 3, available: 12 }, compensatory: { total: 2, used: 1, available: 1 } },
  { employeeId: "EMP004", employeeName: "Sunita Verma", casual: { total: 12, used: 6, available: 6 }, sick: { total: 12, used: 0, available: 12 }, earned: { total: 15, used: 8, available: 7 }, compensatory: { total: 0, used: 0, available: 0 } },
  { employeeId: "EMP005", employeeName: "Vikram Singh", casual: { total: 12, used: 0, available: 12 }, sick: { total: 12, used: 1, available: 11 }, earned: { total: 15, used: 0, available: 15 }, compensatory: { total: 3, used: 0, available: 3 } },
  { employeeId: "EMP006", employeeName: "Anjali Desai", casual: { total: 12, used: 3, available: 9 }, sick: { total: 12, used: 2, available: 10 }, earned: { total: 15, used: 5, available: 10 }, compensatory: { total: 1, used: 1, available: 0 } },
  { employeeId: "EMP007", employeeName: "Rahul Gupta", casual: { total: 12, used: 2, available: 10 }, sick: { total: 12, used: 3, available: 9 }, earned: { total: 15, used: 2, available: 13 }, compensatory: { total: 0, used: 0, available: 0 } },
  { employeeId: "EMP008", employeeName: "Kavita Reddy", casual: { total: 12, used: 5, available: 7 }, sick: { total: 12, used: 5, available: 7 }, earned: { total: 15, used: 10, available: 5 }, compensatory: { total: 2, used: 0, available: 2 } },
  { employeeId: "EMP009", employeeName: "Sanjay Mehta", casual: { total: 12, used: 1, available: 11 }, sick: { total: 12, used: 0, available: 12 }, earned: { total: 15, used: 0, available: 15 }, compensatory: { total: 5, used: 2, available: 3 } },
  { employeeId: "EMP010", employeeName: "Neha Joshi", casual: { total: 12, used: 4, available: 8 }, sick: { total: 12, used: 1, available: 11 }, earned: { total: 15, used: 7, available: 8 }, compensatory: { total: 0, used: 0, available: 0 } },
  { employeeId: "EMP011", employeeName: "Arjun Nair", casual: { total: 12, used: 3, available: 9 }, sick: { total: 12, used: 2, available: 10 }, earned: { total: 15, used: 4, available: 11 }, compensatory: { total: 1, used: 0, available: 1 } },
  { employeeId: "EMP012", employeeName: "Pooja Iyer", casual: { total: 12, used: 2, available: 10 }, sick: { total: 12, used: 1, available: 11 }, earned: { total: 15, used: 3, available: 12 }, compensatory: { total: 0, used: 0, available: 0 } },
  { employeeId: "EMP013", employeeName: "Manoj Pillai", casual: { total: 12, used: 5, available: 7 }, sick: { total: 12, used: 4, available: 8 }, earned: { total: 15, used: 8, available: 7 }, compensatory: { total: 3, used: 1, available: 2 } },
  { employeeId: "EMP014", employeeName: "Rekha Menon", casual: { total: 12, used: 1, available: 11 }, sick: { total: 12, used: 0, available: 12 }, earned: { total: 15, used: 2, available: 13 }, compensatory: { total: 0, used: 0, available: 0 } },
  { employeeId: "EMP015", employeeName: "Deepak Rao", casual: { total: 12, used: 7, available: 5 }, sick: { total: 12, used: 3, available: 9 }, earned: { total: 15, used: 12, available: 3 }, compensatory: { total: 2, used: 2, available: 0 } },
  { employeeId: "EMP016", employeeName: "Swati Kulkarni", casual: { total: 12, used: 3, available: 9 }, sick: { total: 12, used: 1, available: 11 }, earned: { total: 15, used: 5, available: 10 }, compensatory: { total: 1, used: 0, available: 1 } },
  { employeeId: "EMP017", employeeName: "Karthik Bhat", casual: { total: 12, used: 2, available: 10 }, sick: { total: 12, used: 2, available: 10 }, earned: { total: 15, used: 3, available: 12 }, compensatory: { total: 4, used: 1, available: 3 } },
  { employeeId: "EMP018", employeeName: "Divya Nambiar", casual: { total: 12, used: 4, available: 8 }, sick: { total: 12, used: 0, available: 12 }, earned: { total: 15, used: 6, available: 9 }, compensatory: { total: 0, used: 0, available: 0 } },
  { employeeId: "EMP019", employeeName: "Suresh Shetty", casual: { total: 12, used: 6, available: 6 }, sick: { total: 12, used: 5, available: 7 }, earned: { total: 15, used: 9, available: 6 }, compensatory: { total: 2, used: 0, available: 2 } },
  { employeeId: "EMP020", employeeName: "Lakshmi Kamath", casual: { total: 12, used: 3, available: 9 }, sick: { total: 12, used: 1, available: 11 }, earned: { total: 15, used: 8, available: 7 }, compensatory: { total: 1, used: 1, available: 0 } },
  { employeeId: "EMP021", employeeName: "Anil Hegde", casual: { total: 12, used: 1, available: 11 }, sick: { total: 12, used: 0, available: 12 }, earned: { total: 15, used: 2, available: 13 }, compensatory: { total: 0, used: 0, available: 0 } },
  { employeeId: "EMP022", employeeName: "Malini Pai", casual: { total: 12, used: 5, available: 7 }, sick: { total: 12, used: 3, available: 9 }, earned: { total: 15, used: 7, available: 8 }, compensatory: { total: 3, used: 2, available: 1 } },
  { employeeId: "EMP023", employeeName: "Ramesh Shenoy", casual: { total: 12, used: 2, available: 10 }, sick: { total: 12, used: 1, available: 11 }, earned: { total: 15, used: 4, available: 11 }, compensatory: { total: 1, used: 0, available: 1 } },
  { employeeId: "EMP024", employeeName: "Usha Prabhu", casual: { total: 12, used: 4, available: 8 }, sick: { total: 12, used: 2, available: 10 }, earned: { total: 15, used: 6, available: 9 }, compensatory: { total: 0, used: 0, available: 0 } },
  { employeeId: "EMP025", employeeName: "Ganesh Acharya", casual: { total: 12, used: 3, available: 9 }, sick: { total: 12, used: 4, available: 8 }, earned: { total: 15, used: 5, available: 10 }, compensatory: { total: 2, used: 1, available: 1 } },
];

// Company holidays for 2025
export const mockHolidays: Holiday[] = [
  { id: "H001", date: "2025-01-26", name: "Republic Day", type: "national", isOptional: false },
  { id: "H002", date: "2025-03-14", name: "Holi", type: "national", isOptional: false },
  { id: "H003", date: "2025-03-30", name: "Ugadi", type: "regional", isOptional: true },
  { id: "H004", date: "2025-04-10", name: "Mahavir Jayanti", type: "national", isOptional: true },
  { id: "H005", date: "2025-04-14", name: "Ambedkar Jayanti", type: "national", isOptional: false },
  { id: "H006", date: "2025-04-18", name: "Good Friday", type: "national", isOptional: false },
  { id: "H007", date: "2025-05-01", name: "May Day", type: "national", isOptional: false },
  { id: "H008", date: "2025-08-15", name: "Independence Day", type: "national", isOptional: false },
  { id: "H009", date: "2025-08-27", name: "Janmashtami", type: "national", isOptional: true },
  { id: "H010", date: "2025-10-02", name: "Gandhi Jayanti", type: "national", isOptional: false },
  { id: "H011", date: "2025-10-22", name: "Dussehra", type: "national", isOptional: false },
  { id: "H012", date: "2025-11-11", name: "Diwali", type: "national", isOptional: false },
  { id: "H013", date: "2025-12-25", name: "Christmas", type: "national", isOptional: false },
];

export const mockAttendanceRecords = generateAttendanceData();
