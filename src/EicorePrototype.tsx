import { useState, useRef, useEffect } from "react";
import {
  X, Eye, LayoutGrid, Package, CreditCard, GitBranch, LayoutTemplate, Users,
  ChevronDown, ChevronRight, CheckCircle2, Circle, UploadCloud, FileText,
  FileSpreadsheet, Plus, Clock, ArrowRight, ArrowLeft, AlertTriangle, AlertCircle,
  FileSearch, ShieldCheck, FolderTree, BookOpen, Settings, Activity, ExternalLink,
  Shield, Calendar, FileType, Link2, PanelLeftClose, PanelLeftOpen, Check,
} from "lucide-react";
import { C, T, card, pill, btn } from "./theme";
import CaseStudy from "./CaseStudy";
import CommentsLayer from "./CommentsLayer";
import TreeExpansion from "./TreeExpansion";
import UnifiedBuilder from "./UnifiedBuilder";
import DesignSystem from "./DesignSystem";

// ─────────────────────────────────────────────────────────────────────────────
// Shared bits
// ─────────────────────────────────────────────────────────────────────────────
function RainbowLogo({ size = 32 }: { size?: number }) {
  const dots: [number, number, number, string][] = [
    [50, 15, 5, "#E83A59"], [68, 20, 4.5, "#D9467C"], [80, 32, 4.5, "#A855F7"],
    [85, 50, 5, "#6366F1"], [80, 68, 4.5, "#3B82F6"], [68, 80, 4.5, "#0EA5E9"],
    [50, 85, 5, "#06B6D4"], [32, 80, 4.5, "#14B8A6"], [20, 68, 4.5, "#10B981"],
    [15, 50, 5, "#22C55E"], [20, 32, 4.5, "#F59E0B"], [32, 20, 4.5, "#F97316"],
    [50, 28, 3.5, "#E83A59"], [62, 34, 3.5, "#A855F7"], [72, 50, 3.5, "#6366F1"],
    [62, 66, 3.5, "#0EA5E9"], [50, 72, 3.5, "#14B8A6"], [38, 66, 3.5, "#10B981"],
    [28, 50, 3.5, "#F59E0B"], [38, 34, 3.5, "#F97316"],
  ];
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      {dots.map(([cx, cy, r, fill], i) => <circle key={i} cx={cx} cy={cy} r={r} fill={fill} />)}
    </svg>
  );
}

function StatusTag({ label, kind }: { label: string; kind: "brand" | "success" | "warning" | "error" | "neutral" }) {
  const map = {
    brand: { c: C.brand, b: C.brandTint }, success: { c: C.success, b: C.successTint },
    warning: { c: C.warning, b: C.warningTint }, error: { c: C.error, b: C.errorTint },
    neutral: { c: C.text2, b: "#F3F4F6" },
  }[kind];
  return <span style={{ ...pill(map.c, map.b), fontSize: 10, textTransform: "uppercase", letterSpacing: "0.04em", padding: "2px 8px", border: `1px solid ${map.c}20` }}>{label}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Global icon rail
// ─────────────────────────────────────────────────────────────────────────────
function GlobalSidebar() {
  const [expanded, setExpanded] = useState(false);
  const [cfgOpen, setCfgOpen] = useState(true);
  const navItems = [
    { icon: CreditCard, label: "Billing" }, { icon: GitBranch, label: "Workflows" },
    { icon: LayoutTemplate, label: "Templates" },
  ];
  const itemStyle = (active = false): React.CSSProperties => ({
    display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
    borderRadius: active ? 10 : 8, border: "none",
    background: active ? C.brandTintSoft : "transparent",
    color: active ? C.brand : C.text2, cursor: "pointer", whiteSpace: "nowrap",
    width: "100%", textAlign: "left", fontSize: 14, fontWeight: active ? 600 : 500,
  });
  return (
    <aside
      onMouseEnter={() => setExpanded(true)} onMouseLeave={() => setExpanded(false)}
      style={{
        width: expanded ? 240 : 64, minWidth: expanded ? 240 : 64,
        transition: "width .25s ease, min-width .25s ease", height: "100vh",
        background: C.card, borderRight: `1px solid ${C.border}`, display: "flex",
        flexDirection: "column", overflow: "hidden", flexShrink: 0, zIndex: 50,
      }}>
      <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <RainbowLogo />
      </div>
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "16px 8px", display: "flex", flexDirection: "column", gap: 4 }}>
        <button style={itemStyle()}><LayoutGrid size={20} style={{ flexShrink: 0 }} />{expanded && <span>Dashboard</span>}</button>
        <div>
          <button style={itemStyle(true)} onClick={() => setCfgOpen(!cfgOpen)}>
            <Package size={20} style={{ flexShrink: 0 }} />
            {expanded && (<><span style={{ flex: 1 }}>Product Config</span>{cfgOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}</>)}
          </button>
          {expanded && cfgOpen && (
            <div style={{ paddingLeft: 44, display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
              <button style={{ border: "none", background: "none", textAlign: "left", padding: "6px 8px", fontSize: 13, fontWeight: 700, color: C.text, cursor: "pointer", borderRadius: 6 }}>New Product</button>
              <button style={{ border: "none", background: "none", textAlign: "left", padding: "6px 8px", fontSize: 13, fontWeight: 500, color: C.text2, cursor: "pointer", borderRadius: 6 }}>Products</button>
            </div>
          )}
        </div>
        {navItems.map(it => (
          <button key={it.label} style={itemStyle()}><it.icon size={20} style={{ flexShrink: 0 }} />{expanded && <span>{it.label}</span>}</button>
        ))}
        <div style={{ margin: "8px 0", borderTop: `1px solid ${C.border}` }} />
        <button style={itemStyle()}><Users size={20} style={{ flexShrink: 0 }} />{expanded && <span>Team</span>}</button>
      </div>
      <div style={{ padding: "12px 8px", borderTop: `1px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", justifyContent: expanded ? "flex-start" : "center" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: `1px solid ${C.border}`, background: C.bgTertiary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, fontWeight: 700, color: C.text }}>DU</div>
          {expanded && (<div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Designer User</span><span style={{ fontSize: 11, color: C.text3 }}>Sign out</span></div>)}
        </div>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Header (with Case Study / Prototype toggle)
// ─────────────────────────────────────────────────────────────────────────────
function Header({ view, setView, showSidebarToggle, sidebarCollapsed, onToggleSidebar }: { view: "prototype" | "case-study" | "design-system"; setView: (v: "prototype" | "case-study" | "design-system") => void; showSidebarToggle?: boolean; sidebarCollapsed?: boolean; onToggleSidebar?: () => void }) {
  const TABS: { id: "prototype" | "case-study" | "design-system"; label: string }[] = [
    { id: "case-study",     label: "Case Study"     },
    { id: "prototype",      label: "Prototype"      },
    { id: "design-system",  label: "Design System"  },
  ];
  return (
    <header style={{ height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", background: C.card, borderBottom: `1px solid ${C.border}`, borderRadius: "12px 12px 0 0", zIndex: 10, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h1 style={{ fontWeight: 600, fontSize: 15, color: C.text, margin: 0 }}>Product Plan Builder</h1>
        {showSidebarToggle && (
          <button onClick={onToggleSidebar} title={`${sidebarCollapsed ? "Expand" : "Collapse"} sidebar  ⌘B`}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, border: "none", background: sidebarCollapsed ? C.brandTint : "transparent", cursor: "pointer", color: sidebarCollapsed ? C.brand : C.text2 }}>
            {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", gap: 2, padding: 3, borderRadius: 8, background: C.bgTertiary, border: `1px solid ${C.border}` }}>
          {TABS.map(({ id, label }) => (
            <button className="nav-tab" key={id} onClick={() => setView(id)}
              style={{ padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: view === id ? C.card : "transparent", color: view === id ? C.brand : C.text3, boxShadow: view === id ? C.shadowSm : "none", whiteSpace: "nowrap" }}>
              {label}
            </button>
          ))}
        </div>
        <button style={{ display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.border}`, borderRadius: 6, width: 28, height: 28, color: C.text2, background: C.card, cursor: "pointer" }}><Eye size={14} /></button>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Step sidebar (260px)
// ─────────────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, name: "Configuration Method" },
  { id: 2, name: "AI Extraction & Audit", subSteps: ["Source Documents", "Extraction Quality", "Parameter Audit"], progress: 66, currentSubStep: 1 },
  { id: 3, name: "Unified Product Workspace" },
  { id: 4, name: "Product Review & Publish" },
  { id: 5, name: "Stakeholder Overview" },
];

function StepSidebar({ currentStep, setCurrentStep, collapsed, onToggle }: { currentStep: number; setCurrentStep: (n: number) => void; collapsed?: boolean; onToggle?: () => void }) {
  return (
    <aside style={{ width: collapsed ? 0 : 240, minWidth: collapsed ? 0 : 240, background: C.card, borderRight: collapsed ? "none" : `1px solid ${C.border}`, overflow: "hidden", transition: "width .22s ease, min-width .22s ease", flexShrink: 0 }}>
      <div style={{ width: 240, height: "100%", boxSizing: "border-box", overflowY: "auto", padding: "20px 14px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: 14, padding: "0 4px" }}>
          <h3 style={{ fontWeight: 700, fontSize: 13, color: C.text }}>Builder Roadmap</h3>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {STEPS.map(step => {
          const isActive = currentStep === step.id;
          const isPast = currentStep > step.id;
          return (
            <div key={step.id} onClick={() => setCurrentStep(step.id)} className="sidebar-step-card"
              style={{ background: isActive ? C.card : "transparent", borderRadius: 8, padding: "10px 12px", cursor: "pointer", transition: "all .15s ease", border: `1px solid ${isActive ? C.border : "transparent"}`, boxShadow: isActive ? "0 1px 2px rgba(0,0,0,0.04)" : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                {/* Status indicator */}
                {isPast ? (
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.brandTint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Check size={11} color={C.brand} strokeWidth={3} />
                  </div>
                ) : isActive ? (
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.brand, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
                  </div>
                ) : (
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: `1.5px solid ${C.borderStrong}`, background: "transparent", flexShrink: 0 }} />
                )}
                <span style={{ fontSize: 12.5, fontWeight: isActive ? 600 : 500, color: isActive ? C.text : isPast ? C.text2 : C.text3 }}>{step.name}</span>
              </div>
              {isActive && step.subSteps && (
                <div style={{ marginTop: 10, paddingLeft: 27 }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 10, color: C.text2, fontWeight: 500 }}>1 of {step.subSteps.length}</span>
                    <div style={{ flex: 1, height: 3, background: C.border, borderRadius: 999, overflow: "hidden", margin: "0 8px" }}>
                      <div style={{ height: "100%", background: C.brand, width: `${step.progress}%`, borderRadius: 999 }} />
                    </div>
                    <span style={{ fontSize: 10, color: C.text2, fontWeight: 500 }}>{step.progress}%</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {step.subSteps.map((sub, idx) => (
                      <div key={idx} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        {idx <= (step.currentSubStep ?? 0)
                          ? <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.brand, flexShrink: 0 }} />
                          : <div style={{ width: 6, height: 6, borderRadius: "50%", border: `1.5px solid ${C.borderStrong}`, flexShrink: 0 }} />}
                        <span style={{ fontSize: 11, color: idx <= (step.currentSubStep ?? 0) ? C.text : C.text2, fontWeight: idx <= (step.currentSubStep ?? 0) ? 500 : 400 }}>{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 1 — Method Selection
// ─────────────────────────────────────────────────────────────────────────────
const FILES = [
  { name: "BRD_DIY_Health_Ver0.11.docx", size: "5.4 MB", kind: "docx" },
  { name: "D.I.Y Health policy wording.docx", size: "587.9 KB", kind: "docx" },
  { name: "DIY Rates.xlsx", size: "28.0 KB", kind: "xlsx" },
];

export function MethodSelection({ onNext }: { onNext: () => void }) {
  const [files, setFiles] = useState(FILES);
  const [drag, setDrag] = useState(false);
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }} className="animate-fade-in">
      <div style={{ marginBottom: 24 }}>
        <h2 style={T(20, 700)}>Generate Product via AI</h2>
        <p style={{ ...T(14, 400, C.text2), marginTop: 4 }}>Upload your business requirement documents (BRD), policy wording, rate cards, and proposal forms.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 24 }}>
        {/* Left: upload */}
        <div style={card(24)}>
          <div onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); }}
            className="upload-zone" style={{ border: `1px dashed ${drag ? C.brand : C.borderStrong}`, borderRadius: C.rLg, padding: 40, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: drag ? "rgba(4,120,87,0.02)" : C.bgTertiary, transition: "all .25s", cursor: "pointer" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.brandTint, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
              <UploadCloud size={40} color={C.brand} />
            </div>
            <h3 style={{ ...T(16, 700), marginTop: 16 }}>Drag &amp; drop files here</h3>
            <p style={{ ...T(14, 400, C.text3), marginTop: 8 }}>Supports PDF, DOCX, XLSX (max 25MB total)</p>
            <button className="btn btn-secondary btn-lg" style={{ marginTop: 24  }}>Browse Files</button>
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={T(14, 600)}>Uploaded Files Queue</span>
              <span style={T(14, 600, C.brand)}>{files.length} Files</span>
            </div>
            {files.map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: C.bgTertiary, border: `1px solid ${C.border}`, borderRadius: C.rMd, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: C.rSm, display: "flex", alignItems: "center", justifyContent: "center", background: f.kind === "xlsx" ? C.successTint : C.blueTint, color: f.kind === "xlsx" ? C.brandSecondary : C.blue }}>
                    {f.kind === "xlsx" ? <FileSpreadsheet size={16} /> : <FileText size={16} />}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={T(13, 500)}>{f.name}</span>
                    <span style={{ ...T(12, 400, C.text3), marginTop: 2 }}>{f.size}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={pill(C.success, C.successTint)}>Ready</span>
                  <button onClick={() => setFiles(fs => fs.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: C.text3, display: "flex" }}><X size={16} /></button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
            <button className="btn btn-brand btn-lg" onClick={onNext}>Extract Product Configuration</button>
          </div>
        </div>

        {/* Right: secondary options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ ...card(20), opacity: 0.6 }}>
            <h3 style={T(14, 600)}>Select from Template</h3>
            <p style={{ ...T(12, 400, C.text3), marginTop: 4, marginBottom: 16 }}>Start with a pre-configured baseline product template.</p>
            <button disabled className="btn btn-secondary btn-lg" style={{ width: "100%", cursor: "not-allowed"  }}>Templates (Coming Soon)</button>
          </div>
          <div style={card(20)}>
            <h3 style={T(14, 600)}>Manual Configuration</h3>
            <p style={{ ...T(12, 400, C.text3), marginTop: 4, marginBottom: 16 }}>Create plans and coverages manually, field-by-field.</p>
            <button className="btn btn-secondary btn-lg" style={{ width: "100%"  }}><Plus size={16} /> Build Manually</button>
          </div>
          <div style={card(20, C.rLg, { flex: 1 })}>
            <h3 style={{ ...T(14, 600), marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><Clock size={16} /> Recent Config Drafts</h3>
            {[{ n: "Health Total (Generali)", t: "Today, 11:22 AM", p: "94%" }, { n: "D.I.Y Health Insurance", t: "Yesterday, 4:15 PM", p: "72%" }].map((d, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i === 0 ? `1px solid ${C.border}` : "none" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={T(14, 500)}>{d.n}</span>
                  <span style={{ ...T(12, 400, C.text3), marginTop: 2 }}>{d.t}</span>
                </div>
                <span style={{ ...T(12, 600, C.brand), background: C.brandTint, padding: "2px 8px", borderRadius: C.rSm }}>{d.p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 2 — Extraction Preview
// ─────────────────────────────────────────────────────────────────────────────
function StepperPill({ items }: { items: { label: string; state: "done" | "active" | "todo"; n?: number }[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.card, border: `1px solid ${C.border}`, padding: "8px 16px", borderRadius: C.rFull, boxShadow: C.shadowSm, fontSize: 12, flexWrap: "wrap" }}>
      {items.map((it, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: it.state === "active" ? 700 : 500, color: it.state === "done" ? C.success : it.state === "active" ? C.brand : C.text3 }}>
            {it.state === "done" && <CheckCircle2 size={14} />}
            {it.state === "active" && <span style={{ width: 16, height: 16, borderRadius: "50%", background: C.brand, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{it.n}</span>}
            {it.label}
          </span>
          {i < items.length - 1 && <span style={{ color: C.text3 }}>›</span>}
        </span>
      ))}
    </div>
  );
}

type ExRow = { link?: string; cells: [string, string, string]; conf: number; warn?: boolean };
type ExSection = { id: string; name: string; pct: number; cols: [string, string, string]; rows: ExRow[] };

const EXTRACT_SECTIONS: ExSection[] = [
  { id: "product", name: "1. Product Information", pct: 92, cols: ["Parameter", "Extracted Value", "Confidence"], rows: [
    { cells: ["Product Name", "D.I.Y Health Insurance", "BRD Pg 1"], conf: 95 },
    { cells: ["Product Type", "Health — Indemnity", "BRD Pg 1"], conf: 94 },
    { cells: ["Insurer", "Studio Arsa Insurance Ltd.", "BRD Pg 1"], conf: 90 },
  ] },
  { id: "plans", name: "2. Plans Tiers Configuration", pct: 82, cols: ["Plan Tier", "Extracted Specs", "Confidence"], rows: [
    { link: "mini-si", cells: ["Mini", "SI: ₹4L or ₹5L. Floater: Self, Spouse, Kids.", "BRD Pg 2, Sec 2.1"], conf: 92 },
    { link: "medi-si", cells: ["Medi", "SI: ₹6L–₹10L. Adds Parents + in-laws.", "BRD Pg 2, Sec 2.2"], conf: 90 },
    { link: "opd-limit", cells: ["OPD Limit (Mini)", "Annual limit ₹3,000 per policy", "BRD Pg 2, Sec 4.1"], conf: 75, warn: true },
  ] },
  { id: "coverage", name: "3. Coverage Details", pct: 89, cols: ["Coverage", "Extracted Value", "Confidence"], rows: [
    { cells: ["Hospitalisation", "Up to Sum Insured", "Policy Sec 3"], conf: 93 },
    { cells: ["Pre-hospitalisation", "60 days", "Policy Sec 3"], conf: 91 },
    { cells: ["Day Care", "540+ procedures", "Policy Sec 3"], conf: 88 },
  ] },
  { id: "members", name: "4. Member Eligibility", pct: 93, cols: ["Member", "Entry Age", "Confidence"], rows: [
    { cells: ["Self / Spouse", "18–65 yrs", "Proposal Sec 1"], conf: 95 },
    { cells: ["Children", "91 days – 25 yrs", "Proposal Sec 1"], conf: 93 },
    { cells: ["Parents", "Up to 70 yrs", "Proposal Sec 1"], conf: 79, warn: true },
  ] },
  { id: "benefits", name: "5. Benefits & Covers", pct: 89, cols: ["Benefit", "Extracted Value", "Confidence"], rows: [
    { cells: ["Maternity (Normal)", "₹15,000", "BRD Pg 4"], conf: 84 },
    { cells: ["Road Ambulance", "₹2,000 / event", "BRD Pg 4"], conf: 88 },
  ] },
  { id: "waiting", name: "6. Waiting Periods", pct: 90, cols: ["Type", "Period", "Confidence"], rows: [
    { cells: ["Initial waiting", "30 days", "Policy Sec 5"], conf: 96 },
    { cells: ["Pre-existing (PED)", "36 months", "Policy Sec 5"], conf: 90 },
    { cells: ["Specific ailments", "24 months", "Policy Sec 5"], conf: 87 },
  ] },
  { id: "rating", name: "7. Premium Rating", pct: 86, cols: ["Factor", "Extracted Value", "Confidence"], rows: [
    { cells: ["Base premium (Mini, 30y)", "₹6,200", "Rates.xlsx"], conf: 91 },
    { cells: ["Zone loading", "Zone A +10%", "Rates.xlsx"], conf: 80, warn: true },
  ] },
  { id: "exclusions", name: "8. Exclusions", pct: 88, cols: ["Exclusion", "Extracted Value", "Confidence"], rows: [
    { cells: ["Cosmetic surgery", "Excluded", "Policy Sec 6"], conf: 92 },
    { cells: ["Dental (non-accident)", "Excluded", "Policy Sec 6"], conf: 85 },
  ] },
];

// How many doc tabs to show inline before collapsing into "+N more"
// Full-width views (files/data only) pass Infinity → show all
function DocTabBar({ tabs, active, onSelect, maxVisible = 3 }: { tabs: string[]; active: number; onSelect: (i: number) => void; maxVisible?: number }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const visible = tabs.slice(0, maxVisible);
  const overflow = tabs.slice(maxVisible);
  const overflowContainsActive = active >= maxVisible;

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    padding: "10px 14px", fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" as const,
    border: "none", borderBottom: `2px solid ${isActive ? C.brand : "transparent"}`,
    background: isActive ? C.card : "transparent", color: isActive ? C.brand : C.text2,
    cursor: "pointer", flexShrink: 0,
  });

  return (
    <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, background: C.bgTertiary, alignItems: "stretch", position: "relative" as const, minWidth: 0 }}>
      {/* Visible tabs — scroll if needed, fade right edge */}
      <div style={{ flex: 1, display: "flex", overflowX: "hidden", minWidth: 0, maskImage: overflow.length > 0 ? "linear-gradient(to right, black 85%, transparent 100%)" : "none", WebkitMaskImage: overflow.length > 0 ? "linear-gradient(to right, black 85%, transparent 100%)" : "none" }}>
        {visible.map((t, i) => (
          <button key={i} className="nav-tab" onClick={() => onSelect(i)} style={tabStyle(active === i)}>{t}</button>
        ))}
      </div>

      {overflow.length > 0 && (
        <div ref={dropRef} style={{ position: "relative" as const, display: "flex", alignItems: "center", paddingInline: 8, flexShrink: 0 }}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            style={{ ...tabStyle(overflowContainsActive && !dropdownOpen), padding: "6px 10px", borderRadius: 6, border: `1px solid ${overflowContainsActive ? C.brand : C.border}`, background: overflowContainsActive ? C.brandTint : C.card, color: overflowContainsActive ? C.brand : C.text2, display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, borderBottom: "1px solid transparent" }}>
            {overflowContainsActive
              ? <><FileText size={11} />{tabs[active].replace(/\.[^.]+$/, "")}<ChevronDown size={11} /></>
              : <><span>+{overflow.length} more</span><ChevronDown size={11} /></>
            }
          </button>

          {dropdownOpen && (
            <div style={{ position: "absolute" as const, top: "calc(100% + 4px)", right: 0, zIndex: 9999, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.14)", minWidth: 260, overflow: "hidden" }}>
              {overflow.map((t, j) => {
                const realIndex = maxVisible + j;
                const isAct = active === realIndex;
                return (
                  <button key={j} onClick={() => { onSelect(realIndex); setDropdownOpen(false); }}
                    style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 14px", border: "none", textAlign: "left" as const, cursor: "pointer", whiteSpace: "nowrap" as const, background: isAct ? C.brandTint : "transparent", color: isAct ? C.brand : C.text2, fontSize: 12, fontWeight: isAct ? 600 : 400 }}>
                    <FileText size={12} color={isAct ? C.brand : C.text3} style={{ flexShrink: 0 }} />
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ExtractionPreview({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [docTab, setDocTab] = useState(0);
  const [paneView, setPaneView] = useState<"split" | "files" | "data">("split");
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string>("plans"); // accordion: one open at a time
  const docRefs = useRef<Record<string, HTMLElement | null>>({});
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});
  const docTabs = ["BRD_DIY_Health.docx", "D.I.Y Health policy wording.docx", "DIY Rates.xlsx", "DIY Proposal Form.docx", "DIY Addendum v2.docx"];

  const toggleSection = (id: string) => setOpenSection(o => (o === id ? "" : id));

  // Click a linked highlight (doc) or row (data) → reveal the pair in both panes
  const jumpTo = (linkId: string) => {
    const sec = EXTRACT_SECTIONS.find(s => s.rows.some(r => r.link === linkId));
    if (sec) setOpenSection(sec.id);
    setDocTab(0);
    setPaneView("split");
    setActiveLink(linkId);
  };

  useEffect(() => {
    if (!activeLink) return;
    const t = setTimeout(() => {
      docRefs.current[activeLink]?.scrollIntoView({ behavior: "smooth", block: "center" });
      fieldRefs.current[activeLink]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 90);
    return () => clearTimeout(t);
  }, [activeLink, paneView, openSection]);

  const activeLabel = activeLink ? (EXTRACT_SECTIONS.flatMap(s => s.rows).find(r => r.link === activeLink)?.cells[0] ?? "") : "";

  // Clickable source highlight inside the document
  const DocMark = ({ id, tone, children }: { id: string; tone: "brand" | "warn"; children: React.ReactNode }) => {
    const active = activeLink === id;
    const c = tone === "warn" ? { bg: C.warningTint, fg: C.warning } : { bg: C.brandTint, fg: C.brand };
    return (
      <mark ref={el => { docRefs.current[id] = el; }} onClick={() => jumpTo(id)} title="Jump to extracted field →"
        style={{ background: c.bg, color: c.fg, padding: "1px 5px", borderRadius: 4, fontWeight: 600, cursor: "pointer", boxShadow: active ? `0 0 0 2px ${C.brand}` : "none", scrollMarginTop: 24, transition: "box-shadow .2s" }}>
        {children}<Link2 size={11} style={{ verticalAlign: "middle", marginLeft: 3, opacity: 0.65 }} />
      </mark>
    );
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }} className="animate-fade-in">
      {/* Compact header: row 1 = title + actions, row 2 = stepper + view toggle */}
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
          <div>
            <h2 style={T(18, 700)}>Extraction Preview &amp; Audit</h2>
            <p style={{ ...T(13, 400, C.text2), marginTop: 2 }}>Review AI extracted parameters against the source documents.</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button className="btn btn-secondary btn-lg" onClick={onBack}><ArrowLeft size={15} /> Back</button>
            <button className="btn btn-brand btn-lg" onClick={onNext}>Proceed to Builder <ArrowRight size={16} /></button>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <StepperPill items={[{ label: "Upload", state: "done" }, { label: "Generate AI", state: "done" }, { label: "Review & Confirm", state: "active", n: 3 }, { label: "Product Builder", state: "todo" }]} />
          <div style={{ display: "flex", gap: 4, background: C.bgTertiary, padding: 4, borderRadius: C.rLg, width: "max-content", border: `1px solid ${C.border}` }}>
            {([["split", "Split View", LayoutTemplate], ["files", "Files Uploaded", FileText], ["data", "Data Extracted", FileSearch]] as const).map(([id, label, Icon]) => (
              <button key={id} onClick={() => setPaneView(id)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: C.rMd, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: paneView === id ? C.card : "transparent", color: paneView === id ? C.brand : C.text2, boxShadow: paneView === id ? C.shadowSm : "none" }}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active link banner */}
      {activeLink && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", background: C.brandTint, border: `1px solid rgba(4,120,87,0.2)`, borderRadius: C.rMd, marginBottom: 10 }}>
          <Link2 size={14} color={C.brand} />
          <span style={T(12, 700, C.brand)}>Linked: {activeLabel}</span>
          <span style={T(12, 400, C.text2)}>— highlighted in both source &amp; extracted data</span>
          <button className="nav-tab" onClick={() => setActiveLink(null)} style={{ marginLeft: "auto", ...T(12, 600, C.text2), background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}><X size={12} /> Clear</button>
        </div>
      )}

      <div style={{ flex: 1, display: "flex", gap: paneView === "split" ? 24 : 0, overflow: "hidden" }}>
        {/* Left doc */}
        <div style={{ ...card(0), width: paneView === "split" ? "50%" : "100%", display: paneView === "data" ? "none" : "flex", flexDirection: "column", overflow: "hidden" }}>
          <DocTabBar tabs={docTabs} active={docTab} onSelect={setDocTab} maxVisible={paneView === "split" ? 3 : Infinity} />
          <div style={{ flex: 1, overflowY: "auto", padding: 24, background: C.card }}>
            <p style={{ ...T(11, 600, C.brand), marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><Link2 size={12} /> Tip: click a highlighted value to jump to its extracted field</p>
            <h4 style={{ ...T(15, 700), marginBottom: 16 }}>SECTION 2. PLANS DEFINITION</h4>
            <p style={{ ...T(13, 400, C.text2, 1.7), marginBottom: 16 }}>The D.I.Y Health Insurance product offers three standard tiers of benefits designed to meet varied customer requirements:</p>
            <p style={{ ...T(13, 400, C.text, 1.7), marginBottom: 16 }}><strong>2.1 Mini Plan:</strong> Entry-level plan tier. The Sum Insured options available are either <DocMark id="mini-si" tone="brand">Rs. 4,00,000 or Rs. 5,00,000</DocMark>. Floater coverage basis is supported for Self, Spouse/Legal Partner, and dependent Children.</p>
            <p style={{ ...T(13, 400, C.text, 1.7), marginBottom: 16 }}><strong>2.2 Medi Plan:</strong> Mid-tier plan. Sum Insured ranges from <DocMark id="medi-si" tone="brand">Rs. 6,00,000 up to Rs. 10,00,000</DocMark>. Floater bases extend to cover Parents and Parents-in-law (max 2 + 2 in a single floater contract).</p>
            <h4 style={{ ...T(15, 700), marginTop: 32, marginBottom: 16 }}>SECTION 4. OUT-PATIENT BENEFITS</h4>
            <p style={{ ...T(13, 400, C.text, 1.7) }}><strong>4.1 Out-patient (OPD) Treatment:</strong> Provides coverage for medical consultations, diagnostic services, and prescribed medications where hospitalisation is not required. For the Mini Plan option, out-patient (OPD) expenses are capped at an <DocMark id="opd-limit" tone="warn">annual limit of Rs. 3,000</DocMark> per policy. Under the Medi Plan, the limit is Rs. 5,00,000. Under the Max Plan, the limit is Rs. 10,00,000.</p>
          </div>
        </div>

        {/* Right extracted */}
        <div style={{ ...card(0), width: paneView === "split" ? "50%" : "100%", display: paneView === "files" ? "none" : "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "10px 14px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: C.bgTertiary, gap: 12 }}>
            {/* Compact quality strip */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px 3px 6px", borderRadius: C.rFull, background: C.successTint, border: `1px solid rgba(5,150,105,0.2)` }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.success, flexShrink: 0 }} />
                <span style={T(12, 700, C.success)}>89%</span>
                <span style={T(11, 400, C.success)}>Good</span>
              </span>
              <span style={T(12, 400, C.text2)}>130 / 145 parameters extracted</span>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <span style={pill(C.success, C.successTint)}><CheckCircle2 size={11} /> 6 High</span>
              <span style={pill(C.warning, C.warningTint)}><AlertTriangle size={11} /> 1 Warning</span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 6 }}>
            {EXTRACT_SECTIONS.map(sec => {
              const open = openSection === sec.id;
              const pctColor = sec.pct >= 85 ? C.success : C.warning;
              return (
                <div key={sec.id} style={{ border: `1px solid ${open ? C.borderStrong : C.border}`, borderRadius: C.rMd, overflow: "hidden", flexShrink: 0 }}>
                  <button onClick={() => toggleSection(sec.id)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", background: open ? C.card : C.bgTertiary, border: "none", cursor: "pointer" }}>
                    <span style={{ ...T(12.5, 600), display: "flex", alignItems: "center", gap: 8 }}>{open ? <ChevronDown size={14} color={C.brand} /> : <ChevronRight size={14} color={C.text3} />} {sec.name}</span>
                    <span style={T(12, 700, pctColor)}>{sec.pct}%</span>
                  </button>
                  {open && (
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead><tr style={{ background: C.bgTertiary, borderBottom: `1px solid ${C.border}`, borderTop: `1px solid ${C.border}` }}>{sec.cols.map(h => <th key={h} style={{ padding: "6px 12px", ...T(10.5, 600, C.text3) }}>{h}</th>)}</tr></thead>
                      <tbody>
                        {sec.rows.map((r, i) => {
                          const cc = r.conf >= 85 ? C.success : C.warning;
                          const linked = !!r.link;
                          const active = activeLink === r.link;
                          return (
                            <tr key={i}
                              ref={el => { if (r.link) fieldRefs.current[r.link] = el; }}
                              onClick={() => r.link && jumpTo(r.link)}
                              style={{ borderBottom: i < sec.rows.length - 1 ? `1px solid ${C.border}` : "none", cursor: linked ? "pointer" : "default", background: active ? C.brandTint : (r.warn ? C.warningTintSoft : "transparent"), boxShadow: active ? `inset 0 0 0 2px ${C.brand}` : "none", scrollMarginTop: 24, transition: "background .2s" }}>
                              <td style={{ padding: "7px 12px", verticalAlign: "top", ...T(12, 500, r.warn ? C.warning : C.text2) }}>{r.cells[0]}</td>
                              <td style={{ padding: "7px 12px" }}>
                                <div style={T(12, 500)}>{r.cells[1]}</div>
                                <div style={{ ...T(10, 400, r.warn ? C.warning : C.text3), marginTop: 2, display: "flex", alignItems: "center", gap: 5 }}>
                                  {r.cells[2]}
                                  {linked && <span style={{ display: "inline-flex", alignItems: "center", gap: 2, color: C.brand, fontWeight: 600 }}><Link2 size={10} /> view in file</span>}
                                </div>
                              </td>
                              <td style={{ padding: "7px 12px", verticalAlign: "top" }}><span style={{ display: "flex", alignItems: "center", gap: 4, ...T(12, 500, cc) }}>{r.conf >= 85 ? <ShieldCheck size={14} /> : <AlertTriangle size={14} />} {r.conf}%</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 3 — Unified Builder
// ─────────────────────────────────────────────────────────────────────────────
const COVERAGES = ["Organ Donor Expenses", "Cumulative Bonus", "Restoration of Sum Insured", "ICU Charges", "Room Rent (Normal Room)", "Wellness Benefits", "Cataract Surgery", "OPD Cover"];

export function PrePublishReview({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const checklist = [
    { t: "Configure hospitalisation sub-limit rules", k: "blocker" },
    { t: "Set Min/Max coverage limits for Hospitalisation", k: "blocker" },
    { t: "Verify maternity benefit amounts (64% confidence)", k: "warning" },
    { t: "Verify family construct default value", k: "warning" },
    { t: "Mark all 10 sections as Reviewed", k: "warning" },
  ];
  return (
    <div style={{ height: "100%", maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column" }} className="animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={onBack}><ArrowLeft size={14} /> Back</button>
          <h2 style={{ ...T(20, 700), marginLeft: 8 }}>Product Review — D.I.Y Health Insurance · Mini Plan</h2>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-secondary btn-lg">Configure Rules</button>
          <button className="btn btn-brand btn-lg" onClick={onNext}>Submit for Approval →</button>
        </div>
      </div>

      <div style={{ background: C.errorTintSoft, border: `1px solid rgba(239,68,68,0.2)`, borderRadius: C.rLg, padding: 16, marginBottom: 24, display: "flex", alignItems: "flex-start", gap: 16, boxShadow: C.shadowSm }}>
        <AlertTriangle size={20} color={C.error} style={{ marginTop: 2 }} />
        <div><h3 style={T(14, 700, C.error)}>⊙ Not ready to publish</h3><p style={{ ...T(12, 400, C.text2), marginTop: 4 }}>2 blocking errors and 3 unreviewed sections must be resolved before submission.</p></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24, flex: 1, overflow: "hidden", paddingBottom: 8 }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, overflowY: "auto", paddingRight: 8 }}>
          <div style={card(20)}>
            <h3 style={{ ...T(14, 700), marginBottom: 16 }}>Publishing Checklist</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {checklist.map((c, i) => {
                const blk = c.k === "blocker";
                const col = blk ? C.error : C.warning;
                const bg = blk ? C.errorTintSoft : C.warningTintSoft;
                const bd = blk ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)";
                return (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, borderRadius: 6, border: `1px solid ${bd}`, background: bg }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", background: col, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12, fontWeight: 700 }}>{blk ? "!" : "?"}</div>
                      <span style={T(12, 500)}>{c.t}</span>
                    </div>
                    <StatusTag label={blk ? "Blocker" : "Warning"} kind={blk ? "error" : "warning"} />
                  </div>
                );
              })}
            </div>
          </div>

          <div style={card(20)}>
            <h3 style={{ ...T(14, 700), marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>Plan Configuration <span style={{ ...T(12, 400, C.success), display: "flex", alignItems: "center", gap: 4 }}><CheckCircle2 size={14} /> Complete</span></h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[["Plan name", "Mini Plan"], ["Plan code", "MIN-001"], ["Sum insured options", "₹4L, ₹5L"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", ...T(12, 400, C.text2) }}><span>{k}</span><span style={{ ...T(12, 500), display: "flex", alignItems: "center", gap: 6 }}>{v} <CheckCircle2 size={14} color={C.success} /></span></div>
              ))}
            </div>
          </div>

          <div style={card(20)}>
            <h3 style={{ ...T(14, 700), marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>Coverage Configuration <span style={{ ...T(12, 400, C.error), display: "flex", alignItems: "center", gap: 4 }}><AlertTriangle size={14} /> 2 Blockers</span></h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, ...T(12, 400) }}>
              {[["Hospitalisation room rent", "Normal Room", false], ["Hospitalisation sub-limits", "Not configured", true], ["Hospitalisation min/max", "Not set", true], ["Day care procedures", "Standard 540+", false], ["Pre-hosp days", "60 days", false]].map(([k, v, err]) => (
                <div key={k as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 8, borderBottom: `1px solid ${C.border}`, ...(err ? { background: C.errorTintSoft, padding: 8, borderRadius: 6, marginInline: -8 } : {}) }}>
                  <span style={T(12, err ? 500 : 400, err ? C.error : C.text2)}>{k}</span>
                  <span style={{ ...T(12, err ? 700 : 500, err ? C.error : C.text), display: "flex", alignItems: "center", gap: 6 }}>{v} {err ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} color={C.success} />}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto", paddingRight: 8 }}>
          <SummaryCard title="Rules Configuration" rows={[
            { l: "Room rent sub-limit rule — not configured", kind: "error" }, { l: "Entry age rule active", kind: "ok" }, { l: "PED waiting period rule active", kind: "ok" }, { l: "Maternity waiting period rule active", kind: "ok" }, { l: "Cosmetic & dental exclusion", kind: "ok" },
          ]} />
          <div style={card(20)}>
            <h3 style={{ ...T(12, 700, C.text2), textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Field Confidence</h3>
            {[["Network & hospitals", "88% Good", C.success], ["Coverage limits", "Review", C.warning], ["Terms & conditions", "38% Poor", C.error], ["Grace period", "Missing", C.error]].map(([k, v, col]) => (
              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, ...T(12, 400, C.text2) }}><span>{k}</span><span style={T(12, 600, col as string)}>{v}</span></div>
            ))}
          </div>
          <div style={card(20)}>
            <h3 style={{ ...T(12, 700, C.text2), textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>Members &amp; Raters</h3>
            {[["Self entry age", "18–65", true], ["Age rater", "Age band", true], ["PED waiting", "2 years", true], ["Family construct", "Review", false]].map(([k, v, ok]) => (
              <div key={k as string} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, ...T(12, 400, C.text2) }}><span>{k}</span>{ok ? <span style={{ ...T(12, 500), display: "flex", alignItems: "center", gap: 4 }}>{v} <CheckCircle2 size={12} color={C.success} /></span> : <span style={T(12, 600, C.warning)}>{v}</span>}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, rows }: { title: string; rows: { l: string; kind: "ok" | "error" }[] }) {
  return (
    <div style={card(20)}>
      <h3 style={{ ...T(12, 700, C.text2), textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16 }}>{title}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rows.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, ...T(12, r.kind === "error" ? 500 : 400, r.kind === "error" ? C.error : C.text) }}>
            {r.kind === "ok" ? <CheckCircle2 size={14} color={C.success} /> : <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.error }} />}
            {r.l}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 5 — Stakeholder Dashboard
// ─────────────────────────────────────────────────────────────────────────────
const PLAN_DATA: Record<string, { limits: [string, string][]; min: string; max: string; opts: string }> = {
  mini: { min: "₹4,00,000", max: "₹5,00,000", opts: "₹4L, ₹5L", limits: [] },
  medi: { min: "₹6,00,000", max: "₹10,00,000", opts: "₹6L, ₹8L, ₹10L", limits: [] },
  max: { min: "₹11,00,000", max: "₹15,00,000", opts: "₹11L, ₹15L", limits: [] },
};

export function StakeholderDashboard({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<"mini" | "medi" | "max">("mini");
  const d = PLAN_DATA[tab];
  const limits: [string, string][] = [["Sum insured type", "Range"], ["Minimum sum insured", d.min], ["Maximum sum insured", d.max], ["Available options", d.opts], ["Floater basis", "Family floater"]];
  const members: [string, string, string, boolean][] = [["Self", "Mandatory", "18–65 yrs", true], ["Spouse", "Optional", "18–65 yrs", true], ["Children", "Optional", "91 days–25 yrs", true], ["Parents", "Optional", "Up to 70 yrs", false]];
  const cards = [
    { icon: Shield, label: "Sum Insured Range", value: "₹4L – ₹15L", sub: "Across Mini / Medi / Max plans", top: C.brand },
    { icon: Calendar, label: "Effective Live Date", value: "01 Apr 2024", sub: "Live status: Draft", top: C.accent },
    { icon: Users, label: "Members Covered", value: "4 Member Types", sub: "Self · Spouse · Kids · Parents", top: C.brandSecondary },
    { icon: Activity, label: "Total Coverages", value: "111 Configured", sub: "37 benefits per plan", top: C.success },
  ];
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }} className="animate-fade-in">
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: `1px solid ${C.border}`, paddingBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <button onClick={onBack} style={{ ...T(14, 500, C.text2), background: "none", border: "none", cursor: "pointer" }}>← Back</button>
            <span style={{ color: C.text3 }}>|</span>
            <h2 style={T(20, 700)}>Product Overview — D.I.Y Health Insurance</h2>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <StatusTag label="Health Insurance" kind="neutral" />
            <StatusTag label="In Progress" kind="brand" />
          </div>
        </div>
        <button className="btn btn-secondary btn-lg" onClick={onBack}>Back to Review</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ ...card(20), borderTop: `4px solid ${c.top}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, color: C.text2 }}><c.icon size={18} /><span style={T(14, 500, C.text2)}>{c.label}</span></div>
            <div style={{ ...T(24, 700), marginBottom: 4 }}>{c.value}</div>
            <div style={T(12, 400, C.text3)}>{c.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ ...card(24), flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 4, background: C.bgTertiary, padding: 4, borderRadius: C.rLg, width: "max-content", marginBottom: 24, border: `1px solid ${C.border}` }}>
          {(["mini", "medi", "max"] as const).map(p => (
            <button key={p} onClick={() => setTab(p)} style={{ padding: "8px 16px", fontWeight: 500, fontSize: 14, borderRadius: C.rMd, border: "none", cursor: "pointer", background: tab === p ? C.card : "transparent", color: tab === p ? C.brand : C.text2, boxShadow: tab === p ? C.shadowSm : "none", textTransform: "capitalize" }}>{p} Plan</button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <h4 style={{ ...T(15, 700), marginBottom: 16 }}>Plan Limits Configuration</h4>
              <div style={{ border: `1px solid ${C.border}`, borderRadius: C.rLg, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead style={{ background: C.bgTertiary }}><tr style={{ borderBottom: `1px solid ${C.border}` }}>{["Parameter", "Value", "Status"].map(h => <th key={h} style={{ padding: 12, ...T(11, 600, C.text2), letterSpacing: "0.03em" }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {limits.map(([k, v], i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: 12, ...T(12, 500) }}>{k}</td>
                        <td style={{ padding: 12, ...T(12, 400, C.text2) }}>{v}</td>
                        <td style={{ padding: 12 }}><CheckCircle2 size={16} color={C.success} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h4 style={{ ...T(15, 700), marginBottom: 16 }}>Member Details</h4>
              <div style={{ border: `1px solid ${C.border}`, borderRadius: C.rLg, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead style={{ background: C.bgTertiary }}><tr style={{ borderBottom: `1px solid ${C.border}` }}>{["Member", "Applicability", "Entry Age", "Status"].map(h => <th key={h} style={{ padding: 12, ...T(11, 600, C.text2), letterSpacing: "0.03em" }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {members.map(([m, a, e, ok], i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: ok ? "transparent" : C.warningTintSoft }}>
                        <td style={{ padding: 12, ...T(12, 500, ok ? C.text : C.warning) }}>{m}</td>
                        <td style={{ padding: 12, ...T(12, 400, ok ? C.text2 : C.text) }}>{a}</td>
                        <td style={{ padding: 12, ...T(12, 400, ok ? C.text2 : C.text) }}>{e}</td>
                        <td style={{ padding: 12 }}>{ok ? <CheckCircle2 size={16} color={C.success} /> : <StatusTag label="Review" kind="warning" />}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// App shell
// ─────────────────────────────────────────────────────────────────────────────
export default function EicoreApp() {
  const [view, setView] = useState<"prototype" | "case-study" | "design-system">("case-study");
  const [step, setStep] = useState(1);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [treeOpen, setTreeOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") { e.preventDefault(); setSidebarCollapsed(c => !c); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%", overflow: "hidden", background: C.shell }}>
      <GlobalSidebar />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, height: "100vh", overflow: "hidden", padding: "16px 20px" }}>
        <Header view={view} setView={setView} showSidebarToggle={view === "prototype"} sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(c => !c)} />

        <div style={{ display: "flex", flex: 1, overflow: "hidden", background: C.card, borderRadius: "0 0 12px 12px", boxShadow: C.shadowMd, border: `1px solid ${C.border}`, borderTop: "none" }}>
          {view === "prototype" ? (
            <>
              <StepSidebar currentStep={step} setCurrentStep={setStep} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />
              <main style={{ flex: 1, overflowY: "auto", padding: "24px 32px", background: C.bgTertiary }}>
                {step === 1 && <MethodSelection onNext={() => setStep(2)} />}
                {step === 2 && <ExtractionPreview onNext={() => setStep(3)} onBack={() => setStep(1)} />}
                {step === 3 && (treeOpen
                  ? <TreeExpansion onClose={() => setTreeOpen(false)} />
                  : <UnifiedBuilder onNext={() => setStep(4)} onOpenTree={() => setTreeOpen(true)} />
                )}
                {step === 4 && <PrePublishReview onNext={() => setStep(5)} onBack={() => setStep(3)} />}
                {step === 5 && <StakeholderDashboard onBack={() => setStep(4)} />}
              </main>
            </>
          ) : view === "case-study" ? (
            <main style={{ flex: 1, overflowY: "auto", background: C.card, borderRadius: "0 0 12px 12px" }}>
              <CaseStudy onOpenPrototype={(s) => { if (typeof s === "number") setStep(s); setView("prototype"); }} />
            </main>
          ) : (
            <main style={{ flex: 1, overflowY: "auto", background: C.card, borderRadius: "0 0 12px 12px" }}>
              <DesignSystem />
            </main>
          )}
        </div>
      </div>
      <CommentsLayer context={view === "prototype" ? `prototype:${step}` : view === "case-study" ? "case-study" : "design-system"} />
    </div>
  );
}
