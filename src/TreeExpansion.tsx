import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  ArrowLeft, ArrowRight, ChevronDown, ChevronRight, ChevronUp, ChevronLeft,
  X, Check, AlertTriangle, AlertCircle, FileText, ExternalLink, Search,
  Sparkles, Filter, Maximize2, Minimize2, Plus, Minus, MessageCircle,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { C } from "./theme";
import {
  PARAMETERS, DOCUMENTS,
  type Parameter, type PlanTier, type CategoryId,
} from "./builder-data";

// ── Tokens ───────────────────────────────────────────────────────────────
const FONT = "Inter, system-ui, -apple-system, sans-serif";
const EX = {
  brandTintSolid: "#d1fae5",
  amberLight: "#fef3c7", amberDark: "#92400e",
  redLight: "#fee2e2", redDark: "#991b1b",
  successDark: "#065f46",
  ink: "#0f172a",
  surf3: "#f3f4f6",
  teal: "#0D9488",
};

// ── Mappings ─────────────────────────────────────────────────────────────
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

// Category accent colors for card labels
const CAT_LABEL_COLOR: Record<TreeCat, string> = {
  "Plan Limits": EX.teal,
  "Member Details": EX.teal,
  "Coverages": EX.teal,
  "Premium Raters": EX.teal,
};

// Issue counts per tier (simulated from data)
const tierIssueCounts = (tier: PlanTier) => {
  let count = 0;
  for (const p of PARAMETERS) {
    const s = statusOf(p, tier);
    if (s !== "verified") count++;
  }
  return count;
};

// ─────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────
export default function TreeExpansion({ onClose }: { onClose: () => void }) {
  const [tier, setTier] = useState<PlanTier>("Mini");
  const [search, setSearch] = useState("");
  const [filterText, setFilterText] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedCats, setExpandedCats] = useState<Set<TreeCat>>(new Set(["Plan Limits"]));
  const [showLegend, setShowLegend] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // ── Canvas pan/zoom state ──────────────────────────────────────────────
  const [zoom, setZoom] = useState(0.7);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      // Pinch-to-zoom / ctrl+scroll = zoom
      const delta = -e.deltaY * 0.001;
      setZoom(z => Math.min(2, Math.max(0.2, z + delta * z)));
    } else {
      // Regular scroll = pan
      setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  }, []);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    isPanning.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    setPan(p => ({ x: p.x + dx, y: p.y + dy }));
  };
  const onMouseUp = () => { isPanning.current = false; };

  const zoomIn  = () => setZoom(z => Math.min(2,   Math.round((z + 0.1) * 10) / 10));
  const zoomOut = () => setZoom(z => Math.max(0.2, Math.round((z - 0.1) * 10) / 10));
  const resetView = () => { setZoom(0.7); setPan({ x: 0, y: 0 }); };

  const selected = useMemo(
    () => PARAMETERS.find(p => p.id === selectedId) || null,
    [selectedId],
  );

  const filteredFields = useMemo(
    () => PARAMETERS.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterText && !p.name.toLowerCase().includes(filterText.toLowerCase())) return false;
      return true;
    }),
    [search, filterText],
  );

  const toggleCat = (cat: TreeCat) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

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

  const totalIssues = tierIssueCounts(tier);

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      background: C.bgTertiary, overflow: "hidden",
      fontFamily: FONT, position: "relative",
    }}>
      {/* ── Top toolbar ─────────────────────────────────────────── */}
      <TopToolbar
        onClose={onClose} totalIssues={totalIssues}
        zoom={zoom} zoomIn={zoomIn} zoomOut={zoomOut} resetView={resetView}
        sidebarCollapsed={sidebarCollapsed} onToggleSidebar={() => setSidebarCollapsed(c => !c)}
      />

      {/* ── Body ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <LeftSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(c => !c)}
          tier={tier} setTier={setTier}
          search={search} setSearch={setSearch}
          filterText={filterText} setFilterText={setFilterText}
          expandedCats={expandedCats} toggleCat={toggleCat}
          selectedId={selectedId} onSelectField={setSelectedId}
          onClose={onClose}
        />

        {/* ── Zoomable / pannable canvas ─────────────────────── */}
        <div
          ref={canvasRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{
            flex: 1, overflow: "hidden",
            position: "relative",
            cursor: isPanning.current ? "grabbing" : "grab",
            background: C.bgTertiary,
            backgroundImage: `radial-gradient(circle, ${C.borderStrong} 1px, transparent 1px)`,
            backgroundSize: `${Math.max(16, 24 * zoom)}px ${Math.max(16, 24 * zoom)}px`,
            backgroundPosition: `${pan.x % (24 * zoom)}px ${pan.y % (24 * zoom)}px`,
          }}
        >
          {/* Transform container */}
          <div style={{
            position: "absolute",
            top: 0, left: 0,
            transformOrigin: "50% 30%",
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            willChange: "transform",
            padding: "60px 40px 120px",
          }}>
            <CanvasContent
              tier={tier} filteredFields={filteredFields}
              selectedId={selectedId} onSelect={setSelectedId}
            />
          </div>

          {/* Zoom controls overlay */}
          <div style={{
            position: "absolute", bottom: 16, left: "50%",
            transform: "translateX(-50%)",
            display: "flex", alignItems: "center", gap: 0,
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 8, overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}>
            <button onClick={zoomOut} style={zoomBtnStyle()}>
              <Minus size={12} />
            </button>
            <button onClick={resetView} style={{
              ...zoomBtnStyle(),
              minWidth: 52, borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`,
              fontSize: 11.5, fontWeight: 600, color: C.text2,
            }}>
              {Math.round(zoom * 100)}%
            </button>
            <button onClick={zoomIn} style={zoomBtnStyle()}>
              <Plus size={12} />
            </button>
          </div>

          {/* Floating action button */}
          <button style={{
            position: "absolute", bottom: 16, right: 20,
            width: 44, height: 44, borderRadius: "50%",
            background: C.brand, color: "#fff", border: "none",
            cursor: "pointer", boxShadow: "0 4px 12px rgba(4,120,87,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <MessageCircle size={20} />
          </button>

          {/* Legend */}
          {showLegend && (
            <div style={{
              position: "absolute", bottom: 80, right: 20,
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 10, padding: "12px 16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              zIndex: 10, minWidth: 160,
            }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 8, gap: 12,
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: EX.ink }}>Legend</span>
                <button onClick={() => setShowLegend(false)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: C.text3, padding: 0, display: "flex",
                }}>
                  <ChevronDown size={12} />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <LegendRow color={C.success} label="High confidence" />
                <LegendRow color={C.warning} label="Medium / warning" />
                <LegendRow color={C.error} label="Missing / blocker" />
                <LegendRow color={C.text3} label="Ungraded" />
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
                  width: 380, flexShrink: 0,
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
// Top toolbar — matches Figma Row 2
// ─────────────────────────────────────────────────────────────────────────
function zoomBtnStyle(): React.CSSProperties {
  return {
    width: 28, height: 28, border: "none",
    background: "transparent", cursor: "pointer", color: C.text2,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "Inter, system-ui, sans-serif",
  };
}

function TopToolbar({ onClose, totalIssues, zoom, zoomIn, zoomOut, resetView, sidebarCollapsed, onToggleSidebar }: {
  onClose: () => void; totalIssues: number;
  zoom: number; zoomIn: () => void; zoomOut: () => void; resetView: () => void;
  sidebarCollapsed: boolean; onToggleSidebar: () => void;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "10px 20px",
      background: C.card,
      borderBottom: `1px solid ${C.border}`,
      flexShrink: 0,
    }}>
      {/* Back button */}
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
      <div style={{
        display: "flex", gap: 0, padding: 3,
        background: C.bgTertiary, borderRadius: 8,
        border: `1px solid ${C.border}`,
      }}>
        {[
          { id: "tree", label: "Tree", active: true },
          { id: "extraction", label: "Extraction", active: false },
          { id: "issues", label: "Issues", active: false },
          { id: "docs", label: "Docs", active: false },
        ].map(t => (
          <button key={t.id} style={{
            padding: "5px 14px", borderRadius: 6,
            background: t.active ? EX.brandTintSolid : "transparent",
            color: t.active ? C.brand : C.text2,
            fontSize: 12, fontWeight: 600,
            border: "none", cursor: "pointer", fontFamily: FONT,
            display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      {/* Issues badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "4px 10px", borderRadius: 7,
        background: EX.brandTintSolid, border: `1px solid ${C.brand}33`,
      }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: C.brand }}>Issues</span>
        <span style={{
          fontSize: 11, fontWeight: 700, color: C.card,
          background: C.brand, borderRadius: 4,
          padding: "1px 5px", minWidth: 16, textAlign: "center" as const,
        }}>{totalIssues}</span>
        <ChevronDown size={10} color={C.brand} />
      </div>

      {/* Sidebar toggle in top bar */}
      <button onClick={onToggleSidebar} style={{
        width: 28, height: 28, borderRadius: 6,
        background: sidebarCollapsed ? C.brandTint : "transparent",
        border: `1px solid ${sidebarCollapsed ? C.brand + "44" : C.border}`,
        cursor: "pointer", color: sidebarCollapsed ? C.brand : C.text2,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {sidebarCollapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
      </button>

      {/* Zoom display (read-only in toolbar — functional zoom in canvas) */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 0,
        border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden",
      }}>
        <button onClick={zoomOut} style={{
          width: 26, height: 26, border: "none", borderRight: `1px solid ${C.border}`,
          background: C.card, cursor: "pointer", color: C.text2,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><Minus size={11} /></button>
        <button onClick={resetView} style={{
          padding: "0 8px", fontSize: 11, fontWeight: 600, color: C.text2,
          minWidth: 38, textAlign: "center" as const, border: "none",
          background: C.card, cursor: "pointer", fontFamily: FONT, height: 26,
        }}>{Math.round(zoom * 100)}%</button>
        <button onClick={zoomIn} style={{
          width: 26, height: 26, border: "none", borderLeft: `1px solid ${C.border}`,
          background: C.card, cursor: "pointer", color: C.text2,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}><Plus size={11} /></button>
      </div>

      <button style={{
        width: 26, height: 26, borderRadius: 6,
        background: "transparent", border: `1px solid ${C.border}`,
        cursor: "pointer", color: C.text2,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}><Maximize2 size={12} /></button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Left Sidebar — matches Figma left panel exactly
// ─────────────────────────────────────────────────────────────────────────
function LeftSidebar({ collapsed, onToggleCollapse, tier, setTier, search, setSearch, filterText, setFilterText, expandedCats, toggleCat, selectedId, onSelectField, onClose }: {
  collapsed: boolean; onToggleCollapse: () => void;
  tier: PlanTier; setTier: (t: PlanTier) => void;
  search: string; setSearch: (s: string) => void;
  filterText: string; setFilterText: (s: string) => void;
  expandedCats: Set<TreeCat>; toggleCat: (c: TreeCat) => void;
  selectedId: string | null; onSelectField: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <aside style={{
      width: collapsed ? 0 : 260,
      minWidth: collapsed ? 0 : 260,
      flexShrink: 0,
      borderRight: collapsed ? "none" : `1px solid ${C.border}`,
      background: C.card,
      display: "flex", flexDirection: "column",
      overflow: "hidden", fontFamily: FONT,
      transition: "width 0.22s ease, min-width 0.22s ease",
    }}>
      <div style={{ width: 260, display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {/* Search — with collapse toggle next to it */}
        <div style={{ padding: "12px 12px 0" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6, flex: 1,
              padding: "8px 11px", background: C.bgTertiary,
              border: `1px solid ${C.border}`, borderRadius: 7,
            }}>
              <Search size={12} color={C.text3} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Jump to any field..."
                style={{
                  border: "none", outline: "none", background: "none",
                  flex: 1, fontSize: 12, color: C.text, fontFamily: FONT, minWidth: 0,
                }}
              />
              <span style={{
                fontSize: 10, color: C.text3, fontWeight: 500,
                background: C.bgTertiary, border: `1px solid ${C.border}`,
                borderRadius: 4, padding: "1px 5px",
              }}>⌘K</span>
            </div>
            {/* Collapse button right next to search */}
            <button
              onClick={onToggleCollapse}
              title="Collapse sidebar"
              style={{
                width: 30, height: 30, borderRadius: 6, flexShrink: 0,
                background: "transparent", border: `1px solid ${C.border}`,
                cursor: "pointer", color: C.text2,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <PanelLeftClose size={14} />
            </button>
          </div>
        </div>

        {/* VIEWING TIER with Overlay all */}
        <div style={{ padding: "14px 12px 0" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 8,
          }}>
            <span style={{
              fontSize: 11, fontWeight: 600, color: C.text3,
              textTransform: "uppercase" as const, letterSpacing: "0.04em",
            }}>Viewing tier</span>
            <label style={{
              display: "flex", alignItems: "center", gap: 5,
              fontSize: 11, color: C.text3, cursor: "pointer",
            }}>
              <div style={{
                width: 13, height: 13, borderRadius: 3,
                border: `1.5px solid ${C.borderStrong}`,
              }} />
              Overlay all
            </label>
          </div>

          {/* Tier buttons with issue counts */}
          <div style={{
            display: "flex", gap: 6, padding: 6,
            background: C.bgTertiary, borderRadius: 10,
            border: `1px solid ${C.border}`,
          }}>
            {TIERS.map(t => {
              const active = tier === t;
              const issues = tierIssueCounts(t);
              return (
                <button key={t} onClick={() => setTier(t)} style={{
                  flex: 1, padding: "6px 0 5px",
                  borderRadius: 7,
                  background: active ? EX.brandTintSolid : "transparent",
                  border: active ? `1px solid ${C.brand}33` : "1px solid transparent",
                  cursor: "pointer", fontFamily: FONT,
                  display: "flex", flexDirection: "column" as const,
                  alignItems: "center", gap: 2,
                }}>
                  <span style={{
                    fontSize: 12.5, fontWeight: 700,
                    color: active ? C.brand : C.text,
                  }}>{t}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 500,
                    color: active ? C.brand : C.text3,
                  }}>{issues} issues</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter parameters */}
        <div style={{ padding: "12px 12px 0" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "7px 10px", background: C.bgTertiary,
            border: `1px solid ${C.border}`, borderRadius: 7,
          }}>
            <Filter size={11} color={C.text3} />
            <input
              value={filterText} onChange={e => setFilterText(e.target.value)}
              placeholder="Filter parameters"
              style={{
                border: "none", outline: "none", background: "none",
                flex: 1, fontSize: 11.5, color: C.text, fontFamily: FONT, minWidth: 0,
              }}
            />
          </div>
        </div>

        {/* TIER STRUCTURE tree */}
        <div style={{ padding: "14px 12px 0" }}>
          <p style={{
            fontSize: 10, fontWeight: 700, color: C.text3,
            letterSpacing: "0.08em", margin: "0 0 10px",
            textTransform: "uppercase" as const,
          }}>{tier.toUpperCase()} STRUCTURE</p>

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
                    <span style={{
                      fontSize: 12.5, fontWeight: 600, color: EX.ink,
                      flex: 1, whiteSpace: "nowrap" as const,
                    }}>{cat.id}</span>
                    <div style={{
                      display: "flex", width: 40, height: 4,
                      borderRadius: 100, overflow: "hidden", flexShrink: 0,
                    }}>
                      {total > 0 && <>
                        <div style={{ flex: ok / total, background: C.success }} />
                        {warn > 0 && <div style={{ flex: warn / total, background: C.warning }} />}
                        {bad > 0 && <div style={{ flex: bad / total, background: C.error }} />}
                      </>}
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: C.text3,
                      minWidth: 14, textAlign: "right" as const,
                    }}>{fields.length}</span>
                  </button>

                  {expanded && (
                    <div style={{ paddingLeft: 20, marginBottom: 4 }}>
                      {fields.map(f => {
                        const isActive = selectedId === f.id;
                        const sc = statusColor(statusOf(f, tier));
                        return (
                          <button
                            key={f.id} onClick={() => onSelectField(f.id)}
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
                              fontSize: 11.5, fontWeight: isActive ? 600 : 400,
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
      </div>

      {/* Submit configuration button */}
      <div style={{ padding: "12px", borderTop: `1px solid ${C.border}` }}>
        <button onClick={onClose} style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 6,
          padding: "9px 0", borderRadius: 8,
          background: C.brand, color: "#fff",
          fontSize: 13, fontWeight: 600,
          border: "none", cursor: "pointer", fontFamily: FONT,
        }}>
          Submit configuration <ArrowRight size={14} />
        </button>
      </div>

      {/* ROADMAP progress */}
      <div style={{
        padding: "10px 12px", borderTop: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column", gap: 6,
      }}>
        <span style={{
          fontSize: 9, fontWeight: 700, color: C.text3,
          letterSpacing: "0.1em", textTransform: "uppercase" as const,
        }}>ROADMAP</span>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {[C.success, C.success, C.brand, C.border, C.border].map((c, i) => (
            <React.Fragment key={i}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: c, border: c === C.border ? `1.5px solid ${C.borderStrong}` : "none",
              }} />
              {i < 4 && <div style={{ flex: 1, height: 1.5, background: c === C.border ? C.border : c }} />}
            </React.Fragment>
          ))}
        </div>
      </div>
      </div>{/* end width:260 wrapper */}
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Canvas Content
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

      {/* Vertical connector */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 1.5, height: 20, background: C.borderStrong }} />
      </div>

      {/* Horizontal connector */}
      <div style={{
        height: 1.5, background: C.border,
        marginLeft: "12.5%", marginRight: "12.5%",
      }} />

      {/* 4 category columns */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: 12,
      }}>
        {TREE_CATS.map(cat => {
          const visible = filteredFields.filter(p => catOf(p) === cat.id);
          const allInCat = PARAMETERS.filter(p => catOf(p) === cat.id);
          return (
            <CategoryColumn
              key={cat.id} cat={cat.id}
              fields={visible} totalFields={allInCat.length}
              tier={tier} selectedId={selectedId} onSelect={onSelect}
            />
          );
        })}
      </div>

      {filteredFields.length === 0 && (
        <div style={{ textAlign: "center" as const, padding: "60px 20px", color: C.text3 }}>
          <Search size={32} style={{ opacity: 0.4, marginBottom: 12 }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text2 }}>No fields match</div>
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
      {/* Vertical connector */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 1.5, height: 14, background: C.border }} />
      </div>

      {/* Column header */}
      <div style={{
        padding: "10px 12px",
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 8,
      }}>
        {/* Colored accent bar */}
        <div style={{
          display: "flex", height: 3, borderRadius: 100,
          overflow: "hidden", marginBottom: 8,
        }}>
          {total > 0 && <>
            <div style={{ flex: ok / total, background: C.success }} />
            {warn > 0 && <div style={{ flex: warn / total, background: C.warning }} />}
            {bad > 0 && <div style={{ flex: bad / total, background: C.error }} />}
          </>}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: EX.ink }}>{cat}</span>
          <span style={{ fontSize: 12, color: C.text3, fontWeight: 600 }}>{totalFields}</span>
        </div>
      </div>

      {/* Field cards */}
      {fields.map(f => (
        <FieldCard
          key={f.id} field={f} tier={tier}
          selected={selectedId === f.id}
          onClick={() => onSelect(f.id)}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Field Card — matches Figma card design exactly
// ─────────────────────────────────────────────────────────────────────────
function FieldCard({ field, tier, selected, onClick }: {
  field: Parameter; tier: PlanTier; selected: boolean; onClick: () => void;
}) {
  const val = field.values[tier];
  const status = statusOf(field, tier);
  const missing = isMissing(field, tier);
  const sc = statusColor(status);
  const doc = DOCUMENTS.find(d => d.id === val.source.docId)!;
  const cat = catOf(field);
  const catColor = CAT_LABEL_COLOR[cat];
  const [hovered, setHovered] = useState(false);

  const statusLabel = status === "verified" ? "Verified"
    : status === "warning" ? "Warning" : "Missing";

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
        display: "flex", flexDirection: "column" as const, gap: 4,
        boxShadow: selected
          ? `0 0 0 2px ${C.brand}20, 0 4px 12px rgba(4,120,87,0.08)`
          : hovered ? "0 2px 6px rgba(0,0,0,0.06)" : "0 1px 2px rgba(0,0,0,0.03)",
        transition: "all 0.15s ease",
        fontFamily: FONT,
      }}
    >
      {/* Row 1: category label */}
      <span style={{
        fontSize: 10, fontWeight: 600, color: catColor,
        textTransform: "lowercase" as const, letterSpacing: "0.02em",
      }}>{cat.toLowerCase()}</span>

      {/* Row 2: field name */}
      <span style={{
        fontSize: 12.5, fontWeight: 600, color: EX.ink, lineHeight: 1.3,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
      }}>{field.name}</span>

      {/* Row 3: value */}
      <span style={{
        fontSize: 12, fontWeight: 500,
        color: missing ? C.error : C.text,
        lineHeight: 1.3, overflow: "hidden",
        textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
      }}>
        {missing ? "Missing" : val.display}
      </span>

      {/* Row 4: status pill + source + confidence */}
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        marginTop: 3, flexWrap: "wrap" as const,
      }}>
        {/* Status pill */}
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 3,
          fontSize: 10, fontWeight: 600, color: sc,
        }}>
          <span style={{
            width: 5, height: 5, borderRadius: "50%", background: sc,
          }} />
          {statusLabel}
        </span>

        {/* Source */}
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 3,
          fontSize: 10, color: C.text3,
        }}>
          <FileText size={8} /> {doc.type} p{val.source.page}
        </span>

        {/* Confidence */}
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 3,
          fontSize: 10, color: C.text3,
        }}>
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
  const status = statusOf(field, tier);
  const [draft, setDraft] = useState(val.display);

  useEffect(() => { setDraft(val.display); }, [field.id, tier, val.display]);

  return (
    <>
      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{
        padding: "16px 18px 14px", borderBottom: `1px solid ${C.border}`, flexShrink: 0,
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 12,
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

      {/* ── Scrollable body ─────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 18px 24px" }}>

        {/* EXTRACTED VALUE + confidence badge */}
        <DrawerSection label={
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <span>EXTRACTED VALUE</span>
            <span style={{
              fontSize: 10, fontWeight: 600,
              color: status === "verified" ? C.success : status === "warning" ? C.warning : C.error,
              background: status === "verified" ? C.successTint : status === "warning" ? C.warningTint : C.errorTint,
              padding: "2px 8px", borderRadius: 4,
              textTransform: "capitalize" as const, letterSpacing: 0,
            }}>
              {status === "verified" ? "High confidence" : status === "warning" ? "Medium" : "Low"}
            </span>
          </div>
        }>
          <div style={{
            padding: "10px 12px", background: C.bgTertiary,
            border: `1px solid ${C.border}`, borderRadius: 7,
            fontSize: 14, fontWeight: 500, color: C.text2,
          }}>
            {val.display}
          </div>
        </DrawerSection>

        {/* YOUR VALUE */}
        <DrawerSection label="YOUR VALUE">
          <div style={{
            padding: "9px 12px",
            border: `1px solid ${C.border}`, borderRadius: 7,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <input
              value={draft} onChange={e => setDraft(e.target.value)}
              style={{
                border: "none", outline: "none", background: "none",
                flex: 1, fontSize: 14, fontWeight: 500, color: EX.ink,
                fontFamily: FONT, minWidth: 0,
              }}
            />
            {!missing && <Check size={14} color={C.success} />}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={() => setDraft(val.display)} style={{
              padding: "8px 16px", borderRadius: 7,
              background: C.card, color: C.text,
              border: `1px solid ${C.borderStrong}`,
              fontSize: 12.5, fontWeight: 600,
              cursor: "pointer", fontFamily: FONT,
            }}>Reset to AI</button>
            <button style={{
              padding: "8px 16px", borderRadius: 7,
              background: C.brand, color: "#fff", border: "none",
              fontSize: 12.5, fontWeight: 600,
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
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
            <button style={{
              background: "none", border: "none", cursor: "pointer",
              color: C.brand, fontSize: 11.5, fontWeight: 500,
              display: "inline-flex", alignItems: "center", gap: 3,
              padding: 0, fontFamily: FONT,
            }}>Open document <ExternalLink size={10} /></button>
          </div>

          <div style={{
            padding: "9px 12px", background: C.bgTertiary,
            border: `1px solid ${C.border}`, borderRadius: 7,
            display: "flex", alignItems: "center", gap: 6,
            marginBottom: 8,
          }}>
            <FileText size={11} color={C.text3} />
            <span style={{ fontSize: 12, color: C.text2, fontWeight: 500 }}>{doc.name}</span>
          </div>

          <div style={{
            padding: "10px 12px",
            background: EX.amberLight,
            border: `1px solid ${C.warning}33`,
            borderRadius: 7,
            fontSize: 13, fontWeight: 500,
            color: EX.ink, lineHeight: 1.5,
          }}>
            {val.source.context.replace(/\{\{|\}\}/g, "")}
          </div>

          <button style={{
            marginTop: 10, background: "none", border: "none",
            cursor: "pointer", fontFamily: FONT, padding: 0,
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 11.5, fontWeight: 500, color: C.brand,
          }}>
            <ArrowRight size={10} /> Jump from passage to parameter
          </button>
        </DrawerSection>

        {/* DEPENDENCIES */}
        <DrawerSection label="DEPENDENCIES (2)">
          {["Premium Calculation (Rule)", "Member Eligibility Check (Rule)"].map(d => (
            <button key={d} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              width: "100%", padding: "9px 10px", marginBottom: 4,
              background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 7, cursor: "pointer",
              fontSize: 12.5, fontWeight: 500, color: EX.ink,
              fontFamily: FONT, textAlign: "left" as const,
            }}>
              <span>{d}</span>
              <ChevronRight size={12} color={C.text3} />
            </button>
          ))}
        </DrawerSection>
      </div>

      {/* ── Footer with comment input ───────────────────────── */}
      <div style={{
        flexShrink: 0, padding: "10px 18px 12px",
        borderTop: `1px solid ${C.border}`,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "8px 10px",
          background: C.bgTertiary,
          border: `1px solid ${C.border}`, borderRadius: 7,
        }}>
          <input
            placeholder="Write a comment, @-mention or ask AI..."
            style={{
              border: "none", outline: "none", background: "none",
              flex: 1, fontSize: 11.5, color: C.text, fontFamily: FONT, minWidth: 0,
            }}
          />
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "3px 8px", borderRadius: 5,
            background: "transparent", border: "none",
            color: C.text3, fontSize: 11, fontWeight: 500,
            cursor: "pointer", fontFamily: FONT,
          }}>
            <Sparkles size={10} /> AI assist
          </button>
          <button style={{
            padding: "4px 12px", borderRadius: 5,
            background: C.brand, color: "#fff", border: "none",
            fontSize: 11, fontWeight: 600,
            cursor: "pointer", fontFamily: FONT,
          }}>Ask</button>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────
function DrawerSection({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        fontSize: 10, fontWeight: 700, color: C.text3,
        letterSpacing: "0.08em", textTransform: "uppercase" as const,
        marginBottom: 10,
        display: "flex", alignItems: "center",
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
