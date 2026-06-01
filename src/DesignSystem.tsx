import React, { useState } from "react";
import {
  CheckCircle2, AlertTriangle, AlertCircle, XCircle,
  ChevronDown, ChevronRight, Eye, EyeOff, Search, X,
} from "lucide-react";

// ─── Design tokens (mirrors Figma DS collections) ────────────────────────────
const T = {
  brand:   "#047857", brandMid: "#059669", brandLight: "#10b981",
  brandTint: "#d1fae5", teal: "#0d9488",
  ink:     "#111827", ink2: "#374151",
  text2:   "#4b5563", text3:  "#6b7280", text4: "#9ca3af",
  border:  "#e5e7eb", border2: "#d1d5db",
  surf:    "#ffffff", surf2: "#f9fafb", surf3: "#f3f4f6",
  success: "#10b981", successLight: "#d1fae5",
  warning: "#f59e0b", warningLight: "#fef3c7",
  error:   "#ef4444", errorLight: "#fee2e2",
  info:    "#2563eb", infoLight: "#dbeafe",
};

// Dark mode palette
const D = {
  bg:   "#0f172a", surf: "#1e293b", surf2: "#334155",
  ink:  "#f8fafc", ink2: "#e2e8f0", text2: "#94a3b8",
  border: "#334155",
};

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ width: 24, height: 2, background: T.brand, flexShrink: 0 }} />
      <span style={{ fontSize: 11, fontWeight: 700, color: T.text3, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
        {n} — {label}
      </span>
    </div>
  );
}

function SectionH({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontSize: 24, fontWeight: 700, color: T.ink, margin: "0 0 6px", letterSpacing: "-0.02em" }}>{children}</h2>;
}
function SectionSub({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 14, color: T.text2, margin: "0 0 28px", lineHeight: 1.6 }}>{children}</p>;
}

// ─── 01 · COLOUR PALETTE ─────────────────────────────────────────────────────
type Swatch = { name: string; hex: string; badge?: string };

const COLOR_GROUPS: { label: string; swatches: Swatch[] }[] = [
  { label: "Brand Scale", swatches: [
    { name: "green-900", hex: "#064e3b" },
    { name: "green-700", hex: "#047857", badge: "Primary" },
    { name: "green-600", hex: "#059669", badge: "Secondary" },
    { name: "green-500", hex: "#10b981", badge: "Success" },
    { name: "teal",      hex: "#0d9488", badge: "Accent" },
    { name: "green-100", hex: "#d1fae5", badge: "Tint" },
  ]},
  { label: "Neutral Gray", swatches: [
    { name: "gray-900", hex: "#111827" }, { name: "gray-700", hex: "#374151" },
    { name: "gray-600", hex: "#4b5563" }, { name: "gray-400", hex: "#9ca3af" },
    { name: "gray-300", hex: "#d1d5db" }, { name: "gray-200", hex: "#e5e7eb" },
    { name: "gray-100", hex: "#f3f4f6" }, { name: "gray-50",  hex: "#f9fafb" },
  ]},
  { label: "States", swatches: [
    { name: "success",       hex: "#10b981", badge: "Success" },
    { name: "success-light", hex: "#d1fae5", badge: "bg" },
    { name: "warning",       hex: "#f59e0b", badge: "Warning" },
    { name: "warning-light", hex: "#fef3c7", badge: "bg" },
    { name: "error",         hex: "#ef4444", badge: "Error" },
    { name: "error-light",   hex: "#fee2e2", badge: "bg" },
    { name: "info",          hex: "#2563eb", badge: "Info" },
    { name: "info-light",    hex: "#dbeafe", badge: "bg" },
  ]},
  { label: "Semantic — Light Mode", swatches: [
    { name: "bg/page",       hex: "#f9fafb" }, { name: "bg/surface",    hex: "#ffffff" },
    { name: "accent/primary",hex: "#047857" }, { name: "text/primary",  hex: "#111827" },
    { name: "text/secondary",hex: "#4b5563" }, { name: "text/muted",    hex: "#9ca3af" },
    { name: "border/default",hex: "#e5e7eb" }, { name: "border/strong", hex: "#d1d5db" },
  ]},
];

function isLightColor(hex: string) {
  const n = hex.replace("#","");
  const r = parseInt(n.slice(0,2),16)/255;
  const g = parseInt(n.slice(2,4),16)/255;
  const b = parseInt(n.slice(4,6),16)/255;
  return (0.299*r + 0.587*g + 0.114*b) > 0.5;
}

function ColourSection() {
  return (
    <div>
      <SectionLabel n="01" label="Colour Palette" />
      <SectionH>Colour Palette</SectionH>
      <SectionSub>Every token binds to a Figma variable — swap Light/Dark in the right panel. Code syntax: <code style={{ background: T.surf3, padding: "1px 6px", borderRadius: 4, fontSize: 12 }}>var(--color-*)</code></SectionSub>
      {COLOR_GROUPS.map(grp => (
        <div key={grp.label} style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: T.text3, letterSpacing: "0.08em", textTransform: "uppercase" as const, margin: "0 0 12px" }}>{grp.label}</p>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 10 }}>
            {grp.swatches.map(sw => (
              <div key={sw.name} style={{ width: 130, borderRadius: 10, overflow: "hidden", border: `1px solid ${T.border}`, background: T.surf }}>
                <div style={{ height: 60, background: sw.hex, position: "relative" as const }}>
                  {sw.badge && (
                    <span style={{
                      position: "absolute" as const, top: 6, right: 6,
                      fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                      background: isLightColor(sw.hex) ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.2)",
                      color: isLightColor(sw.hex) ? "#111" : "#fff",
                    }}>{sw.badge}</span>
                  )}
                </div>
                <div style={{ padding: "7px 8px" }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: T.ink, margin: "0 0 2px", wordBreak: "break-all" as const }}>{sw.name}</p>
                  <p style={{ fontSize: 9, color: T.text3, margin: 0 }}>{sw.hex.toUpperCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── 02 · TYPOGRAPHY ─────────────────────────────────────────────────────────
const TYPE_ROWS = [
  { style: "Display/Hero",     size: 36, weight: 700, lh: 40, sample: "D.I.Y Health Insurance" },
  { style: "Heading/H1",       size: 28, weight: 700, lh: 34, sample: "Extraction Health Score" },
  { style: "Heading/H2",       size: 22, weight: 600, lh: 28, sample: "Unified Product Workspace" },
  { style: "Heading/H3",       size: 18, weight: 600, lh: 24, sample: "Coverage Details" },
  { style: "Heading/H4",       size: 16, weight: 600, lh: 22, sample: "Plan Variants · 3 fields" },
  { style: "Body/Large",       size: 16, weight: 400, lh: 24, sample: "AI extracts parameters from uploaded source documents." },
  { style: "Body/Regular",     size: 14, weight: 400, lh: 22, sample: "In-patient hospitalisation expenses are payable up to sum insured." },
  { style: "Body/Small",       size: 13, weight: 400, lh: 19, sample: "Source: BRD v5.4 · 64 pages · Rate Card 2025 · 12 pages" },
  { style: "Label/Regular",    size: 13, weight: 500, lh: 19, sample: "Mark verified  ·  Reset to AI  ·  Open parameter" },
  { style: "Caption/Regular",  size: 11, weight: 400, lh: 16, sample: "Updated 4 min ago  ·  AI 92%  ·  BRD p.18" },
  { style: "Overline/Regular", size: 10, weight: 700, lh: 15, sample: "EXTRACTION HEALTH  ·  PLAN VARIANTS", upper: true },
];

function TypographySection() {
  return (
    <div>
      <SectionLabel n="02" label="Typography Scale" />
      <SectionH>Typography Scale</SectionH>
      <SectionSub>Inter is the sole typeface. 19 named styles. Font loaded via Google Fonts.</SectionSub>
      <div style={{ border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
        {TYPE_ROWS.map((row, i) => (
          <div key={row.style} style={{
            display: "grid", gridTemplateColumns: "200px 1fr",
            padding: "14px 20px",
            borderBottom: i < TYPE_ROWS.length - 1 ? `1px solid ${T.border}` : "none",
            background: i % 2 === 0 ? T.surf : T.surf2,
            alignItems: "center", gap: 20,
          }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: T.brand, margin: "0 0 2px" }}>{row.style}</p>
              <p style={{ fontSize: 10, color: T.text3, margin: 0 }}>{row.size}px / {row.lh} · w{row.weight}</p>
            </div>
            <p style={{
              fontSize: Math.min(row.size, 24),
              fontWeight: row.weight,
              lineHeight: row.lh / row.size,
              color: T.ink, margin: 0,
              textTransform: row.upper ? "uppercase" as const : "none" as const,
              letterSpacing: row.upper ? "0.08em" : undefined,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
            }}>{row.sample}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 03 · SPACING & ELEVATION ────────────────────────────────────────────────
const SPACING = [
  { name: "xs",  px: 4  }, { name: "sm",  px: 8  }, { name: "md",  px: 12 },
  { name: "base",px: 16 }, { name: "lg",  px: 20 }, { name: "xl",  px: 24 },
  { name: "2xl", px: 32 }, { name: "3xl", px: 40 }, { name: "4xl", px: 48 },
  { name: "5xl", px: 60 }, { name: "6xl", px: 80 }, { name: "7xl", px: 120},
];
const RADII = [
  { name: "none", px: 0 }, { name: "sm", px: 6 }, { name: "md", px: 8 },
  { name: "lg", px: 12 }, { name: "xl", px: 16 }, { name: "full", px: 9999 },
];
const ELEVATIONS = [
  { name: "0 · Flat",    shadow: "none",                                              desc: "No shadow — inline content" },
  { name: "1 · Subtle",  shadow: "0 1px 2px rgba(0,0,0,0.05)",                       desc: "Tags, chips, badges" },
  { name: "2 · Card",    shadow: "0 4px 6px -1px rgba(0,0,0,0.10)",                  desc: "Cards, panels, dropdowns" },
  { name: "3 · Raised",  shadow: "0 10px 15px -3px rgba(0,0,0,0.10)",               desc: "Raised cards, popovers" },
  { name: "4 · Modal",   shadow: "0 20px 25px -5px rgba(0,0,0,0.15)",               desc: "Modals, drawers" },
  { name: "5 · Overlay", shadow: "0 25px 50px -12px rgba(0,0,0,0.25)",              desc: "Full-screen overlays" },
];

function SpacingSection() {
  return (
    <div>
      <SectionLabel n="03" label="Spacing & Elevation" />
      <SectionH>Spacing Scale</SectionH>
      <SectionSub>Base unit: 4px. Tokens xs(4) → 7xl(120). All bound to Spacing variables.</SectionSub>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 8, marginBottom: 40 }}>
        {SPACING.map(s => (
          <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: T.ink, width: 120, flexShrink: 0 }}>
              spacing/<strong>{s.name}</strong>
            </span>
            <span style={{ fontSize: 11, color: T.text3, width: 40, flexShrink: 0 }}>{s.px}px</span>
            <div style={{ height: 18, width: Math.min(s.px * 4, 480), background: T.brand, opacity: 0.55, borderRadius: 3 }} />
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 600, color: T.ink, margin: "0 0 16px" }}>Elevation</h3>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const, marginBottom: 40 }}>
        {ELEVATIONS.map(el => (
          <div key={el.name} style={{
            padding: "20px 18px", borderRadius: 12, background: T.surf,
            boxShadow: el.shadow, border: `1px solid ${el.shadow === "none" ? T.border : "transparent"}`,
            width: 170, flexShrink: 0,
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: T.ink, margin: "0 0 4px" }}>{el.name}</p>
            <p style={{ fontSize: 11, color: T.text3, margin: 0, lineHeight: 1.4 }}>{el.desc}</p>
          </div>
        ))}
      </div>

      <h3 style={{ fontSize: 18, fontWeight: 600, color: T.ink, margin: "0 0 16px" }}>Border Radius</h3>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" as const }}>
        {RADII.map(r => (
          <div key={r.name} style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 8 }}>
            <div style={{
              width: 56, height: 56,
              borderRadius: Math.min(r.px, 28),
              background: T.brandTint, border: `1.5px solid ${T.brand}`,
            }} />
            <p style={{ fontSize: 10, fontWeight: 600, color: T.ink, margin: 0 }}>radius/{r.name}</p>
            <p style={{ fontSize: 10, color: T.text3, margin: 0 }}>{r.px === 9999 ? "full" : `${r.px}px`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 04 · ATOMS ──────────────────────────────────────────────────────────────
const CTRL_STATES = ["Default", "Hover", "Focused", "Checked", "Disabled", "Error"] as const;
type CtrlState = typeof CTRL_STATES[number];

function ControlCell({ type, state }: { type: "checkbox" | "radio" | "toggle"; state: CtrlState }) {
  const isChecked  = state === "Checked";
  const isDisabled = state === "Disabled";
  const isError    = state === "Error";
  const isFocused  = state === "Focused";
  const border     = isError ? T.error : isChecked ? T.brand : isFocused ? T.brand : state === "Hover" ? "#9ca3af" : T.border;
  const focusRing  = isFocused || isChecked ? `0 0 0 3px ${isError ? T.errorLight : T.brandTint}` : undefined;

  if (type === "toggle") {
    return (
      <div style={{
        width: 40, height: 24, borderRadius: 12,
        background: isChecked ? T.brand : isError ? T.error : "#d1d5db",
        display: "flex", alignItems: "center",
        padding: "2px", boxSizing: "border-box" as const,
        justifyContent: isChecked ? "flex-end" : "flex-start",
        opacity: isDisabled ? 0.4 : 1,
        boxShadow: focusRing,
      }}>
        <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.15)" }} />
      </div>
    );
  }
  return (
    <div style={{
      width: 18, height: 18,
      borderRadius: type === "radio" ? "50%" : 4,
      border: `1.5px solid ${border}`,
      background: isChecked ? T.brand : T.surf,
      display: "flex", alignItems: "center", justifyContent: "center",
      opacity: isDisabled ? 0.4 : 1,
      boxShadow: focusRing,
    }}>
      {isChecked && <CheckCircle2 size={11} color="#fff" strokeWidth={3} />}
    </div>
  );
}

function AtomsSection() {
  return (
    <div>
      <SectionLabel n="04" label="Atoms" />
      <SectionH>Form Controls</SectionH>
      <SectionSub>Checkbox · Radio · Toggle — each state shown. Focus ring uses brand/green-100 spread.</SectionSub>

      <div style={{ border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 40 }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "120px repeat(6, 1fr)", background: T.surf2, padding: "10px 16px", borderBottom: `1px solid ${T.border}` }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.text3 }}>Control</span>
          {CTRL_STATES.map(s => <span key={s} style={{ fontSize: 10, fontWeight: 600, color: T.text3, textAlign: "center" as const }}>{s}</span>)}
        </div>
        {(["checkbox","radio","toggle"] as const).map((type, ti) => (
          <div key={type} style={{
            display: "grid", gridTemplateColumns: "120px repeat(6, 1fr)",
            padding: "14px 16px", alignItems: "center",
            borderBottom: ti < 2 ? `1px solid ${T.border}` : "none",
            background: ti % 2 === 0 ? T.surf : T.surf2,
          }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.ink, textTransform: "capitalize" as const }}>{type}</span>
            {CTRL_STATES.map(state => (
              <div key={state} style={{ display: "flex", justifyContent: "center" }}>
                <ControlCell type={type} state={state} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Avatar row */}
      <h3 style={{ fontSize: 18, fontWeight: 600, color: T.ink, margin: "0 0 8px" }}>Avatar</h3>
      <p style={{ fontSize: 13, color: T.text2, margin: "0 0 20px" }}>7 sizes × 2 variants (initials, placeholder).</p>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-end", marginBottom: 40 }}>
        {[20,24,32,40,48,64,80].map(sz => (
          <div key={sz} style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 8 }}>
            <div style={{
              width: sz, height: sz, borderRadius: sz, background: T.brand,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: Math.max(sz * 0.35, 8), fontWeight: 700, color: "#fff",
            }}>
              {sz >= 32 ? "SW" : "S"}
            </div>
            <div style={{
              width: sz, height: sz, borderRadius: sz, background: T.surf3,
              border: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: Math.max(sz * 0.35, 8), fontWeight: 600, color: T.text3,
            }}>
              {sz >= 32 ? "DU" : "D"}
            </div>
            <span style={{ fontSize: 9, color: T.text3 }}>{sz}px</span>
          </div>
        ))}
      </div>

      {/* Dividers */}
      <h3 style={{ fontSize: 18, fontWeight: 600, color: T.ink, margin: "0 0 8px" }}>Dividers</h3>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 16, marginBottom: 40 }}>
        {[
          { label: "Default", color: T.border, thick: 1, dashed: false },
          { label: "Strong",  color: T.border2, thick: 1, dashed: false },
          { label: "Accent",  color: T.brand,  thick: 2, dashed: false },
          { label: "Dashed",  color: T.border, thick: 1, dashed: true  },
        ].map(d => (
          <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: T.text2, width: 80, flexShrink: 0 }}>{d.label}</span>
            <div style={{
              flex: 1, height: d.thick, background: d.dashed ? "transparent" : d.color,
              borderTop: d.dashed ? `${d.thick}px dashed ${d.color}` : "none",
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 05 · MOLECULES ──────────────────────────────────────────────────────────
const BTN_VARIANTS = [
  { name:"Primary",   bg: T.brand,    fg: "#fff",     border: null },
  { name:"Secondary", bg: T.ink,      fg: "#fff",     border: null },
  { name:"Outline",   bg: T.surf,     fg: T.ink,      border: T.border },
  { name:"Ghost",     bg: "transparent", fg: T.text2, border: null },
  { name:"Danger",    bg: T.error,    fg: "#fff",     border: null },
  { name:"Link",      bg: "transparent", fg: T.brand, border: null, underline: true },
];
const BTN_SIZES = [
  { label: "XS", h: 24, fs: 11, px: 8 },
  { label: "SM", h: 32, fs: 12, px: 12 },
  { label: "MD", h: 40, fs: 13, px: 16 },
  { label: "LG", h: 48, fs: 14, px: 20 },
];
const BTN_STATES = ["Default","Hover","Active","Disabled","Loading"] as const;

function MoleculesSection() {
  return (
    <div>
      <SectionLabel n="05" label="Molecules" />

      {/* Button matrix */}
      <SectionH>Button</SectionH>
      <SectionSub>6 variants × 4 sizes × 5 states. All fully interactive in the prototype.</SectionSub>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 28, marginBottom: 48 }}>
        {BTN_VARIANTS.map(v => (
          <div key={v.name}>
            <p style={{ fontSize: 11, fontWeight: 700, color: T.text3, letterSpacing: "0.06em", textTransform: "uppercase" as const, margin: "0 0 10px" }}>{v.name}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
              {BTN_SIZES.map(sz => (
                <div key={sz.label} style={{ display: "flex", flexDirection: "column" as const, gap: 8, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 9, fontWeight: 600, color: T.text3 }}>{sz.label}</span>
                  {BTN_STATES.map(state => {
                    const isDisabled = state === "Disabled";
                    const isHover    = state === "Hover";
                    const isLoading  = state === "Loading";
                    return (
                      <div key={state} style={{
                        height: sz.h,
                        padding: `0 ${sz.px}px`,
                        borderRadius: 8,
                        background: isDisabled ? T.surf3 : (isHover && v.name === "Primary" ? T.brandMid : v.bg),
                        color: isDisabled ? T.text3 : v.fg,
                        border: v.border ? `1px solid ${isDisabled ? T.border : v.border}` : "none",
                        fontSize: sz.fs, fontWeight: 600,
                        display: "inline-flex", alignItems: "center", gap: 6,
                        opacity: isDisabled ? 0.45 : 1,
                        boxShadow: isHover ? "0 4px 6px -1px rgba(0,0,0,0.10)" : undefined,
                        textDecoration: v.underline && !isDisabled ? "underline" : "none",
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        minWidth: sz.h,
                      }}>
                        {isLoading
                          ? <div style={{ width: sz.h * 0.4, height: sz.h * 0.4, borderRadius: "50%", border: `1.5px solid`, borderColor: `${v.fg} transparent transparent`, animation: "spin 0.7s linear infinite" }} />
                          : "Button"
                        }
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tag / Chip */}
      <SectionH>Tag / Chip</SectionH>
      <SectionSub>6 variants. Status chips are used throughout the builder for confidence and verification states.</SectionSub>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const, marginBottom: 48 }}>
        {[
          { label: "B2B InsurTech",     bg: T.surf,     border: T.border,  fg: T.ink,    r: 7 },
          { label: "AI Workflow",       bg: T.surf,     border: T.border,  fg: T.ink,    r: 100, dashed: true },
          { label: "Enterprise UX",     bg: T.brandTint,border: null,      fg: T.brand,  r: 7 },
          { label: "Product Design",    bg: T.surf2,    border: T.border,  fg: T.ink,    r: 100 },
          { label: "Coverage Details ×",bg: T.surf,     border: T.border,  fg: T.ink,    r: 7, removable: true },
          { label: "● Verified",        bg: T.brandTint,border: null,      fg: T.brand,  r: 7, dot: true },
          { label: "● Low confidence",  bg: T.warningLight,border:null,    fg: T.warning,r: 7, dot: true },
          { label: "● Blocker",         bg: T.errorLight,border: null,     fg: T.error,  r: 7, dot: true },
        ].map((chip, i) => (
          <div key={i} style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "5px 11px", borderRadius: chip.r,
            background: chip.bg,
            border: chip.border ? `${chip.dashed ? "1px dashed" : "1px solid"} ${chip.border}` : "none",
            fontSize: 12, fontWeight: 600, color: chip.fg,
          }}>
            {chip.label}
          </div>
        ))}
      </div>

      {/* Input field */}
      <SectionH>Input Field</SectionH>
      <SectionSub>5 types × 7 states. All follow the label + input + helper text pattern.</SectionSub>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const }}>
        {[
          { label: "Default",    placeholder: "Enter value…",  border: T.border,  bg: T.surf },
          { label: "Focused",    placeholder: "Enter value…",  border: T.brand,   bg: T.surf, ring: `0 0 0 3px ${T.brandTint}` },
          { label: "Filled",     placeholder: "50,000",        border: T.border2, bg: T.surf, filled: true },
          { label: "Error",      placeholder: "Required",      border: T.error,   bg: T.surf, ring: `0 0 0 3px ${T.errorLight}`, error: true },
          { label: "Disabled",   placeholder: "Not available", border: T.border,  bg: T.surf2, disabled: true },
          { label: "Read-only",  placeholder: "Up to SI",      border: "transparent", bg: T.surf2 },
        ].map(inp => (
          <div key={inp.label} style={{ width: 160 }}>
            <p style={{ fontSize: 11, color: T.text3, fontWeight: 600, margin: "0 0 6px" }}>{inp.label}</p>
            <p style={{ fontSize: 12, fontWeight: 500, color: T.text2, margin: "0 0 4px" }}>Limit Value</p>
            <div style={{
              height: 38, padding: "0 10px", borderRadius: 8,
              border: `1.5px solid ${inp.border}`,
              background: inp.bg,
              display: "flex", alignItems: "center",
              boxShadow: inp.ring,
              opacity: inp.disabled ? 0.4 : 1,
            }}>
              <span style={{ fontSize: 13, color: inp.filled ? T.ink : T.text3 }}>{inp.placeholder}</span>
            </div>
            {inp.error && <p style={{ fontSize: 11, color: T.error, margin: "4px 0 0" }}>Value is required</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 06 · ORGANISMS ──────────────────────────────────────────────────────────
const FEED_ITEMS = [
  { kind: "BLOCKER", tier: "Mini", ago: "12m ago", msg: "Room rent cap missing in BRD for Mini tier.", color: T.error },
  { kind: "WARNING", tier: "Medi", ago: "2h ago",  msg: "OPD limit differs between BRD (₹8,000) and Brochure (₹7,500).", color: T.warning },
  { kind: "WARNING", tier: "Max",  ago: "3h ago",  msg: "Initial wait conflict — Brochure 15d vs Policy 30d.", color: T.warning },
];

const PARAM_CARDS = [
  { title: "In-patient Hospitalisation", value: "Up to SI",          state: "Verified",       ai: "92%", badge: "Verified",        bc: T.brand,   bbg: T.brandTint,   borderC: T.border },
  { title: "Zone Loading",               value: "0% / 10% / 20%",    state: "Low confidence", ai: "75%", badge: "Review",          bc: T.warning, bbg: T.warningLight,borderC: T.border },
  { title: "Room Rent Cap",              value: "Missing",            state: "Missing",        ai: "38%", badge: "Missing required",bc: T.error,   bbg: T.errorLight,  borderC: "#fca5a5" },
  { title: "OPD Cover",                  value: "₹3,000",            state: "Blocker",        ai: "38%", badge: "Blocker",         bc: T.error,   bbg: T.errorLight,  borderC: "#fca5a5" },
];

function OrganismsSection() {
  return (
    <div>
      <SectionLabel n="06" label="Organisms" />

      {/* Stage pipeline */}
      <SectionH>Stage Pipeline</SectionH>
      <SectionSub>5-step lifecycle. Shown in 3 states: Not started / In progress / Complete.</SectionSub>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 14, marginBottom: 48 }}>
        {[
          { label: "Not started", active: -1 },
          { label: "In progress (Verify)", active: 2 },
          { label: "Complete", active: 5 },
        ].map(pd => (
          <div key={pd.label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 11, color: T.text3, fontWeight: 600, width: 160, flexShrink: 0 }}>{pd.label}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 0, padding: "8px 16px", background: T.surf, border: `1px solid ${T.border}`, borderRadius: 100 }}>
              {["Upload","Extract","Verify","Audit","Publish"].map((s, i) => {
                const done = i < pd.active;
                const curr = i === pd.active;
                const c = done ? T.success : curr ? T.warning : T.text4;
                return (
                  <React.Fragment key={s}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: done ? T.success : curr ? T.warning : T.border, border: done || curr ? "none" : `1.5px solid ${T.border}` }} />
                      <span style={{ fontSize: 12, fontWeight: curr ? 700 : 400, color: c }}>{s}</span>
                    </div>
                    {i < 4 && <div style={{ width: 14, height: 1, background: T.border, margin: "0 6px" }} />}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Extraction Health Card */}
      <SectionH>Extraction Health Card</SectionH>
      <SectionSub>Primary overview card. 3 quality states: healthy ≥85% · medium ≥65% · low &lt;65%.</SectionSub>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" as const, marginBottom: 48 }}>
        {[
          { score: 89, hi: 124, med: 40, lo: 15, b: 2, w: 4, label: "In-progress" },
          { score: 100,hi: 155, med: 0,  lo: 0,  b: 0, w: 0, label: "Complete"    },
          { score: 61, hi: 80,  med: 45, lo: 30, b: 5, w: 8, label: "Low quality" },
        ].map(hv => {
          const sc = hv.score >= 85 ? T.success : hv.score >= 65 ? T.warning : T.error;
          return (
            <div key={hv.label} style={{
              width: 340, borderRadius: 14, background: T.surf,
              border: `1px solid ${T.border}`, padding: "20px 22px",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.06)",
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: T.text3, letterSpacing: "0.08em", textTransform: "uppercase" as const, margin: "0 0 12px" }}>EXTRACTION HEALTH</p>
              <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 12 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: `conic-gradient(${sc} 0 ${hv.score}%, ${T.border} ${hv.score}% 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" as const,
                }}>
                  <div style={{ position: "absolute" as const, inset: 7, borderRadius: "50%", background: T.surf, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: T.ink }}>{hv.score}%</span>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: T.ink, margin: "0 0 6px" }}>D.I.Y Health Insurance</p>
                  <div style={{ display: "flex", gap: 12 }}>
                    {[[T.success, hv.hi, "High"],[T.warning, hv.med, "Med"],[T.error, hv.lo, "Low"]].map(([col, n, lbl]) => (
                      <div key={lbl as string} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: col as string }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>{n as number}</span>
                        <span style={{ fontSize: 12, color: T.text3 }}>{lbl as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: hv.b ? T.error : T.text3 }}>⚠ {hv.b} Blockers</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: hv.w ? T.warning : T.text3 }}>△ {hv.w} Warnings</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Parameter Cards */}
      <SectionH>Parameter Card</SectionH>
      <SectionSub>4 states — Verified · Low Confidence · Missing · Blocker. Status badge + confidence + source.</SectionSub>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" as const, marginBottom: 48 }}>
        {PARAM_CARDS.map(pc => (
          <div key={pc.title} style={{
            width: 260, borderRadius: 10,
            background: pc.state === "Blocker" ? "#fff8f8" : T.surf,
            border: `1px solid ${pc.borderC}`,
            padding: "13px 14px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: T.success, margin: "0 0 6px" }}>• Coverages</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: T.ink, margin: "0 0 4px" }}>{pc.title}</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: pc.state === "Missing" ? T.text3 : T.ink, margin: "0 0 8px" }}>{pc.value}</p>
            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              {[`AI ${pc.ai}`, "+2 deps", "BRD p.1"].map(m => (
                <span key={m} style={{ fontSize: 10, color: T.text3 }}>{m}</span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ padding: "3px 8px", borderRadius: 5, background: pc.bbg, display: "inline-flex" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: pc.bc }}>{pc.badge}</span>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: T.brand }}>Edit →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Feed */}
      <SectionH>Activity Feed Item</SectionH>
      <SectionSub>Blocker (red) · Warning (amber). Each has Open parameter + Resolve actions.</SectionSub>
      <div style={{ width: 460, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
        {FEED_ITEMS.map((fi, i) => (
          <div key={i} style={{
            display: "flex", gap: 12, padding: "14px 16px",
            borderBottom: i < FEED_ITEMS.length - 1 ? `1px solid ${T.border}` : "none",
            background: T.surf,
          }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${fi.color}`, flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: fi.color, textTransform: "uppercase" as const }}>{fi.kind}</span>
                <span style={{ fontSize: 11, color: T.text3 }}>· {fi.tier}</span>
                <span style={{ fontSize: 11, color: T.text4, marginLeft: "auto" }}>{fi.ago}</span>
              </div>
              <p style={{ fontSize: 12, color: T.ink, margin: "0 0 6px", lineHeight: 1.45 }}>{fi.msg}</p>
              <div style={{ display: "flex", gap: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: T.brand, cursor: "pointer" }}>Open parameter</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: T.text3, cursor: "pointer" }}>Resolve</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 07 · DARK MODE ──────────────────────────────────────────────────────────
function DarkModeSection() {
  return (
    <div>
      <SectionLabel n="07" label="Dark Mode" />
      <SectionH>Light vs Dark</SectionH>
      <SectionSub>Mode swap via Figma Variable Modes (right panel). No manual color overrides — alias semantics to primitives only.</SectionSub>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" as const }}>
        {[
          { label: "Light Mode", bg: T.surf2, surface: T.surf, ink: T.ink,    muted: T.text2, border: T.border,  accent: T.brand },
          { label: "Dark Mode",  bg: D.bg,    surface: D.surf, ink: D.ink,    muted: D.text2, border: D.border,  accent: T.brandLight },
        ].map(mv => (
          <div key={mv.label} style={{ width: 380, borderRadius: 16, background: mv.bg, border: `1px solid ${mv.border}`, padding: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: mv.accent, margin: "0 0 16px" }}>{mv.label}</p>
            <div style={{
              background: mv.surface, border: `1px solid ${mv.border}`, borderRadius: 10,
              padding: 16, marginBottom: 14,
              boxShadow: "0 4px 8px rgba(0,0,0,0.10)",
            }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: mv.ink, margin: "0 0 4px" }}>In-patient Hospitalisation</p>
              <p style={{ fontSize: 12, color: mv.muted, margin: "0 0 12px" }}>Up to Sum Insured  ·  AI 92%  ·  BRD p.18</p>
              <div style={{ height: 4, borderRadius: 100, background: mv.border, overflow: "hidden" }}>
                <div style={{ width: "92%", height: "100%", background: mv.accent }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ padding: "8px 14px", borderRadius: 8, background: mv.accent, fontSize: 12, fontWeight: 600, color: "#fff" }}>Mark verified</div>
              <div style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${mv.border}`, fontSize: 12, fontWeight: 500, color: mv.muted }}>Reset to AI</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 08 · PARAMETER DRAWER ───────────────────────────────────────────────────
function DrawerSection() {
  return (
    <div>
      <SectionLabel n="08" label="Parameter Drawer" />
      <SectionH>Parameter Drawer</SectionH>
      <SectionSub>Slides in from the right edge of the workspace. The core Trust Loop interaction surface.</SectionSub>
      <div style={{ display: "flex", gap: 28, flexWrap: "wrap" as const }}>
        <div style={{
          width: 340, border: `1px solid ${T.border}`, borderRadius: 0, background: T.surf,
          boxShadow: "-4px 0 16px rgba(0,0,0,0.08)",
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "18px 20px 14px", borderBottom: `1px solid ${T.border}` }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: T.text3, margin: "0 0 4px", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>PARAMETER</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: T.ink, margin: 0 }}>In-patient Hospitalisation</p>
            </div>
            <div style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: T.text3 }}>
              <X size={14} />
            </div>
          </div>

          <div style={{ padding: 20, display: "flex", flexDirection: "column" as const, gap: 18 }}>
            {/* Tier pills */}
            <div style={{ display: "flex", gap: 8 }}>
              {[["Mini", T.success, true], ["Medi", T.warning, false], ["Max", T.error, false]].map(([t, c, active]) => (
                <div key={t as string} style={{
                  padding: "4px 10px", borderRadius: 100,
                  background: active ? T.brandTint : "transparent",
                  border: `1px solid ${active ? T.brand : T.border}`,
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: c as string }} />
                  <span style={{ fontSize: 12, fontWeight: active ? 700 : 400, color: active ? T.brand : T.ink }}>{t as string}</span>
                </div>
              ))}
            </div>

            {/* Extracted value */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: T.text3, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>EXTRACTED VALUE</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: T.success }}>High confidence</span>
              </div>
              <div style={{ padding: "9px 12px", borderRadius: 8, background: T.surf2 }}>
                <span style={{ fontSize: 13, color: T.text2 }}>Up to SI</span>
              </div>
            </div>

            {/* Your value */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: T.text3, letterSpacing: "0.08em", textTransform: "uppercase" as const, margin: "0 0 6px" }}>YOUR VALUE</p>
              <div style={{ padding: "9px 12px", borderRadius: 8, background: T.surf, border: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 13, color: T.ink }}>Up to SI</span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: `1px solid ${T.border}`, textAlign: "center" as const, fontSize: 12, fontWeight: 500, color: T.ink, cursor: "pointer" }}>Reset to AI</div>
              <div style={{ flex: 2, padding: "9px 0", borderRadius: 8, background: T.brand, textAlign: "center" as const, fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer" }}>✓  Mark verified</div>
            </div>

            {/* Source passage */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: T.text3, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>SOURCE PASSAGE</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: T.brand, cursor: "pointer" }}>Open document →</span>
              </div>
              <p style={{ fontSize: 11, color: T.text2, margin: "0 0 8px" }}>□ D.I.Y Health policy wording.docx  ·  p. 18</p>
              <div style={{ padding: "9px 10px", borderRadius: 6, background: "#fef9c3", marginBottom: 8 }}>
                <p style={{ fontSize: 12, color: T.ink, margin: 0, lineHeight: 1.45 }}>Hospitalisation expenses payable up to Sum Insured.</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 11, color: T.brand, cursor: "pointer" }}>← Jump from passage to parameter</span>
                <span style={{ fontSize: 10, color: T.text4 }}>Bidirectional link</span>
              </div>
            </div>

            {/* AI assist */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.surf }}>
              <span style={{ fontSize: 12, color: T.text4, flex: 1 }}>Write a comment, @-mention or ask AI…</span>
              <div style={{ padding: "4px 10px", borderRadius: 6, background: T.brand, fontSize: 11, fontWeight: 700, color: "#fff" }}>Ask</div>
            </div>
          </div>
        </div>

        {/* Annotations */}
        <div style={{ maxWidth: 280 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: T.ink, margin: "0 0 16px" }}>Key design decisions</p>
          {[
            { icon: "↔", label: "Bidirectional linking", desc: "Clicking the source passage jumps to the parameter. Clicking the bead jumps to the passage. One mental model, two directions." },
            { icon: "✓", label: "Accept = Verify", desc: "One click transitions confidence bead from amber → green and removes the issue from the Auditor simultaneously." },
            { icon: "⚡", label: "AI assist inline", desc: "No context switch — ask AI, @-mention, or comment without leaving the drawer or the canvas." },
            { icon: "⎋", label: "Keyboard navigation", desc: "← / → walks through sibling parameters. Esc closes. ⌘B toggles the sidebar." },
          ].map(ann => (
            <div key={ann.label} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: T.brandTint, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: T.brand }}>
                {ann.icon}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: T.ink, margin: "0 0 3px" }}>{ann.label}</p>
                <p style={{ fontSize: 12, color: T.text2, margin: 0, lineHeight: 1.5 }}>{ann.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 09 · MOTION ─────────────────────────────────────────────────────────────
function MotionSection() {
  return (
    <div>
      <SectionLabel n="09" label="Motion Tokens" />
      <SectionH>Motion Tokens</SectionH>
      <SectionSub>3 durations · 1 easing. All use cubic-bezier(0.4, 0, 0.2, 1).</SectionSub>
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" as const }}>
        {[
          { name: "Fast",  ms: 100, uses: "Hover states, confidence bead change, chip toggle" },
          { name: "Base",  ms: 200, uses: "Button hover, tab switch, dropdown open, modal" },
          { name: "Slow",  ms: 400, uses: "Page transitions, Parameter Drawer slide-in" },
        ].map(m => (
          <div key={m.name} style={{ flex: "1 1 280px", padding: 20, borderRadius: 12, border: `1px solid ${T.border}`, background: T.surf }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ padding: "5px 10px", borderRadius: 6, background: T.brandTint }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: T.brand }}>{m.ms}ms</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>duration/{m.name.toLowerCase()}</span>
            </div>
            <p style={{ fontSize: 12, color: T.text2, margin: "0 0 6px", lineHeight: 1.5 }}>{m.uses}</p>
            <p style={{ fontSize: 11, color: T.text3, margin: 0 }}>cubic-bezier(0.4, 0, 0.2, 1)</p>
          </div>
        ))}
      </div>
      <div style={{ padding: "12px 16px", borderRadius: 8, background: T.warningLight, border: `1px solid #fde68a`, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 16 }}>⚠</span>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#92400e", margin: 0 }}>
          <code style={{ background: "rgba(0,0,0,0.06)", padding: "1px 6px", borderRadius: 3 }}>prefers-reduced-motion</code>: all durations collapse to 0ms · no scale transforms.
        </p>
      </div>
    </div>
  );
}

// ─── 10 · ACCESSIBILITY ──────────────────────────────────────────────────────
function AccessibilitySection() {
  const rows = [
    { pair: "Text Primary on bg/page",        fg: "#111827", bg: "#F9FAFB", ratio: "15.3:1", pass: true },
    { pair: "Text Secondary on bg/surface",   fg: "#4B5563", bg: "#FFFFFF", ratio: "7.6:1",  pass: true },
    { pair: "Text Muted on bg/surface",       fg: "#9CA3AF", bg: "#FFFFFF", ratio: "3.0:1",  pass: false, note: "Use only for large text ≥18px bold, or decorative" },
    { pair: "White on accent/primary",        fg: "#FFFFFF", bg: "#047857", ratio: "5.1:1",  pass: true },
    { pair: "White on state/error",           fg: "#FFFFFF", bg: "#EF4444", ratio: "3.9:1",  pass: false, note: "Darken to #DC2626 (5.0:1) for AA compliance" },
    { pair: "Brand on brand-tint bg",         fg: "#047857", bg: "#D1FAE5", ratio: "4.6:1",  pass: true },
  ];
  return (
    <div>
      <SectionLabel n="10" label="Accessibility" />
      <SectionH>Accessibility Audit</SectionH>
      <SectionSub>WCAG 2.1 AA. Body text requires 4.5:1, large text/icons 3:1. Failing pairs shown with corrected alternatives.</SectionSub>
      <div style={{ border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 32 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 90px 1fr", gap: 0, padding: "10px 16px", background: T.surf2, borderBottom: `1px solid ${T.border}` }}>
          {["Pair", "Ratio", "Result", "Note"].map(h => (
            <span key={h} style={{ fontSize: 11, fontWeight: 700, color: T.text3 }}>{h}</span>
          ))}
        </div>
        {rows.map((r, i) => (
          <div key={r.pair} style={{
            display: "grid", gridTemplateColumns: "1fr 80px 90px 1fr",
            padding: "12px 16px", alignItems: "center",
            borderBottom: i < rows.length - 1 ? `1px solid ${T.border}` : "none",
            background: i % 2 === 0 ? T.surf : T.surf2,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 16, height: 16, borderRadius: 3, background: r.fg, border: `1px solid ${T.border}`, flexShrink: 0 }} />
              <div style={{ width: 16, height: 16, borderRadius: 3, background: r.bg, border: `1px solid ${T.border}`, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: T.ink }}>{r.pair}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.ink }}>{r.ratio}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {r.pass
                ? <CheckCircle2 size={13} color={T.success} />
                : <XCircle size={13} color={T.error} />
              }
              <span style={{ fontSize: 12, fontWeight: 600, color: r.pass ? T.success : T.error }}>{r.pass ? "AA Pass" : "Fail"}</span>
            </div>
            <span style={{ fontSize: 11, color: r.pass ? T.text3 : T.warning }}>{r.note || "—"}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {[
          { icon: "⌨", label: "Keyboard Navigation", items: ["Tab / Shift+Tab — focus order", "Enter / Space — activate", "Esc — close drawer/modal", "← / → — walk parameters in Tree", "⌘B — toggle sidebar"] },
          { icon: "👁", label: "Focus Visibility", items: ["2px solid brand/green-700", "3px offset using box-shadow spread", "Applies only on :focus-visible", "Never on :focus (avoids click ring)", "Focus ring shows on all interactive atoms"] },
          { icon: "📏", label: "Touch Targets", items: ["Minimum 44×44px on mobile", "All buttons MD(40px)+ on desktop", "Icon-only buttons include padding area", "Form controls: 18×18px + 13px padding each side", "prefers-reduced-motion respected"] },
        ].map(card => (
          <div key={card.label} style={{ padding: 20, borderRadius: 12, border: `1px solid ${T.border}`, background: T.surf }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: T.brandTint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{card.icon}</div>
              <p style={{ fontSize: 14, fontWeight: 700, color: T.ink, margin: 0 }}>{card.label}</p>
            </div>
            <ul style={{ padding: "0 0 0 16px", margin: 0 }}>
              {card.items.map(item => (
                <li key={item} style={{ fontSize: 12, color: T.text2, lineHeight: 1.7 }}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Variable collections summary ────────────────────────────────────────────
function VariablesSection() {
  const collections = [
    { name: "Primitives", modes: ["Value"], count: 70, desc: "Raw color scale, spacing steps, radius, opacity, duration, font-sizes" },
    { name: "Color",      modes: ["Light", "Dark"], count: 26, desc: "Semantic aliases — bg/*, text/*, accent/*, border/*, state/*" },
    { name: "Spacing",    modes: ["Value"], count: 12, desc: "xs(4) → 7xl(120) — all bound to GAP and WIDTH_HEIGHT scopes" },
    { name: "Typography", modes: ["Value"], count: 26, desc: "Font sizes, weights, line-heights, letter-spacings" },
    { name: "Breakpoints",modes: ["Mobile","Tablet","Desktop","Wide"], count: 4, desc: "columns · gutter · margin · max-width per breakpoint" },
  ];
  return (
    <div>
      <SectionLabel n="00" label="Variable Collections" />
      <SectionH>5 Variable Collections · 138 Tokens</SectionH>
      <SectionSub>All collections live in the Figma file on the "Design System — Eicore OneBuzz" page. Every component binds to semantic tokens, never to raw primitives.</SectionSub>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
        {collections.map(c => (
          <div key={c.name} style={{ display: "flex", alignItems: "flex-start", gap: 20, padding: "18px 20px", background: T.surf, border: `1px solid ${T.border}`, borderRadius: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: T.brandTint, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: T.brand }}>{c.count}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: T.ink, margin: 0 }}>{c.name}</p>
                <div style={{ display: "flex", gap: 6 }}>
                  {c.modes.map(m => (
                    <span key={m} style={{ padding: "2px 8px", borderRadius: 100, background: T.surf3, border: `1px solid ${T.border}`, fontSize: 10, fontWeight: 600, color: T.text3 }}>{m}</span>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: 13, color: T.text2, margin: 0 }}>{c.desc}</p>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.text3, flexShrink: 0 }}>{c.count} vars</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Nav anchors ─────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "variables",    label: "Variables"    },
  { id: "colours",      label: "Colours"      },
  { id: "typography",   label: "Typography"   },
  { id: "spacing",      label: "Spacing"      },
  { id: "atoms",        label: "Atoms"        },
  { id: "molecules",    label: "Molecules"    },
  { id: "organisms",    label: "Organisms"    },
  { id: "dark-mode",    label: "Dark Mode"    },
  { id: "drawer",       label: "Drawer"       },
  { id: "motion",       label: "Motion"       },
  { id: "a11y",         label: "A11y"         },
];

// ─── Main export ──────────────────────────────────────────────────────────────
export default function DesignSystem() {
  const [activeSection, setActiveSection] = useState("variables");

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden", background: T.surf }}>

      {/* Left nav */}
      <nav style={{
        width: 180, flexShrink: 0,
        borderRight: `1px solid ${T.border}`,
        background: T.surf, overflowY: "auto",
        padding: "24px 0",
      }}>
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: T.brand, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>DS</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: T.ink }}>Design System</span>
          </div>
          <p style={{ fontSize: 10, color: T.text3, margin: 0 }}>v1.0 · Eicore OneBuzz</p>
        </div>
        <div style={{ height: 1, background: T.border, margin: "0 0 12px" }} />
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => {
            setActiveSection(s.id);
            document.getElementById(`ds-sec-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
          }} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 8,
            padding: "7px 16px", border: "none", background: "transparent",
            cursor: "pointer", textAlign: "left" as const,
            borderLeft: `2px solid ${activeSection === s.id ? T.brand : "transparent"}`,
            fontSize: 12.5, fontWeight: activeSection === s.id ? 600 : 400,
            color: activeSection === s.id ? T.brand : T.text2,
          }}>
            {s.label}
          </button>
        ))}

        <div style={{ height: 1, background: T.border, margin: "12px 0" }} />
        <div style={{ padding: "0 16px" }}>
          <p style={{ fontSize: 10, color: T.text4, margin: "0 0 6px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" as const }}>Figma file</p>
          <a href="https://www.figma.com/design/Kvmh94Muy31SuAT8Ixs4Mr/Swosti_Portfolio_2026?node-id=1738-70145" target="_blank" rel="noreferrer"
            style={{ fontSize: 11, color: T.brand, textDecoration: "none", fontWeight: 500 }}>
            Open in Figma →
          </a>
        </div>
      </nav>

      {/* Content */}
      <main style={{ flex: 1, overflowY: "auto", background: T.surf2 }}>
        {/* Banner */}
        <div style={{ background: T.brand, padding: "32px 60px", display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#a7f3d0", margin: "0 0 6px", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Design System</p>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.025em" }}>Eicore OneBuzz v1.0</h1>
            <p style={{ fontSize: 14, color: "#a7f3d0", margin: 0 }}>5 variable collections · 138 tokens · 19 text styles · 6 elevation levels · Inter</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {[["138", "Variables"], ["5", "Collections"], ["2", "Modes"]].map(([n, l]) => (
              <div key={l} style={{ padding: "14px 18px", borderRadius: 10, background: "rgba(255,255,255,0.12)", textAlign: "center" as const }}>
                <p style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 2px" }}>{n}</p>
                <p style={{ fontSize: 11, color: "#a7f3d0", margin: 0 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 60px 100px", display: "flex", flexDirection: "column" as const, gap: 80 }}>
          <div id="ds-sec-variables">    <VariablesSection />   </div>
          <div style={{ height: 1, background: T.border }} />
          <div id="ds-sec-colours">     <ColourSection />      </div>
          <div style={{ height: 1, background: T.border }} />
          <div id="ds-sec-typography">  <TypographySection />  </div>
          <div style={{ height: 1, background: T.border }} />
          <div id="ds-sec-spacing">     <SpacingSection />     </div>
          <div style={{ height: 1, background: T.border }} />
          <div id="ds-sec-atoms">       <AtomsSection />       </div>
          <div style={{ height: 1, background: T.border }} />
          <div id="ds-sec-molecules">   <MoleculesSection />   </div>
          <div style={{ height: 1, background: T.border }} />
          <div id="ds-sec-organisms">   <OrganismsSection />   </div>
          <div style={{ height: 1, background: T.border }} />
          <div id="ds-sec-dark-mode">   <DarkModeSection />    </div>
          <div style={{ height: 1, background: T.border }} />
          <div id="ds-sec-drawer">      <DrawerSection />      </div>
          <div style={{ height: 1, background: T.border }} />
          <div id="ds-sec-motion">      <MotionSection />      </div>
          <div style={{ height: 1, background: T.border }} />
          <div id="ds-sec-a11y">        <AccessibilitySection /></div>
        </div>
      </main>
    </div>
  );
}
