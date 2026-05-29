import { useEffect, useState, useRef } from "react";
import { MessageSquare, X, Check, Trash2, CornerDownLeft, RotateCcw, Eye, EyeOff } from "lucide-react";
import { C, T } from "./theme";

type Msg = { id: string; author: string; text: string; at: number };
type Thread = { id: string; context: string; x: number; y: number; resolved: boolean; createdAt: number; messages: Msg[] };

const API = "/api/comments";

function initials(name: string) {
  return name.split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase() || "R";
}
function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60); if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24); return `${d}d ago`;
}

export default function CommentsLayer({ context }: { context: string }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [mode, setMode] = useState(false);            // placing mode
  const [draft, setDraft] = useState<{ x: number; y: number } | null>(null);
  const [draftText, setDraftText] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showResolved, setShowResolved] = useState(false);
  const [author, setAuthor] = useState(() => localStorage.getItem("eicore-comment-author") || "Reviewer");
  const [editName, setEditName] = useState(false);
  const draftRef = useRef<HTMLTextAreaElement>(null);

  // initial load
  useEffect(() => {
    fetch(API).then(r => r.json()).then(setThreads).catch(() => {});
  }, []);

  useEffect(() => { localStorage.setItem("eicore-comment-author", author); }, [author]);
  useEffect(() => { if (draft && draftRef.current) draftRef.current.focus(); }, [draft]);

  const visible = threads.filter(t => t.context === context && (showResolved || !t.resolved));
  const unresolvedCount = threads.filter(t => t.context === context && !t.resolved).length;

  const placePin = (e: React.MouseEvent) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    setDraft({ x, y });
    setDraftText("");
    setOpenId(null);
  };

  const submitDraft = async () => {
    if (!draft || !draftText.trim()) return;
    const body = { context, x: draft.x, y: draft.y, text: draftText.trim(), author };
    const created: Thread = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).then(r => r.json());
    setThreads(t => [...t, created]);
    setDraft(null); setDraftText(""); setMode(false); setOpenId(created.id);
  };

  const submitReply = async (id: string) => {
    if (!replyText.trim()) return;
    const updated: Thread = await fetch(`${API}/${id}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: replyText.trim(), author }) }).then(r => r.json());
    setThreads(t => t.map(x => x.id === id ? updated : x));
    setReplyText("");
  };

  const toggleResolved = async (t: Thread) => {
    const updated: Thread = await fetch(`${API}/${t.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resolved: !t.resolved }) }).then(r => r.json());
    setThreads(ts => ts.map(x => x.id === t.id ? updated : x));
    if (!t.resolved) setOpenId(null);
  };

  const del = async (id: string) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setThreads(ts => ts.filter(x => x.id !== id));
    setOpenId(null);
  };

  const pinNum = (t: Thread) => visible.findIndex(v => v.id === t.id) + 1;
  const Avatar = ({ name, size = 24 }: { name: string; size?: number }) => (
    <div style={{ width: size, height: size, borderRadius: "50%", background: C.brand, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.42, fontWeight: 700, flexShrink: 0 }}>{initials(name)}</div>
  );

  return (
    <>
      {/* Placing-mode capture layer */}
      {mode && (
        <div onClick={placePin}
          style={{ position: "fixed", inset: 0, zIndex: 9990, cursor: "crosshair", background: "rgba(4,120,87,0.03)" }} />
      )}

      {/* Pins for current context */}
      {visible.map(t => {
        const isOpen = openId === t.id;
        return (
          <div key={t.id} style={{ position: "fixed", left: `${t.x * 100}%`, top: `${t.y * 100}%`, zIndex: isOpen ? 9996 : 9992, pointerEvents: "auto" }}>
            {/* Pin marker */}
            <button
              onClick={(e) => { e.stopPropagation(); setOpenId(isOpen ? null : t.id); setReplyText(""); }}
              title={t.messages[0]?.text}
              style={{
                transform: "translate(0, -100%)", border: "2px solid #fff", cursor: "pointer",
                width: 30, height: 30, borderRadius: "16px 16px 16px 3px",
                background: t.resolved ? C.text3 : C.brand, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                opacity: t.resolved ? 0.6 : 1,
              }}>
              {t.resolved ? <Check size={14} /> : pinNum(t)}
            </button>

            {/* Thread popover */}
            {isOpen && (
              <div onClick={e => e.stopPropagation()}
                style={{ position: "absolute", left: 16, top: 0, transform: "translateY(-100%)", width: 300, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: "0 12px 40px rgba(0,0,0,0.18)", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", borderBottom: `1px solid ${C.border}`, background: C.bgTertiary }}>
                  <span style={T(12, 700, C.text2)}>{t.resolved ? "Resolved" : "Comment"} #{pinNum(t)}</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => toggleResolved(t)} title={t.resolved ? "Reopen" : "Resolve"} style={iconBtn()}>{t.resolved ? <RotateCcw size={14} /> : <Check size={14} />}</button>
                    <button onClick={() => del(t.id)} title="Delete" style={iconBtn(C.error)}><Trash2 size={14} /></button>
                    <button onClick={() => setOpenId(null)} title="Close" style={iconBtn()}><X size={14} /></button>
                  </div>
                </div>
                <div style={{ maxHeight: 240, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 12 }}>
                  {t.messages.map(m => (
                    <div key={m.id} style={{ display: "flex", gap: 8 }}>
                      <Avatar name={m.author} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                          <span style={T(12, 700)}>{m.author}</span>
                          <span style={T(10, 400, C.text3)}>{timeAgo(m.at)}</span>
                        </div>
                        <p style={{ ...T(13, 400, C.text, 1.5), marginTop: 2, wordBreak: "break-word" }}>{m.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {!t.resolved && (
                  <div style={{ borderTop: `1px solid ${C.border}`, padding: 10, display: "flex", gap: 8, alignItems: "flex-end" }}>
                    <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitReply(t.id); } }}
                      placeholder="Reply…" rows={1}
                      style={{ flex: 1, resize: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", fontSize: 13, outline: "none", fontFamily: "inherit", maxHeight: 80 }} />
                    <button onClick={() => submitReply(t.id)} disabled={!replyText.trim()}
                      style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: replyText.trim() ? C.brand : C.border, color: "#fff", cursor: replyText.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <CornerDownLeft size={15} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Draft composer for a new pin */}
      {draft && (
        <>
          <div onClick={() => { setDraft(null); setMode(false); }} style={{ position: "fixed", inset: 0, zIndex: 9994 }} />
          <div style={{ position: "fixed", left: `${draft.x * 100}%`, top: `${draft.y * 100}%`, zIndex: 9996 }}>
            <div style={{ transform: "translate(0, -100%)", width: 30, height: 30, borderRadius: "16px 16px 16px 3px", background: C.brand, border: "2px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,0.25)" }} />
            <div onClick={e => e.stopPropagation()} style={{ position: "absolute", left: 16, top: 0, transform: "translateY(-100%)", width: 300, background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: "0 12px 40px rgba(0,0,0,0.18)", padding: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Avatar name={author} />
                {editName ? (
                  <input autoFocus value={author} onChange={e => setAuthor(e.target.value)} onBlur={() => setEditName(false)} onKeyDown={e => { if (e.key === "Enter") setEditName(false); }}
                    style={{ ...T(12, 700), border: `1px solid ${C.border}`, borderRadius: 6, padding: "2px 6px", outline: "none", width: 140 }} />
                ) : (
                  <span style={T(12, 700)} onClick={() => setEditName(true)}>{author} <span style={{ ...T(10, 400, C.text3), cursor: "pointer" }}>(edit)</span></span>
                )}
              </div>
              <textarea ref={draftRef} value={draftText} onChange={e => setDraftText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitDraft(); } if (e.key === "Escape") { setDraft(null); setMode(false); } }}
                placeholder="Add a comment…  (Enter to post)" rows={3}
                style={{ width: "100%", resize: "vertical", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 10px", fontSize: 13, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
                <button onClick={() => { setDraft(null); setMode(false); }} style={{ ...T(13, 500, C.text2), background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>Cancel</button>
                <button onClick={submitDraft} disabled={!draftText.trim()} style={{ ...T(13, 600, "#fff"), background: draftText.trim() ? C.brand : C.border, border: "none", borderRadius: 8, padding: "6px 14px", cursor: draftText.trim() ? "pointer" : "default" }}>Comment</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Floating toolbar */}
      <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9998, display: "flex", alignItems: "center", gap: 8 }}>
        {unresolvedCount > 0 && !mode && (
          <button onClick={() => setShowResolved(s => !s)} title={showResolved ? "Hide resolved" : "Show resolved"}
            style={{ display: "flex", alignItems: "center", gap: 6, height: 44, padding: "0 14px", borderRadius: 22, background: C.card, border: `1px solid ${C.border}`, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", cursor: "pointer", ...T(13, 600, C.text2) }}>
            {showResolved ? <EyeOff size={15} /> : <Eye size={15} />} {showResolved ? "Hide resolved" : `${unresolvedCount} open`}
          </button>
        )}
        <button onClick={() => { setMode(m => !m); setDraft(null); setOpenId(null); }}
          title={mode ? "Exit comment mode" : "Add comment"}
          style={{ display: "flex", alignItems: "center", gap: 8, height: 44, padding: "0 18px", borderRadius: 22, border: "none", cursor: "pointer", background: mode ? C.brand : C.text, color: "#fff", boxShadow: "0 4px 16px rgba(0,0,0,0.18)", ...T(14, 600, "#fff") }}>
          <MessageSquare size={16} /> {mode ? "Click to place…" : "Comment"}
        </button>
      </div>
    </>
  );
}

function iconBtn(color = C.text2): React.CSSProperties {
  return { width: 26, height: 26, borderRadius: 6, border: "none", background: "transparent", color, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
}
