export interface User {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  designation: string;
  reportingManager: string | null;
  status: "active" | "inactive";
  avatar?: string;
  dateOfJoining: Date;
  lastLogin: Date | null;
  loginCount: number;
  permissions: string[];
  address: string;
  city: string;
  state: string;
  pincode: string;
  emergencyContact: string;
  bloodGroup: string;
  dateOfBirth: Date;
  gender: "Male" | "Female" | "Other";
  maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
  twoFactorEnabled: boolean;
  sessionTimeout: number; // in minutes
  lastPasswordChange: Date;
  failedLoginAttempts: number;
}

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  color: string;
  bgColor: string;
  userCount: number;
  permissions: string[];
  createdAt: Date;
  isSystemRole: boolean;
}

export interface Permission {
  id: string;
  module: string;
  feature: string;
  actions: string[];
  description: string;
}

// All available permissions in the system
export const allPermissions: Permission[] = [
  {
    id: "perm-001",
    module: "Dashboard",
    feature: "Master Dashboard",
    actions: ["view", "export"],
    description: "Access to master admin dashboard"
  },
  {
    id: "perm-002",
    module: "Orders",
    feature: "Purchase Orders",
    actions: ["create", "read", "update", "delete", "approve"],
    description: "Manage purchase orders"
  },
  {
    id: "perm-003",
    module: "Orders",
    feature: "Order Status",
    actions: ["update"],
    description: "Update order status"
  },
  {
    id: "perm-004",
    module: "Companies",
    feature: "Company Management",
    actions: ["create", "read", "update", "delete"],
    description: "Manage company information"
  },
  {
    id: "perm-005",
    module: "Inventory",
    feature: "Fabric Stock",
    actions: ["read", "update"],
    description: "Manage fabric inventory"
  },
  {
    id: "perm-006",
    module: "Inventory",
    feature: "Raw Material Stock",
    actions: ["read", "update"],
    description: "Manage raw material inventory"
  },
  {
    id: "perm-007",
    module: "Measurements",
    feature: "Measurement Entry",
    actions: ["create", "read", "update"],
    description: "Enter and manage measurements"
  },
  {
    id: "perm-008",
    module: "Measurements",
    feature: "Employee Master Sheet",
    actions: ["create", "read", "update"],
    description: "Manage employee master sheets"
  },
  {
    id: "perm-009",
    module: "Production",
    feature: "Production Management",
    actions: ["read", "update"],
    description: "Manage production operations"
  },
  {
    id: "perm-010",
    module: "Dispatch",
    feature: "Dispatch Management",
    actions: ["read", "update", "approve"],
    description: "Manage dispatch operations"
  },
  {
    id: "perm-011",
    module: "HR",
    feature: "Employee Management",
    actions: ["create", "read", "update", "delete"],
    description: "Manage employee information"
  },
  {
    id: "perm-012",
    module: "HR",
    feature: "Attendance",
    actions: ["read", "update", "approve"],
    description: "Manage employee attendance"
  },
  {
    id: "perm-013",
    module: "HR",
    feature: "Leave Management",
    actions: ["read", "approve", "reject"],
    description: "Approve/reject leave applications"
  },
  {
    id: "perm-014",
    module: "HR",
    feature: "Payroll",
    actions: ["read", "update", "process"],
    description: "Process payroll"
  },
  {
    id: "perm-015",
    module: "Finance",
    feature: "Invoices",
    actions: ["create", "read", "update", "approve"],
    description: "Manage invoices"
  },
  {
    id: "perm-016",
    module: "Finance",
    feature: "Payments",
    actions: ["read", "update", "approve"],
    description: "Manage payments"
  },
  {
    id: "perm-017",
    module: "Finance",
    feature: "Expenses",
    actions: ["read", "approve"],
    description: "Approve expenses"
  },
  {
    id: "perm-018",
    module: "Reports",
    feature: "View Reports",
    actions: ["read", "export"],
    description: "View and export reports"
  },
  {
    id: "perm-019",
    module: "Reports",
    feature: "Create Reports",
    actions: ["create"],
    description: "Create custom reports"
  },
  {
    id: "perm-020",
    module: "Settings",
    feature: "System Settings",
    actions: ["read", "update"],
    description: "Manage system settings"
  },
  {
    id: "perm-021",
    module: "Settings",
    feature: "User Management",
    actions: ["create", "read", "update", "delete"],
    description: "Manage users and roles"
  },
];

// 8 Manufacturing Roles
export const roles: Role[] = [
  {
    id: "role-001",
    name: "master_manager",
    displayName: "Master Manager",
    description: "Full system access with all administrative privileges",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    userCount: 1,
    permissions: allPermissions.map(p => p.id), // All permissions
    createdAt: new Date("2023-01-01"),
    isSystemRole: true
  },
  {
    id: "role-002",
    name: "hr",
    displayName: "HR Manager",
    description: "Manage employees, attendance, leave, and payroll",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    userCount: 2,
    permissions: ["perm-001", "perm-011", "perm-012", "perm-013", "perm-014", "perm-018"],
    createdAt: new Date("2023-01-01"),
    isSystemRole: true
  },
  {
    id: "role-003",
    name: "measurement_expert",
    displayName: "Measurement Expert",
    description: "Enter and manage employee measurements",
    color: "text-green-700",
    bgColor: "bg-green-100",
    userCount: 3,
    permissions: ["perm-001", "perm-002", "perm-007", "perm-008", "perm-018"],
    createdAt: new Date("2023-01-01"),
    isSystemRole: true
  },
  {
    id: "role-004",
    name: "production_manager",
    displayName: "Production Manager",
    description: "Oversee production operations and quality",
    color: "text-orange-700",
    bgColor: "bg-orange-100",
    userCount: 3,
    permissions: ["perm-001", "perm-002", "perm-003", "perm-005", "perm-006", "perm-009", "perm-018"],
    createdAt: new Date("2023-01-01"),
    isSystemRole: true
  },
  {
    id: "role-005",
    name: "fabric_store",
    displayName: "Fabric Store Manager",
    description: "Manage fabric inventory and stock",
    color: "text-teal-700",
    bgColor: "bg-teal-100",
    userCount: 2,
    permissions: ["perm-001", "perm-002", "perm-005", "perm-018"],
    createdAt: new Date("2023-01-01"),
    isSystemRole: true
  },
  {
    id: "role-006",
    name: "raw_material_store",
    displayName: "Raw Material Store Manager",
    description: "Manage raw material inventory",
    color: "text-cyan-700",
    bgColor: "bg-cyan-100",
    userCount: 2,
    permissions: ["perm-001", "perm-002", "perm-006", "perm-018"],
    createdAt: new Date("2023-01-01"),
    isSystemRole: true
  },
  {
    id: "role-007",
    name: "dispatch",
    displayName: "Dispatch Manager",
    description: "Manage shipments and dispatch operations",
    color: "text-red-700",
    bgColor: "bg-red-100",
    userCount: 2,
    permissions: ["perm-001", "perm-002", "perm-003", "perm-010", "perm-018"],
    createdAt: new Date("2023-01-01"),
    isSystemRole: true
  },
  {
    id: "role-008",
    name: "accountant",
    displayName: "Accountant",
    description: "Manage finances, invoices, and payments",
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
    userCount: 3,
    permissions: ["perm-001", "perm-002", "perm-014", "perm-015", "perm-016", "perm-017", "perm-018", "perm-019"],
    createdAt: new Date("2023-01-01"),
    isSystemRole: true
  },
  {
    id: "role-009",
    name: "production_worker",
    displayName: "Production Worker",
    description: "View assigned work and update status",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    userCount: 7,
    permissions: ["perm-009"],
    createdAt: new Date("2023-01-01"),
    isSystemRole: false
  }
];

// 25 Mock Users
export const mockUsers: User[] = [
  {
    id: "user-001",
    employeeId: "EMP-001",
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh.kumar@sunnytailor.com",
    phone: "+91 98765 43210",
    role: "master_manager",
    department: "Management",
    designation: "Master Manager",
    reportingManager: null,
    status: "active",
    dateOfJoining: new Date("2020-01-15"),
    lastLogin: new Date("2026-01-26T08:30:00"),
    loginCount: 1547,
    permissions: allPermissions.map(p => p.id),
    address: "123, MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    emergencyContact: "+91 98765 43211",
    bloodGroup: "O+",
    dateOfBirth: new Date("1985-05-15"),
    gender: "Male",
    maritalStatus: "Married",
    twoFactorEnabled: true,
    sessionTimeout: 60,
    lastPasswordChange: new Date("2026-01-01"),
    failedLoginAttempts: 0
  },
  {
    id: "user-002",
    employeeId: "EMP-002",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@sunnytailor.com",
    phone: "+91 98765 43212",
    role: "hr",
    department: "Human Resources",
    designation: "HR Manager",
    reportingManager: "user-001",
    status: "active",
    dateOfJoining: new Date("2020-03-10"),
    lastLogin: new Date("2026-01-26T07:45:00"),
    loginCount: 1234,
    permissions: ["perm-001", "perm-011", "perm-012", "perm-013", "perm-014", "perm-018"],
    address: "456, Park Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400002",
    emergencyContact: "+91 98765 43213",
    bloodGroup: "A+",
    dateOfBirth: new Date("1988-08-22"),
    gender: "Female",
    maritalStatus: "Single",
    twoFactorEnabled: true,
    sessionTimeout: 45,
    lastPasswordChange: new Date("2025-12-15"),
    failedLoginAttempts: 0
  },
  {
    id: "user-003",
    employeeId: "EMP-003",
    firstName: "Amit",
    lastName: "Patel",
    email: "amit.patel@sunnytailor.com",
    phone: "+91 98765 43213",
    role: "measurement_expert",
    department: "Measurement",
    designation: "Senior Measurement Expert",
    reportingManager: "user-001",
    status: "active",
    dateOfJoining: new Date("2021-06-01"),
    lastLogin: new Date("2026-01-25T18:20:00"),
    loginCount: 892,
    permissions: ["perm-001", "perm-002", "perm-007", "perm-008", "perm-018"],
    address: "789, Station Road",
    city: "Surat",
    state: "Gujarat",
    pincode: "395001",
    emergencyContact: "+91 98765 43214",
    bloodGroup: "B+",
    dateOfBirth: new Date("1990-03-12"),
    gender: "Male",
    maritalStatus: "Married",
    twoFactorEnabled: false,
    sessionTimeout: 30,
    lastPasswordChange: new Date("2025-11-20"),
    failedLoginAttempts: 0
  },
  {
    id: "user-004",
    employeeId: "EMP-004",
    firstName: "Sneha",
    lastName: "Reddy",
    email: "sneha.reddy@sunnytailor.com",
    phone: "+91 98765 43214",
    role: "production_manager",
    department: "Production",
    designation: "Production Manager",
    reportingManager: "user-001",
    status: "active",
    dateOfJoining: new Date("2020-08-15"),
    lastLogin: new Date("2026-01-26T06:15:00"),
    loginCount: 1456,
    permissions: ["perm-001", "perm-002", "perm-003", "perm-005", "perm-006", "perm-009", "perm-018"],
    address: "321, Industrial Area",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    emergencyContact: "+91 98765 43215",
    bloodGroup: "AB+",
    dateOfBirth: new Date("1987-11-30"),
    gender: "Female",
    maritalStatus: "Married",
    twoFactorEnabled: true,
    sessionTimeout: 45,
    lastPasswordChange: new Date("2026-01-10"),
    failedLoginAttempts: 0
  },
  {
    id: "user-005",
    employeeId: "EMP-005",
    firstName: "Vikram",
    lastName: "Singh",
    email: "vikram.singh@sunnytailor.com",
    phone: "+91 98765 43215",
    role: "accountant",
    department: "Finance",
    designation: "Senior Accountant",
    reportingManager: "user-001",
    status: "active",
    dateOfJoining: new Date("2021-01-20"),
    lastLogin: new Date("2026-01-26T09:00:00"),
    loginCount: 1123,
    permissions: ["perm-001", "perm-002", "perm-014", "perm-015", "perm-016", "perm-017", "perm-018", "perm-019"],
    address: "654, Market Square",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    emergencyContact: "+91 98765 43216",
    bloodGroup: "O-",
    dateOfBirth: new Date("1989-07-18"),
    gender: "Male",
    maritalStatus: "Single",
    twoFactorEnabled: false,
    sessionTimeout: 30,
    lastPasswordChange: new Date("2025-12-01"),
    failedLoginAttempts: 0
  },
  {
    id: "user-006",
    employeeId: "EMP-006",
    firstName: "Kavita",
    lastName: "Desai",
    email: "kavita.desai@sunnytailor.com",
    phone: "+91 98765 43216",
    role: "fabric_store",
    department: "Inventory",
    designation: "Fabric Store Manager",
    reportingManager: "user-001",
    status: "active",
    dateOfJoining: new Date("2021-04-10"),
    lastLogin: new Date("2026-01-25T17:30:00"),
    loginCount: 678,
    permissions: ["perm-001", "perm-002", "perm-005", "perm-018"],
    address: "987, Textile Market",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380001",
    emergencyContact: "+91 98765 43217",
    bloodGroup: "A-",
    dateOfBirth: new Date("1992-02-14"),
    gender: "Female",
    maritalStatus: "Single",
    twoFactorEnabled: false,
    sessionTimeout: 30,
    lastPasswordChange: new Date("2025-10-15"),
    failedLoginAttempts: 0
  },
  {
    id: "user-007",
    employeeId: "EMP-007",
    firstName: "Rahul",
    lastName: "Verma",
    email: "rahul.verma@sunnytailor.com",
    phone: "+91 98765 43217",
    role: "dispatch",
    department: "Dispatch",
    designation: "Dispatch Manager",
    reportingManager: "user-001",
    status: "active",
    dateOfJoining: new Date("2021-09-01"),
    lastLogin: new Date("2026-01-26T05:45:00"),
    loginCount: 534,
    permissions: ["perm-001", "perm-002", "perm-003", "perm-010", "perm-018"],
    address: "147, Warehouse Road",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001",
    emergencyContact: "+91 98765 43218",
    bloodGroup: "B-",
    dateOfBirth: new Date("1991-09-25"),
    gender: "Male",
    maritalStatus: "Married",
    twoFactorEnabled: false,
    sessionTimeout: 30,
    lastPasswordChange: new Date("2025-11-01"),
    failedLoginAttempts: 0
  },
  {
    id: "user-008",
    employeeId: "EMP-008",
    firstName: "Anjali",
    lastName: "Mehta",
    email: "anjali.mehta@sunnytailor.com",
    phone: "+91 98765 43218",
    role: "hr",
    department: "Human Resources",
    designation: "HR Executive",
    reportingManager: "user-002",
    status: "active",
    dateOfJoining: new Date("2022-02-15"),
    lastLogin: new Date("2026-01-25T16:00:00"),
    loginCount: 445,
    permissions: ["perm-001", "perm-011", "perm-012", "perm-013", "perm-018"],
    address: "258, Garden Plaza",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    emergencyContact: "+91 98765 43219",
    bloodGroup: "O+",
    dateOfBirth: new Date("1993-06-08"),
    gender: "Female",
    maritalStatus: "Single",
    twoFactorEnabled: false,
    sessionTimeout: 30,
    lastPasswordChange: new Date("2025-09-20"),
    failedLoginAttempts: 0
  },
  {
    id: "user-009",
    employeeId: "EMP-009",
    firstName: "Suresh",
    lastName: "Gupta",
    email: "suresh.gupta@sunnytailor.com",
    phone: "+91 98765 43219",
    role: "measurement_expert",
    department: "Measurement",
    designation: "Measurement Expert",
    reportingManager: "user-003",
    status: "active",
    dateOfJoining: new Date("2022-05-01"),
    lastLogin: new Date("2026-01-25T14:30:00"),
    loginCount: 389,
    permissions: ["perm-001", "perm-002", "perm-007", "perm-008", "perm-018"],
    address: "369, Colony Road",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001",
    emergencyContact: "+91 98765 43220",
    bloodGroup: "A+",
    dateOfBirth: new Date("1994-12-03"),
    gender: "Male",
    maritalStatus: "Single",
    twoFactorEnabled: false,
    sessionTimeout: 30,
    lastPasswordChange: new Date("2025-08-15"),
    failedLoginAttempts: 0
  },
  {
    id: "user-010",
    employeeId: "EMP-010",
    firstName: "Neha",
    lastName: "Kapoor",
    email: "neha.kapoor@sunnytailor.com",
    phone: "+91 98765 43220",
    role: "production_manager",
    department: "Production",
    designation: "Assistant Production Manager",
    reportingManager: "user-004",
    status: "active",
    dateOfJoining: new Date("2022-07-20"),
    lastLogin: new Date("2026-01-26T07:00:00"),
    loginCount: 312,
    permissions: ["perm-001", "perm-002", "perm-003", "perm-009", "perm-018"],
    address: "741, Factory Lane",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700001",
    emergencyContact: "+91 98765 43221",
    bloodGroup: "B+",
    dateOfBirth: new Date("1995-04-17"),
    gender: "Female",
    maritalStatus: "Single",
    twoFactorEnabled: false,
    sessionTimeout: 30,
    lastPasswordChange: new Date("2025-07-10"),
    failedLoginAttempts: 0
  },
  // Adding 15 more users to reach 25
  ...Array.from({ length: 15 }, (_, i) => {
    const roleOptions = ["production_worker", "measurement_expert", "accountant", "fabric_store", "raw_material_store", "dispatch", "production_manager"];
    const selectedRole = roleOptions[i % roleOptions.length];
    const roleData = roles.find(r => r.name === selectedRole);
    
    return {
      id: `user-${String(i + 11).padStart(3, "0")}`,
      employeeId: `EMP-${String(i + 11).padStart(3, "0")}`,
      firstName: ["Ravi", "Sunita", "Karan", "Pooja", "Manoj", "Deepa", "Arjun", "Meera", "Sanjay", "Rekha", "Vivek", "Nisha", "Anil", "Geeta", "Ramesh"][i],
      lastName: ["Shah", "Joshi", "Nair", "Iyer", "Pillai", "Menon", "Rao", "Chopra", "Bhat", "Kulkarni", "Agarwal", "Bansal", "Malhotra", "Saxena", "Tiwari"][i],
      email: `employee${i + 11}@sunnytailor.com`,
      phone: `+91 98765 ${43221 + i}`,
      role: selectedRole,
      department: ["Production", "Measurement", "Finance", "Inventory", "Inventory", "Dispatch", "Production"][i % 7],
      designation: ["Worker", "Expert", "Accountant", "Manager", "Manager", "Executive", "Supervisor"][i % 7],
      reportingManager: ["user-004", "user-003", "user-005", "user-006", "user-006", "user-007", "user-004"][i % 7],
      status: i % 8 === 0 ? "inactive" as const : "active" as const,
      dateOfJoining: new Date(2022 + (i % 3), (i % 12), 1 + i),
      lastLogin: i % 8 === 0 ? null : new Date(2026, 0, 20 + (i % 6), 8 + (i % 12), 30),
      loginCount: 50 + (i * 25),
      permissions: roleData?.permissions || [],
      address: `${100 + i}, Street ${i + 1}`,
      city: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Pune", "Ahmedabad"][i % 7],
      state: ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "West Bengal", "Maharashtra", "Gujarat"][i % 7],
      pincode: `${400001 + i}`,
      emergencyContact: `+91 98765 ${43235 + i}`,
      bloodGroup: ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"][i % 8],
      dateOfBirth: new Date(1990 + (i % 10), (i % 12), 1 + (i % 28)),
      gender: (i % 2 === 0 ? "Male" : "Female") as "Male" | "Female",
      maritalStatus: (i % 3 === 0 ? "Married" : "Single") as "Single" | "Married",
      twoFactorEnabled: false,
      sessionTimeout: 30,
      lastPasswordChange: new Date(2025, 6 + (i % 6), 1 + i),
      failedLoginAttempts: 0
    };
  })
];

// Helper functions
export const getUsersByRole = (roleName: string) => {
  return mockUsers.filter(u => u.role === roleName);
};

export const getActiveUsers = () => {
  return mockUsers.filter(u => u.status === "active");
};

export const getInactiveUsers = () => {
  return mockUsers.filter(u => u.status === "inactive");
};

export const getUserById = (userId: string) => {
  return mockUsers.find(u => u.id === userId);
};

export const getRoleById = (roleId: string) => {
  return roles.find(r => r.id === roleId);
};

export const getRoleByName = (roleName: string) => {
  return roles.find(r => r.name === roleName);
};

export const getPermissionsByRole = (roleName: string) => {
  const role = getRoleByName(roleName);
  return role ? allPermissions.filter(p => role.permissions.includes(p.id)) : [];
};
