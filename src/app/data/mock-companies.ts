export interface Company {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber: string;
  panNumber: string;
  creditLimit: number;
  paymentTerms: string;
  status: "active" | "inactive";
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  outstandingAmount: number;
  performanceScore: number;
  registrationDate: Date;
  lastOrderDate: Date;
  category: "A" | "B" | "C"; // A: High value, B: Medium, C: Low
}

export const mockCompanies: Company[] = [
  {
    id: "COMP-001",
    name: "ABC Garments Pvt Ltd",
    contactPerson: "Ramesh Sharma",
    email: "ramesh@abcgarments.com",
    phone: "+91 98765 43210",
    address: "123, Industrial Area, Phase 2",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    gstNumber: "27AABCU9603R1ZM",
    panNumber: "AABCU9603R",
    creditLimit: 5000000,
    paymentTerms: "30 Days",
    status: "active",
    totalOrders: 85,
    completedOrders: 80,
    pendingOrders: 5,
    totalRevenue: 8750000,
    outstandingAmount: 425000,
    performanceScore: 94.1,
    registrationDate: new Date("2023-01-15"),
    lastOrderDate: new Date("2026-01-20"),
    category: "A"
  },
  {
    id: "COMP-002",
    name: "XYZ Fashion House",
    contactPerson: "Priya Patel",
    email: "priya@xyzfashion.com",
    phone: "+91 98765 43211",
    address: "456, Textile Market, MG Road",
    city: "Surat",
    state: "Gujarat",
    pincode: "395001",
    gstNumber: "24AACFX1234Q1Z5",
    panNumber: "AACFX1234Q",
    creditLimit: 7500000,
    paymentTerms: "45 Days",
    status: "active",
    totalOrders: 120,
    completedOrders: 110,
    pendingOrders: 10,
    totalRevenue: 12500000,
    outstandingAmount: 245000,
    performanceScore: 91.7,
    registrationDate: new Date("2022-06-10"),
    lastOrderDate: new Date("2026-01-22"),
    category: "A"
  },
  {
    id: "COMP-003",
    name: "StyleCo Enterprises",
    contactPerson: "Amit Kumar",
    email: "amit@styleco.com",
    phone: "+91 98765 43212",
    address: "789, Fashion Street",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    gstNumber: "07AADCS2345P1ZN",
    panNumber: "AADCS2345P",
    creditLimit: 4500000,
    paymentTerms: "30 Days",
    status: "active",
    totalOrders: 95,
    completedOrders: 90,
    pendingOrders: 5,
    totalRevenue: 7250000,
    outstandingAmount: 180000,
    performanceScore: 94.7,
    registrationDate: new Date("2023-03-20"),
    lastOrderDate: new Date("2026-01-18"),
    category: "A"
  },
  {
    id: "COMP-004",
    name: "TrendWear Solutions",
    contactPerson: "Sneha Reddy",
    email: "sneha@trendwear.com",
    phone: "+91 98765 43213",
    address: "321, Apparel Hub",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    gstNumber: "29AAFTW3456R1ZP",
    panNumber: "AAFTW3456R",
    creditLimit: 3500000,
    paymentTerms: "30 Days",
    status: "active",
    totalOrders: 68,
    completedOrders: 60,
    pendingOrders: 8,
    totalRevenue: 5200000,
    outstandingAmount: 320000,
    performanceScore: 88.2,
    registrationDate: new Date("2023-08-15"),
    lastOrderDate: new Date("2026-01-15"),
    category: "B"
  },
  {
    id: "COMP-005",
    name: "Modern Textiles Ltd",
    contactPerson: "Vikram Singh",
    email: "vikram@moderntextiles.com",
    phone: "+91 98765 43214",
    address: "654, Garment District",
    city: "Ludhiana",
    state: "Punjab",
    pincode: "141001",
    gstNumber: "03AACMT4567K1ZQ",
    panNumber: "AACMT4567K",
    creditLimit: 3800000,
    paymentTerms: "45 Days",
    status: "active",
    totalOrders: 72,
    completedOrders: 70,
    pendingOrders: 2,
    totalRevenue: 6100000,
    outstandingAmount: 0,
    performanceScore: 97.2,
    registrationDate: new Date("2022-11-05"),
    lastOrderDate: new Date("2026-01-10"),
    category: "B"
  },
  {
    id: "COMP-006",
    name: "Elite Apparels",
    contactPerson: "Anjali Mehta",
    email: "anjali@eliteapparels.com",
    phone: "+91 98765 43215",
    address: "987, Trade Center",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380001",
    gstNumber: "24AAEEA5678L1ZR",
    panNumber: "AAEEA5678L",
    creditLimit: 2500000,
    paymentTerms: "30 Days",
    status: "active",
    totalOrders: 45,
    completedOrders: 42,
    pendingOrders: 3,
    totalRevenue: 3250000,
    outstandingAmount: 125000,
    performanceScore: 93.3,
    registrationDate: new Date("2024-02-10"),
    lastOrderDate: new Date("2026-01-12"),
    category: "B"
  },
  {
    id: "COMP-007",
    name: "Fashion Forward Co",
    contactPerson: "Rohit Agarwal",
    email: "rohit@fashionforward.com",
    phone: "+91 98765 43216",
    address: "147, Textile Hub",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001",
    gstNumber: "33AAFFF6789M1ZS",
    panNumber: "AAFFF6789M",
    creditLimit: 2000000,
    paymentTerms: "30 Days",
    status: "active",
    totalOrders: 38,
    completedOrders: 35,
    pendingOrders: 3,
    totalRevenue: 2850000,
    outstandingAmount: 95000,
    performanceScore: 92.1,
    registrationDate: new Date("2024-05-20"),
    lastOrderDate: new Date("2026-01-08"),
    category: "C"
  },
  {
    id: "COMP-008",
    name: "Urban Styles Pvt Ltd",
    contactPerson: "Kavita Desai",
    email: "kavita@urbanstyles.com",
    phone: "+91 98765 43217",
    address: "258, Fashion District",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    gstNumber: "27AACUS7890N1ZT",
    panNumber: "AACUS7890N",
    creditLimit: 3200000,
    paymentTerms: "45 Days",
    status: "active",
    totalOrders: 56,
    completedOrders: 52,
    pendingOrders: 4,
    totalRevenue: 4350000,
    outstandingAmount: 210000,
    performanceScore: 92.9,
    registrationDate: new Date("2023-09-12"),
    lastOrderDate: new Date("2026-01-14"),
    category: "B"
  },
  {
    id: "COMP-009",
    name: "Classic Wears",
    contactPerson: "Suresh Gupta",
    email: "suresh@classicwears.com",
    phone: "+91 98765 43218",
    address: "369, Market Road",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001",
    gstNumber: "08AACCW8901O1ZU",
    panNumber: "AACCW8901O",
    creditLimit: 1800000,
    paymentTerms: "30 Days",
    status: "active",
    totalOrders: 32,
    completedOrders: 30,
    pendingOrders: 2,
    totalRevenue: 2200000,
    outstandingAmount: 85000,
    performanceScore: 93.8,
    registrationDate: new Date("2024-07-08"),
    lastOrderDate: new Date("2026-01-05"),
    category: "C"
  },
  {
    id: "COMP-010",
    name: "Metro Fashion Hub",
    contactPerson: "Neha Kapoor",
    email: "neha@metrofashion.com",
    phone: "+91 98765 43219",
    address: "741, Commerce Street",
    city: "Kolkata",
    state: "West Bengal",
    pincode: "700001",
    gstNumber: "19AACMF9012P1ZV",
    panNumber: "AACMF9012P",
    creditLimit: 2800000,
    paymentTerms: "30 Days",
    status: "inactive",
    totalOrders: 28,
    completedOrders: 28,
    pendingOrders: 0,
    totalRevenue: 1950000,
    outstandingAmount: 0,
    performanceScore: 100,
    registrationDate: new Date("2023-12-15"),
    lastOrderDate: new Date("2025-10-20"),
    category: "C"
  },
  // Adding more companies to reach 47
  ...Array.from({ length: 37 }, (_, i) => ({
    id: `COMP-${String(i + 11).padStart(3, "0")}`,
    name: `Company ${i + 11}`,
    contactPerson: `Person ${i + 11}`,
    email: `contact${i + 11}@company${i + 11}.com`,
    phone: `+91 98765 ${43220 + i}`,
    address: `${100 + i}, Business Park`,
    city: ["Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata"][i % 5],
    state: ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "West Bengal"][i % 5],
    pincode: `${400001 + i}`,
    gstNumber: `${String(i % 30 + 1).padStart(2, "0")}AAC${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 1) % 26))}${1000 + i}Q1Z${String.fromCharCode(65 + (i % 26))}`,
    panNumber: `AAC${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(65 + ((i + 1) % 26))}${1000 + i}Q`,
    creditLimit: 1000000 + (i * 50000),
    paymentTerms: ["30 Days", "45 Days", "60 Days"][i % 3],
    status: i % 10 === 0 ? "inactive" as const : "active" as const,
    totalOrders: 10 + (i * 2),
    completedOrders: 8 + (i * 2),
    pendingOrders: i % 5,
    totalRevenue: 500000 + (i * 100000),
    outstandingAmount: i % 3 === 0 ? 0 : 50000 + (i * 5000),
    performanceScore: 85 + (i % 15),
    registrationDate: new Date(2023 + (i % 3), (i % 12), 1),
    lastOrderDate: new Date(2026, 0, 1 + (i % 25)),
    category: (["A", "B", "C"][i % 3]) as "A" | "B" | "C"
  }))
];

export const getActiveCompanies = () => {
  return mockCompanies.filter(c => c.status === "active");
};

export const getCompaniesByCategory = (category: Company["category"]) => {
  return mockCompanies.filter(c => c.category === category);
};

export const getTopPerformingCompanies = (limit: number = 10) => {
  return [...mockCompanies]
    .sort((a, b) => b.performanceScore - a.performanceScore)
    .slice(0, limit);
};

export const getTotalRevenue = () => {
  return mockCompanies.reduce((sum, c) => sum + c.totalRevenue, 0);
};

export const getTotalOutstanding = () => {
  return mockCompanies.reduce((sum, c) => sum + c.outstandingAmount, 0);
};
