import { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft, ChevronRight, ChevronLeft, X, Check, AlertTriangle, AlertCircle,
  FileText, ExternalLink, Search, Sparkles, ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { C, T, card, btn } from "./theme";
import {
  PARAMETERS, DOCUMENTS,
  type Parameter, type PlanTier, type CategoryId,
} from "./builder-data";

// ── Local mappings ────────────────────────────────────────────────────────
// Single brand colour discipline. No per-category rainbow — STATUS drives colour.
type TreeCat = "Plan Limits" | "Member Details" | "Coverages" | "Premium Raters";
const TREE_CATS: { id: TreeCat; from: CategoryId[] }[] = [
  { id: "Plan Limits",    from: ["product", "plans"] },
  { id: "Member Details", from: ["eligibility", "waiting"] },
  { id: "Coverages",      from: ["coverage", "benefits", "exclusions"] },
  { id: "Premium Raters", from: ["premium"] },
];
const catOf = (p: Parameter): TreeCat =>
  TREE_CATS.find(t => t.from.includes(p.category))!.id;

const TIERS: PlanTier[] = ["Mini", "Medi", "Max"];
const TIER_SI: Record<PlanTier, string> = {
  Mini: "₹4L – ₹5L", Medi: "₹6L – ₹10L", Max: "₹11L – ₹15L",
};

const isMissing = (p: Parameter, t: PlanTier) =>
  p.values[t].display.toLowerCase().includes("not");

type Status = "verified" | "warning" | "blocker";
const statusOf = (p: Parameter, t: PlanTier): Status => {
  if (isMissing(p, t)) return "blocker";
  const c = p.values[t].confidence;
  return c === "high" ? "verified" : c === "medium" ? "warning" : "blocker";
};
const statusColor = (s: Status) =>
  s === "verified" ? C.success : s === "warning" ? C.warning : C.error;

// ─────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────
type FilterId = "all" | "attention" | "verified";

export default function TreeExpansion({ onClose }: { onClose: () => void }) {
  const [tier, setTier] = useState<PlanTier>("Mini");
  const [filter, setFilter] = useState<FilterId>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(
    () => PARAMETERS.find(p => p.id === selectedId) || null,
    [selectedId]
  );

  const filteredFields = useMemo(() => {
    return PARAMETERS.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      const s = statusOf(p, tier);
      if (filter === "verified") return s === "verified";
      if (filter === "attention") return s !== "verified";
      return true;
    });
  }, [search, filter, tier]);

  const counts = useMemo(() => {
    let v = 0, a = 0;
    for (const p of PARAMETERS) {
      const s = statusOf(p, tier);
      if (s === "verified") v++; else a++;
    }
    return { all: PARAMETERS.length, verified: v, attention: a };
  }, [tier]);

  // Keyboard nav within drawer
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSelectedId(null); return; }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const cat = catOf(selected);
        const list = PARAMETERS.filter(p => catOf(p) === cat);
        const i = list.findIndex(p => p.id === selected.id);
        const next = (i + (e.key === "ArrowRight" ? 1 : -1) + list.length) % list.length;
        setSelectedId(list[next].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.bgTertiary, position: "relative", overflow: "hidden" }}>

      {/* ── Top toolbar ─────────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "12px 24px",
        background: C.card,
        borderBottom: `1px solid ${C.border}`,
        flexShrink: 0, flexWrap: "wrap" as const,
      }}>
        <button onClick={onClose} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 12px",
          background: C.card, color: C.text,
          border: `1px solid ${C.borderStrong}`,
          borderRadius: 6,
          fontSize: 12.5, fontWeight: 500,
          cursor: "pointer", fontFamily: "inherit",
        }}>
          <ArrowLeft size={13} /> Back to Builder
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.text3 }}>
          <span style={{ fontWeight: 500 }}>Tree View</span>
          <ChevronRight size={11} color={C.text3} />
          <span style={{ fontWeight: 600, color: C.text }}>D.I.Y Health · {tier} Plan</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Tier picker */}
        <SegmentedTier tier={tier} setTier={setTier} />

        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 10px",
          background: C.bgTertiary,
          borderRadius: 6,
          border: `1px solid ${C.border}`,
          minWidth: 200,
        }}>
          <Search size={12} color={C.text3} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search fields…"
            style={{ border: "none", outline: "none", background: "none", flex: 1, fontSize: 12, color: C.text, fontFamily: "inherit", minWidth: 0 }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ border: "none", background: "none", cursor: "pointer", display: "flex", color: C.text3, padding: 0 }}>
              <X size={11} />
            </button>
          )}
        </div>

        {/* Filter chips */}
        <div style={{ display: "flex", gap: 4 }}>
          {([
            { id: "all", label: "All", n: counts.all },
            { id: "attention", label: "Needs attention", n: counts.attention },
            { id: "verified", label: "Verified", n: counts.verified },
          ] as { id: FilterId; label: string; n: number }[]).map(c => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "5px 12px",
                fontSize: 12, fontWeight: 500,
                border: `1px solid ${filter === c.id ? C.brand : C.border}`,
                background: filter === c.id ? C.brandTint : C.card,
                color: filter === c.id ? C.brand : C.text2,
                borderRadius: 999, cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {c.label}
              <span style={{ fontSize: 10, fontWeight: 600, color: filter === c.id ? C.brand : C.text3, opacity: 0.8 }}>{c.n}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Canvas ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "32px 24px 64px", position: "relative" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>

          {/* Plan root card */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 18px",
              background: C.card,
              border: `1.5px solid ${C.brand}`,
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(4,120,87,0.10)",
              minWidth: 280,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 7,
                background: C.brand, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 14, flexShrink: 0,
              }}>{tier[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{tier} Plan</div>
                <div style={{ fontSize: 11, fontWeight: 400, color: C.text2, marginTop: 1 }}>SI {TIER_SI[tier]} · D.I.Y Health</div>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 600, color: C.brand,
                padding: "3px 8px",
                background: C.brandTint,
                borderRadius: 999,
                textTransform: "uppercase" as const,
                letterSpacing: "0.06em",
              }}>
                {PARAMETERS.length} fields
              </span>
            </div>
          </div>

          {/* Connector — single short line from root */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <div style={{ width: 1, height: 24, background: C.borderStrong }} />
          </div>

          {/* 4 category columns */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 16,
          }}>
            {TREE_CATS.map(cat => {
              const allFields = PARAMETERS.filter(p => catOf(p) === cat.id);
              const visible = filteredFields.filter(p => catOf(p) === cat.id);
              return (
                <CategoryColumn
                  key={cat.id}
                  cat={cat.id}
                  fields={visible}
                  totalFields={allFields.length}
                  tier={tier}
                  selectedId={selectedId}
                  onSelect={setSelectedId}
                />
              );
            })}
          </div>

          {/* Empty state */}
          {filteredFields.length === 0 && (
            <div style={{ textAlign: "center" as const, padding: "60px 20px", color: C.text3 }}>
              <Search size={32} style={{ opacity: 0.4, marginBottom: 12 }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text2 }}>No fields match your filters</div>
              <div style={{ fontSize: 12, color: C.text3, marginTop: 4 }}>
                Try clearing the search or switching filter
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Plan Editor drawer ──────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setSelectedId(null)}
              style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.06)" }}
            />
            <motion.aside
              key="drawer"
              initial={{ x: 460 }} animate={{ x: 0 }} exit={{ x: 460 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              style={{
                position: "absolute", top: 0, right: 0, bottom: 0,
                width: 440,
                background: C.card,
                borderLeft: `1px solid ${C.border}`,
                boxShadow: "-12px 0 32px rgba(15,23,42,0.08)",
                display: "flex", flexDirection: "column",
              }}
            >
              <PlanEditor
                field={selected}
                tier={tier}
                setTier={setTier}
                onClose={() => setSelectedId(null)}
                onJump={setSelectedId}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Tier segmented picker
// ─────────────────────────────────────────────────────────────────────────
function SegmentedTier({ tier, setTier }: { tier: PlanTier; setTier: (t: PlanTier) => void }) {
  return (
    <div style={{
      display: "flex",
      padding: 2,
      background: C.bgTertiary,
      borderRadius: 6,
      border: `1px solid ${C.border}`,
    }}>
      {TIERS.map(t => (
        <button
          key={t}
          onClick={() => setTier(t)}
          style={{
            padding: "5px 14px",
            fontSize: 12, fontWeight: 600,
            background: tier === t ? C.brand : "transparent",
            color: tier === t ? "#fff" : C.text2,
            border: "none", borderRadius: 4, cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Category column
// ─────────────────────────────────────────────────────────────────────────
function CategoryColumn({
  cat, fields, totalFields, tier, selectedId, onSelect,
}: {
  cat: TreeCat;
  fields: Parameter[];
  totalFields: number;
  tier: PlanTier;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  // Health summary across the WHOLE category (not just filtered)
  const allInCat = PARAMETERS.filter(p => catOf(p) === cat);
  const counts = { verified: 0, warning: 0, blocker: 0 };
  for (const p of allInCat) {
    counts[statusOf(p, tier)]++;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
      {/* Category header */}
      <div style={{
        padding: "10px 12px",
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{cat}</div>
          <div style={{ fontSize: 10.5, fontWeight: 400, color: C.text3, marginTop: 2 }}>
            {totalFields} {totalFields === 1 ? "field" : "fields"}
          </div>
        </div>
        {/* Health summary */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {counts.blocker > 0 && (
            <span style={{ fontSize: 10, fontWeight: 600, color: C.error, display: "inline-flex", alignItems: "center", gap: 3 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.error }} />
              {counts.blocker}
            </span>
          )}
          {counts.warning > 0 && (
            <span style={{ fontSize: 10, fontWeight: 600, color: C.warning, display: "inline-flex", alignItems: "center", gap: 3 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.warning }} />
              {counts.warning}
            </span>
          )}
          {counts.blocker === 0 && counts.warning === 0 && (
            <span style={{ fontSize: 10, fontWeight: 600, color: C.success, display: "inline-flex", alignItems: "center", gap: 3 }}>
              <Check size={10} strokeWidth={2.5} /> ok
            </span>
          )}
        </div>
      </div>

      {/* Field cards */}
      {fields.map(f => (
        <FieldCard
          key={f.id}
          field={f}
          tier={tier}
          selected={selectedId === f.id}
          onClick={() => onSelect(f.id)}
        />
      ))}

      {/* Hint when nothing matches */}
      {fields.length === 0 && totalFields > 0 && (
        <div style={{
          fontSize: 11, color: C.text3,
          textAlign: "center" as const,
          padding: "16px 12px",
          background: C.card,
          border: `1px dashed ${C.border}`,
          borderRadius: 8,
        }}>
          No fields match
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Field card
// ─────────────────────────────────────────────────────────────────────────
function FieldCard({
  field, tier, selected, onClick,
}: {
  field: Parameter;
  tier: PlanTier;
  selected: boolean;
  onClick: () => void;
}) {
  const val = field.values[tier];
  const status = statusOf(field, tier);
  const missing = isMissing(field, tier);
  const sc = statusColor(status);
  const doc = DOCUMENTS.find(d => d.id === val.source.docId)!;

  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left" as const,
        padding: "10px 12px",
        background: C.card,
        border: `1px solid ${selected ? C.brand : C.border}`,
        borderRadius: 8,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column" as const,
        gap: 4,
        boxShadow: selected ? `0 0 0 2px ${C.brand}25, 0 4px 12px rgba(4,120,87,0.10)` : "none",
        transition: "all 150ms cubic-bezier(0.4,0,0.2,1)",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = C.borderStrong;
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = C.border;
      }}
    >
      {/* Row 1: title + status icon */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text, lineHeight: 1.3, minWidth: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
          {field.name}
        </div>
        {status === "verified" ? (
          <Check size={12} color={C.success} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
        ) : (
          <div style={{
            width: 16, height: 16, borderRadius: "50%",
            background: `${sc}1a`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
            marginTop: 1,
          }}>
            {status === "blocker"
              ? <AlertCircle size={10} color={sc} strokeWidth={2.5} />
              : <AlertTriangle size={9} color={sc} strokeWidth={2.5} />}
          </div>
        )}
      </div>

      {/* Row 2: value */}
      <div style={{
        fontSize: 12, fontWeight: 500,
        color: missing ? C.error : C.text,
        lineHeight: 1.3,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap" as const,
      }}>
        {missing ? "Missing" : val.display}
      </div>

      {/* Row 3: meta */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, color: C.text3, marginTop: 2 }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
          <FileText size={9} />
          {doc.type} p{val.source.page}
        </span>
        <span style={{ color: C.border }}>·</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
          <Sparkles size={9} />
          {val.confidence === "high" ? "92%" : val.confidence === "medium" ? "75%" : "38%"}
        </span>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Plan Editor (drawer body)
// ─────────────────────────────────────────────────────────────────────────
function PlanEditor({
  field, tier, setTier, onClose, onJump,
}: {
  field: Parameter;
  tier: PlanTier;
  setTier: (t: PlanTier) => void;
  onClose: () => void;
  onJump: (id: string) => void;
}) {
  const val = field.values[tier];
  const doc = DOCUMENTS.find(d => d.id === val.source.docId)!;
  const cat = catOf(field);
  const list = PARAMETERS.filter(p => catOf(p) === cat);
  const idx = list.findIndex(p => p.id === field.id);
  const status = statusOf(field, tier);
  const missing = isMissing(field, tier);
  const [draft, setDraft] = useState(val.display);

  useEffect(() => { setDraft(val.display); }, [field.id, tier, val.display]);

  const nav = (dir: 1 | -1) => {
    const next = (idx + dir + list.length) % list.length;
    onJump(list[next].id);
  };

  return (
    <>
      {/* Sticky header */}
      <div style={{
        flexShrink: 0,
        padding: "14px 18px 12px",
        borderBottom: `1px solid ${C.border}`,
      }}>
        {/* Row 1: close + position + nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={onClose} style={iconBtnStyle()}>
            <X size={15} />
          </button>
          <div style={{ fontSize: 11, fontWeight: 500, color: C.text3 }}>
            Field {idx + 1} of {list.length}
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 2 }}>
            <button onClick={() => nav(-1)} title="Previous (←)" style={iconBtnStyle()}>
              <ChevronLeft size={14} />
            </button>
            <button onClick={() => nav(1)} title="Next (→)" style={iconBtnStyle()}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginTop: 10, lineHeight: 1.2, margin: "10px 0 0 0" }}>
          {field.name}
        </h2>

        {/* Sub-meta */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6, flexWrap: "wrap" as const }}>
          <span style={{ fontSize: 11.5, fontWeight: 500, color: C.text2 }}>{cat}</span>
          <span style={{ color: C.border }}>·</span>
          <a href="#" onClick={e => e.preventDefault()} style={{ fontSize: 11.5, fontWeight: 500, color: C.brand, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3 }}>
            <FileText size={11} /> {doc.type} p{val.source.page}
          </a>
          <span style={{ color: C.border }}>·</span>
          <StatusPill status={status} />
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px 24px" }}>

        {/* Across Tiers */}
        <Section label="Across plan tiers">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {TIERS.map(t => {
              const v = field.values[t];
              const ts = statusOf(field, t);
              const tm = isMissing(field, t);
              const active = t === tier;
              return (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  style={{
                    textAlign: "left" as const,
                    padding: "8px 10px",
                    background: C.card,
                    border: `1px solid ${active ? C.brand : C.border}`,
                    borderRadius: 8,
                    cursor: "pointer",
                    boxShadow: active ? `0 0 0 1px ${C.brand}40` : "none",
                    fontFamily: "inherit",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor(ts) }} />
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: active ? C.brand : C.text2 }}>{t}</span>
                  </div>
                  <div style={{
                    fontSize: 12.5, fontWeight: 500,
                    color: tm ? C.error : C.text,
                    marginTop: 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap" as const,
                  }}>
                    {tm ? "Missing" : v.display}
                  </div>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Value editor */}
        <Section label="Value">
          <Label>AI extracted</Label>
          <div style={{
            marginTop: 6,
            padding: "10px 12px",
            background: C.bgTertiary,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            fontSize: 13, fontWeight: 500, color: C.text2,
          }}>
            {val.display}
          </div>

          <div style={{ marginTop: 12 }}>
            <Label>Your value</Label>
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              style={{
                marginTop: 6,
                width: "100%",
                padding: "10px 12px",
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                fontSize: 13, fontWeight: 500, color: C.text,
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box" as const,
              }}
              onFocus={e => { e.currentTarget.style.borderColor = C.brand; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.brand}15`; }}
              onBlur={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>

          <div style={{ marginTop: 8, fontSize: 11, color: C.text3 }}>
            {field.unit ? `Unit: ${field.unit}` : "Free text"} · Required
          </div>

          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <button
              onClick={() => setDraft(val.display)}
              style={{
                ...btn("secondary", true),
                padding: "6px 12px",
              }}
            >
              Reset to AI
            </button>
            <button
              style={{
                ...btn("primary", true),
                padding: "6px 14px",
              }}
            >
              Save changes
            </button>
          </div>
        </Section>

        {/* Source passage */}
        <Section label="Source passage">
          <div style={{ fontSize: 11.5, fontWeight: 500, color: C.text2 }}>
            {doc.name} · Page {val.source.page}
          </div>
          <div style={{
            marginTop: 8,
            padding: 12,
            background: C.bgTertiary,
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            fontSize: 12.5, fontWeight: 400, color: C.text2, lineHeight: 1.6,
          }}>
            {val.source.context.split(/(\{\{[^}]+\}\})/g).map((part, i) =>
              part.startsWith("{{") ? (
                <mark key={i} style={{
                  background: C.warningTint,
                  boxShadow: `inset 0 -2px 0 ${C.warning}`,
                  color: C.text, padding: "1px 3px",
                  fontWeight: 500,
                }}>
                  {part.slice(2, -2)}
                </mark>
              ) : <span key={i}>{part}</span>
            )}
          </div>
          <button style={{
            marginTop: 8,
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 11.5, fontWeight: 500, color: C.brand,
            background: "none", border: "none", cursor: "pointer", padding: 0,
            fontFamily: "inherit",
          }}>
            Open full document <ExternalLink size={11} />
          </button>
        </Section>

        {/* Dependencies */}
        <Section label="Dependencies (3)">
          {[
            "Premium Calculation (Rule)",
            "Age Band Mapping (Rate Card)",
            "Member Eligibility Check (Rule)",
          ].map(d => (
            <button
              key={d}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%",
                padding: "8px 10px",
                marginBottom: 4,
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12, fontWeight: 500, color: C.text,
                fontFamily: "inherit",
                textAlign: "left" as const,
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.bgTertiary}
              onMouseLeave={e => e.currentTarget.style.background = C.card}
            >
              <span>{d}</span>
              <ArrowRight size={12} color={C.text3} />
            </button>
          ))}
        </Section>
      </div>

      {/* Sticky footer */}
      <div style={{
        flexShrink: 0,
        padding: 14,
        borderTop: `1px solid ${C.border}`,
        background: C.card,
      }}>
        <button
          style={{
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "11px 16px",
            background: missing ? C.text : C.brand,
            color: "#fff",
            border: "none", borderRadius: 8,
            fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          <Check size={15} /> {missing ? "Fill in value" : "Mark Verified"}
        </button>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Bits
// ─────────────────────────────────────────────────────────────────────────
function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 10.5, fontWeight: 700, color: C.text3,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        marginBottom: 10,
      }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 500, color: C.text2 }}>
      {children}
    </div>
  );
}

function StatusPill({ status }: { status: Status }) {
  const meta = status === "verified"
    ? { bg: C.successTint, fg: C.success, icon: <Check size={11} />, label: "Verified" }
    : status === "warning"
      ? { bg: C.warningTint, fg: C.warning, icon: <AlertTriangle size={10} />, label: "Needs review" }
      : { bg: C.errorTint, fg: C.error, icon: <AlertCircle size={10} />, label: "Missing" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px",
      background: meta.bg,
      color: meta.fg,
      borderRadius: 999,
      fontSize: 10.5, fontWeight: 600,
    }}>
      {meta.icon} {meta.label}
    </span>
  );
}

function iconBtnStyle(): React.CSSProperties {
  return {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 26, height: 26, borderRadius: 6,
    border: "none", background: "transparent",
    cursor: "pointer", color: C.text2,
    fontFamily: "inherit",
  };
}
