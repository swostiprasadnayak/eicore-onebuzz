export interface ExtractionIssue {
  id: string;
  field: string;
  plan: string;
  confidence: number;
  message: string;
  status: "pending" | "resolved";
  source: string;
}

export interface Coverage {
  id: string;
  name: string;
  category: string;
  type: "BASE" | "ADD-ON";
  description: string;
  limitValue: string;
  limitType: "FIXED" | "PERCENTAGE";
  limitApplicability: "POLICY" | "CLAIM";
  isRequired: boolean;
  memberApplicability: "ALL" | "SELF" | "SPOUSE" | "CHILDREN" | "PARENTS";
  confidence: number;
  issues: string[];
}

export interface Plan {
  id: string;
  name: string;
  code: string;
  sumInsuredRange: string;
  sumInsuredOptions: string[];
  coverages: Coverage[];
  status: "draft" | "review" | "done";
}

export const MOCK_ISSUES: ExtractionIssue[] = [
  {
    id: "issue-1",
    field: "OPD Cover",
    plan: "Mini",
    confidence: 75,
    message: "AI extracted values for Mini but range is ambiguous in BRD.",
    status: "pending",
    source: "BRD_DIY_Health_Ver 0.11.docx",
  },
  {
    id: "issue-2",
    field: "LASIK Surgery",
    plan: "Mini",
    confidence: 64,
    message: "Conflicting values between Policy Wording and Brochure.",
    status: "pending",
    source: "D.I.Y Health policy wording.docx",
  },
  {
    id: "issue-3",
    field: "Hospitalisation Room Rent",
    plan: "Mini",
    confidence: 38,
    message: "Value missing in BRD, please verify manually.",
    status: "pending",
    source: "DIY Rates.xlsx",
  },
];

export const MOCK_COVERAGES: Coverage[] = [
  {
    id: "cov-1",
    name: "OPD Cover",
    category: "Outpatient",
    type: "BASE",
    description: "OPD treatment expenses (consultations, diagnostics, medications). For SI 4L it is mental-illness OPD only.",
    limitValue: "3000",
    limitType: "FIXED",
    limitApplicability: "POLICY",
    isRequired: true,
    memberApplicability: "ALL",
    confidence: 75,
    issues: ["issue-1"],
  },
  {
    id: "cov-2",
    name: "Hospitalisation",
    category: "Inpatient",
    type: "BASE",
    description: "In-patient hospitalisation expenses for illness or injury.",
    limitValue: "Sum Insured",
    limitType: "FIXED",
    limitApplicability: "POLICY",
    isRequired: true,
    memberApplicability: "ALL",
    confidence: 95,
    issues: [],
  },
  {
    id: "cov-3",
    name: "ICU Charges",
    category: "Inpatient",
    type: "BASE",
    description: "Intensive Care Unit charges during hospitalisation.",
    limitValue: "Actuals",
    limitType: "FIXED",
    limitApplicability: "CLAIM",
    isRequired: true,
    memberApplicability: "ALL",
    confidence: 92,
    issues: [],
  },
  {
    id: "cov-4",
    name: "Maternity (Normal)",
    category: "Maternity",
    type: "ADD-ON",
    description: "Expenses related to normal delivery hospitalisation.",
    limitValue: "25000",
    limitType: "FIXED",
    limitApplicability: "POLICY",
    isRequired: false,
    memberApplicability: "SPOUSE",
    confidence: 88,
    issues: [],
  },
];

export const MOCK_PLANS: Plan[] = [
  {
    id: "plan-mini",
    name: "Mini",
    code: "MINI-001",
    sumInsuredRange: "₹4L–₹5L",
    sumInsuredOptions: ["₹4,00,000", "₹5,00,000"],
    coverages: MOCK_COVERAGES,
    status: "review",
  },
  {
    id: "plan-medi",
    name: "Medi",
    code: "MEDI-001",
    sumInsuredRange: "₹6L–₹10L",
    sumInsuredOptions: ["₹6,00,000", "₹8,00,000", "₹10,00,000"],
    coverages: MOCK_COVERAGES,
    status: "draft",
  },
  {
    id: "plan-max",
    name: "Max",
    code: "MAX-001",
    sumInsuredRange: "₹11L–₹15L",
    sumInsuredOptions: ["₹11,00,000", "₹13,00,000", "₹15,00,000"],
    coverages: MOCK_COVERAGES,
    status: "draft",
  },
];
