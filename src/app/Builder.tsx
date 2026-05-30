import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight, Check, CheckCircle2, AlertOctagon,
  FileText, Search, Sparkles, X, Pencil, ChevronRight,
  Command, Filter, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  PARAMETERS, CATEGORIES, DOCUMENTS, AUDIT_ISSUES, STAGES,
  confidenceCounts,
  type Parameter, type PlanTier, type Confidence, type CategoryId
} from "./builder-data";

// ── Design tokens ────────────────────────────────────────────────────────
const C = {
  primary: "#047857",
  primarySoft: "#ECFDF5",
  success: "#10B981",
  warning: "#F59E0B",
  warningSoft: "#FEF3C7",
  error: "#EF4444",
  errorSoft: "#FEE2E2",
  info: "#2563EB",
  border: "#E5E7EB",
  surface: "#F9FAFB",
  text: "#0F172A",
  textMuted: "#64748B",
  textFaint: "#94A3B8",
};

const TIERS: PlanTier[] = ["Mini", "Medi", "Max"];
const TIER_LETTER: Record<PlanTier, string> = { Mini: "S", Medi: "M", Max: "L" };
const SCALE_MAX = 1500000;

const confColor = (c: Confidence) => c === "high" ? C.success : c === "medium" ? C.warning : C.error;
const confBg = (c: Confidence) => c === "high" ? "#ECFDF5" : c === "medium" ? "#FEF3C7" : "#FEE2E2";
const confLabel = (c: Confidence) => c === "high" ? "High" : c === "medium" ? "Medium" : "Low";

export default function Builder() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<CategoryId>("coverage");
  const [activeDoc, setActiveDoc] = useState(DOCUMENTS[1].id);
  const [selectedParamId, setSelectedParamId] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<PlanTier>("Mini");
  const [verified, setVerified] = useState<Record<string, boolean>>({});
  const [resolved, setResolved] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [filterConf, setFilterConf] = useState<"all" | Confidence>("all");

  const counts = useMemo(confidenceCounts, []);
  const qualityPct = Math.round((counts.high / counts.total) * 100);

  const paramsInCategory = useMemo(
    () => PARAMETERS.filter(p => p.category === activeCategory),
    [activeCategory]
  );
  const filtered = useMemo(() => paramsInCategory.filter(p => {
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
    if (filterConf !== "all" && !TIERS.some(t => p.values[t].confidence === filterConf)) return false;
    return true;
  }), [paramsInCategory, query, filterConf]);

  const selectedParam = useMemo(
    () => PARAMETERS.find(p => p.id === selectedParamId) || null,
    [selectedParamId]
  );

  const activeDocId = selectedParam ? selectedParam.values[selectedTier].source.docId : activeDoc;
  const activeDocObj = DOCUMENTS.find(d => d.id === activeDocId) || DOCUMENTS[0];

  const openIssuesCount = AUDIT_ISSUES.filter(i => !resolved[i.id]).length;
  const blockerCount = AUDIT_ISSUES.filter(i => !resolved[i.id] && i.severity === "blocker").length;
  const remaining = counts.total - Object.values(verified).filter(Boolean).length;

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: "#F3F4F6", fontFamily: "Inter, system-ui, sans-serif", color: C.text }}>
      {/* TOP BAR */}
      <header className="shrink-0 bg-white border-b flex items-center justify-between px-6 h-16" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-semibold" style={{ background: C.primary, fontSize: 15 }}>E</div>
            <div className="leading-tight">
              <div style={{ fontSize: 13, fontWeight: 600 }}>D.I.Y Health Insurance</div>
              <div style={{ fontSize: 11, color: C.textFaint }}>Health · UIN EIC-HLT-P-V-001-25</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 ml-2">
            {STAGES.map(s => {
              const state = s.id < 3 ? "done" : s.id === 3 ? "active" : "todo";
              return (
                <div key={s.id} className="flex items-center gap-1.5">
                  <div className="h-1.5 rounded-full transition-all" style={{
                    width: state === "active" ? 36 : 18,
                    background: state === "done" ? C.primary : state === "active" ? C.success : "#E5E7EB",
                  }} />
                  <span style={{
                    fontSize: 11,
                    color: state === "todo" ? C.textFaint : C.textMuted,
                    fontWeight: state === "active" ? 600 : 400,
                  }}>{s.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 pl-3 pr-4 py-1.5 rounded-lg border" style={{ borderColor: C.border }}>
            <Ring value={qualityPct} />
            <div className="leading-tight">
              <div style={{ fontSize: 11, color: C.textMuted }}>Extraction quality</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{qualityPct}% · {remaining} to verify</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border" style={{ borderColor: C.border, color: C.textMuted, fontSize: 11 }}>
            <Command size={11} /> K
          </div>

          <button
            onClick={() => toast.success("Submitted for downstream review")}
            className="flex items-center gap-2 px-3.5 py-2 text-white rounded-lg transition-all hover:opacity-90"
            style={{ background: C.primary, fontSize: 12, fontWeight: 600 }}
          >
            Submit configuration <ArrowRight size={14} />
          </button>

          <button onClick={() => navigate("/review")} className="p-2 rounded-md hover:bg-slate-100" style={{ color: C.textMuted }} title="Discard draft">
            <Trash2 size={16} />
          </button>
        </div>
      </header>

      {/* MAIN 3-PANE */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT RAIL */}
        <aside className="w-[260px] shrink-0 bg-white border-r flex flex-col" style={{ borderColor: C.border }}>
          <div className="px-4 pt-4 pb-3">
            <SectionLabel>Categories</SectionLabel>
            <div className="space-y-0.5 mt-2.5">
              {CATEGORIES.map(cat => {
                const params = PARAMETERS.filter(p => p.category === cat.id);
                const cells = params.flatMap(p => TIERS.map(t => p.values[t].confidence));
                const lowCount = cells.filter(x => x === "low").length;
                const medCount = cells.filter(x => x === "medium").length;
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setSelectedParamId(null); }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-left transition-all"
                    style={{ background: active ? C.primarySoft : "transparent", color: active ? C.primary : C.text }}
                  >
                    <span className="flex-1 truncate" style={{ fontSize: 12, fontWeight: 500 }}>{cat.name}</span>
                    <span style={{ fontSize: 10, color: active ? C.primary : C.textFaint }}>{params.length}</span>
                    {(lowCount > 0 || medCount > 0) && (
                      <span className="flex items-center gap-0.5">
                        {lowCount > 0 && <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.error }} />}
                        {medCount > 0 && lowCount === 0 && <span className="w-1.5 h-1.5 rounded-full" style={{ background: C.warning }} />}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-4 py-3 border-t" style={{ borderColor: C.border }}>
            <SectionLabel>Extraction health</SectionLabel>
            <div className="mt-2.5">
              <HealthGrid onSelect={(p, t) => { setActiveCategory(p.category); setSelectedParamId(p.id); setSelectedTier(t); }} />
            </div>
            <div className="flex items-center justify-between mt-3" style={{ fontSize: 10, color: C.textMuted }}>
              <Legend color={C.success} label="High" count={counts.high} />
              <Legend color={C.warning} label="Med" count={counts.medium} />
              <Legend color={C.error} label="Low" count={counts.low} />
            </div>
          </div>

          <div className="px-4 py-3 border-t mt-auto" style={{ borderColor: C.border }}>
            <SectionLabel>Source documents</SectionLabel>
            <div className="space-y-1 mt-2.5">
              {DOCUMENTS.map(d => (
                <button
                  key={d.id}
                  onClick={() => { setActiveDoc(d.id); setSelectedParamId(null); }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left hover:bg-slate-50"
                  style={{ background: activeDocId === d.id ? C.surface : "transparent" }}
                >
                  <FileText size={12} style={{ color: C.textMuted }} />
                  <span className="truncate flex-1" style={{ fontSize: 11, color: C.text }}>{d.name}</span>
                  <span style={{ fontSize: 9, color: C.textFaint }}>{d.pages}p</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* CENTER */}
        <section className="flex-1 overflow-y-auto">
          <div className="px-8 pt-7 pb-10 max-w-[920px]">
            <div className="flex items-center gap-2 mb-1" style={{ fontSize: 11, color: C.textFaint }}>
              <span>Verify</span>
              <ChevronRight size={11} />
              <span style={{ color: C.textMuted }}>{CATEGORIES.find(c => c.id === activeCategory)?.name}</span>
            </div>
            <div className="flex items-baseline justify-between gap-4 mb-5">
              <h1 className="tracking-tight" style={{ fontSize: 22, fontWeight: 600, color: C.text }}>
                {CATEGORIES.find(c => c.id === activeCategory)?.name}
              </h1>
              <div style={{ fontSize: 11, color: C.textMuted }}>
                {filtered.length} parameter{filtered.length === 1 ? "" : "s"} ·{" "}
                <span style={{ color: C.text, fontWeight: 500 }}>Mini</span> /{" "}
                <span style={{ color: C.text, fontWeight: 500 }}>Medi</span> /{" "}
                <span style={{ color: C.text, fontWeight: 500 }}>Max</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-5">
              <div className="relative flex-1">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.textFaint }} />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search parameters…"
                  className="w-full bg-white border rounded-lg pl-9 pr-3 py-2 outline-none focus:border-emerald-600"
                  style={{ borderColor: C.border, fontSize: 12 }}
                />
              </div>
              <div className="flex items-center gap-1 bg-white border rounded-lg p-0.5" style={{ borderColor: C.border }}>
                {(["all", "high", "medium", "low"] as const).map(k => (
                  <button
                    key={k}
                    onClick={() => setFilterConf(k)}
                    className="px-2.5 py-1 rounded-md capitalize"
                    style={{
                      background: filterConf === k ? C.primary : "transparent",
                      color: filterConf === k ? "#fff" : C.textMuted,
                      fontSize: 11, fontWeight: 500,
                    }}
                  >{k === "all" ? "All" : k}</button>
                ))}
              </div>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border hover:bg-white"
                      style={{ borderColor: C.border, color: C.textMuted, fontSize: 11 }}>
                <Filter size={12} /> More
              </button>
            </div>

            <div className="space-y-2.5">
              {filtered.map(p => (
                <ParamCard
                  key={p.id}
                  p={p}
                  selected={selectedParamId === p.id}
                  selectedTier={selectedTier}
                  verified={verified}
                  onClick={(tier) => { setSelectedParamId(p.id); setSelectedTier(tier); }}
                />
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-16" style={{ fontSize: 12, color: C.textFaint }}>
                  No parameters match the current filter.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <aside className="w-[420px] shrink-0 bg-white border-l flex flex-col" style={{ borderColor: C.border }}>
          <AnimatePresence mode="wait">
            {selectedParam ? (
              <SourcePanel
                key={selectedParam.id + selectedTier}
                p={selectedParam}
                tier={selectedTier}
                onTierChange={setSelectedTier}
                onClose={() => setSelectedParamId(null)}
                isVerified={!!verified[`${selectedParam.id}:${selectedTier}`]}
                onVerify={() => {
                  setVerified(v => ({ ...v, [`${selectedParam.id}:${selectedTier}`]: true }));
                  toast.success(`${selectedParam.name} (${selectedTier}) verified`);
                }}
              />
            ) : (
              <AuditPanel
                key="audit"
                openCount={openIssuesCount}
                blockerCount={blockerCount}
                resolved={resolved}
                onResolve={(id) => { setResolved(r => ({ ...r, [id]: true })); toast.success("Issue resolved"); }}
                onOpenParam={(paramId, tier) => {
                  const p = PARAMETERS.find(x => x.id === paramId);
                  if (p) { setActiveCategory(p.category); setSelectedParamId(paramId); setSelectedTier(tier || "Mini"); }
                }}
                activeDoc={activeDocObj}
              />
            )}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}

// ── Param card ───────────────────────────────────────────────────────────
function ParamCard({
  p, selected, selectedTier, verified, onClick,
}: { p: Parameter; selected: boolean; selectedTier: PlanTier; verified: Record<string, boolean>; onClick: (t: PlanTier) => void }) {
  const worstConf: Confidence = TIERS.reduce<Confidence>((acc, t) => {
    const c = p.values[t].confidence;
    if (c === "low") return "low";
    if (c === "medium" && acc === "high") return "medium";
    return acc;
  }, "high");
  const allVerified = TIERS.every(t => verified[`${p.id}:${t}`]);
  const hasNumeric = TIERS.every(t => p.values[t].numeric !== undefined);

  return (
    <div className="bg-white rounded-xl border transition-all"
         style={{
           borderColor: selected ? C.primary : worstConf === "low" ? "#FCA5A5" : C.border,
           boxShadow: selected ? "0 0 0 3px rgba(4,120,87,0.08)"
             : worstConf === "low" ? "0 0 0 3px rgba(239,68,68,0.06)"
             : "0 1px 2px rgba(15,23,42,0.04)",
         }}>
      <div className="px-4 pt-3.5 pb-3 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{p.name}</span>
            {allVerified && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded"
                    style={{ background: C.primarySoft, color: C.primary, fontSize: 9.5, fontWeight: 600 }}>
                <Check size={9} /> Verified
              </span>
            )}
            {worstConf === "low" && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded"
                    style={{ background: C.errorSoft, color: C.error, fontSize: 9.5, fontWeight: 600 }}>
                <AlertOctagon size={9} /> Needs review
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: C.textFaint }}>
            {p.unit ? `unit: ${p.unit}` : "categorical"}
          </div>
        </div>
        <ConfidenceDots p={p} />
      </div>

      {hasNumeric ? (
        <ComparisonBars p={p} selectedTier={selected ? selectedTier : null} verified={verified} onClick={onClick} />
      ) : (
        <TierStrip p={p} selectedTier={selected ? selectedTier : null} verified={verified} onClick={onClick} />
      )}
    </div>
  );
}

function ConfidenceDots({ p }: { p: Parameter }) {
  return (
    <div className="flex items-center gap-1">
      {TIERS.map(t => (
        <div key={t} className="flex flex-col items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ background: confColor(p.values[t].confidence) }} />
          <span style={{ fontSize: 9, color: C.textFaint }}>{t[0]}</span>
        </div>
      ))}
    </div>
  );
}

function ComparisonBars({
  p, selectedTier, verified, onClick,
}: { p: Parameter; selectedTier: PlanTier | null; verified: Record<string, boolean>; onClick: (t: PlanTier) => void }) {
  const max = Math.max(...TIERS.map(t => p.values[t].numeric || 0), 1);
  const scale = Math.max(max, SCALE_MAX / 30);
  return (
    <div className="px-4 pb-3.5 space-y-1.5">
      {TIERS.map(t => {
        const val = p.values[t];
        const conf = val.confidence;
        const pct = ((val.numeric || 0) / scale) * 100;
        const isSel = selectedTier === t;
        const v = !!verified[`${p.id}:${t}`];
        return (
          <button
            key={t}
            onClick={() => onClick(t)}
            className="w-full grid items-center gap-2.5 px-1.5 py-1 -mx-1.5 rounded-md hover:bg-slate-50"
            style={{ gridTemplateColumns: "32px 1fr 110px", background: isSel ? C.surface : "transparent" }}
          >
            <span className="text-left" style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", color: isSel ? C.primary : C.textMuted }}>
              {t.toUpperCase()}
            </span>
            <div className="relative h-2 rounded-full" style={{ background: "#F1F5F9" }}>
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all"
                style={{
                  width: `${Math.max(pct, 2)}%`,
                  background: conf === "high" ? C.primary : confColor(conf),
                  opacity: conf === "low" ? 0.55 : 1,
                }}
              />
              {conf === "low" && (
                <div className="absolute inset-0 rounded-full pointer-events-none"
                     style={{ backgroundImage: "repeating-linear-gradient(45deg,transparent 0 4px,rgba(239,68,68,0.18) 4px 5px)" }} />
              )}
            </div>
            <div className="flex items-center justify-end gap-1.5 text-right">
              <span className="tabular-nums" style={{ fontSize: 11.5, fontWeight: 500, color: C.text }}>{val.display}</span>
              {v && <Check size={10} style={{ color: C.primary }} />}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function TierStrip({
  p, selectedTier, verified, onClick,
}: { p: Parameter; selectedTier: PlanTier | null; verified: Record<string, boolean>; onClick: (t: PlanTier) => void }) {
  return (
    <div className="px-4 pb-3.5 grid grid-cols-3 gap-1.5">
      {TIERS.map(t => {
        const val = p.values[t];
        const conf = val.confidence;
        const isSel = selectedTier === t;
        const v = !!verified[`${p.id}:${t}`];
        return (
          <button
            key={t}
            onClick={() => onClick(t)}
            className="text-left rounded-lg border px-2.5 py-2 hover:bg-slate-50"
            style={{
              borderColor: isSel ? C.primary : C.border,
              background: isSel ? C.primarySoft : "#fff",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: "0.06em", color: C.textMuted }}>
                {t.toUpperCase()}
              </span>
              <span className="flex items-center gap-1">
                {v && <Check size={9} style={{ color: C.primary }} />}
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: confColor(conf) }} />
              </span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.25, color: C.text }}>
              {val.display}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ── Audit panel ─────────────────────────────────────────────────────────
function AuditPanel({
  openCount, blockerCount, resolved, onResolve, onOpenParam, activeDoc,
}: {
  openCount: number; blockerCount: number;
  resolved: Record<string, boolean>;
  onResolve: (id: string) => void;
  onOpenParam: (paramId: string, tier?: PlanTier) => void;
  activeDoc: { id: string; name: string; pages: number; type: string };
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b" style={{ borderColor: C.border }}>
        <SectionLabel>Audit</SectionLabel>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <Stat label="Blockers" value={blockerCount} accent={C.error} />
          <Stat label="Open" value={openCount} accent={C.warning} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <SectionLabel>Activity feed</SectionLabel>
        <div className="space-y-3 relative mt-3">
          <div className="absolute left-[7px] top-1 bottom-1 w-px" style={{ background: C.border }} />
          {AUDIT_ISSUES.map(i => {
            const isResolved = !!resolved[i.id];
            return (
              <div key={i.id} className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white flex items-center justify-center"
                     style={{ borderColor: isResolved ? C.success : i.severity === "blocker" ? C.error : C.warning }}>
                  {isResolved && <Check size={7} style={{ color: C.success }} strokeWidth={3} />}
                </div>
                <div className="flex items-baseline gap-1.5 mb-0.5">
                  <span style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                    color: isResolved ? C.textFaint : i.severity === "blocker" ? C.error : C.warning,
                  }}>{isResolved ? "Resolved" : i.severity}</span>
                  {i.tier && <span style={{ fontSize: 10, color: C.textFaint }}>· {i.tier}</span>}
                  <span className="ml-auto" style={{ fontSize: 10, color: C.textFaint }}>{i.raisedAt}</span>
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.4, color: isResolved ? C.textFaint : C.text }}>
                  {i.message}
                </div>
                {!isResolved && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <button onClick={() => onOpenParam(i.paramId, i.tier)} className="px-2 py-1 rounded-md hover:underline"
                            style={{ fontSize: 11, fontWeight: 500, color: C.primary }}>Open parameter</button>
                    <button onClick={() => onResolve(i.id)} className="px-2 py-1 rounded-md hover:bg-slate-100"
                            style={{ fontSize: 11, color: C.textMuted }}>Resolve</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-3.5 border-t" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2" style={{ fontSize: 11, color: C.textMuted }}>
          <Sparkles size={12} style={{ color: C.primary }} />
          <span>Click any parameter on the left to inspect its source.</span>
        </div>
        <div className="mt-2" style={{ fontSize: 11, color: C.textFaint }}>
          Currently inspecting: <span style={{ color: C.text, fontWeight: 500 }}>{activeDoc.name}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Source panel ────────────────────────────────────────────────────────
function SourcePanel({
  p, tier, onTierChange, onClose, isVerified, onVerify,
}: { p: Parameter; tier: PlanTier; onTierChange: (t: PlanTier) => void; onClose: () => void; isVerified: boolean; onVerify: () => void }) {
  const val = p.values[tier];
  const doc = DOCUMENTS.find(d => d.id === val.source.docId)!;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(val.display);

  return (
    <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                className="flex-1 flex flex-col overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <SectionLabel>Parameter</SectionLabel>
            <div className="truncate mt-1" style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{p.name}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-slate-100" style={{ color: C.textMuted }}>
            <X size={14} />
          </button>
        </div>

        <div className="flex items-center gap-1 mt-3 p-0.5 rounded-lg" style={{ background: C.surface }}>
          {TIERS.map(t => (
            <button key={t} onClick={() => { onTierChange(t); setDraft(p.values[t].display); setEditing(false); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-all"
                    style={{
                      background: tier === t ? "#fff" : "transparent",
                      color: tier === t ? C.text : C.textMuted,
                      boxShadow: tier === t ? "0 1px 2px rgba(15,23,42,0.06)" : "none",
                      fontSize: 11, fontWeight: 600,
                    }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: confColor(p.values[t].confidence) }} />
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center justify-between mb-2">
          <SectionLabel>Extracted value</SectionLabel>
          <span className="px-1.5 py-0.5 rounded" style={{ background: confBg(val.confidence), color: confColor(val.confidence), fontSize: 10, fontWeight: 600 }}>
            {confLabel(val.confidence)} confidence
          </span>
        </div>
        {editing ? (
          <input value={draft} onChange={e => setDraft(e.target.value)} autoFocus
                 className="w-full bg-white border-2 rounded-lg px-3 py-2.5 outline-none"
                 style={{ borderColor: C.primary, color: C.text, fontSize: 14, fontWeight: 500 }} />
        ) : (
          <button onClick={() => setEditing(true)}
                  className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border text-left hover:bg-slate-50"
                  style={{ borderColor: C.border }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: C.text }}>{draft}</span>
            <Pencil size={12} style={{ color: C.textFaint }} />
          </button>
        )}

        <div className="flex items-center gap-2 mt-3">
          <button onClick={() => { onVerify(); setEditing(false); }} disabled={isVerified}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg disabled:opacity-60"
                  style={{ background: isVerified ? C.primarySoft : C.primary, color: isVerified ? C.primary : "#fff", fontSize: 12, fontWeight: 600 }}>
            {isVerified ? <><Check size={13} /> Verified</> : <><CheckCircle2 size={13} /> Mark verified</>}
          </button>
          {editing && (
            <button onClick={() => { setEditing(false); setDraft(val.display); }}
                    className="px-3 py-2 rounded-lg border hover:bg-slate-50"
                    style={{ borderColor: C.border, color: C.textMuted, fontSize: 12, fontWeight: 500 }}>Cancel</button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex items-center justify-between mb-2.5">
          <SectionLabel>Source passage</SectionLabel>
          <button className="hover:underline" style={{ fontSize: 11, fontWeight: 500, color: C.primary }}>Open document →</button>
        </div>

        <div className="rounded-xl border overflow-hidden" style={{ borderColor: C.border }}>
          <div className="px-3.5 py-2.5 border-b flex items-center gap-2" style={{ borderColor: C.border, background: C.surface }}>
            <FileText size={12} style={{ color: C.textMuted }} />
            <span className="truncate flex-1" style={{ fontSize: 11, fontWeight: 500, color: C.text }}>{doc.name}</span>
            <span className="px-1.5 py-0.5 rounded" style={{ background: "#fff", color: C.textMuted, border: `1px solid ${C.border}`, fontSize: 10 }}>
              p. {val.source.page}
            </span>
          </div>
          <div className="px-4 py-4 whitespace-pre-wrap" style={{ fontSize: 12.5, lineHeight: 1.55, color: C.textMuted }}>
            <Highlighted text={val.source.context} />
          </div>
          <div className="px-3.5 py-2 border-t flex items-center justify-between" style={{ borderColor: C.border, background: C.surface }}>
            <button className="flex items-center gap-1 hover:underline" style={{ fontSize: 11, color: C.primary }}>
              ← Jump from passage to parameter
            </button>
            <span style={{ fontSize: 10, color: C.textFaint }}>Bidirectional link</span>
          </div>
        </div>

        <div className="mt-4">
          <SectionLabel>All citations</SectionLabel>
          <div className="space-y-1.5 mt-2">
            {TIERS.map(t => (
              <button key={t} onClick={() => onTierChange(t)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-slate-50"
                      style={{ background: t === tier ? C.surface : "transparent", fontSize: 11 }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: confColor(p.values[t].confidence) }} />
                <span className="w-10 text-left" style={{ fontWeight: 600, color: C.textMuted }}>{t}</span>
                <span className="truncate flex-1 text-left" style={{ color: C.text }}>
                  {DOCUMENTS.find(d => d.id === p.values[t].source.docId)?.name}
                </span>
                <span style={{ color: C.textFaint }}>p.{p.values[t].source.page}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Bits ────────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: C.textFaint }}>
      {children}
    </div>
  );
}

function Highlighted({ text }: { text: string }) {
  const parts = text.split(/(\{\{[^}]+\}\})/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("{{") && p.endsWith("}}")) {
          return (
            <mark key={i} className="rounded px-1 py-0.5"
                  style={{ background: "#FEF3C7", color: C.text, boxShadow: "inset 0 -2px 0 #FBBF24", fontWeight: 500 }}>
              {p.slice(2, -2)}
            </mark>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

function Ring({ value }: { value: number }) {
  const r = 12;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width="30" height="30" viewBox="0 0 30 30">
      <circle cx="15" cy="15" r={r} stroke="#E5E7EB" strokeWidth="3" fill="none" />
      <circle cx="15" cy="15" r={r}
              stroke={value >= 90 ? C.success : value >= 75 ? C.primary : value >= 60 ? C.warning : C.error}
              strokeWidth="3" fill="none" strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`} transform="rotate(-90 15 15)" />
      <text x="15" y="17.5" textAnchor="middle" fontSize="9" fontWeight="600" fill={C.text}>{value}</text>
    </svg>
  );
}

function Legend({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <span className="flex items-center gap-1">
      <span className="w-2 h-2 rounded-sm" style={{ background: color }} />
      {label} <span style={{ color: C.text, fontWeight: 600 }}>{count}</span>
    </span>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-lg border px-3 py-2.5" style={{ borderColor: C.border }}>
      <div style={{ fontSize: 10, color: C.textMuted }}>{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span className="tabular-nums" style={{ fontSize: 20, fontWeight: 600, color: value > 0 ? accent : C.textFaint }}>
          {value}
        </span>
      </div>
    </div>
  );
}

function HealthGrid({ onSelect }: { onSelect: (p: Parameter, t: PlanTier) => void }) {
  return (
    <div className="space-y-1">
      {TIERS.map(t => (
        <div key={t} className="flex items-center gap-1.5">
          <span className="w-3" style={{ fontSize: 9, fontWeight: 600, color: C.textFaint }}>{TIER_LETTER[t]}</span>
          <div className="flex gap-[2px] flex-wrap">
            {PARAMETERS.map(p => {
              const conf = p.values[t].confidence;
              return (
                <button
                  key={p.id + t}
                  onClick={() => onSelect(p, t)}
                  title={`${p.name} · ${t} · ${confLabel(conf)}`}
                  className="w-2.5 h-2.5 rounded-[2px] hover:scale-150 transition-transform"
                  style={{ background: confColor(conf), opacity: conf === "high" ? 0.55 : 1 }}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
