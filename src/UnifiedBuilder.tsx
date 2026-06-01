import React, { useState } from "react";
import {
  ChevronDown, ChevronRight, ChevronUp, ExternalLink, Search, Filter,
  AlertCircle, AlertTriangle, FileText, Trash2, ArrowRight,
  CheckCircle2, Clock, Maximize2, Plus, Check, GitBranch,
} from "lucide-react";

// ─── Design tokens (matched to screenshots) ──────────────────────────────────
const BRAND = "#047857";
const BRAND_TINT = "#d1fae5";
const BRAND_LIGHT = "#10b981";
const INK = "#0f172a";
const MUTED = "#475569";
const SUBTLE = "#64748b";
const FAINT = "#94a3b8";
const BORDER = "#e2e8f0";
const BORDER_STRONG = "#cbd5e1";
const SURFACE = "#F9FAFB";
const SURFACE_2 = "#f8fafc";
const AMBER = "#f59e0b";
const AMBER_DARK = "#d97706";
const RED = "#ef4444";

// ─── Data ─────────────────────────────────────────────────────────────────────
type Status = "ok" | "amber" | "red";

const STAGES = [
  { label: "Upload", state: "done" as const },
  { label: "Extract", state: "done" as const },
  { label: "Verify", state: "active" as const },
  { label: "Audit", state: "todo" as const },
  { label: "Publish", state: "todo" as const },
];

const TOP_TABS = ["Overview", "Basic Details", "Questions", "Exclusions"];

const SOURCES = [
  { label: "BRD v5.4", pages: "64p" },
  { label: "Policy Wording", pages: "38p" },
  { label: "Rate Card 2025", pages: "12p" },
  { label: "Proposal Form", pages: "6p" },
];

// Deterministic 155-cell heatmap (mostly green, some amber, occasional red)
const FIELD_CELLS: ("high" | "medium" | "low")[] = (() => {
  let seed = 7;
  const rng = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  return Array.from({ length: 155 }, () => {
    const r = rng();
    return r > 0.93 ? "low" : r > 0.78 ? "medium" : "high";
  });
})();
const CELL_COLOR: Record<"high" | "medium" | "low", string> = { high: BRAND_LIGHT, medium: AMBER, low: RED };

const STATUS_DOT: Record<Status, string> = { ok: BRAND, amber: AMBER, red: RED };

type PlanItem = { label: string; count: number; status: Status };
const planItems = (overrides: Partial<Record<string, Status>> = {}): PlanItem[] => [
  { label: "Plan Limits", count: 1, status: overrides["Plan Limits"] ?? "amber" },
  { label: "Member Details", count: 6, status: overrides["Member Details"] ?? "ok" },
  { label: "Premium Raters", count: 3, status: overrides["Premium Raters"] ?? "amber" },
  { label: "Coverages", count: 37, status: overrides["Coverages"] ?? "ok" },
];

const PLANS = [
  { name: "Mini", items: planItems({ Coverages: "red" }) },
  { name: "Medi", items: planItems() },
  { name: "Max", items: planItems() },
];

const TREE_NODES = [
  { name: "Coverages", count: 12, progress: [0.78, 0.18, 0.04], expanded: true },
  { name: "Plan Limits", count: 5, progress: [1, 0, 0], expanded: false },
  { name: "Plan Limits", count: 5, progress: [1, 0, 0], expanded: false },
  { name: "Premium Raters", count: 12, progress: [0.84, 0.10, 0.06], expanded: true },
];

type FeedItem = { kind: "blocker" | "warning"; tier: string; time: string; title: string };
const FEED: FeedItem[] = [
  { kind: "blocker", tier: "Mini", time: "12m ago", title: "Room rent cap missing in BRD for Mini tier." },
  { kind: "blocker", tier: "Mini", time: "1h ago", title: "Policy wording vs Brochure conflict on LASIK coverage." },
  { kind: "warning", tier: "Medi", time: "2h ago", title: "OPD limit differs between BRD (₹8,000) and Brochure (₹7,500)." },
  { kind: "warning", tier: "Max", time: "3h ago", title: "Initial wait conflict — Brochure 15d vs Policy 30d." },
  { kind: "warning", tier: "Max", time: "5h ago", title: "Experimental treatment — Brochure conflicts with Policy wording." },
  { kind: "warning", tier: "Max", time: "6h ago", title: "Zone loading numbers handwritten in rates draft." },
];

type ExtractSection = { name: string; pct: number; rows?: { label: string; value: string }[] };
const EXTRACT_SECTIONS: ExtractSection[] = [
  { name: "Product Information", pct: 92 },
  { name: "Plans", pct: 92, rows: [
    { label: "Mini", value: "Entry-level plan with sum insured of Rs.4L or Rs.5L." },
    { label: "Medi", value: "Entry-level plan with sum insured of Rs.4L or Rs.5L." },
    { label: "Max", value: "Entry-level plan with sum insured of Rs.4L or Rs.5L." },
  ]},
  { name: "Coverage Details", pct: 92 },
  { name: "Member Eligibility", pct: 93 },
  { name: "Benefits & Covers", pct: 89 },
  { name: "Risk Factors", pct: 91 },
];

const DOCS = [
  { name: "BRD_DIY_Health_Ver0.11.docx", size: "5.4 MB" },
  { name: "D.I.Y Health policy wording.docx", size: "587.9 KB" },
  { name: "DIY Proposal Form.docx", size: "113.8 KB" },
  { name: "DIY Rates.xlsx", size: "28.0 KB" },
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
      // Escape the parent <main> padding so we can render full-bleed
      margin: "-24px -32px",
      height: "calc(100% + 48px)",
      display: "flex", flexDirection: "column",
      background: SURFACE, overflow: "hidden",
    }}>
      <TopBar onNext={onNext} activeTab={topTab} setActiveTab={setTopTab} />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <main style={{
          flex: 1, overflowY: "auto",
          padding: "20px 24px",
          display: "flex", flexDirection: "column", gap: 20,
        }}>
          <ExtractionHealthCard
            sourceIdx={sourceIdx} setSourceIdx={setSourceIdx}
            needsReviewOnly={needsReviewOnly} setNeedsReviewOnly={setNeedsReviewOnly}
          />
          <FieldMapCard />
          <PlanVariantsGrid onOpenTree={onOpenTree} />
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
      display: "flex", alignItems: "center", gap: 16,
      padding: "12px 20px",
      borderBottom: `1px solid ${BORDER}`,
      background: "#fff",
      flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: BRAND_TINT, color: BRAND,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 700,
        }}>E</div>
        <div>
          <p style={{ fontSize: 14.5, fontWeight: 700, color: INK, margin: 0, lineHeight: 1.2 }}>D.I.Y Health Insurance</p>
          <p style={{ fontSize: 11.5, color: SUBTLE, margin: "2px 0 0", lineHeight: 1.2 }}>Health · UIN EIC-HLT-P-V-001-25</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", marginLeft: 4 }}>
        {STAGES.map((s, i) => (
          <React.Fragment key={s.label}>
            <StageChip stage={s} />
            {i < STAGES.length - 1 && <div style={{ width: 12, height: 1, background: BORDER_STRONG, margin: "0 6px" }} />}
          </React.Fragment>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ display: "flex", gap: 2, padding: 3, background: SURFACE_2, borderRadius: 8 }}>
        {TOP_TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: "6px 12px", borderRadius: 6,
            background: activeTab === t ? "#fff" : "transparent",
            color: activeTab === t ? INK : SUBTLE,
            fontSize: 12.5, fontWeight: 600,
            border: "none", cursor: "pointer",
            boxShadow: activeTab === t ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
          }}>{t}</button>
        ))}
      </div>

      <button onClick={onNext} style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "8px 14px", borderRadius: 8,
        background: BRAND, color: "#fff",
        fontSize: 13, fontWeight: 600,
        border: "none", cursor: "pointer",
      }}>Submit configuration <ArrowRight size={14} /></button>

      <button style={{
        width: 34, height: 34, borderRadius: 8,
        background: "transparent", color: SUBTLE,
        display: "flex", alignItems: "center", justifyContent: "center",
        border: `1px solid ${BORDER}`, cursor: "pointer",
      }}><Trash2 size={14} /></button>
    </div>
  );
}

function StageChip({ stage }: { stage: typeof STAGES[number] }) {
  const { label, state } = stage;
  const color = state === "done" ? BRAND : state === "active" ? AMBER_DARK : FAINT;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{
        width: 14, height: 14, borderRadius: "50%",
        background: state === "todo" ? "transparent" : color,
        border: state === "todo" ? `1.5px solid ${FAINT}` : "none",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {state === "done" && <Check size={9} color="#fff" strokeWidth={3.5} />}
      </div>
      <span style={{ fontSize: 12.5, fontWeight: state === "active" ? 700 : 500, color }}>{label}</span>
    </div>
  );
}

// ─── Extraction Health card ───────────────────────────────────────────────────
function ExtractionHealthCard({
  sourceIdx, setSourceIdx, needsReviewOnly, setNeedsReviewOnly,
}: { sourceIdx: number; setSourceIdx: (i: number) => void; needsReviewOnly: boolean; setNeedsReviewOnly: (v: boolean) => void }) {
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${BORDER}`,
      borderRadius: 14,
      padding: "22px 24px",
    }}>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
        <div style={{ flexShrink: 0 }}>
          <Donut value={89} size={110} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: SUBTLE, letterSpacing: "0.08em", margin: 0 }}>EXTRACTION HEALTH</p>
            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: SUBTLE }}>
              <Clock size={11} /> Updated 4 min ago
            </div>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: INK, margin: "0 0 14px", letterSpacing: "-0.01em" }}>
            D.I.Y Health Insurance <span style={{ color: SUBTLE, fontWeight: 500 }}>· 234 fields extracted</span>
          </h2>

          <div style={{ display: "flex", gap: 22, marginBottom: 10 }}>
            <Stat dot={BRAND} bold="124" label="High" />
            <Stat dot={AMBER} bold="40" label="Medium" />
            <Stat dot={RED} bold="15" label="Low" />
          </div>

          <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <AlertCircle size={14} color={RED} />
              <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>2</span>
              <span style={{ fontSize: 13, color: SUBTLE }}>Blockers</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <AlertTriangle size={14} color={AMBER} />
              <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>4</span>
              <span style={{ fontSize: 13, color: SUBTLE }}>Warnings</span>
            </div>
          </div>
        </div>

        <div style={{ flexShrink: 0, width: 180, height: 80, position: "relative" }}>
          <p style={{ position: "absolute", top: 0, right: 0, fontSize: 11, color: SUBTLE, margin: 0 }}>Session trend</p>
          <Sparkline />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 22, paddingTop: 16, borderTop: `1px solid ${BORDER}`, flexWrap: "wrap" }}>
        <span style={{ fontSize: 12, color: SUBTLE, fontWeight: 500 }}>Source:</span>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", flex: 1 }}>
          {SOURCES.map((s, i) => {
            const active = i === sourceIdx;
            return (
              <button key={s.label} onClick={() => setSourceIdx(i)} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "5px 11px", borderRadius: 8,
                background: active ? BRAND_TINT : "#fff",
                color: active ? BRAND : INK,
                border: `1px solid ${active ? BRAND + "55" : BORDER}`,
                fontSize: 12, fontWeight: 600,
                cursor: "pointer",
              }}>
                <FileText size={11} /> {s.label} <span style={{ color: active ? BRAND : SUBTLE, fontWeight: 500 }}>· {s.pages}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
        <div style={{
          flex: 1, display: "flex", alignItems: "center", gap: 8,
          padding: "8px 12px", background: SURFACE,
          border: `1px solid ${BORDER}`, borderRadius: 8,
        }}>
          <Search size={14} color={FAINT} />
          <input placeholder="Find parameter..." style={{
            flex: 1, border: "none", background: "transparent", outline: "none",
            fontSize: 13, color: INK, fontFamily: "inherit",
          }} />
        </div>
        <button onClick={() => setNeedsReviewOnly(!needsReviewOnly)} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "8px 12px", borderRadius: 8,
          background: needsReviewOnly ? BRAND_TINT : "#fff",
          color: needsReviewOnly ? BRAND : SUBTLE,
          border: `1px solid ${needsReviewOnly ? BRAND + "55" : BORDER}`,
          fontSize: 12.5, fontWeight: 600,
          cursor: "pointer", whiteSpace: "nowrap",
        }}>
          <Filter size={12} /> Needs review only
        </button>
      </div>
    </div>
  );
}

function Donut({ value, size = 100 }: { value: number; size?: number }) {
  return (
    <div style={{
      position: "relative", width: size, height: size, borderRadius: "50%",
      background: `conic-gradient(${BRAND} 0 ${value}%, #e5e7eb ${value}% 100%)`,
    }}>
      <div style={{
        position: "absolute", inset: 9, borderRadius: "50%", background: "#fff",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: INK, lineHeight: 1 }}>{value}%</span>
        <span style={{ fontSize: 9, color: SUBTLE, fontWeight: 600, letterSpacing: "0.08em", marginTop: 3 }}>HEALTH</span>
      </div>
    </div>
  );
}

function Stat({ dot, bold, label }: { dot: string; bold: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: dot }} />
      <span style={{ fontSize: 14, fontWeight: 700, color: INK }}>{bold}</span>
      <span style={{ fontSize: 13, color: SUBTLE }}>{label}</span>
    </div>
  );
}

function Sparkline() {
  return (
    <svg width="180" height="70" viewBox="0 0 180 70" style={{ position: "absolute", bottom: 0, left: 0 }}>
      <defs>
        <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={BRAND} stopOpacity="0.22" />
          <stop offset="100%" stopColor={BRAND} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0,58 L20,55 L40,52 L60,49 L80,44 L100,38 L120,32 L140,24 L160,16 L180,8 L180,70 L0,70 Z" fill="url(#sparkFill)" />
      <path d="M0,58 L20,55 L40,52 L60,49 L80,44 L100,38 L120,32 L140,24 L160,16 L180,8" stroke={BRAND} strokeWidth="1.8" fill="none" />
    </svg>
  );
}

// ─── Field Map card ───────────────────────────────────────────────────────────
function FieldMapCard() {
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${BORDER}`,
      borderRadius: 14,
      padding: "20px 22px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: SUBTLE, letterSpacing: "0.08em", margin: "0 0 4px" }}>FIELD MAP</p>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: INK }}>89%</span>
            <span style={{ fontSize: 13, color: SUBTLE }}>extraction health</span>
            <ChevronDown size={14} color={SUBTLE} />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <LegendDot color={BRAND_LIGHT} label="High" />
          <LegendDot color={AMBER} label="Medium" />
          <LegendDot color={RED} label="Low" />
          <button style={{ background: "transparent", border: "none", cursor: "pointer", color: SUBTLE, display: "flex" }}>
            <Maximize2 size={13} />
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(31, 1fr)", gap: 3 }}>
        {FIELD_CELLS.map((c, i) => (
          <div key={i} style={{
            aspectRatio: "1",
            borderRadius: 3,
            background: CELL_COLOR[c],
          }} />
        ))}
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
      <span style={{ fontSize: 12, color: SUBTLE, fontWeight: 500 }}>{label}</span>
    </div>
  );
}

// ─── Plan Variants grid ───────────────────────────────────────────────────────
function PlanVariantsGrid({ onOpenTree }: { onOpenTree: () => void }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <span style={{ fontSize: 15, fontWeight: 700, color: INK }}>Plan Variants</span>
          <span style={{ fontSize: 13, color: SUBTLE, marginLeft: 6 }}>· 3 fields</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", gap: 2, width: 80, height: 6, borderRadius: 100, overflow: "hidden" }}>
            <div style={{ flex: 0.62, background: BRAND }} />
            <div style={{ flex: 0.23, background: AMBER }} />
            <div style={{ flex: 0.15, background: RED }} />
          </div>
          <span style={{ fontSize: 12.5, color: SUBTLE, fontWeight: 500 }}>77% quality</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {PLANS.map(p => <PlanCard key={p.name} plan={p} onOpen={onOpenTree} />)}
        <AddPlanCard />
      </div>
    </div>
  );
}

function PlanCard({ plan, onOpen }: { plan: typeof PLANS[number]; onOpen: () => void }) {
  return (
    <button onClick={onOpen} style={{
      background: "#fff",
      border: `1px solid ${BORDER}`,
      borderRadius: 12,
      padding: 18,
      cursor: "pointer",
      textAlign: "left",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: INK, margin: 0 }}>{plan.name}</p>
        <ExternalLink size={14} color={SUBTLE} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {plan.items.map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_DOT[item.status] }} />
              <span style={{ fontSize: 13, color: INK }}>{item.label}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>{item.count}</span>
          </div>
        ))}
      </div>
    </button>
  );
}

function AddPlanCard() {
  return (
    <button style={{
      background: SURFACE,
      border: `1.5px dashed ${BORDER_STRONG}`,
      borderRadius: 12,
      padding: 18,
      cursor: "pointer",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        background: BRAND_TINT,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <Plus size={18} color={BRAND} />
      </div>
      <p style={{ fontSize: 14, fontWeight: 600, color: INK, margin: 0 }}>Add Plan</p>
      <p style={{ fontSize: 12, color: SUBTLE, margin: 0, textAlign: "center" }}>Create a new plan variant</p>
    </button>
  );
}

// ─── Right rail ───────────────────────────────────────────────────────────────
type RightTab = "tree" | "issues" | "data" | "document";

function RightRail({ tab, setTab, activeTier, setActiveTier }: {
  tab: RightTab; setTab: (t: RightTab) => void;
  activeTier: string; setActiveTier: (t: string) => void;
}) {
  const tabs: { id: RightTab; label: string; Icon: typeof GitBranch }[] = [
    { id: "tree", label: "Tree", Icon: GitBranch },
    { id: "issues", label: "Issues", Icon: AlertTriangle },
    { id: "data", label: "Data Extracted", Icon: FileText },
    { id: "document", label: "Document", Icon: FileText },
  ];

  return (
    <aside style={{
      width: 380, flexShrink: 0,
      borderLeft: `1px solid ${BORDER}`,
      background: "#fff",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
    }}>
      <div style={{ display: "flex", gap: 2, padding: "12px 14px", borderBottom: `1px solid ${BORDER}` }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "6px 10px", borderRadius: 6,
            background: tab === t.id ? BRAND_TINT : "transparent",
            color: tab === t.id ? BRAND : SUBTLE,
            fontSize: 12.5, fontWeight: 600,
            border: "none", cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 5,
            whiteSpace: "nowrap",
          }}><t.Icon size={12} /> {t.label}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {tab === "tree" && <TreeTabContent activeTier={activeTier} setActiveTier={setActiveTier} />}
        {tab === "issues" && <IssuesTabContent />}
        {tab === "data" && <DataTabContent />}
        {tab === "document" && <DocumentTabContent />}
      </div>
    </aside>
  );
}

function TreeTabContent({ activeTier, setActiveTier }: { activeTier: string; setActiveTier: (t: string) => void }) {
  return (
    <div style={{ padding: "16px 16px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: SUBTLE, letterSpacing: "0.08em", margin: "0 0 10px" }}>PLAN VARIANTS</p>
        <div style={{ display: "flex", gap: 4, padding: 3, background: SURFACE_2, borderRadius: 8 }}>
          {["Mini", "Medi", "Max"].map(t => (
            <button key={t} onClick={() => setActiveTier(t)} style={{
              flex: 1, padding: "6px 0", borderRadius: 6,
              background: activeTier === t ? "#fff" : "transparent",
              color: INK,
              fontSize: 12.5, fontWeight: 600,
              border: "none", cursor: "pointer",
              boxShadow: activeTier === t ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 5,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: t === "Mini" ? BRAND : t === "Medi" ? AMBER : RED }} />
              {t}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        background: "#fff",
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        padding: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: BRAND }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: INK, letterSpacing: "0.06em" }}>{activeTier.toUpperCase()} STRUCTURE</span>
            <span style={{ fontSize: 11, color: SUBTLE }}>· 26 fields</span>
          </div>
          <button style={{ background: "transparent", border: "none", cursor: "pointer", color: SUBTLE, display: "flex" }}>
            <Maximize2 size={12} />
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TREE_NODES.map((n, i) => <TreeNode key={i} node={n} />)}
        </div>
      </div>

      <ActivityFeedSection />
    </div>
  );
}

function TreeNode({ node }: { node: typeof TREE_NODES[number] }) {
  return (
    <div style={{
      background: SURFACE_2,
      border: `1px solid ${BORDER}`,
      borderRadius: 8,
      padding: "10px 12px",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minWidth: 0 }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: BRAND, flexShrink: 0 }} />
        <span style={{ fontSize: 12.5, fontWeight: 600, color: INK }}>{node.name}</span>
        <span style={{ fontSize: 11, color: SUBTLE }}>{node.count} fields</span>
      </div>
      <div style={{ display: "flex", gap: 1, width: 60, height: 5, borderRadius: 100, overflow: "hidden", flexShrink: 0 }}>
        <div style={{ flex: node.progress[0], background: BRAND }} />
        {node.progress[1] > 0 && <div style={{ flex: node.progress[1], background: AMBER }} />}
        {node.progress[2] > 0 && <div style={{ flex: node.progress[2], background: RED }} />}
      </div>
      {node.expanded ? <ChevronDown size={13} color={SUBTLE} /> : <ChevronRight size={13} color={SUBTLE} />}
    </div>
  );
}

function ActivityFeedSection() {
  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: SUBTLE, letterSpacing: "0.08em", margin: "0 0 12px" }}>ACTIVITY FEED</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {FEED.map((f, i) => <FeedItemRow key={i} item={f} />)}
      </div>
    </div>
  );
}

function FeedItemRow({ item }: { item: FeedItem }) {
  const isBlocker = item.kind === "blocker";
  const color = isBlocker ? RED : AMBER;
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <div style={{
        width: 16, height: 16, borderRadius: "50%",
        border: `1.5px solid ${color}`, background: "transparent",
        flexShrink: 0, marginTop: 2,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {item.kind} <span style={{ color: SUBTLE, fontWeight: 500 }}>· {item.tier}</span>
          </span>
          <span style={{ fontSize: 11, color: SUBTLE }}>{item.time}</span>
        </div>
        <p style={{ fontSize: 12.5, color: INK, margin: "0 0 6px", lineHeight: 1.45 }}>{item.title}</p>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={{ background: "transparent", border: "none", color: BRAND, fontSize: 12, fontWeight: 600, padding: 0, cursor: "pointer" }}>Open parameter</button>
          <button style={{ background: "transparent", border: "none", color: SUBTLE, fontSize: 12, fontWeight: 600, padding: 0, cursor: "pointer" }}>Resolve</button>
        </div>
      </div>
    </div>
  );
}

function IssuesTabContent() {
  return (
    <div style={{ padding: "16px 16px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: SUBTLE, letterSpacing: "0.08em", margin: "0 0 10px" }}>AUDIT</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <StatBox label="Blockers" value="2" color={RED} />
          <StatBox label="Open" value="6" color={INK} />
        </div>
      </div>
      <ActivityFeedSection />
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ padding: "14px 16px", border: `1px solid ${BORDER}`, borderRadius: 10, background: SURFACE_2 }}>
      <p style={{ fontSize: 12, color: SUBTLE, margin: "0 0 6px", fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 700, color, margin: 0, lineHeight: 1 }}>{value}</p>
    </div>
  );
}

function DataTabContent() {
  const [openIdx, setOpenIdx] = useState(1);
  return (
    <div style={{ padding: "16px 16px" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: SUBTLE, letterSpacing: "0.08em", margin: "0 0 14px" }}>DATA EXTRACTED</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {EXTRACT_SECTIONS.map((s, i) => (
          <DataSection key={i} section={s} expanded={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? -1 : i)} />
        ))}
      </div>
    </div>
  );
}

function DataSection({ section, expanded, onToggle }: { section: ExtractSection; expanded: boolean; onToggle: () => void }) {
  return (
    <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden", background: "#fff" }}>
      <button onClick={onToggle} style={{
        width: "100%", padding: "12px 14px",
        display: "flex", alignItems: "center", gap: 10,
        background: "transparent", border: "none", cursor: "pointer",
        textAlign: "left",
      }}>
        <CheckCircle2 size={15} color={BRAND} />
        <span style={{ fontSize: 13, fontWeight: 600, color: INK, flex: 1 }}>{section.name}</span>
        <span style={{ fontSize: 12, color: SUBTLE, fontWeight: 500 }}>{section.pct}%</span>
        {expanded ? <ChevronUp size={14} color={SUBTLE} /> : <ChevronDown size={14} color={SUBTLE} />}
      </button>
      {expanded && section.rows && (
        <div style={{ padding: "0 14px 14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 8, padding: "8px 0 4px", borderBottom: `1px solid ${BORDER}`, marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: SUBTLE, fontWeight: 700, letterSpacing: "0.05em" }}>FIELD</span>
            <span style={{ fontSize: 10, color: SUBTLE, fontWeight: 700, letterSpacing: "0.05em" }}>EXTRACTED VALUE</span>
          </div>
          {section.rows.map(r => (
            <div key={r.label} style={{ display: "grid", gridTemplateColumns: "60px 1fr", gap: 8, padding: "8px 0", borderBottom: `1px solid ${BORDER}` }}>
              <span style={{ fontSize: 12, color: INK, fontWeight: 600 }}>{r.label}</span>
              <div>
                <p style={{ fontSize: 12.5, color: INK, margin: "0 0 6px", lineHeight: 1.4 }}>{r.value}</p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 7px", borderRadius: 5, background: BRAND_TINT, color: BRAND, fontSize: 10, fontWeight: 600 }}>
                  <FileText size={9} /> From: BRD
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
    <div style={{ padding: "16px 16px" }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: SUBTLE, letterSpacing: "0.08em", margin: "0 0 14px" }}>PLAN VARIANTS</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {DOCS.map(d => (
          <div key={d.name} style={{
            padding: 14, background: "#fff",
            border: `1px solid ${BORDER}`, borderRadius: 10,
          }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
              <FileText size={16} color={SUBTLE} style={{ marginTop: 1 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: INK, margin: "0 0 2px", wordBreak: "break-word" }}>{d.name}</p>
                <p style={{ fontSize: 11, color: SUBTLE, margin: 0 }}>{d.size}</p>
              </div>
            </div>
            <button style={{
              width: "100%", padding: "7px 0", borderRadius: 7,
              background: BRAND_TINT, color: BRAND,
              fontSize: 12, fontWeight: 600,
              border: "none", cursor: "pointer",
            }}>View Document</button>
          </div>
        ))}
      </div>
    </div>
  );
}
