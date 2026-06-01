import React, { useState } from "react";
import {
  ChevronDown, ChevronRight, ChevronUp, ExternalLink, Search, Filter,
  AlertCircle, AlertTriangle, FileText, Trash2, ArrowRight,
  CheckCircle2, Clock, Maximize2, Plus, Check, GitBranch, MoreHorizontal, X,
  Sparkles, Activity, Layers,
} from "lucide-react";

// ─── Design tokens (refined to match new Figma) ──────────────────────────────
const C = {
  brand: "#047857", brandMid: "#059669", brandLight: "#10b981", brandTint: "#d1fae5",
  ink: "#0f172a", ink2: "#1f2937",
  text: "#374151", text2: "#6b7280", text3: "#9ca3af",
  border: "#e5e7eb", borderStrong: "#d1d5db", borderSubtle: "#f3f4f6",
  surf: "#ffffff", surf2: "#f9fafb", surf3: "#f3f4f6",
  amber: "#f59e0b", amberLight: "#fef3c7", amberDark: "#92400e",
  red: "#ef4444", redLight: "#fee2e2", redDark: "#991b1b",
  success: "#10b981", successLight: "#d1fae5", successDark: "#065f46",
};

const FONT = "Inter, system-ui, -apple-system, sans-serif";

// ─── Data ────────────────────────────────────────────────────────────────────
type StageState = "done" | "active" | "todo";

const STAGES: { label: string; state: StageState }[] = [
  { label: "Upload",  state: "done" },
  { label: "Extract", state: "done" },
  { label: "Verify",  state: "active" },
  { label: "Audit",   state: "todo" },
  { label: "Publish", state: "todo" },
];

const TOP_TABS = ["Overview", "Basic Details", "Questions", "Exclusions"];

const SOURCES = [
  { label: "BRD v5.4",        pages: "64p" },
  { label: "Policy Wording",  pages: "38p" },
  { label: "Rate Card 2025",  pages: "12p" },
  { label: "Proposal Form",   pages: "6p"  },
];

// Deterministic 155-cell heatmap
const FIELD_CELLS: ("high" | "medium" | "low")[] = (() => {
  let seed = 7;
  const rng = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  return Array.from({ length: 155 }, () => {
    const r = rng();
    return r > 0.93 ? "low" : r > 0.78 ? "medium" : "high";
  });
})();
const CELL_COLOR = { high: C.brandLight, medium: C.amber, low: C.red };

type Status = "ok" | "amber" | "red";
const STATUS_DOT: Record<Status, string> = { ok: C.brand, amber: C.amber, red: C.red };

type PlanItem = { label: string; count: number; status: Status };
const planItems = (overrides: Partial<Record<string, Status>> = {}): PlanItem[] => [
  { label: "Plan Limits",    count: 1,  status: overrides["Plan Limits"]    ?? "amber" },
  { label: "Member Details", count: 6,  status: overrides["Member Details"] ?? "ok" },
  { label: "Premium Raters", count: 3,  status: overrides["Premium Raters"] ?? "amber" },
  { label: "Coverages",      count: 37, status: overrides["Coverages"]      ?? "ok" },
];

const PLANS = [
  { name: "Mini", items: planItems({ Coverages: "red" }) },
  { name: "Medi", items: planItems() },
  { name: "Max",  items: planItems() },
];

const TREE_NODES = [
  { name: "Coverages",      count: 12, progress: [0.78, 0.18, 0.04], expanded: true,  children: [
      { name: "In-patient Hospitalisation", verified: true },
      { name: "ICU Charges",                verified: true },
      { name: "Room Rent Cap",              verified: false },
      { name: "OPD Cover",                  verified: false },
    ]},
  { name: "Plan Limits",    count: 5,  progress: [1, 0, 0],         expanded: false },
  { name: "Plan Limits",    count: 5,  progress: [1, 0, 0],         expanded: false },
  { name: "Premium Raters", count: 12, progress: [0.84, 0.10, 0.06], expanded: false },
];

type FeedItem = { kind: "blocker" | "warning"; tier: string; time: string; title: string };
const FEED: FeedItem[] = [
  { kind: "blocker", tier: "Mini", time: "12m ago", title: "Room rent cap missing in BRD for Mini tier." },
  { kind: "blocker", tier: "Mini", time: "1h ago",  title: "Policy wording vs Brochure conflict on LASIK coverage." },
  { kind: "warning", tier: "Medi", time: "2h ago",  title: "OPD limit differs between BRD (₹8,000) and Brochure (₹7,500)." },
  { kind: "warning", tier: "Max",  time: "3h ago",  title: "Initial wait conflict — Brochure 15d vs Policy 30d." },
  { kind: "warning", tier: "Max",  time: "5h ago",  title: "Experimental treatment — Brochure conflicts with Policy wording." },
  { kind: "warning", tier: "Max",  time: "6h ago",  title: "Zone loading numbers handwritten in rates draft." },
];

type ExtractSection = { name: string; pct: number; rows?: { label: string; value: string }[] };
const EXTRACT_SECTIONS: ExtractSection[] = [
  { name: "Product Information", pct: 92 },
  { name: "Plans", pct: 92, rows: [
    { label: "Mini", value: "Entry-level plan with sum insured of Rs.4L or Rs.5L." },
    { label: "Medi", value: "Mid-tier plan with sum insured of Rs.10L or Rs.15L." },
    { label: "Max",  value: "Top-tier plan with sum insured up to Rs.50L." },
  ]},
  { name: "Coverage Details",   pct: 92 },
  { name: "Member Eligibility", pct: 93 },
  { name: "Benefits & Covers",  pct: 89 },
  { name: "Risk Factors",       pct: 91 },
];

const DOCS = [
  { name: "BRD_DIY_Health_Ver0.11.docx",         size: "5.4 MB" },
  { name: "D.I.Y Health policy wording.docx",    size: "587.9 KB" },
  { name: "DIY Proposal Form.docx",              size: "113.8 KB" },
  { name: "DIY Rates.xlsx",                      size: "28.0 KB" },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function UnifiedBuilder({ onNext, onOpenTree }: { onNext: () => void; onOpenTree: () => void }) {
  const [rightTab, setRightTab] = useState<"tree" | "issues" | "data" | "document">("tree");
  const [activeTier, setActiveTier] = useState("Mini");
  const [topTab, setTopTab] = useState("Overview");
  const [sourceIdx, setSourceIdx] = useState(2);
  const [needsReviewOnly, setNeedsReviewOnly] = useState(false);

  return (
    <div style={{
      margin: "-24px -32px",
      height: "calc(100% + 48px)",
      display: "flex", flexDirection: "column",
      background: C.surf2, overflow: "hidden",
      fontFamily: FONT,
    }}>
      <TopBar onNext={onNext} activeTab={topTab} setActiveTab={setTopTab} />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <main style={{
          flex: 1, overflowY: "auto",
          padding: "16px 20px 20px",
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          <ExtractionHealthCard
            sourceIdx={sourceIdx} setSourceIdx={setSourceIdx}
            needsReviewOnly={needsReviewOnly} setNeedsReviewOnly={setNeedsReviewOnly}
          />
          <FieldMapCard />
          <PlanVariantsGrid onOpenTree={onOpenTree} onNext={onNext} />
        </main>
        <RightRail tab={rightTab} setTab={setRightTab} activeTier={activeTier} setActiveTier={setActiveTier} />
      </div>
    </div>
  );
}

// ─── Top header bar ───────────────────────────────────────────────────────────
function TopBar({ onNext, activeTab, setActiveTab }: { onNext: () => void; activeTab: string; setActiveTab: (t: string) => void }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "10px 20px",
      borderBottom: `1px solid ${C.border}`,
      background: C.surf,
      flexShrink: 0,
      minHeight: 56,
    }}>
      {/* Avatar + product */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: C.brandTint, color: C.brand,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 700,
          flexShrink: 0,
        }}>E</div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, margin: 0, lineHeight: 1.2, whiteSpace: "nowrap" }}>D.I.Y Health Insurance</p>
          <p style={{ fontSize: 11, color: C.text2, margin: "2px 0 0", lineHeight: 1.2, whiteSpace: "nowrap" }}>Health · UIN EIC-HLT-P-V-001-25</p>
        </div>
      </div>

      {/* Stage chips */}
      <div style={{ display: "flex", alignItems: "center", marginLeft: 8 }}>
        {STAGES.map((s, i) => (
          <React.Fragment key={s.label}>
            <StageChip stage={s} />
            {i < STAGES.length - 1 && <div style={{ width: 18, height: 1, background: C.border, margin: "0 6px" }} />}
          </React.Fragment>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, padding: 3, background: C.surf2, borderRadius: 7, border: `1px solid ${C.border}` }}>
        {TOP_TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: "5px 11px", borderRadius: 5,
            background: activeTab === t ? C.surf : "transparent",
            color: activeTab === t ? C.ink : C.text2,
            fontSize: 12, fontWeight: 600,
            border: "none", cursor: "pointer",
            boxShadow: activeTab === t ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
            fontFamily: FONT,
          }}>{t}</button>
        ))}
      </div>

      {/* Submit */}
      <button onClick={onNext} style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "7px 14px", borderRadius: 7,
        background: C.brand, color: "#fff",
        fontSize: 12.5, fontWeight: 600,
        border: "none", cursor: "pointer",
        fontFamily: FONT,
      }}>Submit configuration <ArrowRight size={13} /></button>

      <button style={{
        width: 32, height: 32, borderRadius: 7,
        background: "transparent", color: C.text2,
        display: "flex", alignItems: "center", justifyContent: "center",
        border: `1px solid ${C.border}`, cursor: "pointer",
      }}><Trash2 size={13} /></button>
    </div>
  );
}

function StageChip({ stage }: { stage: { label: string; state: StageState } }) {
  const { label, state } = stage;
  const done = state === "done";
  const active = state === "active";
  const color = done ? C.brand : active ? C.amberDark : C.text3;
  const bg = done ? C.brandTint : active ? C.amberLight : "transparent";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{
        width: 16, height: 16, borderRadius: "50%",
        background: done ? C.brand : active ? C.amber : "transparent",
        border: state === "todo" ? `1.5px solid ${C.borderStrong}` : "none",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {done && <Check size={9} color="#fff" strokeWidth={3.5} />}
        {active && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />}
      </div>
      <span style={{
        fontSize: 12,
        fontWeight: active ? 700 : 500,
        color,
        fontFamily: FONT,
      }}>{label}</span>
    </div>
  );
}

// ─── Extraction Health Card ───────────────────────────────────────────────────
function ExtractionHealthCard({
  sourceIdx, setSourceIdx, needsReviewOnly, setNeedsReviewOnly,
}: { sourceIdx: number; setSourceIdx: (i: number) => void; needsReviewOnly: boolean; setNeedsReviewOnly: (v: boolean) => void }) {
  const HEALTH_SCORE = 89;
  const HIGH = 124, MED = 40, LOW = 15;
  const total = HIGH + MED + LOW;
  const highPct = (HIGH / total) * 100;
  const medPct  = (MED / total) * 100;

  return (
    <div style={{
      background: C.surf,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: "16px 18px",
    }}>
      {/* Top row: label + timestamp */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <p style={{ fontSize: 10.5, fontWeight: 700, color: C.text2, letterSpacing: "0.06em", margin: 0, textTransform: "uppercase" }}>
          EXTRACTION HEALTH
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: C.text2 }}>
          <Clock size={11} /> Updated 4 min ago
        </div>
      </div>

      {/* Title row + Healthy pill */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <h2 style={{
          fontSize: 22, fontWeight: 700, color: C.ink,
          margin: 0, letterSpacing: "-0.015em",
          fontFamily: FONT,
        }}>
          D.I.Y Health Insurance
        </h2>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "4px 11px", borderRadius: 100,
          background: C.successLight, border: `1px solid ${C.brand}33`,
          flexShrink: 0,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.brand }} />
          <span style={{ fontSize: 11.5, fontWeight: 700, color: C.successDark }}>89% Healthy</span>
        </div>
      </div>

      {/* Subtitle */}
      <p style={{ fontSize: 12, color: C.text2, margin: "0 0 14px", lineHeight: 1.5 }}>
        Health · Underwriting · UIN EIC-HLT-P-V-001-25 · 79 fields, 4 sources
      </p>

      {/* Health bar with confidence breakdown */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.brand }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: C.ink }}>{HIGH}</span>
            <span style={{ fontSize: 11.5, color: C.text2 }}>High</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.amber }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: C.ink }}>{MED}</span>
            <span style={{ fontSize: 11.5, color: C.text2 }}>Medium</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.red }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: C.ink }}>{LOW}</span>
            <span style={{ fontSize: 11.5, color: C.text2 }}>Low</span>
          </div>
        </div>

        {/* Stacked horizontal bar */}
        <div style={{
          display: "flex", height: 8, borderRadius: 100,
          overflow: "hidden", background: C.borderSubtle,
        }}>
          <div style={{ width: `${highPct}%`, background: C.brand }} />
          <div style={{ width: `${medPct}%`, background: C.amber }} />
          <div style={{ flex: 1, background: C.red }} />
        </div>
      </div>

      {/* Source row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11.5, color: C.text2, fontWeight: 500 }}>Source:</span>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {SOURCES.map((s, i) => {
            const active = i === sourceIdx;
            return (
              <button key={s.label} onClick={() => setSourceIdx(i)} style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "4px 9px", borderRadius: 6,
                background: active ? C.successLight : C.surf,
                color: active ? C.successDark : C.ink,
                border: `1px solid ${active ? C.brand + "55" : C.border}`,
                fontSize: 11, fontWeight: 600,
                cursor: "pointer",
                fontFamily: FONT,
              }}>
                <FileText size={10} />
                {s.label}
                <span style={{ color: active ? C.brand : C.text3, fontWeight: 500, marginLeft: 1 }}>· {s.pages}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search + filter */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 7,
          padding: "7px 11px", background: C.surf2,
          border: `1px solid ${C.border}`, borderRadius: 7,
        }}>
          <Search size={13} color={C.text3} />
          <input placeholder="Find a parameter" style={{
            flex: 1, border: "none", background: "transparent", outline: "none",
            fontSize: 12.5, color: C.ink, fontFamily: FONT,
          }} />
        </div>
        <button onClick={() => setNeedsReviewOnly(!needsReviewOnly)} style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "7px 11px", borderRadius: 7,
          background: needsReviewOnly ? C.successLight : C.surf,
          color: needsReviewOnly ? C.successDark : C.text2,
          border: `1px solid ${needsReviewOnly ? C.brand + "55" : C.border}`,
          fontSize: 11.5, fontWeight: 600,
          cursor: "pointer", whiteSpace: "nowrap",
          fontFamily: FONT,
        }}>
          <Filter size={11} /> Needs review only
        </button>
      </div>
    </div>
  );
}

// ─── Field Map Card ──────────────────────────────────────────────────────────
function FieldMapCard() {
  return (
    <div style={{
      background: C.surf,
      border: `1px solid ${C.border}`,
      borderRadius: 12,
      padding: "14px 18px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 10.5, fontWeight: 700, color: C.text2, letterSpacing: "0.06em", margin: "0 0 3px", textTransform: "uppercase" }}>
            FIELD MAP
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>89%</span>
            <span style={{ fontSize: 12, color: C.text2 }}>extraction health</span>
            <ChevronDown size={13} color={C.text2} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LegendDot color={C.brandLight} label="High" />
          <LegendDot color={C.amber} label="Medium" />
          <LegendDot color={C.red} label="Low" />
          <button style={{ background: "transparent", border: "none", cursor: "pointer", color: C.text2, display: "flex", padding: 0 }}>
            <Maximize2 size={12} />
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(31, 1fr)", gap: 2.5 }}>
        {FIELD_CELLS.map((c, i) => (
          <div key={i} style={{
            aspectRatio: "1",
            borderRadius: 2.5,
            background: CELL_COLOR[c],
          }} />
        ))}
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
      <span style={{ fontSize: 11, color: C.text2, fontWeight: 500 }}>{label}</span>
    </div>
  );
}

// ─── Plan Variants Grid ──────────────────────────────────────────────────────
function PlanVariantsGrid({ onOpenTree, onNext }: { onOpenTree: () => void; onNext: () => void }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Plan Variants</span>
          <span style={{ fontSize: 12, color: C.text2, marginLeft: 5 }}>· 3 fields</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ display: "flex", gap: 2, width: 70, height: 5, borderRadius: 100, overflow: "hidden" }}>
            <div style={{ flex: 0.62, background: C.brand }} />
            <div style={{ flex: 0.23, background: C.amber }} />
            <div style={{ flex: 0.15, background: C.red }} />
          </div>
          <span style={{ fontSize: 11.5, color: C.text2, fontWeight: 500 }}>77% quality</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {PLANS.map(p => <PlanCard key={p.name} plan={p} onOpen={onOpenTree} />)}
        <AddPlanCard />
      </div>

      {/* Bottom action bar */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
        <button onClick={onOpenTree} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "8px 14px", borderRadius: 7,
          background: C.surf, color: C.ink,
          border: `1px solid ${C.borderStrong}`,
          fontSize: 12.5, fontWeight: 600,
          cursor: "pointer", fontFamily: FONT,
        }}>
          <GitBranch size={13} /> Tree Mode
        </button>
        <button onClick={onNext} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "8px 14px", borderRadius: 7,
          background: C.brand, color: "#fff",
          border: "none",
          fontSize: 12.5, fontWeight: 600,
          cursor: "pointer", fontFamily: FONT,
        }}>
          Continue verifying <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

function PlanCard({ plan, onOpen }: { plan: typeof PLANS[number]; onOpen: () => void }) {
  return (
    <button onClick={onOpen} style={{
      background: C.surf,
      border: `1px solid ${C.border}`,
      borderRadius: 10,
      padding: 14,
      cursor: "pointer",
      textAlign: "left",
      display: "flex", flexDirection: "column", gap: 10,
      fontFamily: FONT,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: C.ink, margin: 0 }}>{plan.name}</p>
        <ExternalLink size={12} color={C.text2} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {plan.items.map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: STATUS_DOT[item.status] }} />
              <span style={{ fontSize: 12, color: C.ink }}>{item.label}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>{item.count}</span>
          </div>
        ))}
      </div>
    </button>
  );
}

function AddPlanCard() {
  return (
    <button style={{
      background: C.surf2,
      border: `1.5px dashed ${C.borderStrong}`,
      borderRadius: 10,
      padding: 14,
      cursor: "pointer",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
      fontFamily: FONT,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: C.brandTint,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Plus size={16} color={C.brand} />
      </div>
      <p style={{ fontSize: 12.5, fontWeight: 600, color: C.ink, margin: 0 }}>Add Plan</p>
      <p style={{ fontSize: 11, color: C.text2, margin: 0, textAlign: "center" }}>Create a new plan variant</p>
    </button>
  );
}

// ─── Right Rail ──────────────────────────────────────────────────────────────
type RightTab = "tree" | "issues" | "data" | "document";

function RightRail({ tab, setTab, activeTier, setActiveTier }: {
  tab: RightTab; setTab: (t: RightTab) => void;
  activeTier: string; setActiveTier: (t: string) => void;
}) {
  const tabs: { id: RightTab; label: string; Icon: typeof GitBranch }[] = [
    { id: "tree",     label: "Tree",           Icon: GitBranch    },
    { id: "issues",   label: "Issues",         Icon: AlertTriangle },
    { id: "data",     label: "Data Extracted", Icon: Layers       },
    { id: "document", label: "Document",       Icon: FileText     },
  ];

  return (
    <aside style={{
      width: 340, flexShrink: 0,
      borderLeft: `1px solid ${C.border}`,
      background: C.surf,
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      fontFamily: FONT,
    }}>
      <div style={{ display: "flex", padding: "10px 12px 0", borderBottom: `1px solid ${C.border}`, gap: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "8px 8px 10px",
            background: "transparent",
            color: tab === t.id ? C.brand : C.text2,
            fontSize: 11.5, fontWeight: 600,
            border: "none", cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 4,
            whiteSpace: "nowrap",
            borderBottom: `2px solid ${tab === t.id ? C.brand : "transparent"}`,
            marginBottom: -1,
            fontFamily: FONT,
            flex: 1,
            justifyContent: "center",
          }}><t.Icon size={11} /> {t.label}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "tree"     && <TreeTabContent     activeTier={activeTier} setActiveTier={setActiveTier} />}
        {tab === "issues"   && <IssuesTabContent />}
        {tab === "data"     && <DataTabContent />}
        {tab === "document" && <DocumentTabContent />}
      </div>
    </aside>
  );
}

function TreeTabContent({ activeTier, setActiveTier }: { activeTier: string; setActiveTier: (t: string) => void }) {
  return (
    <div style={{ padding: "14px 14px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <p style={{ fontSize: 10.5, fontWeight: 700, color: C.text2, letterSpacing: "0.06em", margin: "0 0 8px", textTransform: "uppercase" }}>
          PLAN VARIANTS
        </p>
        <div style={{ display: "flex", gap: 4, padding: 3, background: C.surf2, borderRadius: 7, border: `1px solid ${C.border}` }}>
          {["Mini", "Medi", "Max"].map(t => (
            <button key={t} onClick={() => setActiveTier(t)} style={{
              flex: 1, padding: "5px 0", borderRadius: 5,
              background: activeTier === t ? C.surf : "transparent",
              color: C.ink,
              fontSize: 11.5, fontWeight: 600,
              border: "none", cursor: "pointer",
              boxShadow: activeTier === t ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5,
              fontFamily: FONT,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: t === "Mini" ? C.brand : t === "Medi" ? C.amber : C.red }} />
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        background: C.surf,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        padding: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.brand }} />
            <span style={{ fontSize: 10.5, fontWeight: 700, color: C.ink, letterSpacing: "0.05em" }}>{activeTier.toUpperCase()} STRUCTURE</span>
            <span style={{ fontSize: 10.5, color: C.text2 }}>· 26 fields</span>
          </div>
          <button style={{ background: "transparent", border: "none", cursor: "pointer", color: C.text2, display: "flex", padding: 0 }}>
            <Maximize2 size={11} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {TREE_NODES.map((n, i) => <TreeNode key={i} node={n} />)}
        </div>
      </div>

      <ActivityFeedSection />
    </div>
  );
}

function TreeNode({ node }: { node: typeof TREE_NODES[number] }) {
  return (
    <div>
      <div style={{
        background: C.surf2,
        border: `1px solid ${C.border}`,
        borderRadius: 7,
        padding: "8px 10px",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.brand, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: C.ink }}>{node.name}</span>
          <span style={{ fontSize: 10.5, color: C.text2 }}>{node.count} fields</span>
        </div>
        <div style={{ display: "flex", gap: 1, width: 50, height: 4, borderRadius: 100, overflow: "hidden", flexShrink: 0 }}>
          <div style={{ flex: node.progress[0], background: C.brand }} />
          {node.progress[1] > 0 && <div style={{ flex: node.progress[1], background: C.amber }} />}
          {node.progress[2] > 0 && <div style={{ flex: node.progress[2], background: C.red }} />}
        </div>
        {node.expanded ? <ChevronDown size={11} color={C.text2} /> : <ChevronRight size={11} color={C.text2} />}
      </div>

      {node.expanded && node.children && (
        <div style={{ paddingLeft: 14, marginTop: 4, display: "flex", flexDirection: "column", gap: 3 }}>
          {node.children.map((ch, i) => (
            <div key={i} style={{
              padding: "5px 8px",
              fontSize: 11, color: C.text,
              display: "flex", alignItems: "center", gap: 5,
              borderLeft: `1px solid ${C.border}`, marginLeft: 4, paddingLeft: 9,
            }}>
              {ch.verified
                ? <CheckCircle2 size={9} color={C.brand} />
                : <div style={{ width: 5, height: 5, borderRadius: "50%", border: `1px solid ${C.text3}` }} />
              }
              {ch.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActivityFeedSection() {
  return (
    <div>
      <p style={{ fontSize: 10.5, fontWeight: 700, color: C.text2, letterSpacing: "0.06em", margin: "0 0 10px", textTransform: "uppercase" }}>
        ACTIVITY FEED
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {FEED.map((f, i) => <FeedItemRow key={i} item={f} />)}
      </div>
    </div>
  );
}

function FeedItemRow({ item }: { item: FeedItem }) {
  const isBlocker = item.kind === "blocker";
  const color = isBlocker ? C.red : C.amber;
  return (
    <div style={{ display: "flex", gap: 9 }}>
      <div style={{
        width: 14, height: 14, borderRadius: "50%",
        border: `1.5px solid ${color}`, background: "transparent",
        flexShrink: 0, marginTop: 2,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.03em" }}>
            {item.kind} <span style={{ color: C.text2, fontWeight: 500 }}>· {item.tier}</span>
          </span>
          <span style={{ fontSize: 10, color: C.text3 }}>{item.time}</span>
        </div>
        <p style={{ fontSize: 11.5, color: C.ink, margin: "0 0 5px", lineHeight: 1.4 }}>{item.title}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ background: "transparent", border: "none", color: C.brand, fontSize: 10.5, fontWeight: 600, padding: 0, cursor: "pointer", fontFamily: FONT }}>Open parameter</button>
          <button style={{ background: "transparent", border: "none", color: C.text2, fontSize: 10.5, fontWeight: 600, padding: 0, cursor: "pointer", fontFamily: FONT }}>Resolve</button>
        </div>
      </div>
    </div>
  );
}

function IssuesTabContent() {
  return (
    <div style={{ padding: "14px 14px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <p style={{ fontSize: 10.5, fontWeight: 700, color: C.text2, letterSpacing: "0.06em", margin: "0 0 8px", textTransform: "uppercase" }}>AUDIT</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <StatBox label="Blockers" value="2" color={C.red} />
          <StatBox label="Open" value="6" color={C.ink} />
        </div>
      </div>
      <ActivityFeedSection />
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ padding: "12px 14px", border: `1px solid ${C.border}`, borderRadius: 8, background: C.surf2 }}>
      <p style={{ fontSize: 11, color: C.text2, margin: "0 0 4px", fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 700, color, margin: 0, lineHeight: 1 }}>{value}</p>
    </div>
  );
}

function DataTabContent() {
  const [openIdx, setOpenIdx] = useState(1);
  return (
    <div style={{ padding: "14px 14px" }}>
      <p style={{ fontSize: 10.5, fontWeight: 700, color: C.text2, letterSpacing: "0.06em", margin: "0 0 10px", textTransform: "uppercase" }}>DATA EXTRACTED</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {EXTRACT_SECTIONS.map((s, i) => (
          <DataSection key={i} section={s} expanded={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? -1 : i)} />
        ))}
      </div>
    </div>
  );
}

function DataSection({ section, expanded, onToggle }: { section: ExtractSection; expanded: boolean; onToggle: () => void }) {
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden", background: C.surf }}>
      <button onClick={onToggle} style={{
        width: "100%", padding: "10px 12px",
        display: "flex", alignItems: "center", gap: 8,
        background: "transparent", border: "none", cursor: "pointer",
        textAlign: "left", fontFamily: FONT,
      }}>
        <CheckCircle2 size={13} color={C.brand} />
        <span style={{ fontSize: 12, fontWeight: 600, color: C.ink, flex: 1 }}>{section.name}</span>
        <span style={{ fontSize: 11, color: C.text2, fontWeight: 500 }}>{section.pct}%</span>
        {expanded ? <ChevronUp size={12} color={C.text2} /> : <ChevronDown size={12} color={C.text2} />}
      </button>
      {expanded && section.rows && (
        <div style={{ padding: "0 12px 12px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "52px 1fr", gap: 7, padding: "6px 0 4px", borderBottom: `1px solid ${C.border}`, marginBottom: 6 }}>
            <span style={{ fontSize: 9, color: C.text2, fontWeight: 700, letterSpacing: "0.05em" }}>FIELD</span>
            <span style={{ fontSize: 9, color: C.text2, fontWeight: 700, letterSpacing: "0.05em" }}>EXTRACTED VALUE</span>
          </div>
          {section.rows.map(r => (
            <div key={r.label} style={{ display: "grid", gridTemplateColumns: "52px 1fr", gap: 7, padding: "6px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 11, color: C.ink, fontWeight: 600 }}>{r.label}</span>
              <div>
                <p style={{ fontSize: 11, color: C.ink, margin: "0 0 5px", lineHeight: 1.4 }}>{r.value}</p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 6px", borderRadius: 4, background: C.successLight, color: C.brand, fontSize: 9, fontWeight: 600 }}>
                  <FileText size={8} /> From: BRD
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DocumentTabContent() {
  return (
    <div style={{ padding: "14px 14px" }}>
      <p style={{ fontSize: 10.5, fontWeight: 700, color: C.text2, letterSpacing: "0.06em", margin: "0 0 10px", textTransform: "uppercase" }}>SOURCE DOCUMENTS</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {DOCS.map(d => (
          <div key={d.name} style={{
            padding: 12, background: C.surf,
            border: `1px solid ${C.border}`, borderRadius: 8,
          }}>
            <div style={{ display: "flex", gap: 9, alignItems: "flex-start", marginBottom: 8 }}>
              <FileText size={14} color={C.text2} style={{ marginTop: 1, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.ink, margin: "0 0 2px", wordBreak: "break-word" }}>{d.name}</p>
                <p style={{ fontSize: 10.5, color: C.text2, margin: 0 }}>{d.size}</p>
              </div>
            </div>
            <button style={{
              width: "100%", padding: "6px 0", borderRadius: 6,
              background: C.successLight, color: C.brand,
              fontSize: 11, fontWeight: 600,
              border: "none", cursor: "pointer", fontFamily: FONT,
            }}>View Document</button>
          </div>
        ))}
      </div>
    </div>
  );
}
