import React from "react";
import { Zap, Target, Users, AlertTriangle, CheckCircle2, ArrowRight, Layers, Search, FileSearch, Activity } from "lucide-react";

const BRAND = "#047857";
const BRAND_TINT = "#d1fae5";

const PAIN_POINTS = [
  { num: 1, flaw: "Attention Fragmentation", impact: "Errors and confidence scores live in 4 places at once — panic and skipped steps.", fix: "A dedicated Issues tab lists every blocker and warning with one-click Resolve, and the stepper carries a live 'Needs Attention' count." },
  { num: 2, flaw: "Passive Source Attribution", impact: "\"From: BRD\" is just a text tag — users hunt through 5 separate PDFs manually.", fix: "Every parameter cites its origin (e.g. 'BRD Pg 2, Sec 4.1') and the Document Inspector opens that exact passage, highlighted." },
  { num: 3, flaw: "Blind Navigation", impact: "Plan nodes give no signal of how close each is to done.", fix: "The staged left rail expands the active stage into sub-steps with a live progress bar." },
  { num: 4, flaw: "Flat Coverage Scroll", impact: "37 coverages in one long flat list means endless vertical scrolling.", fix: "Coverages sit under collapsible plan accordions (Mini / Medi / Max) in the navigation column." },
  { num: 5, flaw: "Post-Hoc Shock", impact: "Critical errors (T&C at 38% Poor) surface only at the final pre-publish step.", fix: "Field-level confidence colouring — amber / red borders and badges — surfaces weak values inline while editing." },
  { num: 6, flaw: "Disconnected Mark-Reviewed", impact: "Typing a value, saving and ticking 'Mark Reviewed' are three separate clicks.", fix: "Save and the Overview 'Mark Reviewed (0/151)' counter are co-located, and resolving an issue updates the audit in place." },
];

const PERSONAS = [
  { tag: "Persona 1", role: "Product Manager / Head of Product", motive: "Speed-to-market & compliance", need: "High-level coverage verification, exclusions and compliance checklists.", pain: "Validation failures discovered at the final pre-publish step after hours of work.", color: "#047857", bg: "#d1fae5" },
  { tag: "Persona 2", role: "Senior Actuarial Analyst", motive: "Precision & underwriting safety", need: "Verify complex tables — rate cards, co-pays, age bands — with 100% precision.", pain: "Source attribution is passive — no live link from a field back to its page in the document.", color: "#0369a1", bg: "#e0f2fe" },
];

const DECISIONS = [
  { icon: <Activity size={18} color={BRAND} />, title: "Confidence-Coded Fields", body: "Low-confidence values carry amber borders and a 75% badge, missing data turns the field red — so risk is visible inline during editing rather than only at final review." },
  { icon: <FileSearch size={18} color={BRAND} />, title: "Inspect → Live Source Split", body: "The confidence badge and the per-field 'Inspect' link open a Document Inspector pinned to the canvas, scrolled to the exact BRD passage with the figure highlighted." },
  { icon: <Layers size={18} color={BRAND} />, title: "One Multi-Tab Workspace Panel", body: "Tree, Extraction, Issues and Docs live in a single right-hand panel, so product structure, AI audit, open issues and source documents are always one click apart." },
  { icon: <Search size={18} color={BRAND} />, title: "Staged Navigation with Sub-Steps", body: "The left rail maps the five stages from Configuration to Stakeholder Overview, and the active stage expands to show its own sub-step progress." },
];

const SCREENS = [
  { n: 1, name: "Configuration Method", desc: "Generate via AI (primary upload) alongside Template (coming soon) and Manual paths, with a live file-upload queue." },
  { n: 2, name: "AI Extraction & Audit", desc: "Split-pane: source document viewer + 89% extraction-quality audit, extractor notes, and parameter tables with per-row confidence." },
  { n: 3, name: "Unified Product Workspace", desc: "The core 3-column screen — coverage navigation, a dynamic overview/edit canvas, and the Tree/Extraction/Issues/Docs panel." },
  { n: 4, name: "Product Review & Publish", desc: "Pre-publish validator — publishing checklist (blockers + warnings), plan/coverage config status, and subsystem health cards." },
  { n: 5, name: "Stakeholder Overview", desc: "Read-only shareable dashboard — metric cards plus per-plan Plan-Limits and Member-Details tables." },
];

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ width: 24, height: 2, background: BRAND }} />
      <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b", letterSpacing: "0.1em" }}>{n} — {label}</span>
    </div>
  );
}

export default function CaseStudy({ onOpenPrototype }: { onOpenPrototype: () => void }) {
  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#ffffff" }}>
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "64px 40px 100px", display: "flex", flexDirection: "column", gap: 64 }}>

        {/* Hero */}
        <div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 100, background: BRAND_TINT, color: BRAND, fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
            <Zap size={13} /> UX Case Study
          </span>
          <h1 style={{ fontSize: 48, lineHeight: 1.1, fontWeight: 700, letterSpacing: "-0.03em", color: "#0f172a", margin: "0 0 20px" }}>
            Eicore OneBuzz —<br />Product Plan Builder Redesign
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "#475569", maxWidth: 720, margin: "0 0 28px" }}>
            Redesigning an AI-powered insurance Product Plan Builder — compressing 3–5 days of manual configuration into hours of intelligent, trustworthy review.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
            {["B2B InsurTech", "AI Workflow", "Enterprise UX", "Product Design"].map(t => (
              <span key={t} style={{ padding: "6px 14px", borderRadius: 100, border: "1px dashed #cbd5e1", fontSize: 13, color: "#64748b", fontWeight: 500 }}>{t}</span>
            ))}
          </div>
          <button onClick={onOpenPrototype}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", borderRadius: 10, background: BRAND, color: "#fff", fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer" }}>
            Open Interactive Prototype <ArrowRight size={17} />
          </button>
        </div>

        {/* Challenge */}
        <div>
          <SectionLabel n="01" label="THE CHALLENGE" />
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", margin: "0 0 16px", letterSpacing: "-0.02em" }}>A tool that knew too much — and told you nothing clearly.</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#475569", margin: "0 0 28px" }}>
            Eicore's OneBuzz platform uses AI to extract insurance product configurations from uploaded source documents (BRDs, rate cards, policy wordings) — compressing a 3–5 day manual process into hours of review. But the interface surfaced errors in 4 separate places simultaneously, hid the connection between extracted values and their source documents, and confronted users with blocking validation failures only at the very end of the workflow.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { stat: "3–5 days", label: "Manual config time before AI", color: "#dc2626" },
              { stat: "155 fields", label: "AI-extracted across 8 categories", color: BRAND },
              { stat: "8 UX flaws", label: "Identified in the interface audit", color: "#d97706" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "26px 22px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14 }}>
                <p style={{ fontSize: 32, fontWeight: 700, color: s.color, margin: "0 0 6px", lineHeight: 1 }}>{s.stat}</p>
                <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.4 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Users */}
        <div>
          <SectionLabel n="02" label="USER ANALYSIS" />
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Domain experts who can't afford UI friction.</h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#475569", margin: "0 0 24px" }}>
            The system serves deep insurance domain experts — not developers. They configure several products a quarter, each across multiple sessions, where a single misread co-payment bracket can cost millions.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {PERSONAS.map((p, i) => (
              <div key={i} style={{ padding: 24, background: p.bg, border: `1px solid ${p.color}22`, borderRadius: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <Users size={15} color={p.color} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: p.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>{p.tag}</span>
                </div>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>{p.role}</p>
                <p style={{ fontSize: 14, color: "#475569", margin: "0 0 12px" }}>Motive: <strong>{p.motive}</strong></p>
                <p style={{ fontSize: 14, color: "#475569", margin: "0 0 10px", lineHeight: 1.5 }}>Core need: {p.need}</p>
                <p style={{ fontSize: 13.5, color: p.color, fontStyle: "italic", margin: 0, lineHeight: 1.5 }}>Pain: "{p.pain}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pain points */}
        <div>
          <SectionLabel n="03" label="6 UX FLAWS → REDESIGN RESPONSES" />
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden" }}>
            {PAIN_POINTS.map((p, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "34px 1fr 1fr", gap: 18, padding: "16px 20px", borderBottom: i < PAIN_POINTS.length - 1 ? "1px solid #e2e8f0" : "none", background: i % 2 === 0 ? "#fff" : "#fafafa", alignItems: "start" }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", background: BRAND_TINT, color: BRAND, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{p.num}</span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <AlertTriangle size={13} color="#dc2626" />
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#dc2626", margin: 0 }}>{p.flaw}</p>
                  </div>
                  <p style={{ fontSize: 13.5, color: "#64748b", margin: 0, lineHeight: 1.5 }}>{p.impact}</p>
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

        {/* Screen flow */}
        <div>
          <SectionLabel n="04" label="THE 5 REDESIGNED SCREENS" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {SCREENS.map((s) => (
              <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 22px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: BRAND, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>{s.n}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 3px" }}>{s.name}</p>
                  <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
                </div>
                {s.n < SCREENS.length && <ArrowRight size={16} color="#cbd5e1" />}
              </div>
            ))}
          </div>
        </div>

        {/* Design decisions */}
        <div>
          <SectionLabel n="05" label="KEY DESIGN DECISIONS" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {DECISIONS.map((d, i) => (
              <div key={i} style={{ padding: "24px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: BRAND_TINT, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>{d.icon}</div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 8px" }}>{d.title}</p>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>{d.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: "40px", background: "linear-gradient(135deg, #047857, #064e3b)", borderRadius: 18, textAlign: "center" }}>
          <Target size={28} color="#fff" style={{ margin: "0 auto 14px", opacity: 0.9 }} />
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>See it working end-to-end</h2>
          <p style={{ fontSize: 15.5, color: "#a7f3d0", margin: "0 0 24px", maxWidth: 520, marginInline: "auto", lineHeight: 1.6 }}>
            All 5 screens are fully interactive — upload &amp; extract, click confidence beads to inspect source, resolve auditor warnings in real time, and walk the product from draft to stakeholder view.
          </p>
          <button onClick={onOpenPrototype}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 10, background: "#fff", color: BRAND, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer" }}>
            Launch Prototype <ArrowRight size={17} />
          </button>
        </div>

      </div>
    </div>
  );
}
