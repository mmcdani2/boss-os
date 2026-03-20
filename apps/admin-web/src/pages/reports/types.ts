export type Division = {
  id: string;
  companyId: string;
  key: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DivisionModuleRow = {
  id: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  module: {
    id: string;
    key: string;
    name: string;
    category: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type SprayFoamAreaLine = {
  id: string;
  jobLogId: string;
  lineNumber: number;
  areaDescription: string;
  jobType: string;
  foamType: string;
  squareFeet: string | null;
  thicknessInches: string | null;
  boardFeet: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SprayFoamMaterialLine = {
  id: string;
  jobLogId: string;
  areaLineId: string;
  lineNumber: number;
  foamType: string;
  manufacturer: string;
  lotNumber: string;
  setsUsed: string | null;
  theoreticalYieldPerSet: string | null;
  theoreticalTotalYield: string | null;
  actualYield: string | null;
  yieldPercent: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SprayFoamLog = {
  id: string;
  userId: string;
  companyKey: string;
  divisionKey: string | null;
  techNameSnapshot: string;
  customerName: string | null;
  jobNumber: string | null;
  jobDate: string | null;
  crewLead: string | null;
  helpersText: string | null;
  rigName: string | null;
  timeOnJob: string | null;
  ambientTempF: string | null;
  substrateTempF: string | null;
  humidityPercent: string | null;
  downtimeMinutes: number | null;
  downtimeReason: string | null;
  otherNotes: string | null;
  photosUploadedToHcp: boolean;
  notes: string | null;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  lines: SprayFoamAreaLine[];
  areaLines: SprayFoamAreaLine[];
  materialLines: SprayFoamMaterialLine[];
};

export type ReimbursementRequest = {
  id: string;
  userId: string;
  companyKey: string;
  divisionKey: string | null;
  techNameSnapshot: string;
  amountSpent: string;
  purchaseDate: string;
  vendor: string;
  category: string;
  paymentMethod: string;
  purpose: string;
  tiedToJob: boolean;
  jobNumber: string | null;
  notes: string | null;
  receiptUploaded: boolean;
  urgentReimbursementNeeded: boolean;
  status: string;
  reimbursementDate: string | null;
  reviewedAt: string | null;
  reviewedByUserId: string | null;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type ReportModuleItem = {
  key: string;
  name: string;
};
