export type Confidence = "high" | "medium" | "low";
export type PlanTier = "Mini" | "Medi" | "Max";

export interface SourceCitation {
  docId: string;
  page: number;
  snippet: string; // the exact sentence
  context: string; // surrounding paragraph w/ {{...}} marking the snippet
}

export interface ParameterValue {
  tier: PlanTier;
  display: string;
  numeric?: number; // for comparison bars; rupees
  confidence: Confidence;
  verified?: boolean;
  source: SourceCitation;
}

export interface Parameter {
  id: string;
  category: CategoryId;
  name: string;
  unit?: string;
  values: Record<PlanTier, ParameterValue>;
}

export type CategoryId =
  | "product"
  | "plans"
  | "coverage"
  | "eligibility"
  | "benefits"
  | "waiting"
  | "premium"
  | "exclusions";

export interface Category {
  id: CategoryId;
  name: string;
  short: string;
}

export const CATEGORIES: Category[] = [
  { id: "product",     name: "Product Info",       short: "Product" },
  { id: "plans",       name: "Plans",              short: "Plans" },
  { id: "coverage",    name: "Coverage Details",   short: "Coverage" },
  { id: "eligibility", name: "Member Eligibility", short: "Eligibility" },
  { id: "benefits",    name: "Benefits",           short: "Benefits" },
  { id: "waiting",     name: "Waiting Periods",    short: "Waiting" },
  { id: "premium",     name: "Premium & Rating",   short: "Premium" },
  { id: "exclusions",  name: "Exclusions",         short: "Exclusions" },
];

export interface SourceDoc {
  id: string;
  name: string;
  pages: number;
  type: "BRD" | "Policy" | "Rates" | "Brochure";
}

export const DOCUMENTS: SourceDoc[] = [
  { id: "brd",      name: "BRD_DIY_Health_Ver 0.11.docx",   pages: 47, type: "BRD" },
  { id: "policy",   name: "D.I.Y Health policy wording.docx", pages: 82, type: "Policy" },
  { id: "rates",    name: "DIY Rates.xlsx",                  pages: 12, type: "Rates" },
  { id: "brochure", name: "DIY Health Brochure.pdf",         pages: 8,  type: "Brochure" },
];

const c = (
  docId: string, page: number, snippet: string, context: string
): SourceCitation => ({ docId, page, snippet, context });

// helper to build a value
const v = (
  tier: PlanTier, display: string, numeric: number | undefined,
  confidence: Confidence, source: SourceCitation, verified = false
): ParameterValue => ({ tier, display, numeric, confidence, verified, source });

export const PARAMETERS: Parameter[] = [
  // ── Product Info ────────────────────────────────────────────────────────
  {
    id: "p-name", category: "product", name: "Product Name",
    values: {
      Mini: v("Mini", "D.I.Y Health Insurance", undefined, "high",
        c("brd", 1, "Product name: D.I.Y Health Insurance",
          "1. INTRODUCTION\n{{Product name: D.I.Y Health Insurance}} — an indemnity-based retail health product."), true),
      Medi: v("Medi", "D.I.Y Health Insurance", undefined, "high",
        c("brd", 1, "Product name: D.I.Y Health Insurance",
          "1. INTRODUCTION\n{{Product name: D.I.Y Health Insurance}} — an indemnity-based retail health product."), true),
      Max:  v("Max",  "D.I.Y Health Insurance", undefined, "high",
        c("brd", 1, "Product name: D.I.Y Health Insurance",
          "1. INTRODUCTION\n{{Product name: D.I.Y Health Insurance}} — an indemnity-based retail health product."), true),
    },
  },
  {
    id: "p-uin", category: "product", name: "Product UIN",
    values: {
      Mini: v("Mini", "EIC-HLT-P-V-001-25", undefined, "high",
        c("policy", 2, "UIN: EIC-HLT-P-V-001-25", "Regulatory filing — {{UIN: EIC-HLT-P-V-001-25}} approved 12-Mar-2025."), true),
      Medi: v("Medi", "EIC-HLT-P-V-001-25", undefined, "high",
        c("policy", 2, "UIN: EIC-HLT-P-V-001-25", "Regulatory filing — {{UIN: EIC-HLT-P-V-001-25}} approved 12-Mar-2025."), true),
      Max:  v("Max",  "EIC-HLT-P-V-001-25", undefined, "high",
        c("policy", 2, "UIN: EIC-HLT-P-V-001-25", "Regulatory filing — {{UIN: EIC-HLT-P-V-001-25}} approved 12-Mar-2025."), true),
    },
  },
  {
    id: "p-policy-term", category: "product", name: "Policy Term",
    values: {
      Mini: v("Mini", "1 / 2 / 3 yrs", undefined, "high",
        c("brd", 4, "Available policy terms: 1, 2 or 3 years.", "{{Available policy terms: 1, 2 or 3 years.}}")),
      Medi: v("Medi", "1 / 2 / 3 yrs", undefined, "high",
        c("brd", 4, "Available policy terms: 1, 2 or 3 years.", "{{Available policy terms: 1, 2 or 3 years.}}")),
      Max:  v("Max",  "1 / 2 / 3 yrs", undefined, "high",
        c("brd", 4, "Available policy terms: 1, 2 or 3 years.", "{{Available policy terms: 1, 2 or 3 years.}}")),
    },
  },

  // ── Plans ───────────────────────────────────────────────────────────────
  {
    id: "p-si", category: "plans", name: "Sum Insured", unit: "₹",
    values: {
      Mini: v("Mini", "₹4L – ₹5L",    500000,  "high",
        c("rates", 1, "Mini: 4L, 5L SI options.", "Sheet 1 — Plan tiers:\n{{Mini: 4L, 5L SI options.}}\nMedi: 6L, 8L, 10L. Max: 11L, 13L, 15L.")),
      Medi: v("Medi", "₹6L – ₹10L",   1000000, "high",
        c("rates", 1, "Medi: 6L, 8L, 10L.", "Sheet 1 — Plan tiers:\nMini: 4L, 5L.\n{{Medi: 6L, 8L, 10L.}}\nMax: 11L, 13L, 15L.")),
      Max:  v("Max",  "₹11L – ₹15L",  1500000, "high",
        c("rates", 1, "Max: 11L, 13L, 15L.", "Sheet 1 — Plan tiers:\nMini: 4L, 5L.\nMedi: 6L, 8L, 10L.\n{{Max: 11L, 13L, 15L.}}")),
    },
  },
  {
    id: "p-tier-code", category: "plans", name: "Plan Code",
    values: {
      Mini: v("Mini", "MINI-001", undefined, "high",
        c("brd", 6, "Mini tier code: MINI-001", "Tier codes are stable across renewals: {{Mini tier code: MINI-001}}"), true),
      Medi: v("Medi", "MEDI-001", undefined, "high",
        c("brd", 6, "Medi tier code: MEDI-001", "{{Medi tier code: MEDI-001}}"), true),
      Max:  v("Max",  "MAX-001",  undefined, "high",
        c("brd", 6, "Max tier code: MAX-001",  "{{Max tier code: MAX-001}}"), true),
    },
  },

  // ── Coverage Details ───────────────────────────────────────────────────
  {
    id: "p-room", category: "coverage", name: "Room Rent Cap", unit: "₹/day",
    values: {
      Mini: v("Mini", "Not specified", undefined, "low",
        c("brd", 14, "Room rent capping — refer rates schedule.",
          "5.2 ROOM RENT\n{{Room rent capping — refer rates schedule.}} (value not present in BRD; flagged for manual entry)")),
      Medi: v("Medi", "₹6,000 / day", 6000, "medium",
        c("rates", 3, "Medi: room rent cap ₹6,000 per day.",
          "Room rent matrix — Mini: TBD. {{Medi: room rent cap ₹6,000 per day.}} Max: actuals.")),
      Max:  v("Max",  "Actuals (no cap)", 15000, "high",
        c("policy", 22, "For Max tier, room rent is payable at actuals subject to SI.",
          "Clause 5.2.3 — {{For Max tier, room rent is payable at actuals subject to SI.}}")),
    },
  },
  {
    id: "p-hosp", category: "coverage", name: "In-patient Hospitalisation", unit: "₹",
    values: {
      Mini: v("Mini", "Up to SI",  500000,  "high",
        c("policy", 18, "Hospitalisation expenses payable up to Sum Insured.",
          "4.1 IN-PATIENT — {{Hospitalisation expenses payable up to Sum Insured.}}"), true),
      Medi: v("Medi", "Up to SI",  1000000, "high",
        c("policy", 18, "Hospitalisation expenses payable up to Sum Insured.",
          "4.1 IN-PATIENT — {{Hospitalisation expenses payable up to Sum Insured.}}"), true),
      Max:  v("Max",  "Up to SI",  1500000, "high",
        c("policy", 18, "Hospitalisation expenses payable up to Sum Insured.",
          "4.1 IN-PATIENT — {{Hospitalisation expenses payable up to Sum Insured.}}"), true),
    },
  },
  {
    id: "p-icu", category: "coverage", name: "ICU Charges", unit: "₹",
    values: {
      Mini: v("Mini", "Up to SI",  500000,  "high",
        c("policy", 19, "ICU charges payable at actuals within SI.",
          "{{ICU charges payable at actuals within SI.}}"), true),
      Medi: v("Medi", "Up to SI",  1000000, "high",
        c("policy", 19, "ICU charges payable at actuals within SI.",
          "{{ICU charges payable at actuals within SI.}}"), true),
      Max:  v("Max",  "Up to SI",  1500000, "high",
        c("policy", 19, "ICU charges payable at actuals within SI.",
          "{{ICU charges payable at actuals within SI.}}"), true),
    },
  },
  {
    id: "p-opd", category: "coverage", name: "OPD Cover", unit: "₹",
    values: {
      Mini: v("Mini", "₹3,000 (mental-illness only)", 3000, "low",
        c("brd", 21, "For SI 4L it is mental-illness OPD only, limit ambiguous.",
          "6.1 OPD\n{{For SI 4L it is mental-illness OPD only, limit ambiguous.}} Range across drafts: ₹2,000–₹5,000.")),
      Medi: v("Medi", "₹7,500", 7500, "medium",
        c("brochure", 4, "OPD up to ₹7,500 in Medi plan.",
          "Brochure pg. 4 — {{OPD up to ₹7,500 in Medi plan.}} (BRD shows ₹8,000 — conflict)")),
      Max:  v("Max",  "₹15,000", 15000, "high",
        c("policy", 31, "OPD benefit limit for Max tier is ₹15,000 per policy year.",
          "{{OPD benefit limit for Max tier is ₹15,000 per policy year.}}"), true),
    },
  },
  {
    id: "p-lasik", category: "coverage", name: "LASIK Surgery", unit: "₹",
    values: {
      Mini: v("Mini", "Excluded", 0, "low",
        c("policy", 44, "LASIK is excluded unless visual error ≥ 7.5 D.",
          "Exclusion 12 — {{LASIK is excluded unless visual error ≥ 7.5 D.}} (Brochure says ‘covered up to SI’ — conflict)")),
      Medi: v("Medi", "₹40,000", 40000, "medium",
        c("brochure", 5, "LASIK covered up to ₹40,000 if error ≥ 6 D.",
          "{{LASIK covered up to ₹40,000 if error ≥ 6 D.}}")),
      Max:  v("Max",  "Up to SI", 1500000, "medium",
        c("brochure", 5, "LASIK covered up to SI in Max plan.",
          "{{LASIK covered up to SI in Max plan.}}")),
    },
  },
  {
    id: "p-amb", category: "coverage", name: "Road Ambulance", unit: "₹",
    values: {
      Mini: v("Mini", "₹2,000 / claim", 2000, "high",
        c("policy", 25, "Ambulance reimbursed up to ₹2,000 per claim.",
          "{{Ambulance reimbursed up to ₹2,000 per claim.}}"), true),
      Medi: v("Medi", "₹5,000 / claim", 5000, "high",
        c("policy", 25, "Medi: ₹5,000 per claim ambulance.",
          "{{Medi: ₹5,000 per claim ambulance.}}"), true),
      Max:  v("Max",  "Actuals", 10000, "high",
        c("policy", 25, "Max: ambulance at actuals.",
          "{{Max: ambulance at actuals.}}"), true),
    },
  },

  // ── Eligibility ─────────────────────────────────────────────────────────
  {
    id: "p-age-min", category: "eligibility", name: "Min Entry Age",
    values: {
      Mini: v("Mini", "91 days", undefined, "high",
        c("brd", 8, "Minimum entry age: 91 days (child), 18 yrs (adult).",
          "{{Minimum entry age: 91 days (child), 18 yrs (adult).}}"), true),
      Medi: v("Medi", "91 days", undefined, "high",
        c("brd", 8, "Minimum entry age: 91 days (child), 18 yrs (adult).",
          "{{Minimum entry age: 91 days (child), 18 yrs (adult).}}"), true),
      Max:  v("Max",  "91 days", undefined, "high",
        c("brd", 8, "Minimum entry age: 91 days (child), 18 yrs (adult).",
          "{{Minimum entry age: 91 days (child), 18 yrs (adult).}}"), true),
    },
  },
  {
    id: "p-age-max", category: "eligibility", name: "Max Entry Age",
    values: {
      Mini: v("Mini", "65 yrs", undefined, "high",
        c("brd", 8, "Maximum entry age: 65 years.", "{{Maximum entry age: 65 years.}}"), true),
      Medi: v("Medi", "65 yrs", undefined, "high",
        c("brd", 8, "Maximum entry age: 65 years.", "{{Maximum entry age: 65 years.}}"), true),
      Max:  v("Max",  "70 yrs", undefined, "medium",
        c("brochure", 2, "Max plan: entry age extended to 70.", "{{Max plan: entry age extended to 70.}} (BRD still says 65 — verify)")),
    },
  },
  {
    id: "p-family", category: "eligibility", name: "Family Structure",
    values: {
      Mini: v("Mini", "1A or 1A+1C", undefined, "high",
        c("brd", 9, "Mini allows individual or single-parent + 1 child.",
          "{{Mini allows individual or single-parent + 1 child.}}"), true),
      Medi: v("Medi", "2A + 2C", undefined, "high",
        c("brd", 9, "Medi: 2 adults + up to 2 children.", "{{Medi: 2 adults + up to 2 children.}}"), true),
      Max:  v("Max",  "2A + 3C + 2P", undefined, "medium",
        c("brd", 9, "Max: floater incl. parents.", "{{Max: floater incl. parents.}} (counts not explicit in BRD)")),
    },
  },

  // ── Benefits ───────────────────────────────────────────────────────────
  {
    id: "p-ncb", category: "benefits", name: "No-Claim Bonus", unit: "%",
    values: {
      Mini: v("Mini", "10% / yr (max 50%)", 50, "high",
        c("policy", 36, "NCB: 10% per claim-free year, capped 50% of SI.",
          "{{NCB: 10% per claim-free year, capped 50% of SI.}}"), true),
      Medi: v("Medi", "20% / yr (max 100%)", 100, "high",
        c("policy", 36, "Medi NCB doubles to 20% per year up to 100%.",
          "{{Medi NCB doubles to 20% per year up to 100%.}}"), true),
      Max:  v("Max",  "50% / yr (max 200%)", 200, "medium",
        c("brochure", 6, "Max plan: super NCB 50% up to 200%.",
          "{{Max plan: super NCB 50% up to 200%.}} (Policy wording silent — verify)")),
    },
  },
  {
    id: "p-restore", category: "benefits", name: "Restoration Benefit",
    values: {
      Mini: v("Mini", "Not available", undefined, "high",
        c("brd", 18, "Restoration not offered in Mini.",
          "{{Restoration not offered in Mini.}}"), true),
      Medi: v("Medi", "100% once / yr", undefined, "high",
        c("policy", 40, "Medi: 100% SI restored once per policy year.",
          "{{Medi: 100% SI restored once per policy year.}}"), true),
      Max:  v("Max",  "Unlimited", undefined, "high",
        c("policy", 40, "Max: unlimited restorations per policy year.",
          "{{Max: unlimited restorations per policy year.}}"), true),
    },
  },
  {
    id: "p-health-checkup", category: "benefits", name: "Health Check-up", unit: "₹",
    values: {
      Mini: v("Mini", "₹500", 500, "medium",
        c("brochure", 3, "Annual check-up up to ₹500 in Mini.",
          "{{Annual check-up up to ₹500 in Mini.}}")),
      Medi: v("Medi", "₹2,000", 2000, "high",
        c("brochure", 3, "₹2,000 check-up benefit in Medi.",
          "{{₹2,000 check-up benefit in Medi.}}"), true),
      Max:  v("Max",  "₹5,000", 5000, "high",
        c("brochure", 3, "₹5,000 check-up benefit in Max.",
          "{{₹5,000 check-up benefit in Max.}}"), true),
    },
  },

  // ── Waiting Periods ───────────────────────────────────────────────────
  {
    id: "p-init-wait", category: "waiting", name: "Initial Wait",
    values: {
      Mini: v("Mini", "30 days", undefined, "high",
        c("policy", 11, "Initial waiting period: 30 days from inception.",
          "{{Initial waiting period: 30 days from inception.}}"), true),
      Medi: v("Medi", "30 days", undefined, "high",
        c("policy", 11, "Initial waiting period: 30 days from inception.",
          "{{Initial waiting period: 30 days from inception.}}"), true),
      Max:  v("Max",  "15 days", undefined, "medium",
        c("brochure", 7, "Max plan: reduced initial wait of 15 days.",
          "{{Max plan: reduced initial wait of 15 days.}} (Policy wording says 30 — conflict)")),
    },
  },
  {
    id: "p-ped", category: "waiting", name: "Pre-existing Disease",
    values: {
      Mini: v("Mini", "48 months", undefined, "high",
        c("policy", 13, "PED waiting period: 48 months continuous coverage.",
          "{{PED waiting period: 48 months continuous coverage.}}"), true),
      Medi: v("Medi", "36 months", undefined, "high",
        c("policy", 13, "Medi PED wait: 36 months.",
          "{{Medi PED wait: 36 months.}}"), true),
      Max:  v("Max",  "24 months", undefined, "high",
        c("policy", 13, "Max PED wait: 24 months.",
          "{{Max PED wait: 24 months.}}"), true),
    },
  },
  {
    id: "p-maternity-wait", category: "waiting", name: "Maternity Wait",
    values: {
      Mini: v("Mini", "Not covered", undefined, "high",
        c("brd", 26, "Maternity not covered in Mini.", "{{Maternity not covered in Mini.}}"), true),
      Medi: v("Medi", "24 months", undefined, "medium",
        c("brochure", 5, "Maternity covered after 24 months.",
          "{{Maternity covered after 24 months.}} (BRD draft says 36 — pending)")),
      Max:  v("Max",  "9 months", undefined, "high",
        c("policy", 47, "Max: maternity wait of 9 months.",
          "{{Max: maternity wait of 9 months.}}"), true),
    },
  },

  // ── Premium & Rating ──────────────────────────────────────────────────
  {
    id: "p-base-prem", category: "premium", name: "Base Premium (35 yr, 5L)", unit: "₹",
    values: {
      Mini: v("Mini", "₹5,890",  5890,  "high",
        c("rates", 4, "Mini 5L base premium: ₹5,890 (age 35).",
          "{{Mini 5L base premium: ₹5,890 (age 35).}}"), true),
      Medi: v("Medi", "₹9,400",  9400,  "high",
        c("rates", 4, "Medi 5L equivalent: ₹9,400.",
          "{{Medi 5L equivalent: ₹9,400.}}"), true),
      Max:  v("Max",  "₹14,200", 14200, "high",
        c("rates", 4, "Max 5L equivalent: ₹14,200.",
          "{{Max 5L equivalent: ₹14,200.}}"), true),
    },
  },
  {
    id: "p-zone", category: "premium", name: "Zone Loading", unit: "%",
    values: {
      Mini: v("Mini", "0% / 10% / 20%", 20, "medium",
        c("rates", 7, "Zone A 0%, Zone B 10%, Zone C 20%.",
          "{{Zone A 0%, Zone B 10%, Zone C 20%.}}")),
      Medi: v("Medi", "0% / 10% / 20%", 20, "medium",
        c("rates", 7, "Same zone matrix applies to Medi.",
          "{{Same zone matrix applies to Medi.}}")),
      Max:  v("Max",  "0% / 8% / 15%", 15, "low",
        c("rates", 7, "Max plan zone loading reduced.",
          "{{Max plan zone loading reduced.}} (numbers handwritten in draft — verify)")),
    },
  },
  {
    id: "p-discount", category: "premium", name: "Family Discount", unit: "%",
    values: {
      Mini: v("Mini", "5%",  5,  "high",
        c("rates", 9, "Family discount Mini: 5%.", "{{Family discount Mini: 5%.}}"), true),
      Medi: v("Medi", "10%", 10, "high",
        c("rates", 9, "Family discount Medi: 10%.", "{{Family discount Medi: 10%.}}"), true),
      Max:  v("Max",  "15%", 15, "high",
        c("rates", 9, "Family discount Max: 15%.", "{{Family discount Max: 15%.}}"), true),
    },
  },

  // ── Exclusions ─────────────────────────────────────────────────────────
  {
    id: "p-cosmetic", category: "exclusions", name: "Cosmetic Treatment",
    values: {
      Mini: v("Mini", "Excluded", undefined, "high",
        c("policy", 58, "Cosmetic procedures permanently excluded.",
          "{{Cosmetic procedures permanently excluded.}}"), true),
      Medi: v("Medi", "Excluded", undefined, "high",
        c("policy", 58, "Cosmetic procedures permanently excluded.",
          "{{Cosmetic procedures permanently excluded.}}"), true),
      Max:  v("Max",  "Excluded", undefined, "high",
        c("policy", 58, "Cosmetic procedures permanently excluded.",
          "{{Cosmetic procedures permanently excluded.}}"), true),
    },
  },
  {
    id: "p-experimental", category: "exclusions", name: "Experimental Treatment",
    values: {
      Mini: v("Mini", "Excluded", undefined, "high",
        c("policy", 60, "Experimental/unproven treatments excluded.",
          "{{Experimental/unproven treatments excluded.}}"), true),
      Medi: v("Medi", "Excluded", undefined, "high",
        c("policy", 60, "Experimental/unproven treatments excluded.",
          "{{Experimental/unproven treatments excluded.}}"), true),
      Max:  v("Max",  "Case-by-case", undefined, "low",
        c("brochure", 8, "Max may cover unproven on review.",
          "{{Max may cover unproven on review.}} (Policy wording contradicts — escalate)")),
    },
  },
  {
    id: "p-war", category: "exclusions", name: "War & Nuclear",
    values: {
      Mini: v("Mini", "Excluded", undefined, "high",
        c("policy", 62, "War, invasion, nuclear risks excluded.",
          "{{War, invasion, nuclear risks excluded.}}"), true),
      Medi: v("Medi", "Excluded", undefined, "high",
        c("policy", 62, "War, invasion, nuclear risks excluded.",
          "{{War, invasion, nuclear risks excluded.}}"), true),
      Max:  v("Max",  "Excluded", undefined, "high",
        c("policy", 62, "War, invasion, nuclear risks excluded.",
          "{{War, invasion, nuclear risks excluded.}}"), true),
    },
  },
];

export interface AuditIssue {
  id: string;
  severity: "blocker" | "warning";
  paramId: string;
  tier?: PlanTier;
  message: string;
  raisedAt: string; // relative
}

export const AUDIT_ISSUES: AuditIssue[] = [
  { id: "i1", severity: "blocker", paramId: "p-room",         tier: "Mini", message: "Room rent cap missing in BRD for Mini tier.",                       raisedAt: "12m ago" },
  { id: "i2", severity: "blocker", paramId: "p-lasik",        tier: "Mini", message: "Policy wording vs Brochure conflict on LASIK coverage.",            raisedAt: "1h ago" },
  { id: "i3", severity: "warning", paramId: "p-opd",          tier: "Medi", message: "OPD limit differs between BRD (₹8,000) and Brochure (₹7,500).",    raisedAt: "2h ago" },
  { id: "i4", severity: "warning", paramId: "p-init-wait",    tier: "Max",  message: "Initial wait conflict — Brochure 15d vs Policy 30d.",              raisedAt: "3h ago" },
  { id: "i5", severity: "warning", paramId: "p-experimental", tier: "Max",  message: "Experimental treatment — Brochure conflicts with Policy wording.", raisedAt: "5h ago" },
  { id: "i6", severity: "warning", paramId: "p-zone",         tier: "Max",  message: "Zone loading numbers handwritten in rates draft.",                 raisedAt: "6h ago" },
];

export const STAGES = [
  { id: 1, name: "Upload" },
  { id: 2, name: "Extract" },
  { id: 3, name: "Verify" },
  { id: 4, name: "Audit" },
  { id: 5, name: "Publish" },
] as const;

export function confidenceCounts() {
  let high = 0, medium = 0, low = 0;
  for (const p of PARAMETERS) {
    for (const tier of ["Mini","Medi","Max"] as PlanTier[]) {
      const lvl = p.values[tier].confidence;
      if (lvl === "high") high++;
      else if (lvl === "medium") medium++;
      else low++;
    }
  }
  return { high, medium, low, total: high + medium + low };
}
