export interface GeneralSettings {
  companyName: string;
  companyLogo: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  phone: string;
  email: string;
  website: string;
  fiscalYearStart: string; // MM-DD format
  fiscalYearEnd: string;
  timezone: string;
  dateFormat: string;
  timeFormat: string;
  currency: string;
  currencySymbol: string;
  currencyPosition: "before" | "after";
  numberFormat: string;
  decimalSeparator: string;
  thousandSeparator: string;
  language: string;
  gstNumber: string;
  panNumber: string;
}

export interface WorkflowSettings {
  orderApproval: {
    enabled: boolean;
    levels: number;
    autoApproveBelow: number; // amount threshold
    approvers: string[];
  };
  leaveApproval: {
    enabled: boolean;
    requireManagerApproval: boolean;
    requireHRApproval: boolean;
    autoApproveBelow: number; // days threshold
  };
  purchaseOrderApproval: {
    enabled: boolean;
    thresholdAmount: number;
    approvers: string[];
  };
  paymentApproval: {
    enabled: boolean;
    thresholdAmount: number;
    requireDualApproval: boolean;
    approvers: string[];
  };
  productionStageGates: {
    enabled: boolean;
    requireQualityCheck: boolean;
    stages: string[];
  };
}

export interface NotificationSettings {
  email: {
    enabled: boolean;
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    senderEmail: string;
    senderName: string;
    useSSL: boolean;
  };
  sms: {
    enabled: boolean;
    provider: string;
    apiKey: string;
    senderId: string;
  };
  whatsapp: {
    enabled: boolean;
    apiKey: string;
    businessNumber: string;
  };
  stockAlerts: {
    enabled: boolean;
    fabricMinimumThreshold: number;
    rawMaterialMinimumThreshold: number;
    notifyRoles: string[];
    frequency: string; // "realtime" | "daily" | "weekly"
  };
  orderDelayAlerts: {
    enabled: boolean;
    delayThresholdDays: number;
    notifyRoles: string[];
    escalateAfterDays: number;
  };
  paymentOverdueAlerts: {
    enabled: boolean;
    reminderDays: number[];
    notifyRoles: string[];
  };
}

export interface BusinessRules {
  creditLimitRules: {
    enabled: boolean;
    defaultCreditLimit: number;
    creditPeriodDays: number;
    categoryLimits: {
      premium: number;
      standard: number;
      basic: number;
    };
  };
  paymentTerms: {
    defaultTerms: string; // "30" | "45" | "60" | "90"
    advancePaymentRequired: boolean;
    advancePercentage: number;
    acceptPartialPayments: boolean;
  };
  leadTimeCalculation: {
    enabled: boolean;
    baseLeadTimeDays: number;
    additionalDaysPerUnit: number;
    bufferDays: number;
  };
  overtimeRules: {
    enabled: boolean;
    maxOvertimeHoursPerDay: number;
    maxOvertimeHoursPerMonth: number;
    requireManagerApproval: boolean;
    overtimeRate: number; // multiplier
  };
  qualityCheckpoints: {
    enabled: boolean;
    checkpoints: string[];
    mandatoryCheckpoints: string[];
  };
}

export interface IntegrationSettings {
  tally: {
    enabled: boolean;
    serverUrl: string;
    companyName: string;
    username: string;
    password: string;
    syncFrequency: string; // "realtime" | "hourly" | "daily"
  };
  quickbooks: {
    enabled: boolean;
    clientId: string;
    clientSecret: string;
    realmId: string;
    syncFrequency: string;
  };
  customApi: {
    enabled: boolean;
    endpoints: Array<{
      name: string;
      url: string;
      method: string;
      apiKey: string;
    }>;
  };
  webhooks: {
    enabled: boolean;
    webhooks: Array<{
      name: string;
      url: string;
      events: string[];
      active: boolean;
    }>;
  };
}

export interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    passwordExpiryDays: number;
    preventReuse: number; // number of previous passwords to check
  };
  sessionSettings: {
    defaultTimeout: number; // minutes
    maxConcurrentSessions: number;
    enableRememberMe: boolean;
    rememberMeDuration: number; // days
  };
  twoFactorAuth: {
    enabled: boolean;
    enforceForAllUsers: boolean;
    enforceForRoles: string[];
    method: string; // "email" | "sms" | "authenticator"
  };
  ipWhitelist: {
    enabled: boolean;
    allowedIPs: string[];
  };
  dataEncryption: {
    encryptDatabase: boolean;
    encryptBackups: boolean;
    encryptionAlgorithm: string;
  };
  auditLogging: {
    enabled: boolean;
    logRetentionDays: number;
    logSensitiveData: boolean;
  };
}

export interface BackupSettings {
  automated: {
    enabled: boolean;
    frequency: string; // "daily" | "weekly" | "monthly"
    time: string; // HH:MM format
    dayOfWeek?: string; // for weekly
    dayOfMonth?: number; // for monthly
  };
  retention: {
    keepDailyBackups: number;
    keepWeeklyBackups: number;
    keepMonthlyBackups: number;
  };
  location: {
    type: string; // "local" | "cloud" | "both"
    localPath: string;
    cloudProvider: string; // "aws" | "azure" | "google"
    cloudBucket: string;
    cloudRegion: string;
  };
  notifications: {
    notifyOnSuccess: boolean;
    notifyOnFailure: boolean;
    recipients: string[];
  };
}

export interface DefaultValues {
  measurements: {
    defaultUnit: string; // "cm" | "inch"
    defaultTolerancePlus: number;
    defaultToleranceMinus: number;
  };
  fabrics: {
    defaultFabricTypes: string[];
    defaultColors: string[];
  };
  payment: {
    defaultPaymentTerms: string;
    defaultPaymentMode: string;
    defaultTaxRate: number; // GST
    defaultIGSTRate: number;
  };
  production: {
    defaultWorkingHoursPerDay: number;
    defaultWorkingDaysPerWeek: number;
    defaultShifts: number;
  };
  inventory: {
    defaultReorderLevel: number;
    defaultMaxStockLevel: number;
    enableAutoReorder: boolean;
  };
}

// Mock settings data
export const mockGeneralSettings: GeneralSettings = {
  companyName: "Sunny Tailor Corporate Garment",
  companyLogo: "/logo.png",
  address: "123, Industrial Area, Phase 2",
  city: "Mumbai",
  state: "Maharashtra",
  country: "India",
  pincode: "400001",
  phone: "+91 22 1234 5678",
  email: "info@sunnytailor.com",
  website: "www.sunnytailor.com",
  fiscalYearStart: "04-01",
  fiscalYearEnd: "03-31",
  timezone: "Asia/Kolkata",
  dateFormat: "DD-MM-YYYY",
  timeFormat: "12-hour",
  currency: "INR",
  currencySymbol: "₹",
  currencyPosition: "before",
  numberFormat: "en-IN",
  decimalSeparator: ".",
  thousandSeparator: ",",
  language: "en",
  gstNumber: "27AABCU9603R1ZM",
  panNumber: "AABCU9603R",
};

export const mockWorkflowSettings: WorkflowSettings = {
  orderApproval: {
    enabled: true,
    levels: 2,
    autoApproveBelow: 50000,
    approvers: ["Master Manager", "Production Manager"],
  },
  leaveApproval: {
    enabled: true,
    requireManagerApproval: true,
    requireHRApproval: true,
    autoApproveBelow: 2,
  },
  purchaseOrderApproval: {
    enabled: true,
    thresholdAmount: 100000,
    approvers: ["Master Manager", "Accountant"],
  },
  paymentApproval: {
    enabled: true,
    thresholdAmount: 200000,
    requireDualApproval: true,
    approvers: ["Master Manager", "Accountant"],
  },
  productionStageGates: {
    enabled: true,
    requireQualityCheck: true,
    stages: ["Measurement", "Cutting", "Stitching", "Quality Check", "Packaging"],
  },
};

export const mockNotificationSettings: NotificationSettings = {
  email: {
    enabled: true,
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "noreply@sunnytailor.com",
    smtpPassword: "••••••••",
    senderEmail: "noreply@sunnytailor.com",
    senderName: "Sunny Tailor ERP",
    useSSL: true,
  },
  sms: {
    enabled: true,
    provider: "Twilio",
    apiKey: "••••••••",
    senderId: "SUNNY",
  },
  whatsapp: {
    enabled: false,
    apiKey: "",
    businessNumber: "",
  },
  stockAlerts: {
    enabled: true,
    fabricMinimumThreshold: 1000,
    rawMaterialMinimumThreshold: 500,
    notifyRoles: ["Master Manager", "Fabric Store", "Raw Material Store"],
    frequency: "realtime",
  },
  orderDelayAlerts: {
    enabled: true,
    delayThresholdDays: 3,
    notifyRoles: ["Master Manager", "Production Manager"],
    escalateAfterDays: 7,
  },
  paymentOverdueAlerts: {
    enabled: true,
    reminderDays: [7, 14, 30, 45],
    notifyRoles: ["Master Manager", "Accountant"],
  },
};

export const mockBusinessRules: BusinessRules = {
  creditLimitRules: {
    enabled: true,
    defaultCreditLimit: 500000,
    creditPeriodDays: 30,
    categoryLimits: {
      premium: 2000000,
      standard: 1000000,
      basic: 500000,
    },
  },
  paymentTerms: {
    defaultTerms: "30",
    advancePaymentRequired: true,
    advancePercentage: 30,
    acceptPartialPayments: true,
  },
  leadTimeCalculation: {
    enabled: true,
    baseLeadTimeDays: 7,
    additionalDaysPerUnit: 0.1,
    bufferDays: 3,
  },
  overtimeRules: {
    enabled: true,
    maxOvertimeHoursPerDay: 3,
    maxOvertimeHoursPerMonth: 50,
    requireManagerApproval: true,
    overtimeRate: 1.5,
  },
  qualityCheckpoints: {
    enabled: true,
    checkpoints: ["Measurement Verification", "Fabric Inspection", "Stitching Quality", "Final Inspection", "Packaging Check"],
    mandatoryCheckpoints: ["Measurement Verification", "Final Inspection"],
  },
};

export const mockIntegrationSettings: IntegrationSettings = {
  tally: {
    enabled: false,
    serverUrl: "",
    companyName: "",
    username: "",
    password: "",
    syncFrequency: "daily",
  },
  quickbooks: {
    enabled: false,
    clientId: "",
    clientSecret: "",
    realmId: "",
    syncFrequency: "daily",
  },
  customApi: {
    enabled: false,
    endpoints: [],
  },
  webhooks: {
    enabled: false,
    webhooks: [],
  },
};

export const mockSecuritySettings: SecuritySettings = {
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiryDays: 90,
    preventReuse: 5,
  },
  sessionSettings: {
    defaultTimeout: 30,
    maxConcurrentSessions: 3,
    enableRememberMe: true,
    rememberMeDuration: 30,
  },
  twoFactorAuth: {
    enabled: true,
    enforceForAllUsers: false,
    enforceForRoles: ["Master Manager", "HR Manager", "Accountant"],
    method: "email",
  },
  ipWhitelist: {
    enabled: false,
    allowedIPs: [],
  },
  dataEncryption: {
    encryptDatabase: true,
    encryptBackups: true,
    encryptionAlgorithm: "AES-256",
  },
  auditLogging: {
    enabled: true,
    logRetentionDays: 365,
    logSensitiveData: false,
  },
};

export const mockBackupSettings: BackupSettings = {
  automated: {
    enabled: true,
    frequency: "daily",
    time: "02:00",
    dayOfWeek: "Sunday",
    dayOfMonth: 1,
  },
  retention: {
    keepDailyBackups: 7,
    keepWeeklyBackups: 4,
    keepMonthlyBackups: 12,
  },
  location: {
    type: "both",
    localPath: "/backups/sunny-tailor",
    cloudProvider: "aws",
    cloudBucket: "sunny-tailor-backups",
    cloudRegion: "ap-south-1",
  },
  notifications: {
    notifyOnSuccess: false,
    notifyOnFailure: true,
    recipients: ["admin@sunnytailor.com"],
  },
};

export const mockDefaultValues: DefaultValues = {
  measurements: {
    defaultUnit: "cm",
    defaultTolerancePlus: 0.5,
    defaultToleranceMinus: 0.5,
  },
  fabrics: {
    defaultFabricTypes: ["Cotton", "Polyester", "Denim", "Linen", "Silk", "Wool"],
    defaultColors: ["Black", "White", "Blue", "Gray", "Beige", "Brown"],
  },
  payment: {
    defaultPaymentTerms: "30 days",
    defaultPaymentMode: "Bank Transfer",
    defaultTaxRate: 18,
    defaultIGSTRate: 18,
  },
  production: {
    defaultWorkingHoursPerDay: 8,
    defaultWorkingDaysPerWeek: 6,
    defaultShifts: 1,
  },
  inventory: {
    defaultReorderLevel: 1000,
    defaultMaxStockLevel: 10000,
    enableAutoReorder: false,
  },
};

// Timezone options
export const timezones = [
  { value: "Asia/Kolkata", label: "IST - India Standard Time (UTC+5:30)" },
  { value: "America/New_York", label: "EST - Eastern Standard Time (UTC-5)" },
  { value: "America/Los_Angeles", label: "PST - Pacific Standard Time (UTC-8)" },
  { value: "Europe/London", label: "GMT - Greenwich Mean Time (UTC+0)" },
  { value: "Europe/Paris", label: "CET - Central European Time (UTC+1)" },
  { value: "Asia/Dubai", label: "GST - Gulf Standard Time (UTC+4)" },
  { value: "Asia/Singapore", label: "SGT - Singapore Time (UTC+8)" },
  { value: "Asia/Tokyo", label: "JST - Japan Standard Time (UTC+9)" },
];

// Currency options
export const currencies = [
  { value: "INR", label: "INR - Indian Rupee", symbol: "₹" },
  { value: "USD", label: "USD - US Dollar", symbol: "$" },
  { value: "EUR", label: "EUR - Euro", symbol: "€" },
  { value: "GBP", label: "GBP - British Pound", symbol: "£" },
  { value: "AED", label: "AED - UAE Dirham", symbol: "د.إ" },
  { value: "SGD", label: "SGD - Singapore Dollar", symbol: "S$" },
];

// Language options
export const languages = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिंदी (Hindi)" },
  { value: "mr", label: "मराठी (Marathi)" },
  { value: "gu", label: "ગુજરાતી (Gujarati)" },
  { value: "ta", label: "தமிழ் (Tamil)" },
  { value: "te", label: "తెలుగు (Telugu)" },
];
