import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import {
  X, ChevronRight, ChevronDown, Search, Sparkles, Undo2, Redo2,
  Maximize2, Minus, Plus, MoreHorizontal, FileText, Check,
  AlertOctagon, AlertTriangle, ArrowLeft, ArrowRight, ExternalLink,
  MessageSquarePlus, Layers, GitBranch, Activity, Files, MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  PARAMETERS, CATEGORIES, DOCUMENTS,
  type Parameter, type PlanTier, type Confidence, type CategoryId,
} from "./builder-data";

// ── Tokens ───────────────────────────────────────────────────────────────
// Aligned with project's slate palette (Root.tsx / Entry.tsx / AIPreview.tsx)
const C = {
  primary: "#047857", primaryHover: "#059669", primarySoft: "#ECFDF5",
  success: "#10B981", warning: "#F59E0B", warningSoft: "#FEF3C7",
  error: "#EF4444", errorSoft: "#FEE2E2",
  info: "#4F46E5", infoSoft: "#EEF2FF",
  // slate-900 / slate-500 / slate-400 / slate-200 / slate-50
  text: "#0F172A", textMuted: "#64748B", textFaint: "#94A3B8",
  surface: "#FFFFFF", canvas: "#F8FAFC", dot: "#E2E8F0",
  border: "#E2E8F0", borderStrong: "#CBD5E1",
  // legacy aliases:
  brand: "#047857", brandHover: "#059669", brandSoft: "#ECFDF5",
  warnSoft: "#FEF3C7", errSoft: "#FEE2E2",
};

const TIERS: PlanTier[] = ["Mini", "Medi", "Max"];

// Map data-model categories → spec's 4 tree categories
type TreeCat = "Plan Limits" | "Member Details" | "Coverages" | "Premium Raters";
const TREE_CATS: { id: TreeCat; color: string; from: CategoryId[] }[] = [
  { id: "Plan Limits",     color: "#6366F1", from: ["product", "plans"] },
  { id: "Member Details",  color: "#F97316", from: ["eligibility", "waiting"] },
  { id: "Coverages",       color: "#047857", from: ["coverage", "benefits", "exclusions"] },
  { id: "Premium Raters",  color: "#A855F7", from: ["premium"] },
];

const catOf = (p: Parameter): TreeCat =>
  TREE_CATS.find(t => t.from.includes(p.category))!.id;

const TIER_COLOR: Record<PlanTier, string> = {
  Mini: "#047857", Medi: "#2563EB", Max: "#A855F7",
};

type FilterId = "all" | "issues" | "low" | "missing" | "changed" | "ai";

const confColor = (c: Confidence) => c === "high" ? C.success : c === "medium" ? C.warning : C.error;

// ── Component ────────────────────────────────────────────────────────────
export default function TreeExpansion({ onClose }: { onClose: () => void }) {
  const [tier, setTier] = useState<PlanTier>("Mini");
  const [overlay, setOverlay] = useState(false);
  const [mode, setMode] = useState<"tree" | "extraction" | "issues" | "docs">("tree");
  const [filter, setFilter] = useState<FilterId>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [legendOpen, setLegendOpen] = useState(true);
  const [activeDocId, setActiveDocId] = useState(DOCUMENTS[0].id);
  const [extractionPick, setExtractionPick] = useState<string>(PARAMETERS[0].id);

  const selected = useMemo(
    () => PARAMETERS.find(p => p.id === selectedId) || null,
    [selectedId]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setPaletteOpen(o => !o); }
      if (e.key === "Escape") { setPaletteOpen(false); setSelectedId(null); }
      if (e.key === "f" && !selected) setZoom(1);
      if (selected && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        const cat = catOf(selected);
        const list = PARAMETERS.filter(p => catOf(p) === cat);
        const idx = list.findIndex(p => p.id === selected.id);
        const next = (idx + (e.key === "ArrowRight" ? 1 : -1) + list.length) % list.length;
        setSelectedId(list[next].id);
      }
      if (selected && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        const i = TIERS.indexOf(tier);
        setTier(TIERS[(i + (e.key === "ArrowDown" ? 1 : -1) + 3) % 3]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, tier]);

  // Counts for filter chips
  const counts = useMemo(() => {
    const all = PARAMETERS;
    let low = 0, issues = 0;
    all.forEach(p => {
      const c = p.values[tier].confidence;
      if (c === "low") { low++; issues++; }
      else if (c === "medium") issues++;
    });
    return { all: all.length, issues, low, missing: 3, changed: 4, ai: 5 };
  }, [tier]);

  const matchesFilter = useCallback((p: Parameter): boolean => {
    const c = p.values[tier].confidence;
    if (filter === "all") return true;
    if (filter === "issues") return c !== "high";
    if (filter === "low") return c === "low";
    if (filter === "missing") return p.values[tier].display.toLowerCase().includes("not");
    if (filter === "changed") return false;
    if (filter === "ai") return c === "medium";
    return true;
  }, [filter, tier]);

  return (
    <div className="h-full w-full p-3 bg-slate-50" style={{ fontFamily: "Inter, system-ui, sans-serif", color: C.text }}>
      <div
        className="h-full w-full rounded-2xl border border-slate-200 bg-white flex flex-col overflow-hidden shadow-sm"
      >
        {/* TOP BAR */}
        <header className="shrink-0 h-14 border-b flex items-center justify-between px-4" style={{ borderColor: C.border }}>
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onClose} className="p-1.5 rounded-md hover:bg-slate-100" style={{ color: C.textMuted }}>
              <X size={16} />
            </button>
            <Breadcrumb segments={["Eicore", "Products", "D.I.Y Health Insurance", `${tier} Plan`]} />
          </div>

          {/* Mode Slider */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg border" style={{ borderColor: C.border, background: "#F9FAFB" }}>
            {([
              { id: "tree", label: "Tree", icon: GitBranch },
              { id: "extraction", label: "Extraction", icon: Layers },
              { id: "issues", label: "Issues", icon: AlertTriangle },
              { id: "docs", label: "Docs", icon: Files },
            ] as const).map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all"
                style={{
                  background: mode === m.id ? C.brand : "transparent",
                  color: mode === m.id ? "#fff" : C.textMuted,
                  fontSize: 12, fontWeight: 500,
                }}
              >
                <m.icon size={12} /> {m.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Filter chips */}
            <div className="hidden lg:flex items-center gap-1">
              {([
                { id: "all", label: "All", n: counts.all },
                { id: "issues", label: "Issues", n: counts.issues },
                { id: "low", label: "Low conf", n: counts.low },
                { id: "missing", label: "Missing", n: counts.missing },
                { id: "changed", label: "Changed", n: counts.changed },
                { id: "ai", label: "AI hints", n: counts.ai },
              ] as { id: FilterId; label: string; n: number }[]).map(c => (
                <button
                  key={c.id}
                  onClick={() => setFilter(c.id)}
                  className="flex items-center gap-1 px-2 py-1 rounded-full border transition-all"
                  style={{
                    borderColor: filter === c.id ? C.brand : C.border,
                    background: filter === c.id ? C.brandSoft : "#fff",
                    color: filter === c.id ? C.brand : C.textMuted,
                    fontSize: 11, fontWeight: 500,
                  }}
                >
                  {c.label}
                  <span className="tabular-nums" style={{ fontSize: 10, opacity: 0.7 }}>{c.n}</span>
                </button>
              ))}
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-0.5 ml-2 border rounded-md" style={{ borderColor: C.border }}>
              <IconBtn onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}><Minus size={12} /></IconBtn>
              <span className="px-1.5 tabular-nums" style={{ fontSize: 11, color: C.textMuted, minWidth: 36, textAlign: "center" }}>{Math.round(zoom * 100)}%</span>
              <IconBtn onClick={() => setZoom(z => Math.min(2, z + 0.1))}><Plus size={12} /></IconBtn>
              <IconBtn onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}><Maximize2 size={12} /></IconBtn>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <div className="flex-1 flex overflow-hidden relative">

          {/* LEFT SIDEBAR */}
          <LeftNav
            tier={tier}
            setTier={setTier}
            overlay={overlay}
            setOverlay={setOverlay}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onOpenCopilot={() => setCopilotOpen(true)}
            onOpenPalette={() => setPaletteOpen(true)}
          />

          {/* CANVAS / MODE CONTENT */}
          <main className="flex-1 relative overflow-hidden" style={{ background: C.canvas }}>
            {mode === "tree" || mode === "issues" ? (
              <TreeCanvas
                tier={tier}
                overlay={overlay}
                zoom={zoom}
                pan={pan}
                setPan={setPan}
                matchesFilter={mode === "issues" ? (p => p.values[tier].confidence !== "high") : matchesFilter}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            ) : mode === "extraction" ? (
              <ExtractionSplit
                tier={tier}
                pickId={extractionPick}
                onPick={setExtractionPick}
              />
            ) : (
              <DocsSplit activeDocId={activeDocId} onPick={setActiveDocId} />
            )}

            {/* Undo/Redo */}
            {(mode === "tree" || mode === "issues") && (
              <div className="absolute top-3 left-3 flex items-center gap-0.5 bg-white border rounded-md" style={{ borderColor: C.border }}>
                <IconBtn><Undo2 size={12} /></IconBtn>
                <IconBtn><Redo2 size={12} /></IconBtn>
              </div>
            )}

            {/* Status legend */}
            {(mode === "tree" || mode === "issues") && (
              <div className="absolute bottom-3 left-3 bg-white border rounded-lg overflow-hidden" style={{ borderColor: C.border, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
                <button
                  onClick={() => setLegendOpen(o => !o)}
                  className="w-full flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-50"
                  style={{ fontSize: 11, fontWeight: 600, color: C.text }}
                >
                  <Activity size={11} /> Legend
                  <ChevronDown size={11} className="ml-1 transition-transform" style={{ transform: legendOpen ? "rotate(0)" : "rotate(-90deg)" }} />
                </button>
                {legendOpen && (
                  <div className="px-3 pb-2.5 pt-1 space-y-1" style={{ fontSize: 11, color: C.textMuted }}>
                    <LegendRow color={C.success} label="Verified" />
                    <LegendRow color={C.warning} label="Low confidence" />
                    <LegendRow color={C.error} label="Missing / blocker" />
                    <LegendRow color={C.info} label="AI suggestion" />
                  </div>
                )}
              </div>
            )}

            {/* Mini-map */}
            {(mode === "tree" || mode === "issues") && (
              <MiniMap tier={tier} matchesFilter={matchesFilter} />
            )}

            {/* AI Co-Pilot floating */}
            <button
              onClick={() => setCopilotOpen(o => !o)}
              className="absolute right-3 bottom-[170px] w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform"
              style={{ background: C.brand, boxShadow: "0 4px 12px rgba(4,120,87,0.25)" }}
              title="AI Co-Pilot"
            >
              <Sparkles size={16} />
            </button>
          </main>

          {/* DRAWER */}
          <AnimatePresence>
            {selected && (
              <motion.div
                key="drawer-scrim"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedId(null)}
                className="absolute inset-0"
                style={{ background: "rgba(0,0,0,0.04)" }}
              />
            )}
            {selected && (
              <motion.aside
                key="drawer"
                initial={{ x: 480 }} animate={{ x: 0 }} exit={{ x: 480 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="absolute top-0 right-0 h-full w-[480px] bg-white border-l flex flex-col"
                style={{ borderColor: C.border, boxShadow: "-8px 0 24px rgba(0,0,0,0.06)" }}
              >
                <PlanEditorDrawer
                  p={selected}
                  tier={tier}
                  setTier={setTier}
                  onClose={() => setSelectedId(null)}
                  onJump={setSelectedId}
                />
              </motion.aside>
            )}
          </AnimatePresence>

          {/* AI Co-Pilot panel */}
          <AnimatePresence>
            {copilotOpen && (
              <motion.aside
                key="copilot"
                initial={{ x: 360, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 360, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute top-0 right-0 h-full w-[340px] bg-white border-l flex flex-col z-10"
                style={{ borderColor: C.border }}
              >
                <CopilotPanel onClose={() => setCopilotOpen(false)} />
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Command Palette */}
      <AnimatePresence>
        {paletteOpen && (
          <CommandPalette
            onClose={() => setPaletteOpen(false)}
            onPick={(id) => { setSelectedId(id); setPaletteOpen(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Left Nav ─────────────────────────────────────────────────────────────
function LeftNav({
  tier, setTier, overlay, setOverlay, selectedId, onSelect, onOpenCopilot, onOpenPalette,
}: {
  tier: PlanTier; setTier: (t: PlanTier) => void;
  overlay: boolean; setOverlay: (v: boolean) => void;
  selectedId: string | null; onSelect: (id: string) => void;
  onOpenCopilot: () => void; onOpenPalette: () => void;
}) {
  const [q, setQ] = useState("");
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({
    "Plan Limits": true, "Member Details": true, "Coverages": true, "Premium Raters": true,
  });

  const filtered = (params: Parameter[]) =>
    !q ? params : params.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <aside className="w-[260px] shrink-0 border-r flex flex-col bg-white" style={{ borderColor: C.border }}>
      {/* Search / quick jump */}
      <div className="px-3 pt-3 pb-2 border-b" style={{ borderColor: C.border }}>
        <button
          onClick={onOpenPalette}
          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md border hover:bg-slate-50"
          style={{ borderColor: C.border, fontSize: 12, color: C.textMuted }}
        >
          <Search size={12} />
          <span className="flex-1 text-left">Jump to any field…</span>
          <span className="px-1.5 py-0.5 rounded border tabular-nums" style={{ borderColor: C.border, fontSize: 10, color: C.textFaint }}>⌘K</span>
        </button>
      </div>

      {/* Tier picker — single source of truth */}
      <div className="px-3 py-3 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center justify-between">
          <Label>Viewing tier</Label>
          <label className="flex items-center gap-1.5 cursor-pointer" style={{ fontSize: 10, color: C.textMuted }}>
            <input type="checkbox" checked={overlay} onChange={e => setOverlay(e.target.checked)} className="accent-emerald-700" />
            Overlay all
          </label>
        </div>
        <div className="mt-1.5 flex items-center p-0.5 rounded-lg border" style={{ borderColor: C.border }}>
          {TIERS.map(t => {
            const params = PARAMETERS;
            const issues = params.filter(p => p.values[t].confidence !== "high").length;
            return (
              <button
                key={t}
                onClick={() => setTier(t)}
                className="flex-1 flex flex-col items-center py-1.5 rounded-md transition-all"
                style={{
                  background: tier === t ? C.brand : "transparent",
                  color: tier === t ? "#fff" : C.textMuted,
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 600 }}>{t}</span>
                <span className="tabular-nums" style={{ fontSize: 9, opacity: 0.85 }}>{issues} issues</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Inline search inside tree */}
      <div className="px-3 pt-2.5 pb-2 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border" style={{ borderColor: C.border }}>
          <Search size={11} style={{ color: C.textFaint }} />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Filter parameters"
            className="flex-1 outline-none bg-transparent"
            style={{ fontSize: 11 }}
          />
          {q && <button onClick={() => setQ("")}><X size={10} style={{ color: C.textFaint }} /></button>}
        </div>
      </div>

      {/* Categories tree (expandable) */}
      <div className="flex-1 overflow-y-auto px-1.5 py-1.5">
        <div className="px-2 pb-1.5 flex items-center justify-between">
          <Label>{tier} structure</Label>
          <span style={{ fontSize: 10, color: C.textFaint }}>{PARAMETERS.length} fields</span>
        </div>
        {TREE_CATS.map(cat => {
          const all = PARAMETERS.filter(p => catOf(p) === cat.id);
          const params = filtered(all);
          if (q && params.length === 0) return null;
          const low = all.filter(p => p.values[tier].confidence === "low").length;
          const med = all.filter(p => p.values[tier].confidence === "medium").length;
          const open = q ? true : openCats[cat.id];
          return (
            <div key={cat.id} className="mb-0.5">
              <button
                onClick={() => setOpenCats(o => ({ ...o, [cat.id]: !o[cat.id] }))}
                className="w-full flex items-center gap-1.5 px-1.5 py-1.5 rounded-md hover:bg-slate-50"
              >
                <ChevronDown size={11} style={{ color: C.textFaint, transform: open ? "rotate(0)" : "rotate(-90deg)", transition: "transform 150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: cat.color }} />
                <span className="flex-1 text-left truncate" style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{cat.id}</span>
                <span style={{ fontSize: 10, color: C.textFaint }}>{all.length}</span>
                {low > 0 && <span className="flex items-center" style={{ fontSize: 10, color: C.error, fontWeight: 600 }}>{low}<AlertOctagon size={9} /></span>}
                {med > 0 && <span className="flex items-center" style={{ fontSize: 10, color: C.warning, fontWeight: 600 }}>{med}<AlertTriangle size={9} /></span>}
              </button>
              {open && (
                <div className="ml-3.5 border-l pl-1.5" style={{ borderColor: C.border }}>
                  {params.map(p => {
                    const c = p.values[tier].confidence;
                    const sel = p.id === selectedId;
                    return (
                      <button
                        key={p.id}
                        onClick={() => onSelect(p.id)}
                        className="w-full flex items-center gap-1.5 px-1.5 py-1 rounded-md hover:bg-slate-50"
                        style={{ background: sel ? C.brandSoft : "transparent" }}
                      >
                        <span className="w-1 h-1 rounded-full shrink-0" style={{ background: confColor(c) }} />
                        <span className="flex-1 text-left truncate" style={{ fontSize: 11.5, color: sel ? C.brand : C.text, fontWeight: sel ? 600 : 400 }}>{p.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer: roadmap + AI */}
      <div className="border-t" style={{ borderColor: C.border }}>
        <div className="px-3 pt-2.5 pb-2">
          <div className="flex items-center justify-between mb-1.5">
            <Label>Roadmap</Label>
            <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 600 }}>3/5</span>
          </div>
          <div className="flex items-center gap-1">
            {["Upload","Extract","Verify","Audit","Publish"].map((s, i) => (
              <div key={s} className="flex-1 flex flex-col items-center gap-0.5" title={s}>
                <div className="h-1 w-full rounded-full" style={{ background: i < 2 ? C.brand : i === 2 ? C.success : "#E5E7EB" }} />
                <span style={{ fontSize: 8.5, color: i === 2 ? C.success : C.textFaint, fontWeight: i === 2 ? 600 : 400 }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={onOpenCopilot}
          className="m-2 mt-0 flex w-[calc(100%-1rem)] items-center gap-2 px-3 py-2 rounded-lg border hover:bg-emerald-50 transition-all"
          style={{ borderColor: C.border, fontSize: 12, color: C.text }}
        >
          <Sparkles size={14} style={{ color: C.brand }} />
          <span style={{ fontWeight: 600 }}>AI Co-Pilot</span>
          <span className="ml-auto" style={{ fontSize: 10, color: C.textFaint }}>Ask</span>
        </button>
      </div>
    </aside>
  );
}

// ── Tree Canvas ──────────────────────────────────────────────────────────
function TreeCanvas({
  tier, overlay, zoom, pan, setPan, matchesFilter, selectedId, onSelect,
}: {
  tier: PlanTier; overlay: boolean; zoom: number;
  pan: { x: number; y: number }; setPan: (p: { x: number; y: number }) => void;
  matchesFilter: (p: Parameter) => boolean;
  selectedId: string | null; onSelect: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const [isPanning, setIsPanning] = useState(false);

  const onMouseDown = (e: React.MouseEvent) => {
    // Pan when clicking the empty canvas (not a card/button) with left or middle mouse
    const target = e.target as HTMLElement;
    if (target.closest("[data-node-card]") || target.closest("button")) return;
    if (e.button !== 0 && e.button !== 1) return;
    dragRef.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    setIsPanning(true);
    e.preventDefault();
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    setPan({ x: dragRef.current.px + (e.clientX - dragRef.current.x), y: dragRef.current.py + (e.clientY - dragRef.current.y) });
  };
  const onMouseUp = () => { dragRef.current = null; setIsPanning(false); };

  // Layout: vertical tree — root → categories → fields
  const CARD_W = 260;
  const CARD_H = 140;
  const COL_GAP = 32;
  const ROW_GAP = 90;

  const cats = TREE_CATS.map(cat => {
    const fields = PARAMETERS.filter(p => catOf(p) === cat.id);
    return { ...cat, fields };
  });

  // X positions per category (horizontal columns)
  const colW = CARD_W + COL_GAP;
  const totalW = cats.length * colW - COL_GAP;
  let xOffset = -totalW / 2;
  const catLayout = cats.map(c => {
    const x = xOffset + CARD_W / 2;
    xOffset += colW;
    return { ...c, x };
  });

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(circle, ${C.dot} 1.5px, transparent 1.5px)`,
        backgroundSize: "24px 24px",
        cursor: isPanning ? "grabbing" : "grab",
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div
        className="absolute left-1/2 top-12"
        style={{
          transform: `translate(calc(-50% + ${pan.x}px), ${pan.y}px) scale(${zoom})`,
          transformOrigin: "top center",
          transition: dragRef.current ? "none" : "transform 200ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Plan Root */}
        <div className="relative" style={{ width: totalW, height: 100 }}>
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 rounded-2xl border bg-white px-5 py-3.5 shadow-sm"
            style={{
              width: 300, borderColor: C.brand, background: C.brandSoft,
              boxShadow: "0 8px 20px rgba(4,120,87,0.12)",
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md flex items-center justify-center text-white" style={{ background: C.brand, fontSize: 13, fontWeight: 700 }}>
                {tier[0]}
              </div>
              <div className="min-w-0">
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{tier} Plan</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>
                  SI {tier === "Mini" ? "₹4L–₹5L" : tier === "Medi" ? "₹6L–₹10L" : "₹11L–₹15L"} · D.I.Y Health
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SVG connections layer */}
        <svg
          width={totalW}
          height={(Math.max(...cats.map(c => c.fields.length)) + 1) * (CARD_H + ROW_GAP)}
          style={{ position: "absolute", top: 90, left: 0, pointerEvents: "none" }}
        >
          {catLayout.map(cat => {
            const rootX = totalW / 2;
            const catY = 50;
            const catX = cat.x + totalW / 2;
            return (
              <g key={cat.id}>
                {/* root → category */}
                <path
                  d={`M ${rootX} 0 C ${rootX} 30, ${catX} 20, ${catX} ${catY}`}
                  stroke={C.borderStrong} strokeWidth={1.5} fill="none"
                />
                {/* category → fields */}
                {cat.fields.map((_f, i) => {
                  const fy = catY + 90 + i * (CARD_H + ROW_GAP / 2);
                  return (
                    <path
                      key={i}
                      d={`M ${catX} ${catY + 50} C ${catX} ${catY + 70}, ${catX} ${fy - 20}, ${catX} ${fy}`}
                      stroke={C.borderStrong} strokeWidth={1.5} fill="none"
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Categories + Fields */}
        <div className="relative" style={{ width: totalW }}>
          {catLayout.map(cat => (
            <div key={cat.id} className="absolute" style={{ left: cat.x + totalW / 2 - 120, top: 30, width: 240 }}>
              {/* Category card */}
              <div
                className="rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 flex items-center gap-2 shadow-sm"
              >
                <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{cat.id}</div>
                  <div style={{ fontSize: 10, color: C.textMuted }}>{cat.fields.length} fields</div>
                </div>
                <HealthBar fields={cat.fields} tier={tier} />
              </div>

              {/* Fields */}
              <div className="relative mt-[90px] space-y-[24px]" style={{ height: cat.fields.length * (CARD_H + ROW_GAP / 2) }}>
                {overlay && (
                  <div className="absolute -inset-1 pointer-events-none">
                    <div className="absolute inset-1 rounded-2xl" style={{ border: `2px solid ${TIER_COLOR.Medi}`, opacity: 0.18, transform: "translate(8px, 8px)" }} />
                    <div className="absolute inset-1 rounded-2xl" style={{ border: `2px solid ${TIER_COLOR.Max}`, opacity: 0.13, transform: "translate(16px, 16px)" }} />
                  </div>
                )}
                {cat.fields.map((f, i) => (
                  <div key={f.id} style={{ position: "absolute", top: i * (CARD_H + ROW_GAP / 2), left: 0, right: 0 }}>
                    <NodeCard
                      p={f}
                      tier={tier}
                      cat={cat}
                      selected={selectedId === f.id}
                      dimmed={!matchesFilter(f)}
                      onClick={() => onSelect(f.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Node Card ────────────────────────────────────────────────────────────
function NodeCard({
  p, tier, cat, selected, dimmed, onClick,
}: {
  p: Parameter; tier: PlanTier;
  cat: { id: TreeCat; color: string };
  selected: boolean; dimmed: boolean; onClick: () => void;
}) {
  const val = p.values[tier];
  const conf = val.confidence;
  const missing = val.display.toLowerCase().includes("not");
  const status: "verified" | "warning" | "blocker" =
    missing ? "blocker" : conf === "high" ? "verified" : conf === "medium" ? "warning" : "blocker";

  const statusMeta = {
    verified: { bg: C.brandSoft, fg: C.brand, icon: <Check size={11} />, label: "Verified", action: "Edit" },
    warning:  { bg: C.warnSoft, fg: C.warning, icon: <AlertTriangle size={11} />, label: "Low confidence", action: "Review" },
    blocker:  { bg: C.errSoft, fg: C.error, icon: <AlertOctagon size={11} />, label: missing ? "Missing required" : "Blocker", action: "Resolve" },
  }[status];

  const aiPct = conf === "high" ? 92 : conf === "medium" ? 75 : 38;
  const doc = DOCUMENTS.find(d => d.id === val.source.docId)!;

  return (
    <button
      onClick={onClick}
      data-node-card
      className="w-full text-left rounded-2xl border bg-white overflow-hidden transition-all shadow-sm hover:shadow-md"
      style={{
        opacity: dimmed ? 0.4 : 1,
        borderColor: selected ? C.brand : C.border,
        boxShadow: selected
          ? `0 0 0 2px ${C.brand}, 0 8px 20px rgba(4,120,87,0.12)`
          : undefined,
      }}
    >
      {/* Category tab */}
      <div className="flex items-center justify-between px-3.5 pt-2.5 pb-1.5">
        <span
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded"
          style={{ background: `${cat.color}15`, color: cat.color, fontSize: 10, fontWeight: 600 }}
        >
          <span className="w-1 h-1 rounded-full" style={{ background: cat.color }} />
          {cat.id}
        </span>
        <MoreHorizontal size={13} style={{ color: C.textFaint }} />
      </div>

      {/* Body */}
      <div className="px-3.5 pb-2.5">
        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.25 }}>{p.name}</div>
        <div className="mt-1" style={{
          fontSize: 13, fontWeight: 500,
          color: missing ? C.error : C.textMuted,
        }}>
          {missing ? "Missing" : val.display}
        </div>
      </div>

      {/* Indicator strip */}
      <div className="px-3.5 py-1.5 border-t flex items-center gap-2" style={{ borderColor: C.border, fontSize: 10.5, color: C.textMuted }}>
        <span className="flex items-center gap-1">
          <Sparkles size={9} style={{ color: C.info }} />
          AI · <span className="tabular-nums" style={{ fontWeight: 600, color: C.text }}>{aiPct}%</span>
        </span>
        <span style={{ color: C.textFaint }}>·</span>
        <span>↔ {Math.floor(Math.random() * 4) + 1} deps</span>
        <span style={{ color: C.textFaint }}>·</span>
        <span className="flex items-center gap-1 truncate">
          <FileText size={9} /> {doc.type} p{val.source.page}
        </span>
      </div>

      {/* Status footer */}
      <div className="flex items-center justify-between px-3.5 py-2" style={{ background: statusMeta.bg }}>
        <span className="flex items-center gap-1.5" style={{ fontSize: 11, fontWeight: 600, color: statusMeta.fg }}>
          {statusMeta.icon} {statusMeta.label}
        </span>
        <span className="flex items-center gap-0.5" style={{ fontSize: 11, fontWeight: 600, color: statusMeta.fg }}>
          {statusMeta.action} <ChevronRight size={11} />
        </span>
      </div>
    </button>
  );
}

// ── Health bar (mini summary on category card) ──────────────────────────
function HealthBar({ fields, tier }: { fields: Parameter[]; tier: PlanTier }) {
  const counts = fields.reduce((a, p) => {
    a[p.values[tier].confidence]++;
    return a;
  }, { high: 0, medium: 0, low: 0 } as Record<Confidence, number>);
  const total = Math.max(fields.length, 1);
  return (
    <div className="flex h-1.5 w-16 rounded-full overflow-hidden" style={{ background: "#F1F5F9" }}>
      <div style={{ width: `${(counts.high / total) * 100}%`, background: C.success }} />
      <div style={{ width: `${(counts.medium / total) * 100}%`, background: C.warning }} />
      <div style={{ width: `${(counts.low / total) * 100}%`, background: C.error }} />
    </div>
  );
}

// ── Mini-map ─────────────────────────────────────────────────────────────
function MiniMap({ tier, matchesFilter }: { tier: PlanTier; matchesFilter: (p: Parameter) => boolean }) {
  return (
    <div className="absolute bottom-3 right-3 bg-white border rounded-lg p-2 w-[200px]" style={{ borderColor: C.border, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between mb-1.5">
        <Label>Map</Label>
        <span style={{ fontSize: 10, color: C.textFaint }}>{tier}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5" style={{ background: C.canvas, padding: 6, borderRadius: 6 }}>
        {TREE_CATS.map(cat => {
          const fields = PARAMETERS.filter(p => catOf(p) === cat.id);
          return (
            <div key={cat.id} className="flex flex-col gap-0.5">
              <div className="h-1 rounded-sm" style={{ background: cat.color }} />
              {fields.map(f => (
                <div
                  key={f.id}
                  className="h-1 rounded-sm"
                  style={{
                    background: confColor(f.values[tier].confidence),
                    opacity: matchesFilter(f) ? 1 : 0.3,
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Plan Editor Drawer ──────────────────────────────────────────────────
function PlanEditorDrawer({
  p, tier, setTier, onClose, onJump,
}: {
  p: Parameter; tier: PlanTier; setTier: (t: PlanTier) => void;
  onClose: () => void; onJump: (id: string) => void;
}) {
  const val = p.values[tier];
  const doc = DOCUMENTS.find(d => d.id === val.source.docId)!;
  const cat = TREE_CATS.find(c => c.from.includes(p.category))!;
  const allList = PARAMETERS;
  const allIdx = allList.findIndex(x => x.id === p.id);
  const list = PARAMETERS.filter(x => catOf(x) === cat.id);
  const aiPct = val.confidence === "high" ? 92 : val.confidence === "medium" ? 75 : 38;
  const [draft, setDraft] = useState(val.display);
  const [tab, setTab] = useState<"comments" | "activity" | "subtasks" | "team">("comments");
  const [depsOpen, setDepsOpen] = useState(true);
  const [srcOpen, setSrcOpen] = useState(true);
  const [jumpOpen, setJumpOpen] = useState(false);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [jumpQ, setJumpQ] = useState("");

  useEffect(() => setDraft(val.display), [val.display]);
  useEffect(() => { setJumpOpen(false); setCatMenuOpen(false); }, [p.id, tier]);

  const missing = val.display.toLowerCase().includes("not");
  const jumpMatches = jumpQ
    ? allList.filter(x => x.name.toLowerCase().includes(jumpQ.toLowerCase()))
    : allList;

  // Prev/Next across the entire flat list
  const onNavAll = (dir: 1 | -1) => {
    const next = (allIdx + dir + allList.length) % allList.length;
    onJump(allList[next].id);
  };

  return (
    <>
      {/* Sticky header */}
      <div className="shrink-0 border-b" style={{ borderColor: C.border, background: "#fff" }}>
        {/* Row 1: close + global pos + nav */}
        <div className="flex items-center gap-2 px-4 pt-3">
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100"><X size={14} /></button>
          <span style={{ fontSize: 11, color: C.textFaint }}>Field {allIdx + 1} of {allList.length}</span>
          <div className="ml-auto flex items-center gap-0.5">
            <button onClick={() => onNavAll(-1)} title="Previous field" className="p-1 rounded hover:bg-slate-100" style={{ color: C.textMuted }}>
              <ArrowLeft size={13} />
            </button>
            <button onClick={() => onNavAll(1)} title="Next field" className="p-1 rounded hover:bg-slate-100" style={{ color: C.textMuted }}>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Row 2: clickable breadcrumb (cross-tier, cross-category, cross-field) */}
        <div className="px-4 pt-2 pb-2 flex items-center gap-1 flex-wrap" style={{ fontSize: 12 }}>
          {/* Tier picker */}
          <div className="relative">
            <div className="flex items-center p-0.5 rounded-md border" style={{ borderColor: C.border }}>
              {TIERS.map(t => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className="flex items-center gap-1 px-2 py-1 rounded transition-all"
                  style={{
                    background: tier === t ? C.brand : "transparent",
                    color: tier === t ? "#fff" : C.textMuted,
                    fontSize: 11, fontWeight: 600,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: confColor(p.values[t].confidence) }} />
                  {t}
                </button>
              ))}
            </div>
          </div>

          <ChevronRight size={11} style={{ color: C.textFaint }} />

          {/* Category dropdown */}
          <div className="relative">
            <button
              onClick={() => { setCatMenuOpen(o => !o); setJumpOpen(false); }}
              className="flex items-center gap-1 px-2 py-1 rounded-md border hover:bg-slate-50"
              style={{ borderColor: C.border, fontSize: 11, color: C.text, fontWeight: 500 }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: cat.color }} />
              {cat.id}
              <ChevronDown size={10} style={{ color: C.textFaint }} />
            </button>
            {catMenuOpen && (
              <div className="absolute top-full left-0 mt-1 w-[200px] bg-white border rounded-md z-20 py-1" style={{ borderColor: C.border, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
                {TREE_CATS.map(c2 => {
                  const first = PARAMETERS.find(x => catOf(x) === c2.id);
                  return (
                    <button
                      key={c2.id}
                      onClick={() => { if (first) onJump(first.id); setCatMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-50 text-left"
                      style={{ background: c2.id === cat.id ? C.brandSoft : "transparent" }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c2.color }} />
                      <span style={{ fontSize: 12, color: C.text }}>{c2.id}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <ChevronRight size={11} style={{ color: C.textFaint }} />

          {/* Field jumper */}
          <div className="relative flex-1 min-w-0">
            <button
              onClick={() => { setJumpOpen(o => !o); setCatMenuOpen(false); }}
              className="w-full flex items-center gap-1 px-2 py-1 rounded-md border hover:bg-slate-50"
              style={{ borderColor: C.border }}
            >
              <span className="flex-1 text-left truncate" style={{ fontSize: 11, fontWeight: 600, color: C.text }}>{p.name}</span>
              <ChevronDown size={10} style={{ color: C.textFaint }} />
            </button>
            {jumpOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md z-20 overflow-hidden" style={{ borderColor: C.border, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
                <div className="flex items-center gap-1.5 px-2 py-1.5 border-b" style={{ borderColor: C.border }}>
                  <Search size={11} style={{ color: C.textFaint }} />
                  <input
                    autoFocus
                    value={jumpQ}
                    onChange={e => setJumpQ(e.target.value)}
                    placeholder="Find field across all categories…"
                    className="flex-1 outline-none bg-transparent"
                    style={{ fontSize: 12 }}
                  />
                </div>
                <div className="max-h-[280px] overflow-y-auto py-0.5">
                  {TREE_CATS.map(c2 => {
                    const items = jumpMatches.filter(x => catOf(x) === c2.id);
                    if (items.length === 0) return null;
                    return (
                      <div key={c2.id}>
                        <div className="px-2.5 pt-1.5 pb-1 flex items-center gap-1.5" style={{ fontSize: 9.5, fontWeight: 600, color: C.textFaint, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                          <span className="w-1 h-1 rounded-full" style={{ background: c2.color }} />
                          {c2.id}
                        </div>
                        {items.map(x => (
                          <button
                            key={x.id}
                            onClick={() => { onJump(x.id); setJumpOpen(false); setJumpQ(""); }}
                            className="w-full flex items-center gap-2 px-2.5 py-1 hover:bg-slate-50 text-left"
                            style={{ background: x.id === p.id ? C.brandSoft : "transparent" }}
                          >
                            <span className="w-1 h-1 rounded-full" style={{ background: confColor(x.values[tier].confidence) }} />
                            <span className="flex-1 truncate" style={{ fontSize: 11.5, color: x.id === p.id ? C.brand : C.text, fontWeight: x.id === p.id ? 600 : 400 }}>{x.name}</span>
                            <span style={{ fontSize: 10, color: C.textFaint }} className="truncate max-w-[140px]">{x.values[tier].display}</span>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                  {jumpMatches.length === 0 && <div className="px-3 py-4 text-center" style={{ fontSize: 11, color: C.textFaint }}>No matches</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {/* Title */}
        <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
          <div className="flex items-start justify-between gap-2">
            <h2 style={{ fontSize: 18, fontWeight: 600, color: C.text }}>{p.name}</h2>
            <div className="flex items-center gap-1">
              <IconBtn><ExternalLink size={13} /></IconBtn>
              <IconBtn><MoreHorizontal size={13} /></IconBtn>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            <Pill bg={missing ? C.errSoft : val.confidence === "high" ? C.brandSoft : C.warnSoft}
                  fg={missing ? C.error : val.confidence === "high" ? C.brand : C.warning}>
              {missing ? "⛔ Missing" : val.confidence === "high" ? "✓ Verified" : "⚠ Review"}
            </Pill>
            <Pill bg="#F3F4F6" fg={C.textMuted}>📄 {doc.type} p{val.source.page}</Pill>
            <Pill bg={C.infoSoft} fg={C.info}>🤖 {aiPct}%</Pill>
          </div>
        </div>

        {/* Cross-tier comparison */}
        <div className="px-5 py-3 border-b" style={{ borderColor: C.border, background: C.canvas }}>
          <div className="flex items-center justify-between mb-1.5">
            <Label>Across plan tiers</Label>
            <span style={{ fontSize: 10, color: C.textFaint }}>Click to switch tier</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {TIERS.map(t => {
              const v = p.values[t];
              const active = t === tier;
              const m = v.display.toLowerCase().includes("not");
              return (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className="rounded-md border bg-white px-2 py-1.5 text-left transition-all"
                  style={{
                    borderColor: active ? C.brand : C.border,
                    boxShadow: active ? `0 0 0 1px ${C.brand}` : "none",
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: confColor(v.confidence) }} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: active ? C.brand : C.textMuted }}>{t}</span>
                  </div>
                  <div className="mt-0.5 truncate" style={{ fontSize: 12, fontWeight: 500, color: m ? C.error : C.text }}>
                    {m ? "Missing" : v.display}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Value editor */}
        <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
          <Label>AI Extracted</Label>
          <div className="mt-1.5 px-3 py-2 rounded-md" style={{ background: C.canvas, color: C.textMuted, fontSize: 13 }}>
            {val.display}
          </div>
          <Label>Your Value</Label>
          <input
            value={draft}
            onChange={e => setDraft(e.target.value)}
            className="mt-1.5 w-full px-3 py-2 rounded-md border outline-none focus:border-emerald-600"
            style={{ borderColor: C.border, fontSize: 13, fontWeight: 500, color: C.text }}
          />
          <div className="mt-2 flex items-center gap-2" style={{ fontSize: 11, color: C.textFaint }}>
            <span>Field type: Range</span><span>·</span><span>Required</span>
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <button onClick={() => setDraft(val.display)} className="px-3 py-1.5 rounded-md border hover:bg-slate-50" style={{ borderColor: C.border, fontSize: 11, color: C.textMuted }}>Reset to AI value</button>
            <button className="px-3 py-1.5 rounded-md text-white hover:opacity-90" style={{ background: C.text, fontSize: 11, fontWeight: 600 }}>Save changes</button>
          </div>
        </div>

        {/* Dependencies */}
        <div className="border-b" style={{ borderColor: C.border }}>
          <button onClick={() => setDepsOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50">
            <Label>↔ Dependencies (3)</Label>
            <ChevronDown size={13} style={{ color: C.textFaint, transform: depsOpen ? "rotate(0)" : "rotate(-90deg)" }} />
          </button>
          {depsOpen && (
            <div className="px-5 pb-3 space-y-1.5">
              <div style={{ fontSize: 10, fontWeight: 600, color: C.textFaint, letterSpacing: "0.06em" }}>USED IN</div>
              {["Premium Calculation (Rule)", "Age Band Mapping (Rate Card)", "Member Eligibility Check (Rule)"].map(d => (
                <button key={d} className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-slate-50" style={{ fontSize: 12, color: C.text }}>
                  <span>{d}</span>
                  <ChevronRight size={11} style={{ color: C.textFaint }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Source passage */}
        <div className="border-b" style={{ borderColor: C.border }}>
          <button onClick={() => setSrcOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50">
            <Label>📄 Source passage</Label>
            <ChevronDown size={13} style={{ color: C.textFaint, transform: srcOpen ? "rotate(0)" : "rotate(-90deg)" }} />
          </button>
          {srcOpen && (
            <div className="px-5 pb-4">
              <div style={{ fontSize: 11, color: C.textMuted }}>
                {doc.name} · Page {val.source.page}
              </div>
              <div className="mt-2 p-3 rounded-md border" style={{ borderColor: C.border, background: C.canvas, fontSize: 12, color: C.textMuted, lineHeight: 1.55 }}>
                {val.source.context.split(/(\{\{[^}]+\}\})/g).map((part, i) =>
                  part.startsWith("{{") ? (
                    <mark key={i} style={{ background: C.warnSoft, boxShadow: "inset 0 -2px 0 #FBBF24", color: C.text, padding: "0 2px", fontWeight: 500 }}>
                      {part.slice(2, -2)}
                    </mark>
                  ) : <span key={i}>{part}</span>
                )}
              </div>
              <button className="mt-2 flex items-center gap-1 hover:underline" style={{ fontSize: 11, fontWeight: 500, color: C.brand }}>
                Open full document <ExternalLink size={11} />
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div>
          <div className="flex items-center border-b" style={{ borderColor: C.border }}>
            {([
              { id: "comments", label: "Comments", n: 2 },
              { id: "activity", label: "Activity", n: 8 },
              { id: "subtasks", label: "Subtasks", n: list.length - 1 },
              { id: "team", label: "Team", n: 4 },
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="px-4 py-2.5 transition-all"
                style={{
                  color: tab === t.id ? C.text : C.textMuted,
                  borderBottom: `2px solid ${tab === t.id ? C.brand : "transparent"}`,
                  fontSize: 12, fontWeight: 500,
                }}
              >
                {t.label} <span style={{ color: C.textFaint, fontSize: 10 }}>({t.n})</span>
              </button>
            ))}
          </div>
          <div className="px-5 py-4">
            {tab === "comments" && (
              <div className="space-y-3">
                <div className="flex gap-2.5">
                  <Avatar name="SC" />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2"><span style={{ fontSize: 12, fontWeight: 600 }}>Sarah Chen</span><span style={{ fontSize: 10, color: C.textFaint }}>2h ago</span></div>
                    <div style={{ fontSize: 12, color: C.text, lineHeight: 1.45 }}>BRD doesn't specify the upper bound. I've reached out to product — assume 65 yrs unless we hear otherwise.</div>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <Avatar name="AI" color={C.info} />
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2"><span style={{ fontSize: 12, fontWeight: 600, color: C.info }}>AI Co-pilot</span><span style={{ fontSize: 10, color: C.textFaint }}>1h ago</span></div>
                    <div style={{ fontSize: 12, color: C.text, lineHeight: 1.45 }}>I found "18–65 yrs inclusive" on BRD p7. Confidence 75% — recommend manual verify.</div>
                  </div>
                </div>
                <div className="mt-3 rounded-md border" style={{ borderColor: C.border }}>
                  <textarea placeholder="Write a comment, @-mention or ask AI…" className="w-full px-3 py-2 outline-none rounded-md resize-none" rows={2} style={{ fontSize: 12 }} />
                  <div className="px-2 py-1.5 border-t flex items-center justify-between" style={{ borderColor: C.border }}>
                    <button className="flex items-center gap-1 px-2 py-1 rounded hover:bg-emerald-50" style={{ fontSize: 11, color: C.brand, fontWeight: 600 }}>
                      <Sparkles size={11} /> AI assist
                    </button>
                    <button className="px-3 py-1 rounded text-white" style={{ background: C.brand, fontSize: 11, fontWeight: 600 }}>Post</button>
                  </div>
                </div>
              </div>
            )}
            {tab === "activity" && (
              <div className="space-y-2" style={{ fontSize: 12, color: C.textMuted }}>
                <ActivityRow when="2h ago" who="Sarah" what="commented" />
                <ActivityRow when="3h ago" who="AI" what="extracted value (75% conf)" />
                <ActivityRow when="1d ago" who="Maya" what="marked as needs review" />
              </div>
            )}
            {tab === "subtasks" && (
              <div className="space-y-1">
                {list.filter(x => x.id !== p.id).slice(0, 6).map(x => (
                  <button key={x.id} className="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-slate-50" style={{ fontSize: 12 }}>
                    <span>{x.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: confColor(x.values[tier].confidence) }} />
                  </button>
                ))}
              </div>
            )}
            {tab === "team" && (
              <div className="flex items-center gap-1.5">
                {["SC","MK","AR","JD"].map(n => <Avatar key={n} name={n} />)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating action */}
      <div className="shrink-0 p-3 border-t" style={{ borderColor: C.border, background: "#fff" }}>
        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white" style={{ background: C.brand, fontSize: 13, fontWeight: 600 }}>
          <Check size={14} /> Mark Verified
        </button>
      </div>
    </>
  );
}

// ── Extraction split ─────────────────────────────────────────────────────
function ExtractionSplit({ tier, pickId, onPick }: { tier: PlanTier; pickId: string; onPick: (id: string) => void }) {
  const pick = PARAMETERS.find(p => p.id === pickId) || PARAMETERS[0];
  const val = pick.values[tier];
  const doc = DOCUMENTS.find(d => d.id === val.source.docId)!;
  return (
    <div className="absolute inset-0 flex" style={{ background: "#fff" }}>
      {/* Left: param list */}
      <div className="w-[45%] border-r overflow-y-auto" style={{ borderColor: C.border }}>
        <div className="sticky top-0 px-4 py-3 bg-white border-b flex items-center gap-2" style={{ borderColor: C.border }}>
          <Label>Extracted parameters · {tier}</Label>
          <span className="ml-auto" style={{ fontSize: 11, color: C.textMuted }}>{PARAMETERS.length} items</span>
        </div>
        <div className="divide-y" style={{ borderColor: C.border }}>
          {PARAMETERS.map(p => {
            const v = p.values[tier];
            const sel = p.id === pickId;
            return (
              <button key={p.id} onClick={() => onPick(p.id)} className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3"
                      style={{ background: sel ? C.brandSoft : "transparent" }}>
                <input type="checkbox" className="accent-emerald-700" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{p.name}</span>
                    <Pill bg={v.confidence === "high" ? C.brandSoft : v.confidence === "medium" ? C.warnSoft : C.errSoft}
                          fg={confColor(v.confidence)}>
                      {v.confidence === "high" ? "✓ Verified" : v.confidence === "medium" ? "⚠ Review" : "⛔ Missing"}
                    </Pill>
                  </div>
                  <div className="mt-0.5 truncate" style={{ fontSize: 11, color: C.textMuted }}>{v.display}</div>
                </div>
                <ChevronRight size={13} style={{ color: C.textFaint }} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: doc viewer */}
      <div className="flex-1 flex flex-col bg-slate-50">
        <div className="px-4 py-2.5 border-b bg-white flex items-center gap-2" style={{ borderColor: C.border }}>
          <FileText size={13} style={{ color: C.textMuted }} />
          <span style={{ fontSize: 12, fontWeight: 600 }}>{doc.name}</span>
          <span className="ml-auto" style={{ fontSize: 11, color: C.textMuted }}>Page {val.source.page} / {doc.pages}</span>
          <IconBtn><Minus size={11} /></IconBtn>
          <IconBtn><Plus size={11} /></IconBtn>
          <IconBtn><Maximize2 size={11} /></IconBtn>
        </div>
        <div className="flex-1 overflow-y-auto p-8 flex justify-center">
          <div className="w-full max-w-[600px] bg-white rounded-md border p-8" style={{ borderColor: C.border, boxShadow: "0 1px 3px rgba(0,0,0,0.05)", fontSize: 12, lineHeight: 1.7, color: C.text }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>{doc.type} · Section relating to {pick.name}</div>
            <div style={{ color: C.textMuted }}>
              {val.source.context.split(/(\{\{[^}]+\}\})/g).map((part, i) =>
                part.startsWith("{{") ? (
                  <mark key={i} style={{ background: C.warnSoft, boxShadow: "inset 0 -2px 0 #FBBF24", color: C.text, padding: "1px 3px", fontWeight: 500 }}>
                    {part.slice(2, -2)}
                  </mark>
                ) : <span key={i}>{part}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Docs split ───────────────────────────────────────────────────────────
function DocsSplit({ activeDocId, onPick }: { activeDocId: string; onPick: (id: string) => void }) {
  const doc = DOCUMENTS.find(d => d.id === activeDocId) || DOCUMENTS[0];
  return (
    <div className="absolute inset-0 flex bg-white">
      <div className="w-[320px] border-r overflow-y-auto" style={{ borderColor: C.border }}>
        <div className="sticky top-0 px-4 py-3 bg-white border-b" style={{ borderColor: C.border }}>
          <Label>Source documents</Label>
        </div>
        {DOCUMENTS.map(d => (
          <button key={d.id} onClick={() => onPick(d.id)} className="w-full text-left px-4 py-3 border-b hover:bg-slate-50 flex items-center gap-3"
                  style={{ borderColor: C.border, background: d.id === activeDocId ? C.brandSoft : "transparent" }}>
            <div className="w-9 h-12 rounded-sm flex items-center justify-center" style={{ background: C.canvas, border: `1px solid ${C.border}` }}>
              <FileText size={14} style={{ color: C.textMuted }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate" style={{ fontSize: 12, fontWeight: 600 }}>{d.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{d.pages} pages · 87% extracted</div>
            </div>
          </button>
        ))}
      </div>
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-8">
        <div className="w-full max-w-[600px] h-full bg-white rounded-md border p-8 overflow-y-auto" style={{ borderColor: C.border, fontSize: 12, lineHeight: 1.7, color: C.textMuted }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 16 }}>{doc.name}</div>
          <p>This is a stub preview of the document. In the production app this would render the actual PDF/DOCX content with annotation tools and a passage-to-parameter jump on click.</p>
        </div>
      </div>
    </div>
  );
}

// ── Command palette ──────────────────────────────────────────────────────
function CommandPalette({ onClose, onPick }: { onClose: () => void; onPick: (id: string) => void }) {
  const [q, setQ] = useState("");
  const matches = PARAMETERS.filter(p => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 8);
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      style={{ background: "rgba(0,0,0,0.18)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-[520px] bg-white rounded-2xl border border-slate-200 overflow-hidden"
        style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: C.border }}>
          <Search size={14} style={{ color: C.textMuted }} />
          <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search any field, jump to it, run actions…" className="flex-1 outline-none" style={{ fontSize: 13 }} />
          <span className="text-xs px-1.5 py-0.5 rounded border" style={{ borderColor: C.border, color: C.textFaint }}>⌘K</span>
        </div>
        <div className="max-h-[320px] overflow-y-auto py-1">
          {matches.map(p => (
            <button key={p.id} onClick={() => onPick(p.id)} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-left">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: TREE_CATS.find(c => c.from.includes(p.category))!.color }} />
              <span className="flex-1" style={{ fontSize: 12, color: C.text }}>{p.name}</span>
              <span style={{ fontSize: 10, color: C.textFaint }}>{catOf(p)}</span>
            </button>
          ))}
          {matches.length === 0 && <div className="px-4 py-6 text-center" style={{ fontSize: 12, color: C.textFaint }}>No matches</div>}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Co-pilot panel ───────────────────────────────────────────────────────
function CopilotPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2">
          <Sparkles size={14} style={{ color: C.brand }} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>AI Co-Pilot</span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-slate-100"><X size={13} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <Label>Try asking</Label>
        {[
          "What fields are missing across all plans?",
          "Compare OPD limits across tiers",
          "Show anomalies in Premium Raters",
          "Which fields have conflicting source citations?",
        ].map(q => (
          <button key={q} className="w-full text-left px-3 py-2 rounded-lg border hover:bg-emerald-50" style={{ borderColor: C.border, fontSize: 12, color: C.text }}>{q}</button>
        ))}
      </div>
      <div className="p-3 border-t" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ borderColor: C.border }}>
          <input placeholder="Ask anything about the tree…" className="flex-1 outline-none" style={{ fontSize: 12 }} />
          <button className="p-1 rounded text-white" style={{ background: C.brand }}><ArrowRight size={12} /></button>
        </div>
      </div>
    </>
  );
}

// ── Bits ─────────────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  // Matches Root.tsx pattern: text-[10px] font-bold text-slate-400 uppercase tracking-widest
  return <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{children}</div>;
}
function IconBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return <button onClick={onClick} className="p-1.5 rounded-md hover:bg-slate-100" style={{ color: C.textMuted }}>{children}</button>;
}
function Pill({ children, bg, fg }: { children: React.ReactNode; bg: string; fg: string }) {
  return <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: bg, color: fg, fontSize: 10.5, fontWeight: 600 }}>{children}</span>;
}
function Breadcrumb({ segments }: { segments: string[] }) {
  return (
    <div className="flex items-center gap-1 min-w-0" style={{ fontSize: 12 }}>
      {segments.map((s, i) => (
        <span key={i} className="flex items-center gap-1 truncate">
          {i > 0 && <ChevronRight size={11} style={{ color: C.textFaint }} />}
          <span style={{ color: i === segments.length - 1 ? C.text : C.textMuted, fontWeight: i === segments.length - 1 ? 600 : 400 }}>{s}</span>
        </span>
      ))}
    </div>
  );
}
function Avatar({ name, color = "#94A3B8" }: { name: string; color?: string }) {
  return <div className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0" style={{ background: color, fontSize: 10, fontWeight: 700 }}>{name}</div>;
}
function ActivityRow({ when, who, what }: { when: string; who: string; what: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.brand }} />
      <span style={{ fontWeight: 600, color: C.text }}>{who}</span>
      <span>{what}</span>
      <span className="ml-auto" style={{ fontSize: 10, color: C.textFaint }}>{when}</span>
    </div>
  );
}
function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span>{label}</span>
    </div>
  );
}
