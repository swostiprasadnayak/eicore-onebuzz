import type { CSSProperties } from "react";

// ─── saas-builder design tokens ───────────────────────────────────────────────
export const C = {
  // surfaces
  shell: "#E5E7EB",
  card: "#FFFFFF",
  bgTertiary: "#F9FAFB",
  // text
  text: "#111827",
  text2: "#4B5563",
  text3: "#9CA3AF",
  // brand (deep teal/green)
  brand: "#047857",
  brandSecondary: "#059669",
  accent: "#0D9488",
  brandTint: "rgba(4, 120, 87, 0.1)",
  brandTintSoft: "rgba(4, 120, 87, 0.06)",
  // status
  success: "#10B981",
  successTint: "rgba(16, 185, 129, 0.1)",
  successTintSoft: "rgba(16, 185, 129, 0.05)",
  warning: "#F59E0B",
  warningTint: "rgba(245, 158, 11, 0.1)",
  warningTintSoft: "rgba(245, 158, 11, 0.05)",
  error: "#EF4444",
  errorTint: "rgba(239, 68, 68, 0.1)",
  errorTintSoft: "rgba(239, 68, 68, 0.05)",
  // file-type accents
  blue: "#2563EB",
  blueTint: "rgba(37, 99, 235, 0.1)",
  // borders
  border: "#E5E7EB",
  borderStrong: "#D1D5DB",
  // radii
  rSm: 6,
  rMd: 8,
  rLg: 12,
  rFull: 9999,
  // shadows
  shadowSm: "0 1px 2px 0 rgba(0,0,0,0.05)",
  shadowMd: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
};

export const T = (size: number, weight = 400, color = C.text, lh = 1.5): CSSProperties => ({
  fontSize: size, fontWeight: weight, color, lineHeight: lh, margin: 0,
});

export const card = (p = 20, r = C.rLg, extra?: CSSProperties): CSSProperties => ({
  background: C.card, border: `1px solid ${C.border}`, borderRadius: r,
  boxShadow: C.shadowSm, padding: p, ...extra,
});

export const pill = (color: string, bg: string, extra?: CSSProperties): CSSProperties => ({
  display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px",
  borderRadius: C.rFull, background: bg, color, fontSize: 12, fontWeight: 600, ...extra,
});

export type BtnVariant = "brand" | "primary" | "secondary" | "ghost";
export const btn = (variant: BtnVariant = "brand", small = false): CSSProperties => {
  const base: CSSProperties = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: small ? "6px 14px" : "8px 16px",
    borderRadius: C.rMd, fontSize: small ? 13 : 14, fontWeight: 500,
    cursor: "pointer", border: "none", transition: "all 150ms cubic-bezier(0.4,0,0.2,1)",
    whiteSpace: "nowrap",
  };
  if (variant === "brand") return { ...base, background: C.brand, color: "#fff" };
  if (variant === "primary") return { ...base, background: C.text, color: "#fff" };
  if (variant === "secondary") return { ...base, background: C.card, color: C.text, border: `1px solid ${C.borderStrong}` };
  return { ...base, background: "transparent", color: C.text2 };
};

// Status colour resolver (high/medium/low confidence + statuses)
export const confColor = (pct: number) =>
  pct >= 85 ? { color: C.success, bg: C.successTint }
  : pct >= 60 ? { color: C.warning, bg: C.warningTint }
  : { color: C.error, bg: C.errorTint };
