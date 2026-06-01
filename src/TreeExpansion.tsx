import React, { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft, ArrowRight, ChevronDown, ChevronRight, ChevronUp, ChevronLeft,
  X, Check, AlertTriangle, AlertCircle, FileText, ExternalLink, Search,
  Sparkles, Filter, Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { C } from "./theme";
import {
  PARAMETERS, DOCUMENTS,
  type Parameter, type PlanTier, type CategoryId,
} from "./builder-data";

// ── Extra tokens ─────────────────────────────────────────────────────────
const FONT = "Inter, system-ui, -apple-system, sans-serif";
const EX = {
  brandTintSolid: "#d1fae5",
  amberLight: "#fef3c7", amberDark: "#92400e",
  redLight: "#fee2e2", redDark: "#991b1b",
  successDark: "#065f46",
  ink: "#0f172a",
  surf3: "#f3f4f6",
};

// ── Local mappings ───────────────────────────────────────────────────────
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

// ── Tab types ────────────────────────────────────────────────────────────
type TopTab = "tree" | "extraction" | "issues" | "docs";
const TOP_TABS: { id: TopTab; label: string }[] = [
  { id: "tree",       label: "Tree" },
  { id: "extraction", label: "Extraction" },
  { id: "issues",     label: "Issues" },
  { id: "docs",       label: "Docs" },
];

// ─────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────
export default function TreeExpansion({ onClose }: { onClose: () => void }) {
  const [tier, setTier] = useState<PlanTier>("Mini");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [topTab, setTopTab] = useState<TopTab>("tree");
  const [expandedCats, setExpandedCats] = useState<Set<TreeCat>>(new Set(["Plan Limits"]));
  const [showLegend, setShowLegend] = useState(true);

  const selected = useMemo(
    () => PARAMETERS.find(p => p.id === selectedId) || null,
    [selectedId],
  );

  const filteredFields = useMemo(
    () => PARAMETERS.filter(p =>
      !search || p.name.toLowerCase().includes(search.toLowerCase()),
    ),
    [search],
  );

  const toggleCat = (cat: TreeCat) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  // Keyboard nav inside drawer
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
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      background: C.bgTertiary, overflow: "hidden",
      fontFamily: FONT, position: "relative",
    }}>
      {/* ── Top toolbar ─────────────────────────────────────────────── */}
      <TopToolbar onClose={onClose} topTab={topTab} setTopTab={setTopTab} />

      {/* ── Body: sidebar + canvas + drawer ─────────────────────────── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <LeftSidebar
          tier={tier} setTier={setTier}
          search={search} setSearch={setSearch}
          expandedCats={expandedCats} toggleCat={toggleCat}
          selectedId={selectedId} onSelectField={setSelectedId}
          onClose={onClose}
        />

        {/* Center canvas */}
        <div style={{
          flex: 1, overflowY: "auto", overflowX: "auto",
          padding: "24px 20px 80px",
          position: "relative",
        }}>
          <CanvasContent
            tier={tier} filteredFields={filteredFields}
            selectedId={selectedId} onSelect={setSelectedId}
          />

          {/* Legend */}
          {showLegend && (
            <div style={{
              position: "fixed", bottom: 24, right: selected ? 396 : 24,
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 10, padding: "12px 16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              transition: "right 0.25s ease",
              zIndex: 10,
            }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 8, gap: 16,
              }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: EX.ink }}>Legend</span>
                <button onClick={() => setShowLegend(false)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: C.text3, padding: 0, display: "flex",
                }}>
                  <ChevronDown size={12} />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <LegendRow color={C.success} label="High confidence" />
                <LegendRow color={C.warning} label="Medium + tooltip" />
                <LegendRow color={C.error} label="Low + blocker" />
              </div>
            </div>
          )}
        </div>

        {/* Right drawer */}
        <AnimatePresence>
          {selected && (
            <>
              <motion.div
                key="scrim"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                onClick={() => setSelectedId(null)}
                style={{
                  position: "absolute", inset: 0,
                  background: "rgba(15,23,42,0.04)", zIndex: 15,
                }}
              />
              <motion.aside
                key="drawer"
                initial={{ x: 380 }} animate={{ x: 0 }} exit={{ x: 380 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  width: 360, flexShrink: 0,
                  background: C.card,
                  borderLeft: `1px solid ${C.border}`,
                  boxShadow: "-8px 0 24px rgba(15,23,42,0.06)",
                  display: "flex", flexDirection: "column",
                  overflow: "hidden", zIndex: 20,
                }}
              >
                <ParameterDrawer
                  field={selected} tier={tier} setTier={setTier}
                  onClose={() => setSelectedId(null)} onJump={setSelectedId}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Top toolbar — Back + tabs + right actions
// ─────────────────────────────────────────────────────────────────────────
function TopToolbar({ onClose, topTab, setTopTab }: {
  onClose: () => void; topTab: TopTab; setTopTab: (t: TopTab) => void;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 20px",
      background: C.card,
      borderBottom: `1px solid ${C.border}`,
      flexShrink: 0,
    }}>
      <button onClick={onClose} style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "6px 14px", borderRadius: 7,
        background: C.card, color: C.text,
        border: `1px solid ${C.borderStrong}`,
        fontSize: 12.5, fontWeight: 500,
        cursor: "pointer", fontFamily: FONT,
      }}>
        <ArrowLeft size={13} /> Back to Builder
      </button>

      {/* Tab pills */}
      <div style={{ display: "flex", gap: 2, marginLeft: 4 }}>
        {TOP_TABS.map(t => {
          const active = topTab === t.id;
          return (
            <button key={t.id} onClick={() => setTopTab(t.id)} style={{
              padding: "6px 16px", borderRadius: 7,
              background: active ? EX.brandTintSolid : "transparent",
              color: active ? C.brand : C.text2,
              fontSize: 12.5, fontWeight: 600,
              border: active ? `1px solid ${C.brand}33` : "1px solid transparent",
              cursor: "pointer", fontFamily: FONT,
            }}>{t.label}</button>
          );
        })}
      </div>

      <div style={{ flex: 1 }} />

      {/* Grade badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "5px 12px", borderRadius: 7,
        background: EX.brandTintSolid, border: `1px solid ${C.brand}33`,
        fontSize: 12, fontWeight: 700, color: C.brand,
      }}>
        Grade ?
      </div>

      {/* Toolbar icons */}
      {[Filter, Maximize2].map((Icon, i) => (
        <button key={i} style={{
          width: 30, height: 30, borderRadius: 7,
          background: "transparent", border: `1px solid ${C.border}`,
          cursor: "pointer", color: C.text2,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Left Sidebar — Search, tier picker, mini structure tree, submit
// ─────────────────────────────────────────────────────────────────────────
function LeftSidebar({ tier, setTier, search, setSearch, expandedCats, toggleCat, selectedId, onSelectField, onClose }: {
  tier: PlanTier; setTier: (t: PlanTier) => void;
  search: string; setSearch: (s: string) => void;
  expandedCats: Set<TreeCat>; toggleCat: (c: TreeCat) => void;
  selectedId: string | null; onSelectField: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <aside style={{
      width: 224, flexShrink: 0,
      borderRight: `1px solid ${C.border}`,
      background: C.card,
      display: "flex", flexDirection: "column",
      overflow: "hidden", fontFamily: FONT,
    }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "14px 14px" }}>
        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "7px 10px", background: C.bgTertiary,
          border: `1px solid ${C.border}`, borderRadius: 7,
          marginBottom: 16,
        }}>
          <Search size={12} color={C.text3} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Jump to any field..."
            style={{
              border: "none", outline: "none", background: "none",
              flex: 1, fontSize: 11.5, color: C.text, fontFamily: FONT, minWidth: 0,
            }}
          />
        </div>

        {/* COVERAGE TIERS label */}
        <p style={{
          fontSize: 10, fontWeight: 700, color: C.text3,
          letterSpacing: "0.08em", margin: "0 0 8px",
          textTransform: "uppercase" as const,
        }}>COVERAGE TIERS</p>

        {/* Tier picker */}
        <div style={{
          display: "flex", gap: 3, padding: 2,
          background: C.bgTertiary, borderRadius: 7,
          border: `1px solid ${C.border}`, marginBottom: 18,
        }}>
          {TIERS.map(t => {
            const active = tier === t;
            const bgMap: Record<PlanTier, string> = { Mini: EX.brandTintSolid, Medi: EX.amberLight, Max: EX.redLight };
            const fgMap: Record<PlanTier, string> = { Mini: C.brand, Medi: EX.amberDark, Max: EX.redDark };
            return (
              <button key={t} onClick={() => setTier(t)} style={{
                flex: 1, padding: "6px 0", borderRadius: 5,
                background: active ? bgMap[t] : "transparent",
                color: active ? fgMap[t] : C.text2,
                fontSize: 12, fontWeight: 700,
                border: "none", cursor: "pointer", fontFamily: FONT,
              }}>{t}</button>
            );
          })}
        </div>

        {/* MINI STRUCTURE */}
        <p style={{
          fontSize: 10, fontWeight: 700, color: C.text3,
          letterSpacing: "0.08em", margin: "0 0 10px",
          textTransform: "uppercase" as const,
        }}>{tier.toUpperCase()} STRUCTURE</p>

        {/* Tree categories */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {TREE_CATS.map(cat => {
            const fields = PARAMETERS.filter(p => catOf(p) === cat.id);
            const expanded = expandedCats.has(cat.id);
            let ok = 0, warn = 0, bad = 0;
            for (const f of fields) {
              const s = statusOf(f, tier);
              if (s === "verified") ok++; else if (s === "warning") warn++; else bad++;
            }
            const total = ok + warn + bad;

            return (
              <div key={cat.id}>
                {/* Category row */}
                <button
                  onClick={() => toggleCat(cat.id)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 5,
                    padding: "6px 4px", borderRadius: 5,
                    background: "transparent", border: "none",
                    cursor: "pointer", fontFamily: FONT, textAlign: "left" as const,
                  }}
                >
                  {expanded
                    ? <ChevronDown size={11} color={C.text3} />
                    : <ChevronRight size={11} color={C.text3} />
                  }
                  <span style={{ fontSize: 12, fontWeight: 600, color: EX.ink, flex: 1, whiteSpace: "nowrap" as const }}>{cat.id}</span>
                  {/* Mini progress bar */}
                  <div style={{
                    display: "flex", width: 36, height: 3.5,
                    borderRadius: 100, overflow: "hidden", flexShrink: 0,
                  }}>
                    {total > 0 && <>
                      <div style={{ flex: ok / total, background: C.success }} />
                      {warn > 0 && <div style={{ flex: warn / total, background: C.warning }} />}
                      {bad > 0 && <div style={{ flex: bad / total, background: C.error }} />}
                    </>}
                  </div>
                  <span style={{
                    fontSize: 10.5, fontWeight: 600, color: C.text3,
                    minWidth: 14, textAlign: "right" as const,
                  }}>{fields.length}</span>
                </button>

                {/* Expanded field list */}
                {expanded && (
                  <div style={{ paddingLeft: 18, marginBottom: 4 }}>
                    {fields.map(f => {
                      const isActive = selectedId === f.id;
                      const sc = statusColor(statusOf(f, tier));
                      return (
                        <button
                          key={f.id}
                          onClick={() => onSelectField(f.id)}
                          style={{
                            display: "flex", alignItems: "center", gap: 5,
                            width: "100%", padding: "4px 6px",
                            borderRadius: 4,
                            background: isActive ? C.brandTint : "transparent",
                            border: "none", cursor: "pointer",
                            fontFamily: FONT, textAlign: "left" as const,
                          }}
                        >
                          <span style={{
                            width: 4, height: 4, borderRadius: "50%",
                            background: sc, flexShrink: 0,
                          }} />
                          <span style={{
                            fontSize: 11, fontWeight: isActive ? 600 : 400,
                            color: isActive ? C.brand : C.text,
                            overflow: "hidden", textOverflow: "ellipsis",
                            whiteSpace: "nowrap" as const,
                          }}>{f.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit button */}
      <div style={{ padding: "12px 14px", borderTop: `1px solid ${C.border}` }}>
        <button onClick={onClose} style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 6,
          padding: "9px 0", borderRadius: 7,
          background: C.brand, color: "#fff",
          fontSize: 12.5, fontWeight: 600,
          border: "none", cursor: "pointer", fontFamily: FONT,
        }}>
          Submit configuration <ArrowRight size={13} />
        </button>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Canvas Content — root card, connectors, 4 category columns
// ─────────────────────────────────────────────────────────────────────────
function CanvasContent({ tier, filteredFields, selectedId, onSelect }: {
  tier: PlanTier; filteredFields: Parameter[];
  selectedId: string | null; onSelect: (id: string) => void;
}) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Root plan card */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "10px 20px", borderRadius: 10,
          background: EX.brandTintSolid, border: `1.5px solid ${C.brand}`,
          boxShadow: "0 2px 8px rgba(4,120,87,0.10)",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: C.brand, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700,
          }}>{tier[0]}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: EX.ink }}>{tier} Plan</div>
            <div style={{ fontSize: 10.5, color: C.text2 }}>D.I.Y Health Insurance</div>
          </div>
        </div>
      </div>

      {/* Vertical connector from root */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 0 }}>
        <div style={{ width: 1.5, height: 20, background: C.borderStrong }} />
      </div>

      {/* Horizontal connector */}
      <div style={{
        height: 1.5, background: C.border,
        marginLeft: "12.5%", marginRight: "12.5%",
        marginBottom: 0,
      }} />

      {/* 4 category columns */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 14,
      }}>
        {TREE_CATS.map(cat => {
          const visible = filteredFields.filter(p => catOf(p) === cat.id);
          const allInCat = PARAMETERS.filter(p => catOf(p) === cat.id);
          return (
            <CategoryColumn
              key={cat.id}
              cat={cat.id}
              fields={visible}
              totalFields={allInCat.length}
              tier={tier}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          );
        })}
      </div>

      {/* Empty state */}
      {filteredFields.length === 0 && (
        <div style={{ textAlign: "center" as const, padding: "60px 20px", color: C.text3 }}>
          <Search size={32} style={{ opacity: 0.4, marginBottom: 12 }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text2 }}>No fields match your search</div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Category Column
// ─────────────────────────────────────────────────────────────────────────
function CategoryColumn({ cat, fields, totalFields, tier, selectedId, onSelect }: {
  cat: TreeCat; fields: Parameter[]; totalFields: number;
  tier: PlanTier; selectedId: string | null; onSelect: (id: string) => void;
}) {
  const allInCat = PARAMETERS.filter(p => catOf(p) === cat);
  let ok = 0, warn = 0, bad = 0;
  for (const p of allInCat) {
    const s = statusOf(p, tier);
    if (s === "verified") ok++; else if (s === "warning") warn++; else bad++;
  }
  const total = ok + warn + bad;
  const topColor = bad > 0 ? C.error : warn > 0 ? C.warning : C.success;

  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
      {/* Vertical connector from horizontal line */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 1.5, height: 14, background: C.border }} />
      </div>

      {/* Category header card */}
      <div style={{
        padding: "10px 12px",
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        borderTop: `3px solid ${topColor}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: EX.ink }}>{cat}</span>
          <span style={{ fontSize: 10.5, color: C.text3, fontWeight: 500 }}>{totalFields}</span>
        </div>
        {total > 0 && (
          <div style={{
            display: "flex", height: 3, borderRadius: 100,
            overflow: "hidden", marginTop: 8, background: EX.surf3,
          }}>
            <div style={{ flex: ok / total, background: C.success }} />
            {warn > 0 && <div style={{ flex: warn / total, background: C.warning }} />}
            {bad > 0 && <div style={{ flex: bad / total, background: C.error }} />}
          </div>
        )}
      </div>

      {/* Field cards */}
      {fields.map(f => (
        <FieldCard
          key={f.id} field={f} tier={tier}
          selected={selectedId === f.id}
          onClick={() => onSelect(f.id)}
        />
      ))}

      {fields.length === 0 && totalFields > 0 && (
        <div style={{
          fontSize: 11, color: C.text3, textAlign: "center" as const,
          padding: "16px 12px", background: C.card,
          border: `1px dashed ${C.border}`, borderRadius: 8,
        }}>No fields match</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Field Card
// ─────────────────────────────────────────────────────────────────────────
function FieldCard({ field, tier, selected, onClick }: {
  field: Parameter; tier: PlanTier; selected: boolean; onClick: () => void;
}) {
  const val = field.values[tier];
  const status = statusOf(field, tier);
  const missing = isMissing(field, tier);
  const sc = statusColor(status);
  const doc = DOCUMENTS.find(d => d.id === val.source.docId)!;
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", textAlign: "left" as const,
        padding: "10px 12px",
        background: C.card,
        border: `1.5px solid ${selected ? C.brand : hovered ? C.borderStrong : C.border}`,
        borderRadius: 8,
        cursor: "pointer",
        display: "flex", flexDirection: "column" as const, gap: 3,
        boxShadow: selected
          ? `0 0 0 2px ${C.brand}20, 0 4px 12px rgba(4,120,87,0.08)`
          : hovered ? "0 2px 6px rgba(0,0,0,0.06)" : "0 1px 2px rgba(0,0,0,0.03)",
        transition: "all 0.15s ease",
        fontFamily: FONT,
      }}
    >
      {/* Row 1: title + status */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6 }}>
        <span style={{
          fontSize: 12, fontWeight: 600, color: EX.ink, lineHeight: 1.3,
          flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
        }}>{field.name}</span>
        {status === "verified" ? (
          <Check size={12} color={C.success} strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 1 }} />
        ) : (
          <div style={{
            width: 14, height: 14, borderRadius: "50%",
            background: `${sc}18`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            {status === "blocker"
              ? <AlertCircle size={9} color={sc} strokeWidth={2.5} />
              : <AlertTriangle size={8} color={sc} strokeWidth={2.5} />
            }
          </div>
        )}
      </div>

      {/* Row 2: value */}
      <div style={{
        fontSize: 11.5, fontWeight: 500,
        color: missing ? C.error : C.text,
        lineHeight: 1.3, overflow: "hidden",
        textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
      }}>
        {missing ? "Missing" : val.display}
      </div>

      {/* Row 3: source + confidence */}
      <div style={{
        display: "flex", alignItems: "center", gap: 5,
        fontSize: 10, color: C.text3, marginTop: 2,
      }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
          <FileText size={8} /> {doc.type} p{val.source.page}
        </span>
        <span style={{ color: C.border }}>·</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
          <Sparkles size={8} />
          {val.confidence === "high" ? "92%" : val.confidence === "medium" ? "75%" : "38%"}
        </span>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Parameter Drawer — matches Figma "Tree card.png" exactly
// ─────────────────────────────────────────────────────────────────────────
function ParameterDrawer({ field, tier, setTier, onClose, onJump }: {
  field: Parameter; tier: PlanTier; setTier: (t: PlanTier) => void;
  onClose: () => void; onJump: (id: string) => void;
}) {
  const val = field.values[tier];
  const doc = DOCUMENTS.find(d => d.id === val.source.docId)!;
  const missing = isMissing(field, tier);
  const [draft, setDraft] = useState(val.display);

  useEffect(() => { setDraft(val.display); }, [field.id, tier, val.display]);

  return (
    <>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div style={{
        padding: "16px 18px 14px", borderBottom: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        {/* Label + close */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 10,
        }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color: C.text3,
            letterSpacing: "0.08em", textTransform: "uppercase" as const,
          }}>PARAMETER</span>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            color: C.text3, padding: 0, display: "flex",
          }}><X size={16} /></button>
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 18, fontWeight: 700, color: EX.ink,
          margin: "0 0 12px", lineHeight: 1.2, fontFamily: FONT,
        }}>{field.name}</h2>

        {/* Tier pills */}
        <div style={{ display: "flex", gap: 6 }}>
          {TIERS.map(t => {
            const active = t === tier;
            return (
              <button key={t} onClick={() => setTier(t)} style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                padding: "4px 12px", borderRadius: 20,
                background: active ? C.brandTint : "transparent",
                border: `1px solid ${active ? C.brand + "44" : C.border}`,
                color: active ? C.brand : C.text2,
                fontSize: 12, fontWeight: 600,
                cursor: "pointer", fontFamily: FONT,
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: active ? C.brand : "transparent",
                  border: active ? "none" : `1.5px solid ${C.text3}`,
                }} />
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Scrollable body ─────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px 24px" }}>

        {/* EXTRACTED VALUE */}
        <DrawerSection label="EXTRACTED VALUE">
          {/* AI value (gray box) */}
          <div style={{
            padding: "10px 12px", background: C.bgTertiary,
            border: `1px solid ${C.border}`, borderRadius: 7,
            fontSize: 13, fontWeight: 500, color: C.text2,
            marginBottom: 10,
          }}>
            {val.display}
          </div>

          {/* Editable value with check */}
          <div style={{
            padding: "9px 12px",
            border: `1px solid ${C.border}`, borderRadius: 7,
            fontSize: 13, fontWeight: 500, color: EX.ink,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <input
              value={draft}
              onChange={e => setDraft(e.target.value)}
              style={{
                border: "none", outline: "none", background: "none",
                flex: 1, fontSize: 13, fontWeight: 500, color: EX.ink,
                fontFamily: FONT, minWidth: 0,
              }}
            />
            <Check size={14} color={C.success} />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={() => setDraft(val.display)} style={{
              padding: "7px 14px", borderRadius: 7,
              background: C.card, color: C.text,
              border: `1px solid ${C.borderStrong}`,
              fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: FONT,
            }}>Revert to AI</button>
            <button style={{
              padding: "7px 14px", borderRadius: 7,
              background: C.brand, color: "#fff", border: "none",
              fontSize: 12, fontWeight: 600,
              cursor: "pointer", fontFamily: FONT,
              display: "inline-flex", alignItems: "center", gap: 5,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
              Mark verified
            </button>
          </div>
        </DrawerSection>

        {/* SOURCE PASSAGE */}
        <DrawerSection label="SOURCE PASSAGE">
          {/* Open document link */}
          <div style={{
            display: "flex", justifyContent: "flex-end", marginBottom: 8,
          }}>
            <button style={{
              background: "none", border: "none", cursor: "pointer",
              color: C.brand, fontSize: 11.5, fontWeight: 500,
              display: "inline-flex", alignItems: "center", gap: 3,
              padding: 0, fontFamily: FONT,
            }}>Open document <ExternalLink size={10} /></button>
          </div>

          {/* Document chip */}
          <div style={{
            padding: "9px 12px", background: C.bgTertiary,
            border: `1px solid ${C.border}`, borderRadius: 7,
            display: "flex", alignItems: "center", gap: 6,
            marginBottom: 8,
          }}>
            <FileText size={11} color={C.text3} />
            <span style={{ fontSize: 12, color: C.text2, fontWeight: 500 }}>{doc.name}</span>
          </div>

          {/* Highlighted passage */}
          <div style={{
            padding: "10px 12px",
            background: EX.amberLight,
            border: `1px solid ${C.warning}33`,
            borderRadius: 7,
            fontSize: 12.5, fontWeight: 500,
            color: EX.ink, lineHeight: 1.5,
          }}>
            {val.source.context.replace(/\{\{|\}\}/g, "")}
          </div>

          {/* Jump link */}
          <button style={{
            marginTop: 10, background: "none", border: "none",
            cursor: "pointer", fontFamily: FONT, padding: 0,
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 11.5, fontWeight: 500, color: C.warning,
            textDecoration: "underline",
          }}>
            <ChevronRight size={10} /> Jump: First passage in parameter
          </button>
        </DrawerSection>

        {/* CROSS-CHECKS */}
        <DrawerSection label="CROSS-CHECKS (2)">
          {["Premium Calculation (Rule)", "Member Eligibility Check (Rule)"].map(d => (
            <button key={d} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", padding: "9px 10px", marginBottom: 4,
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 7, cursor: "pointer",
              fontSize: 12, fontWeight: 500, color: EX.ink,
              fontFamily: FONT, textAlign: "left" as const,
            }}>
              <span>{d}</span>
              <ChevronRight size={12} color={C.text3} />
            </button>
          ))}
        </DrawerSection>
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0, padding: "12px 18px",
        borderTop: `1px solid ${C.border}`,
        display: "flex", gap: 8, justifyContent: "flex-end",
      }}>
        <button style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          padding: "7px 14px", borderRadius: 7,
          background: C.card, color: C.text,
          border: `1px solid ${C.borderStrong}`,
          fontSize: 12, fontWeight: 600,
          cursor: "pointer", fontFamily: FONT,
        }}>
          <Sparkles size={12} /> AI Assist
        </button>
        <button style={{
          padding: "7px 14px", borderRadius: 7,
          background: C.brand, color: "#fff", border: "none",
          fontSize: 12, fontWeight: 600,
          cursor: "pointer", fontFamily: FONT,
        }}>Add</button>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Small helpers
// ─────────────────────────────────────────────────────────────────────────
function DrawerSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: C.text3,
        letterSpacing: "0.08em", textTransform: "uppercase" as const,
        marginBottom: 10,
      }}>{label}</div>
      {children}
    </div>
  );
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
      <span style={{ fontSize: 11.5, color: C.text2, fontWeight: 500 }}>{label}</span>
    </div>
  );
}
