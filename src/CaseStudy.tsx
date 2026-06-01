import React from "react";
import { MotionConfig } from "motion/react";
import {
  Zap, Target, Users, AlertTriangle, CheckCircle2, ArrowRight,
  Layers, Search, FileSearch, Activity, Sparkles,
} from "lucide-react";
import {
  MethodSelection, ExtractionPreview,
  PrePublishReview, StakeholderDashboard,
} from "./EicorePrototype";
import UnifiedBuilder from "./UnifiedBuilder";

// ─── Design tokens (matches saas-builder system) ──────────────────────────────
const BRAND = "#047857";
const BRAND_TINT = "#d1fae5";
const INK = "#0f172a";
const MUTED = "#475569";
const SUBTLE = "#64748b";
const BORDER = "#e2e8f0";
const SURFACE = "#f8fafc";

// ─── Content data ─────────────────────────────────────────────────────────────
const PAIN_POINTS = [
  { num: 1, flaw: "Attention Fragmentation", impact: "Errors and confidence scores live in 4 places — panic and skipped steps.", fix: "A dedicated Issues tab with one-click Resolve; the stepper carries a live 'Needs Attention' count." },
  { num: 2, flaw: "Passive Source Attribution", impact: "'From: BRD' is a text tag — users hunt through 5 PDFs manually.", fix: "Every value cites origin (BRD Pg 2, Sec 4.1); the Document Inspector opens that passage highlighted." },
  { num: 3, flaw: "Blind Navigation", impact: "Plan nodes give no signal of how close each one is to done.", fix: "The active stage expands its own sub-steps with a live progress bar." },
  { num: 4, flaw: "Flat Coverage Scroll", impact: "37 coverages in one flat list means endless vertical scrolling.", fix: "Coverages live under collapsible plan accordions — Mini, Medi, Max." },
  { num: 5, flaw: "Competing Side Drawers", impact: "Tree, Extraction, Issues and Docs tabs fight for the same panel.", fix: "Context-sensitive split — only the relevant panel surfaces while you're editing." },
  { num: 6, flaw: "Disconnected 'Mark Reviewed'", impact: "Save, value, and 'Mark Reviewed' are three separate clicks.", fix: "Save and the 'Mark Reviewed (n/151)' counter co-locate; resolving updates audit in place." },
  { num: 7, flaw: "Post-Hoc Shock", impact: "Critical errors surface only at the final pre-publish step.", fix: "Field-level amber/red borders surface weak values inline while editing." },
  { num: 8, flaw: "High-Risk Friction", impact: "Destructive actions (delete coverage, revert) lack visible feedback.", fix: "Standardized states — 'Draft Auto-saved', 'Revert' affordance, undo path." },
];

const PERSONAS = [
  { tag: "Persona 1", role: "Product Manager / Head of Product", motive: "Speed-to-market & compliance", need: "High-level coverage verification, exclusions, compliance checklists.", pain: "Blockers surface only at final pre-publish — hours of rework.", color: "#047857", bg: "#d1fae5" },
  { tag: "Persona 2", role: "Senior Actuarial Analyst", motive: "Precision & underwriting safety", need: "Verify complex tables — rate cards, co-pays, age bands — with 100% precision.", pain: "Source attribution is passive — no live link from a field back to its page.", color: "#0369a1", bg: "#e0f2fe" },
];

const PRINCIPLES = [
  { icon: <Activity size={18} color={BRAND} />, title: "Confidence-Coded Fields", body: "Low-confidence values carry amber borders and a 75% badge — risk is visible inline during editing, not at final review." },
  { icon: <FileSearch size={18} color={BRAND} />, title: "Inspect → Live Source Split", body: "Confidence badges open a Document Inspector pinned to canvas, scrolled to the exact BRD passage with the figure highlighted." },
  { icon: <Layers size={18} color={BRAND} />, title: "One Multi-Tab Workspace", body: "Tree, Extraction, Issues and Docs live in a single right-hand panel — product structure, audit, issues and source one click apart." },
  { icon: <Search size={18} color={BRAND} />, title: "Staged Navigation with Sub-Steps", body: "Left rail maps the five stages; the active stage expands to show its own sub-step progress." },
];

const SCREENS = [
  { n: 1, name: "Configuration Method", desc: "Three paths — AI extraction (primary), template (coming soon), manual — with a live file-upload queue.", render: () => <MethodSelection onNext={() => {}} /> },
  { n: 2, name: "AI Extraction & Audit", desc: "Split-pane source viewer + 89% extraction-quality audit + parameter tables with per-row confidence.", render: () => <ExtractionPreview onNext={() => {}} onBack={() => {}} /> },
  { n: 3, name: "Unified Product Workspace", desc: "The core 3-column screen — coverage navigation, overview/edit canvas, Tree/Extraction/Issues/Docs panel.", render: () => <UnifiedBuilder onNext={() => {}} onOpenTree={() => {}} /> },
  { n: 4, name: "Product Review & Publish", desc: "Pre-publish validator — publishing checklist (blockers + warnings), plan/coverage status, subsystem health.", render: () => <PrePublishReview onNext={() => {}} onBack={() => {}} /> },
  { n: 5, name: "Stakeholder Overview", desc: "Read-only shareable dashboard — metric cards plus per-plan Plan-Limits and Member-Details tables.", render: () => <StakeholderDashboard onBack={() => {}} /> },
];

const OUTCOMES = [
  { before: "3–5 days", after: "Hours of review", label: "Time to configure a product" },
  { before: "4 error surfaces", after: "1 unified Auditor", label: "Where validation lives" },
  { before: "37 flat items", after: "8 semantic groups", label: "Coverage navigation" },
  { before: "No source link", after: "Click-to-source", label: "From a value back to the BRD" },
];

const REFLECTIONS = [
  { label: "What's next", body: "Empirical confidence calibration — wire amber thresholds to real AI accuracy data from production." },
  { label: "Would change", body: "The 8-section accordion could collapse to a sticky 'jump-to' chip-row on long pages." },
  { label: "Open question", body: "How should the system handle a value the user accepts that AI later refines? Versioning vs override?" },
];

// ─── Final design showcase data (hi-fi PNGs from Figma) ──────────────────────
const DESIGNS = [
  {
    src: "/final-designs/01-workspace.png",
    label: "Tree Mode",
    title: "The whole plan as a single canvas.",
    summary: "A full-screen anatomy view — every parameter rendered as a card, grouped by category, connected by dependency edges. Switch tier with one click; issues count follows you.",
    features: [
      "Mini Plan root branches into 4 category columns (Plan Limits · Members · Coverages · Premium)",
      "Each parameter card carries a status — Verified · Missing · Low confidence · Blocker",
      "Per-card metadata — AI confidence %, dependency count, source page",
      "Side panel: ⌘K jump-to-any-field, tier picker with issue counts, filter parameters",
      "Floating Legend explains the four card states at the bottom-right",
      "Bottom roadmap progress shows the full lifecycle (Upload · Extract · Verify · Audit · Publish)",
    ],
  },
  {
    src: "/final-designs/02-drilldown.png",
    label: "Coverage Drill-Down",
    title: "From workspace to category in one click.",
    summary: "Selecting a category morphs the left rail into a Categories list with progress per group, while the workspace shows per-parameter 3-up values across Mini / Medi / Max.",
    features: [
      "Left rail switches to a Categories list — 33 categories with status dots and progress bars",
      "Plan Variants stay pinned at top so tier context never drops",
      "Parameter cards show MINI / MEDI / MAX values inline with confidence dot per tier",
      "'Needs review' chip flags the parameters demanding attention first",
      "Mini Extraction Health pixel grid in the bottom-left for ambient quality orientation",
    ],
  },
  {
    src: "/final-designs/03-parameter.png",
    label: "Parameter Editor",
    title: "The Trust Loop, expanded.",
    summary: "A single parameter — In-patient Hospitalisation — opens into a focused editor with the Parameter Drawer pinning the AI's source passage right next to the form.",
    features: [
      "Structured form: Name · Type · Description · Data Range · Limit Value · Applicability",
      "Drawer shows Extracted value alongside Your value — one click to accept or override",
      "Confidence badge inline — High confidence shown in green, Low in amber",
      "Source Passage highlights the exact BRD sentence at the cited page number",
      "Bidirectional link — jump from passage to parameter or from parameter to passage",
      "AI-assist input at the bottom — @-mention a colleague, ask AI, or leave a comment",
    ],
  },
  {
    src: "/final-designs/04-tree.png",
    label: "Unified Workspace",
    title: "The product builder's home screen.",
    summary: "Every signal needed to start verifying — extraction health, source documents, plan structure, and open issues — consolidated into one view without hunting across tabs.",
    features: [
      "89% extraction-health donut with confidence breakdown: 124 High · 40 Medium · 15 Low",
      "Field Map heatmap colours every one of 234 extracted fields by AI confidence",
      "Source pills let you jump straight to the active document — Rate Card, BRD, Policy Wording",
      "Right rail unifies Tree · Issues · Data Extracted · Document in one panel",
      "Mini/Medi/Max Plan Variants with per-category field counts and quality score",
      "Live Activity Feed with Resolve and Open-parameter shortcuts for every issue",
    ],
  },
  {
    src: "/final-designs/05-tree-drawer.png",
    label: "Tree + Parameter Drawer",
    title: "Inspect any card without losing the map.",
    summary: "Clicking a card on the Tree opens the Parameter Drawer on the right edge — the full canvas stays visible so dependencies and sibling values remain legible.",
    features: [
      "Drawer slides in from the right edge — tree canvas stays anchored as context",
      "Extracted value vs Your value side-by-side with confidence label",
      "Source Passage with highlighted BRD quote and bidirectional ↔ link",
      "Dependencies panel lists upstream rules (Premium Calculation · Member Eligibility Check)",
      "AI assist input — ask 'why this value?' without leaving the tree view",
      "← / → walks through sibling parameters in the same category; Esc closes",
    ],
  },
];

// ─── Workspace pattern mockups (Phase 2 designs, explained simply) ───────────
const TabRailMockup = () => (
  <div style={{ display: "flex", gap: 6, padding: 14, alignItems: "center", height: "100%" }}>
    {["Tree", "Issues", "Data", "Document"].map((t, i) => (
      <div key={t} style={{
        padding: "6px 11px", borderRadius: 7,
        background: i === 0 ? BRAND_TINT : "#fff",
        border: `1px solid ${i === 0 ? BRAND + "55" : BORDER}`,
        fontSize: 11, fontWeight: 600,
        color: i === 0 ? BRAND : SUBTLE,
      }}>{t}</div>
    ))}
  </div>
);

const HealthMapMockup = () => {
  const cells = [BRAND, BRAND, BRAND, "#f59e0b", BRAND, BRAND, BRAND, "#ef4444", BRAND, "#f59e0b",
                 BRAND, BRAND, "#f59e0b", BRAND, BRAND, BRAND, BRAND, BRAND, "#ef4444", BRAND,
                 "#f59e0b", BRAND, BRAND, BRAND, BRAND, BRAND, "#f59e0b", BRAND, BRAND, BRAND];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 14, height: "100%" }}>
      <div style={{ position: "relative", width: 56, height: 56, borderRadius: "50%", background: `conic-gradient(${BRAND} 0 89%, #e2e8f0 89% 100%)`, flexShrink: 0 }}>
        <div style={{ position: "absolute", inset: 6, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: INK }}>89%</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 2, flex: 1 }}>
        {cells.map((c, i) => (
          <div key={i} style={{ aspectRatio: "1", borderRadius: 2, background: c }} />
        ))}
      </div>
    </div>
  );
};

const PipelineMockup = () => (
  <div style={{ display: "flex", alignItems: "center", padding: 14, height: "100%", justifyContent: "space-between" }}>
    {["Upload", "Extract", "Verify", "Audit", "Publish"].map((s, i) => {
      const done = i < 2, active = i === 2;
      const color = done ? BRAND : active ? "#d97706" : "#94a3b8";
      return (
        <React.Fragment key={s}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: active ? `0 0 0 3px ${color}22` : "none" }} />
            <span style={{ fontSize: 10, fontWeight: 600, color, whiteSpace: "nowrap" }}>{s}</span>
          </div>
          {i < 4 && <div style={{ flex: 1, height: 1, background: "#cbd5e1", margin: "0 4px" }} />}
        </React.Fragment>
      );
    })}
  </div>
);

const TreeModeMockup = () => (
  <div style={{ padding: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, height: "100%", justifyContent: "center" }}>
    <div style={{ padding: "5px 12px", borderRadius: 7, background: BRAND_TINT, border: `1px solid ${BRAND}55`, fontSize: 10, fontWeight: 700, color: BRAND }}>Mini Plan</div>
    <div style={{ width: "60%", height: 1, background: "#cbd5e1" }} />
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5, width: "100%" }}>
      {[
        { label: "Plan Limits", color: BRAND },
        { label: "Members", color: BRAND },
        { label: "Coverages", color: "#f59e0b" },
        { label: "Premium", color: "#ef4444" },
      ].map((c) => (
        <div key={c.label} style={{
          padding: "4px 5px", borderRadius: 4, background: "#fff",
          border: `1px solid ${BORDER}`, fontSize: 8, fontWeight: 600,
          color: SUBTLE, textAlign: "center", lineHeight: 1.2,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: c.color }} />
          {c.label}
        </div>
      ))}
    </div>
  </div>
);

const DrawerMockup = () => (
  <div style={{ padding: 14, height: "100%", display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
    <div>
      <p style={{ fontSize: 8, color: SUBTLE, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Extracted · High confidence</p>
      <div style={{ padding: "5px 9px", background: BRAND_TINT, borderRadius: 5, fontSize: 10, fontWeight: 700, color: INK }}>Up to SI</div>
    </div>
    <div>
      <p style={{ fontSize: 8, color: SUBTLE, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>Source · BRD p.18 ↔</p>
      <div style={{ padding: 6, background: "#fafafa", border: `1px solid ${BORDER}`, borderRadius: 5, fontSize: 9, color: INK, lineHeight: 1.4 }}>
        <mark style={{ background: "#fde68a", padding: "0 2px", borderRadius: 2 }}>Hospitalisation expenses payable up to Sum Insured.</mark>
      </div>
    </div>
  </div>
);

const AIAssistMockup = () => (
  <div style={{ padding: 14, height: "100%", display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
    <div style={{ display: "flex", gap: 6, alignItems: "center", padding: "7px 9px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 7 }}>
      <Sparkles size={11} color={BRAND} />
      <span style={{ fontSize: 9, color: SUBTLE, flex: 1 }}>Ask AI or @-mention…</span>
      <div style={{ padding: "3px 9px", background: BRAND, color: "#fff", borderRadius: 4, fontSize: 9, fontWeight: 700 }}>Ask</div>
    </div>
    <div style={{ display: "flex", gap: 4 }}>
      <span style={{ padding: "2px 6px", background: "#fef3c7", borderRadius: 3, fontSize: 8, color: "#92400e", fontWeight: 600 }}>@Aisha</span>
      <span style={{ padding: "2px 6px", background: "#dbeafe", borderRadius: 3, fontSize: 8, color: "#1e40af", fontWeight: 600 }}>@Riya</span>
      <span style={{ padding: "2px 6px", background: BRAND_TINT, borderRadius: 3, fontSize: 8, color: BRAND, fontWeight: 600 }}>AI assist</span>
    </div>
  </div>
);

const PATTERNS = [
  { title: "Multi-Tab Right Rail", desc: "Tree, Issues, Data Extracted and Document share one panel — product structure, AI audit, source data and originals are all one click apart.", mockup: <TabRailMockup /> },
  { title: "Extraction Health + Field Map", desc: "An 89% donut and a confidence-coloured grid of every field — quality is visible before the user touches a single value.", mockup: <HealthMapMockup /> },
  { title: "Stage Pipeline", desc: "Upload → Extract → Verify → Audit → Publish — the full lifecycle sits as an always-visible chip row in the header.", mockup: <PipelineMockup /> },
  { title: "Tree Mode", desc: "A full-screen plan anatomy — categorised parameter cards (Plan Limits, Members, Coverages, Premium) with per-card status and dependency edges.", mockup: <TreeModeMockup /> },
  { title: "Parameter Drawer", desc: "Extracted value with confidence, your value, the source passage highlighted at the exact BRD page, and a bidirectional jump back to the document.", mockup: <DrawerMockup /> },
  { title: "AI Assist Inline", desc: "Every parameter has a comment input that doubles as an @-mention chat and an Ask AI surface — no context switch to a separate copilot.", mockup: <AIAssistMockup /> },
];

// ─── Small primitives ─────────────────────────────────────────────────────────
function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ width: 24, height: 2, background: BRAND }} />
      <span style={{ fontSize: 12, fontWeight: 600, color: SUBTLE, letterSpacing: "0.1em" }}>{n} — {label}</span>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 28, fontWeight: 700, color: INK, margin: "0 0 16px", letterSpacing: "-0.02em" }}>{children}</h2>;
}

// ─── Real-DOM screen thumbnail ────────────────────────────────────────────────
function ScreenThumb({ n, name, desc, onOpen, render }: { n: number; name: string; desc: string; onOpen: () => void; render: () => React.ReactNode }) {
  const SCALE = 0.29;
  const W = 1400, H = Math.round(W * 10 / 16); // 875
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <button onClick={onOpen} aria-label={`Open ${name} in prototype`} style={{
        position: "relative", width: "100%", aspectRatio: "16 / 10",
        borderRadius: 14, border: `1px solid ${BORDER}`, overflow: "hidden",
        background: "#F9FAFB", cursor: "pointer", padding: 0,
      }}>
        {/* Scaled screen */}
        <div style={{
          width: W, height: H,
          transform: `scale(${SCALE})`, transformOrigin: "top left",
          pointerEvents: "none", position: "absolute", top: 0, left: 0,
        }}>
          <div style={{ width: "100%", height: "100%", background: "#F9FAFB", padding: 24, boxSizing: "border-box" }}>
            <MotionConfig reducedMotion="always">{render()}</MotionConfig>
          </div>
        </div>
        {/* Step badge */}
        <div style={{
          position: "absolute", top: 10, left: 12, zIndex: 2,
          padding: "3px 9px", borderRadius: 6,
          background: "rgba(255,255,255,0.94)", border: `1px solid ${BORDER}`,
          fontSize: 11, fontWeight: 700, color: INK, letterSpacing: "0.02em",
        }}>0{n}</div>
        {/* Hover hint */}
        <div style={{
          position: "absolute", bottom: 10, right: 12, zIndex: 2,
          padding: "5px 10px", borderRadius: 100,
          background: BRAND, color: "#fff",
          fontSize: 11, fontWeight: 600,
          display: "inline-flex", alignItems: "center", gap: 5,
        }}>Open <ArrowRight size={12} /></div>
      </button>
      <div>
        <p style={{ fontSize: 15, fontWeight: 700, color: INK, margin: "0 0 4px" }}>{name}</p>
        <p style={{ fontSize: 13.5, color: SUBTLE, margin: 0, lineHeight: 1.5 }}>{desc}</p>
      </div>
    </div>
  );
}

// ─── Trust loop step + three CSS illustrations ───────────────────────────────
function LoopStep({ n, title, body, illustration }: { n: number; title: string; body: string; illustration: React.ReactNode }) {
  return (
    <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 22, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ width: 26, height: 26, borderRadius: "50%", background: BRAND, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>{n}</div>
        <p style={{ fontSize: 15, fontWeight: 700, color: INK, margin: 0, letterSpacing: "-0.01em" }}>{title}</p>
      </div>
      <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 14, marginBottom: 14, minHeight: 84 }}>
        {illustration}
      </div>
      <p style={{ fontSize: 13.5, color: MUTED, margin: 0, lineHeight: 1.55 }}>{body}</p>
    </div>
  );
}

const SpotIllustration = () => (
  <div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <p style={{ fontSize: 10, color: SUBTLE, margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Annual OPD Limit</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: INK, margin: 0 }}>Rs. 3,000</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 100, background: "#fef3c7", border: "1px solid #fde68a" }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#d97706" }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "#92400e" }}>75%</span>
      </div>
    </div>
    <p style={{ fontSize: 11, color: "#92400e", margin: "8px 0 0", fontWeight: 500 }}>Low confidence — user notices</p>
  </div>
);

const InspectIllustration = () => (
  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
    <div style={{ flex: 1, background: "#fafafa", border: `1px solid ${BORDER}`, borderRadius: 6, padding: 8 }}>
      <p style={{ fontSize: 9, color: SUBTLE, margin: "0 0 4px", fontWeight: 600 }}>BRD · Pg 12</p>
      <p style={{ fontSize: 9.5, color: INK, margin: 0, lineHeight: 1.5 }}>
        ...Mini plan <mark style={{ background: "#fde68a", color: INK, padding: "0 2px", borderRadius: 2 }}>capped at Rs. 3,000</mark>...
      </p>
    </div>
    <ArrowRight size={14} color={SUBTLE} style={{ flexShrink: 0 }} />
    <div style={{ width: 82, background: BRAND_TINT, borderRadius: 6, padding: 8 }}>
      <p style={{ fontSize: 9, color: BRAND, margin: "0 0 3px", fontWeight: 600 }}>Match</p>
      <p style={{ fontSize: 14, color: INK, fontWeight: 700, margin: 0 }}>3,000</p>
    </div>
  </div>
);

const ResolveIllustration = () => (
  <div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
      <div>
        <p style={{ fontSize: 10, color: SUBTLE, margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Annual OPD Limit</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: INK, margin: 0 }}>Rs. 3,000</p>
      </div>
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: BRAND, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CheckCircle2 size={12} color="#fff" />
      </div>
    </div>
    <div style={{ height: 5, borderRadius: 100, background: "#e2e8f0", overflow: "hidden", marginBottom: 5 }}>
      <div style={{ width: "35%", height: "100%", background: BRAND }} />
    </div>
    <p style={{ fontSize: 10, color: SUBTLE, margin: 0, fontWeight: 500 }}>13 of 37 verified</p>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function CaseStudy({ onOpenPrototype }: { onOpenPrototype: (step?: number) => void }) {
  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#ffffff" }}>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "64px 40px 100px", display: "flex", flexDirection: "column", gap: 80 }}>

        {/* HERO */}
        <div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 100, background: BRAND_TINT, color: BRAND, fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
            <Zap size={13} /> UX Case Study
          </span>
          <h1 style={{ fontSize: 48, lineHeight: 1.1, fontWeight: 700, letterSpacing: "-0.03em", color: INK, margin: "0 0 20px" }}>
            Eicore OneBuzz —<br />Product Plan Builder Redesign
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: MUTED, maxWidth: 720, margin: "0 0 28px" }}>
            Redesigning an AI-powered insurance Product Plan Builder — compressing 3–5 days of manual configuration into hours of intelligent, trustworthy review.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
            {["B2B InsurTech", "AI Workflow", "Enterprise UX", "Product Design"].map(t => (
              <span key={t} style={{ padding: "6px 14px", borderRadius: 100, border: "1px dashed #cbd5e1", fontSize: 13, color: SUBTLE, fontWeight: 500 }}>{t}</span>
            ))}
          </div>
          <button onClick={() => onOpenPrototype()} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", borderRadius: 10, background: BRAND, color: "#fff", fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer" }}>
            Open Interactive Prototype <ArrowRight size={17} />
          </button>
        </div>

        {/* ⭐ FINAL DESIGN SHOWCASE — positioned right after the hero for primary impact */}
        <div style={{
          marginLeft: -40, marginRight: -40,
          padding: "52px 40px",
          background: "#ffffff",
        }}>
          <div style={{ marginBottom: 44 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 100,
              background: BRAND, color: "#fff",
              fontSize: 11.5, fontWeight: 700, letterSpacing: "0.06em",
              marginBottom: 18,
            }}>
              <Sparkles size={13} /> FINAL DESIGNS · HI-FI SHOWCASE
            </span>
            <h2 style={{
              fontSize: 36, lineHeight: 1.15, fontWeight: 700,
              color: INK, margin: "0 0 14px", letterSpacing: "-0.025em",
            }}>The high-fidelity designs.</h2>
            <p style={{ fontSize: 16.5, lineHeight: 1.6, color: MUTED, maxWidth: 680, margin: 0 }}>
              Five core surfaces across the unified workspace. Each component traces back to a specific friction point retired by the audit — extraction trust, source attribution, drill-down navigation, and dependency visibility.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 52 }}>
            {DESIGNS.map((d, i) => (
              <div key={d.src}>
                <div style={{
                  borderRadius: 16, overflow: "hidden",
                  boxShadow: "0 14px 36px -10px rgba(15,23,42,0.20), 0 4px 10px -4px rgba(15,23,42,0.06)",
                  border: `1px solid ${BORDER}`,
                  background: "#fff",
                }}>
                  <img src={d.src} alt={d.title} style={{ width: "100%", display: "block" }} />
                </div>
                <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 28, alignItems: "start" }}>
                  <div>
                    <p style={{ fontSize: 11, color: BRAND, fontWeight: 700, letterSpacing: "0.08em", margin: "0 0 8px" }}>
                      0{i + 1} — {d.label.toUpperCase()}
                    </p>
                    <h3 style={{ fontSize: 22, fontWeight: 700, color: INK, margin: "0 0 10px", letterSpacing: "-0.015em", lineHeight: 1.25 }}>
                      {d.title}
                    </h3>
                    <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.6, margin: 0 }}>{d.summary}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: SUBTLE, fontWeight: 700, letterSpacing: "0.08em", margin: "0 0 12px" }}>KEY FEATURES</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 9 }}>
                      {d.features.map((f, j) => (
                        <li key={j} style={{ fontSize: 13.5, color: INK, display: "flex", gap: 10, lineHeight: 1.5 }}>
                          <CheckCircle2 size={14} color={BRAND} style={{ flexShrink: 0, marginTop: 3 }} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 01 CHALLENGE */}
        <div>
          <SectionLabel n="01" label="THE CHALLENGE" />
          <H2>A tool that knew too much — and told you nothing clearly.</H2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: MUTED, margin: "0 0 28px" }}>
            OneBuzz uses AI to extract insurance product configurations from BRDs, rate cards and policy wordings — compressing 3–5 days of manual config into hours of review. But the interface surfaced errors in 4 separate places, hid the connection between extracted values and their source documents, and confronted users with blocking validation only at the very end.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { stat: "3–5 days", label: "Manual config time before AI", color: "#dc2626" },
              { stat: "155 fields", label: "AI-extracted across 8 categories", color: BRAND },
              { stat: "8 UX flaws", label: "Identified in the interface audit", color: "#d97706" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "26px 22px", background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14 }}>
                <p style={{ fontSize: 32, fontWeight: 700, color: s.color, margin: "0 0 6px", lineHeight: 1 }}>{s.stat}</p>
                <p style={{ fontSize: 14, color: SUBTLE, margin: 0, lineHeight: 1.4 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 02 USERS */}
        <div>
          <SectionLabel n="02" label="USER ANALYSIS" />
          <H2>Domain experts who can't afford UI friction.</H2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: MUTED, margin: "0 0 24px" }}>
            The system serves deep insurance domain experts — not developers. They configure several products a quarter, each across multiple sessions, where a single misread co-payment bracket can cost millions.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {PERSONAS.map((p, i) => (
              <div key={i} style={{ padding: 24, background: p.bg, border: `1px solid ${p.color}22`, borderRadius: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Users size={15} color={p.color} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: p.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>{p.tag}</span>
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, color: INK, margin: "0 0 4px" }}>{p.role}</p>
                <p style={{ fontSize: 14, color: MUTED, margin: "0 0 12px" }}>Motive: <strong>{p.motive}</strong></p>
                <p style={{ fontSize: 14, color: MUTED, margin: "0 0 10px", lineHeight: 1.5 }}>Core need: {p.need}</p>
                <p style={{ fontSize: 13.5, color: p.color, fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>Pain: "{p.pain}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* 03 8 UX FLAWS */}
        <div>
          <SectionLabel n="03" label="8 UX FLAWS → REDESIGN RESPONSES" />
          <H2>An audit of the existing interface.</H2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: MUTED, margin: "0 0 24px" }}>
            Eight behaviors were undermining trust in the AI-extracted output. The redesign answers each with a specific, scoped affordance — no blanket rewrites.
          </p>
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
            {PAIN_POINTS.map((p, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "34px 1fr 1fr", gap: 18, padding: "16px 20px", borderBottom: i < PAIN_POINTS.length - 1 ? `1px solid ${BORDER}` : "none", background: i % 2 === 0 ? "#fff" : "#fafafa", alignItems: "start" }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: BRAND_TINT, color: BRAND, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{p.num}</span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <AlertTriangle size={13} color="#dc2626" />
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#dc2626", margin: 0 }}>{p.flaw}</p>
                  </div>
                  <p style={{ fontSize: 13.5, color: SUBTLE, margin: 0, lineHeight: 1.5 }}>{p.impact}</p>
                </div>
                <div style={{ padding: "10px 14px", borderRadius: 10, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <CheckCircle2 size={13} color="#16a34a" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#16a34a" }}>Redesign</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: "#166534", margin: 0, lineHeight: 1.5 }}>{p.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 04 PRINCIPLES */}
        <div>
          <SectionLabel n="04" label="DESIGN PRINCIPLES" />
          <H2>Four ideas that shaped every decision.</H2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: MUTED, margin: "0 0 24px" }}>
            Once the audit was clear, four principles became the rubric for every layout, control, and interaction in the rebuild.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {PRINCIPLES.map((d, i) => (
              <div key={i} style={{ padding: "24px", background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: BRAND_TINT, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>{d.icon}</div>
                <p style={{ fontSize: 16, fontWeight: 700, color: INK, margin: "0 0 8px" }}>{d.title}</p>
                <p style={{ fontSize: 14, color: SUBTLE, lineHeight: 1.6, margin: 0 }}>{d.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 05 FIVE SCREENS — real DOM thumbnails */}
        <div>
          <SectionLabel n="05" label="THE 5 REDESIGNED SCREENS" />
          <H2>Walk the product, screen by screen.</H2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: MUTED, margin: "0 0 32px" }}>
            Each thumbnail is a live render of the actual screen, scaled. Click any one to open it in the interactive prototype.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
            {SCREENS.map((s) => (
              <ScreenThumb
                key={s.n}
                n={s.n}
                name={s.name}
                desc={s.desc}
                onOpen={() => onOpenPrototype(s.n)}
                render={s.render}
              />
            ))}
          </div>
        </div>

        {/* 06 ANATOMY OF THE WORKSPACE */}
        <div>
          <SectionLabel n="06" label="ANATOMY OF THE WORKSPACE" />
          <H2>Six patterns make the unified workspace work.</H2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: MUTED, margin: "0 0 32px" }}>
            The principles materialised as six distinct UI patterns inside Screen 3. Each one retires a specific class of friction from the audit — and together they're the reason a 3–5 day workflow now takes hours.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            {PATTERNS.map((p, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ height: 130, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
                  {p.mockup}
                </div>
                <div style={{ paddingTop: 14 }}>
                  <p style={{ fontSize: 14.5, fontWeight: 700, color: INK, margin: "0 0 6px" }}>{p.title}</p>
                  <p style={{ fontSize: 13, color: SUBTLE, margin: 0, lineHeight: 1.55 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 07 TRUST LOOP */}
        <div>
          <SectionLabel n="07" label="THE TRUST LOOP" />
          <H2>Three clicks from suspicion to verified.</H2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: MUTED, margin: "0 0 32px" }}>
            The interaction that ties the whole system together — <strong style={{ color: INK }}>Spot · Inspect · Resolve</strong>. The user never has to leave the canvas to trust an AI extraction.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <LoopStep n={1} title="Spot" body="An amber 75% bead beside a field signals low confidence. The user scans — doesn't search." illustration={<SpotIllustration />} />
            <LoopStep n={2} title="Inspect" body="One click opens the source passage on the left, highlighted at Page 12 of the BRD. The user reads — doesn't hunt." illustration={<InspectIllustration />} />
            <LoopStep n={3} title="Resolve" body="Accept & Verify turns the bead green. The Auditor warning clears. Progress ticks 12/37 → 13/37." illustration={<ResolveIllustration />} />
          </div>
        </div>

        {/* 08 OUTCOMES */}
        <div>
          <SectionLabel n="08" label="OUTCOMES" />
          <H2>What the redesign moves.</H2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: MUTED, margin: "0 0 32px" }}>
            Each before / after pair retires a specific UX flaw from the audit.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {OUTCOMES.map((o, i) => (
              <div key={i} style={{ padding: 22, background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 14 }}>
                <p style={{ fontSize: 12, color: SUBTLE, margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{o.label}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ padding: "8px 14px", borderRadius: 10, background: "#fee2e2", border: "1px solid #fecaca", flex: "0 0 auto" }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#991b1b", margin: 0, whiteSpace: "nowrap" }}>{o.before}</p>
                  </div>
                  <ArrowRight size={16} color={SUBTLE} style={{ flexShrink: 0 }} />
                  <div style={{ padding: "8px 14px", borderRadius: 10, background: BRAND_TINT, border: `1px solid ${BRAND}33`, flex: "0 0 auto" }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: BRAND, margin: 0, whiteSpace: "nowrap" }}>{o.after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 09 REFLECTION */}
        <div>
          <SectionLabel n="09" label="REFLECTION" />
          <H2>What I'd carry forward.</H2>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: MUTED, margin: "0 0 24px" }}>
            The hardest decision wasn't visual — it was deciding how AI confidence should behave when it's wrong. The principle I'd carry forward: <strong style={{ color: INK }}>never make the user discover a problem at the end of a flow that the system could have surfaced at the start.</strong>
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            {REFLECTIONS.map((r, i) => (
              <div key={i} style={{ padding: 20, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12 }}>
                <p style={{ fontSize: 12, color: BRAND, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>{r.label}</p>
                <p style={{ fontSize: 14, color: MUTED, margin: 0, lineHeight: 1.55 }}>{r.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: "40px", background: "linear-gradient(135deg, #047857, #064e3b)", borderRadius: 18, textAlign: "center" }}>
          <Target size={28} color="#fff" style={{ margin: "0 auto 14px", opacity: 0.9 }} />
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>See it working end-to-end</h2>
          <p style={{ fontSize: 15.5, color: "#a7f3d0", margin: "0 0 24px", maxWidth: 520, marginInline: "auto", lineHeight: 1.6 }}>
            All 5 screens are fully interactive — upload &amp; extract, click confidence beads to inspect source, resolve auditor warnings in real time, walk the product from draft to stakeholder view.
          </p>
          <button onClick={() => onOpenPrototype()} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 10, background: "#fff", color: BRAND, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer" }}>
            Launch Prototype <ArrowRight size={17} />
          </button>
        </div>

      </div>
    </div>
  );
}
