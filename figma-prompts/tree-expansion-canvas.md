# Eicore OneBuzz — Tree Expansion Canvas
## Figma Make Prompt · v1

Paste the entire **"# THE PROMPT"** section below into Figma Make. Attach the 5 reference images you assembled. Leave the **Reference notes** section out — that's for you, to remember why each decision exists.

---

## REFERENCE NOTES (for you, not Figma)

**What this screen is:** the **deep working canvas** of the Product Plan Builder. Today the Builder dashboard has a tiny right-panel "Tree". This new view *promotes that tree into a full-canvas working surface* — a node-graph where actuaries actually do the work of verifying 100+ AI-extracted insurance parameters across 3 plan tiers (Mini / Medi / Max).

**Why a canvas, not a form:** A flat form/table cannot show how Age → Premium Rate → Coverage Limit cascade across plans. The canvas shows **structural relationships and dependencies** — the "system view" — so users never lose context.

**Two anchor patterns** (the most important things you must get right):
1. The **workflow card** — the atomic unit on the canvas (combines reference image 1 + 4 + 5)
2. The **Plan Editor side drawer** — the rich edit context that opens when a card is selected (reference image 2). This drawer is *shared* with the Builder Dashboard, so its UX must work without canvas context too.

**Companion screens (later, not now):**
- Builder Dashboard becomes the **status view** — plans roll-up, issue counts, charts, "Open Canvas →" entry point
- We design that after the canvas is locked

---

# THE PROMPT

```
Design a full-canvas "Tree Expansion" view for the Eicore OneBuzz Product Plan Builder — an enterprise InsurTech tool where actuaries and product managers verify 100+ AI-extracted parameters across 3 insurance plan tiers (Mini / Medi / Max). This canvas replaces the small right-panel "Tree" in the current Builder. It is the primary working surface for editing and resolving parameters.

═══════════════════════════════════════════════════════════════
ATTACHED REFERENCES — visual ground truth
═══════════════════════════════════════════════════════════════

I have attached layout images alongside this prompt. They are the authoritative visual reference — match their structure, card anatomy, spacing, and tone. Use the spec below for what to put in the layouts; use the images for HOW it should look.

If a tension arises between a written description and the images, the images win for visual treatment; the spec wins for functional requirements (capabilities, data, navigation).

The images cover, in order:
  1. The TREE / node-graph layout — vertical workflow with branching, dotted canvas, cards connected by lines
  2. The PLAN EDITOR side drawer — breadcrumb, title, property rows, tabs, AI-assisted comment composer
  3. The EXTRACTOR split — left card list ↔ right source document with PDF chrome
  4. The NODE CARD VARIANTS — category-tab + body + meta footer + status states
  5. The CARD/STATUS BANNERS — soft tinted bottom strips (green/amber/red) and task card meta
  6. The CURRENT EICORE BUILDER — for context on what this view replaces

Treat images 1–5 as how-to-style references; treat image 6 as the "from" state we're upgrading from.

═══════════════════════════════════════════════════════════════
HARD CONSTRAINTS — DESIGN SYSTEM (do not change)
═══════════════════════════════════════════════════════════════

▸ TYPOGRAPHY
  • Inter only — 400/500/600/700 weights
  • Numerical data uses tabular figures
  • No display fonts, no serifs

▸ COLOR (semantic tokens, every visual must bind to one)
  • Brand teal:        #047857  (primary, links, active states)
  • Brand teal hover:  #059669
  • Success green:     #10B981  (verified, ok)
  • Warning amber:     #F59E0B  (needs review, low confidence)
  • Error red:         #EF4444  (blocker, missing, critical)
  • Info blue:         #2563EB  (AI hints, neutral info)
  • Text primary:      #111827
  • Text secondary:    #4B5563
  • Text muted:        #9CA3AF
  • Surface (cards):   #FFFFFF
  • Canvas dot bg:     #F4F6F9 with subtle dotted grid (1.5px dots, 24px spacing, #E2E5EA)
  • Border subtle:     #E5E7EB
  • Border strong:     #D1D5DB

▸ SHAPE & ELEVATION
  • Radius scale: 6 / 8 / 12 / 16 / 999 (pill)
  • Soft shadow: 0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)
  • No glassmorphism, no heavy depth — quiet luxury

▸ MOTION
  • All transitions 150–250ms cubic-bezier(0.4, 0, 0.2, 1)
  • Card hover: shadow elevates one step, no scale
  • Drawer open: 250ms slide from right + fade in content
  • Selection: 2px brand ring with 150ms fade

▸ LIGHT MODE ONLY

═══════════════════════════════════════════════════════════════
FUNCTIONAL REQUIREMENTS — what users must be able to do
═══════════════════════════════════════════════════════════════

The screen MUST let users:

1. See the entire product structure for one plan as a vertical node-graph (Plan root → Categories → Fields), with parent→child branches and dotted cross-field dependency lines.
2. Identify per-field state at a glance — origin (AI / user-edited / carried / blank / changed), confidence %, status (verified / warning / blocker), source citation.
3. Switch between the 3 plan tiers (Mini / Medi / Max) without losing position or selection.
4. Overlay all 3 plans simultaneously to spot gaps and divergence across tiers.
5. Filter the canvas (All / Issues / Low confidence / Missing / Recently changed / AI suggested) — dim non-matching cards, don't hide.
6. Switch between 4 canvas modes: TREE (default node-graph) · EXTRACTION (split: cards ↔ source doc) · ISSUES (filtered tree, only red/amber) · DOCS (docs list ↔ doc preview).
7. Select a card to open the Plan Editor drawer; edit value inline; mark verified.
8. Multi-select cards (shift-click or marquee) and run bulk actions (verify all, apply Mini value to Medi+Max, mark resolved).
9. Search any field by name (⌘K command palette).
10. Zoom / pan / fit-to-content; use the mini-map (bottom-right) to teleport.
11. Drop Figma-style comment pins anchored to cards (pins move with the tree, persist on disk).
12. Undo / redo any action; see last 5 edits in a history strip.
13. Ask an AI co-pilot questions about the tree ("Show me all fields where Mini has a value but Medi doesn't").

═══════════════════════════════════════════════════════════════
LAYOUT — three zones inside a full-bleed shell
═══════════════════════════════════════════════════════════════

Total viewport: 1440 × 900 minimum (responsive down to 1280).
Outer shell: gray #E5E7EB padding with a rounded white "app card" (12px corner, soft shadow, 1px border).

Inside the app card:

┌────────────────────────────────────────────────────────────────────────────┐
│  TOP BAR · 56px                                                            │
│  [×]  ☰ D.I.Y Health Insurance ▸ Mini Plan          Mode-Slider · Filters  │
├────────────┬───────────────────────────────────────────┬───────────────────┤
│            │                                           │                   │
│  CONTEXT   │           NODE CANVAS                     │   PLAN EDITOR     │
│  SIDEBAR   │           (dotted bg)                     │   DRAWER          │
│  240px     │           flex-grow                       │   480px           │
│            │                                           │                   │
│  fixed     │           pan / zoom                      │   slides in       │
│            │           selection                       │   on card click   │
│            │                                           │                   │
└────────────┴───────────────────────────────────────────┴───────────────────┘

▸ TOP BAR (56px, white, 1px bottom border)
  • Left:  [× close] · breadcrumb (Eicore › Products › D.I.Y Health Insurance ▸ Mini Plan) — segments clickable
  • Center: large segmented Mode-Slider — 4 pills: ◊ Tree | ⊞ Extraction | ⚠ Issues | 📑 Docs (active = brand fill, others = ghost)
  • Right: Filter chips row → All · Issues (12) · Low conf (8) · Missing (3) · Changed (4) · AI hints (5)
          Then zoom controls: − [85%] + [fit] [fullscreen]

▸ CONTEXT SIDEBAR (240px, left, white, 1px right border)
  • Header: "Builder Roadmap" mini — current stage = AI Extraction & Audit (collapsed)
  • Plan switcher segmented: [Mini] | Medi | Max — switching swaps the canvas data, preserves zoom/selection
  • Mini overview tree (collapsible):
      Plan Limits (1)
      Member Details (6) · 1 ⚠
      Coverages (37) · 3 ⚠ · 1 ⛔
      Premium Raters (3) · 3 ⛔ ← (the missing fields you spotted)
    Each row: name + small count badge + health dots (●●●○○ = 3/5 verified)
    Click row → canvas pans + zooms to that subtree
  • At bottom: "AI Co-Pilot" launcher (small chat-bubble button with sparkle icon)

▸ NODE CANVAS (flex, center)
  • Background: subtle dotted grid (#E2E5EA dots, 1.5px, 24px spacing) on cream #F4F6F9
  • Smooth pan (space + drag), pinch zoom, fit-to-content button
  • Selection: 2px brand ring around selected card; marquee select via drag
  • Mini-map: 200×140 pill in bottom-right corner, white card with soft shadow, click any region to teleport
  • Status legend: collapsible card in bottom-left explaining color/icon meanings
  • Undo/Redo: top-left small toolbar with ⌘Z ⌘⇧Z shortcuts visible on hover

▸ PLAN EDITOR DRAWER (480px, right)
  • Hidden by default. Slides in from the right when a card is clicked.
  • Canvas does NOT shift — drawer overlays with subtle scrim on canvas (rgba(0,0,0,0.04))
  • Click outside or × closes
  • See full spec below

═══════════════════════════════════════════════════════════════
TREE CANVAS — node-graph specification
═══════════════════════════════════════════════════════════════

LAYOUT MODEL
• Vertical top-down tree (root at top, branches downward)
• Auto-layout: levels separated by 80px vertical gap, siblings 40px horizontal gap
• Cards snap to a 8px grid

NODE TYPES (from root to leaf)
1. PLAN ROOT (1 per canvas) — large card, 280×100, "Mini Plan" + meta (SI range, status)
2. CATEGORY (4 per plan) — medium card, 240×80, name + count + roll-up health bar
3. FIELD (the workflow cards — many) — see card anatomy below
4. SUB-FIELD (optional, for nested fields like rate-band tiers)

CONNECTIONS
• PARENT→CHILD: solid 1.5px line, color #D1D5DB, gentle right-angle routing (Figma-style orthogonal)
• DEPENDENCY (cross-tree): dashed 1px line, color #2563EB (info blue), draws a curved arc when source/target are far apart. Hover any card → its dependency chain pulses
• Connection endpoints: 6px dots on top/bottom of cards

PLAN OVERLAY MODE (toggle in top bar)
• When "Show all plans" is on, the tree renders 3 translucent layered branches per Category:
  • Mini = brand teal at 100% opacity (top)
  • Medi = blue at 70% opacity (middle)
  • Max = purple at 50% opacity (back)
• Cards present in all 3 plans align in the same X position
• Cards missing in a plan show as dashed outlines in that plan's color → instantly visible gap

═══════════════════════════════════════════════════════════════
WORKFLOW CARD ANATOMY — the atom
═══════════════════════════════════════════════════════════════

Every field on the canvas is a workflow card. Use the same structure for visual consistency (reference: image 4 node card variants).

DIMENSIONS
• Default: 280px wide, ~120px tall (auto-grows with content)
• Compact (zoomed out): 200×80, hides indicator strip
• Selected: 2px brand teal ring, soft brand-tinted glow

STRUCTURE (top to bottom)

┌─────────────────────────────────────┐
│ ▣ Premium Rater              [⋮]    │ ← Category tab (12px, colored chip + menu)
├─────────────────────────────────────┤
│                                     │
│  📐  Age                            │ ← Icon + field title (15px semibold)
│                                     │
│  18–65 yrs                          │ ← Extracted value (14px medium) OR "Missing" placeholder in red
│                                     │
│  ────────────────────────────────   │
│  🤖 AI · 75%  ↔ 3 deps  📄 BRD p7  │ ← Indicator strip (11px) — 3 segments separated by · or 4px gap
├─────────────────────────────────────┤
│ ⚠ Low confidence       [Review →]  │ ← Status footer banner (full-width, soft tint)
└─────────────────────────────────────┘
              ●                         ← Connection dot

CATEGORY TAB COLORS (top-left chip)
• Plan Limits     →  indigo  #6366F1 on tint
• Member Details  →  orange  #F97316 on tint
• Coverages       →  teal    #047857 on tint  (brand)
• Premium Raters  →  purple  #A855F7 on tint
• Exclusions      →  slate   #475569 on tint

INDICATOR STRIP SEGMENTS (left to right)

1. ORIGIN icon + label (font size 11, bold)
   • 🤖 AI · 92%     (AI extracted with confidence)
   • ✏️ Edited       (user typed/changed)
   • ↩ Carried       (copied from another plan)
   • ⬜ Blank         (no value, no source) — text muted
   • 🔄 Changed      (modified since last extraction)

2. LINKAGE chip
   • "↔ 3 deps" — number of other fields that depend on this one
   • Click → opens a side panel listing them with click-to-jump
   • Hover → pulses the dependency lines in the canvas

3. SOURCE chip
   • "📄 BRD p7" — clickable, opens Extraction mode with that doc + sentence highlighted

STATUS FOOTER BANNER (full-width, ~36px tall)
Color-coded by status, soft pastel tint, with a primary action link on the right:

• 🟢 Green  — "✓ Verified"             [Edit →]
• 🟡 Amber  — "⚠ Low confidence"        [Review →]
• 🔴 Red    — "⛔ Missing required field" [Resolve →]
• 🔵 Blue   — "💡 AI suggestion: ..."    [Open →]
• ⚪ Gray   — "—"                        [Edit →]
• 🟣 Purple — "👤 Edited by Sarah · 2h"  [View diff →]

CARD STATES (show all in the deliverable)
Default · Hover · Selected · Multi-selected · Dragging · Locked (approved) · Loading (skeleton) · Filtered-out (40% opacity)

═══════════════════════════════════════════════════════════════
PLAN EDITOR DRAWER — the most important component
═══════════════════════════════════════════════════════════════

This drawer is the user's primary editing surface. It opens in TWO contexts:
  A) Inside the Tree Expansion canvas (this screen) — slides over the canvas
  B) Inside the Builder Dashboard (separate screen, future) — slides over the dashboard
So its design must be context-independent. Treat it as a standalone organism.

WIDTH 480px · full viewport height · white surface · 12px radius on top-left corner · soft left shadow

SECTION 1 — STICKY HEADER (88px, white, 1px bottom border)

  Row 1: Quick-nav controls (top bar of drawer)
    [←  Prev field]              [3 of 27]              [Next field  →]
    (field arrows navigate within the same category)

  Row 2: Plan-tier switcher (segmented, full width)
    [Mini ●]  [Medi]  [Max]
    Active plan is filled brand teal; switching swaps the field value across plans WHILE keeping the same field selected. Tiny dot indicator on each shows status (green/amber/red dot)

  Row 3: Breadcrumb (text-only, 12px muted, each segment clickable)
    Mini ▸ Premium Raters ▸ Age
    (click "Premium Raters" → drawer scrolls to a category overview list of all 3 raters)

SECTION 2 — TITLE & STATUS (one block, 24px padding)

  ┌──────────────────────────────────────────┐
  │  📐  Age                  [⋮] [↗] [✕]    │  large 24px title + actions (menu, expand, close)
  │                                          │
  │  [✓ Verified]  [📄 BRD p7 ↗] [🤖 75%]   │  Status pills (each interactive)
  └──────────────────────────────────────────┘

  Status pills:
  • Status pill — click to cycle (Missing → In review → Verified)
  • Source pill — click to open BRD doc with highlighted passage
  • Confidence pill — click to see AI explanation

SECTION 3 — VALUE EDITOR (the actual edit zone)

  Show original AI value vs current edit side-by-side (or stacked for long values):

  ┌──────────────────────────────────────────┐
  │  AI EXTRACTED                            │
  │  18–65 years                             │ (muted, read-only)
  │                                          │
  │  YOUR VALUE                              │
  │  ┌────────────────────────────────────┐  │
  │  │ 18–65 yrs                          │  │ (editable input — type matches field)
  │  └────────────────────────────────────┘  │
  │                                          │
  │  Field type: Range · Required             │
  │                                          │
  │  [Reset to AI value]  [Save changes]     │
  └──────────────────────────────────────────┘

  INPUT TYPES (vary per field):
  • Text input · Number input · Range (two inputs with "to" between)
  • Select dropdown · Multi-select chips · Toggle · Date picker · Currency input (₹ prefix)
  • Long text → textarea with character count

SECTION 4 — DEPENDENCY MAP (collapsible accordion, default open)

  ↔ Dependencies (3)
    ┌──────────────────────────────────────────┐
    │  USED IN                                 │
    │  • Premium Calculation (Rule)      [→]   │
    │  • Age Band Mapping (Rate Card)    [→]   │
    │  • Member Eligibility Check (Rule) [→]   │
    │                                          │
    │  DEPENDS ON                              │
    │  (none for this field)                   │
    └──────────────────────────────────────────┘

  Clicking any item → canvas pans to that node + this drawer reloads with that field.

SECTION 5 — SOURCE PASSAGE (collapsible, default open)

  📄 BRD_DIY_Health.docx · Page 7 · Section 4.2
    ┌──────────────────────────────────────────┐
    │  "...member entry age shall be between   │
    │  ╔══════════════════════════════════════╗│
    │  ║ 18 and 65 years inclusive ║...      ││  ← highlighted passage in amber tint
    │  ╚══════════════════════════════════════╝│
    └──────────────────────────────────────────┘
    [Open full document →]

SECTION 6 — FOOTER TABS (sticky bottom of drawer)

  Tabs: Comments (2) · Activity (8) · Subtasks · Team

  Each shows:
  • Comments: thread of @-mentions, AI suggestions, with rich text composer + AI assist button
  • Activity: timeline of edits, verifications, AI extractions
  • Subtasks: related fields in same category (siblings) — click to navigate
  • Team: who's edited this field, who's reviewing it

SECTION 7 — FLOATING ACTION (bottom-right of drawer)
  [✓ Mark Verified]   primary brand button, large, always visible
  Disabled state if blockers exist

═══════════════════════════════════════════════════════════════
NAVIGATION ARCHITECTURE — the deep think
═══════════════════════════════════════════════════════════════

The user lives in this canvas. Navigation efficiency is everything. Provide ALL of these — they're additive, each addresses a different intent.

1. BREADCRUMB (top of drawer + top bar)
   Plan ▸ Category ▸ Field — every segment clickable. Hover any segment → tooltip lists its siblings for one-click jump.

2. PLAN-TIER SWITCHER (segmented at top of drawer)
   [Mini] | Medi | Max
   Swaps the field across plans, keeps the field selected. Each tier carries a tiny status dot. Use cases:
   • "Show me Age across all 3 plans" — three taps
   • "Copy Mini's Age value to Medi" — toggle, paste

3. FIELD ARROWS (top of drawer, "3 of 27")
   ← Prev field · Next field →
   Navigates within the current category. Wraps to next category at end.

4. ⌘K COMMAND PALETTE (any time, anywhere)
   Type any field name → instant jump. Also supports:
   • "go to medi opd cover"
   • "show all missing fields"
   • "verify all under premium raters mini"

5. CONTEXT SIDEBAR MINI-TREE (always visible left rail)
   Click any node → canvas pans + zooms + drawer updates. Persistent map.

6. MINI-MAP (always visible bottom-right of canvas)
   Drag to pan, click to teleport. Shows your viewport as a rectangle on the overview.

7. DEPENDENCY JUMP (inside drawer)
   Every "Used in / Depends on" item is a one-click jump to that field.

8. KEYBOARD SHORTCUTS (cheatsheet accessible via ?)
   ← →             Prev / Next field in category
   ↑ ↓             Switch plan tier (Mini ↑↑ Medi ↑↑ Max)
   ⌘K              Command palette
   ⌘Enter          Mark verified
   ⌘/              Add comment
   ⌘Z / ⌘⇧Z        Undo / Redo
   Space + drag    Pan canvas
   F               Fit canvas to content
   /               Focus search
   Esc             Close drawer

9. RECENTLY VIEWED (footer chip strip in drawer)
   Last 5 fields the user touched, as small chips, one-click to revisit.

10. URL DEEP-LINKING
    Every state has a URL: /builder/diy-health/mini/premium-raters/age
    Shareable. Browser back/forward navigates.

═══════════════════════════════════════════════════════════════
MODE SLIDER — Tree / Extraction / Issues / Docs
═══════════════════════════════════════════════════════════════

Switching mode preserves: selected card, plan tier, filter chips, zoom level (where applicable).

▸ TREE (default) — described above. The node-graph canvas.

▸ EXTRACTION — split layout (reference image 3):
  LEFT (45%): scrollable list of extracted parameters as horizontal cards
    [☐]  Age              [✓ Verified]    18–65 yrs              [→]
    [☐]  Family Construct [⚠ Review]      Self+Spouse+Children   [→]
  RIGHT (55%): live source document with PDF chrome (zoom, page nav, fullscreen)
    Selected parameter's source passage highlighted in amber
  Selecting a card in left → doc auto-jumps to its passage, ✓ checkbox for bulk verify

▸ ISSUES — same tree mode but filtered to red+amber cards, with dependency chains drawn highlighted (so user sees how 1 missing Age cascades). Adds a side panel with a sorted list:
    Critical (4)
      • Mini · Age (Missing)
      • Mini · Family Construct (Missing)
      • Mini · Pre-existing (Missing)
      • Medi · OPD Limit (Conflict)
    Warnings (12)

▸ DOCS — split layout:
  LEFT (320px): source documents list with thumbnail + filename + page count + extraction confidence
  RIGHT: PDF viewer with full annotation tools, highlighted passages clickable → jump to corresponding parameter

═══════════════════════════════════════════════════════════════
CANVAS ESSENTIALS (must include all)
═══════════════════════════════════════════════════════════════

1. Mini-map (bottom-right) — Figma-style, click to teleport
2. Zoom controls (top-right) — − [85%] + [fit] [fullscreen]
3. Status legend (bottom-left, collapsible) — explains every color/icon
4. Undo/Redo strip (top-left) — last action visible
5. Multi-select toolbar (appears on shift-click or marquee, anchored to selection):
   "12 selected · [✓ Verify all] [Copy to other plans] [Apply rule…] [Comment] [✕ Deselect]"
6. AI Co-Pilot floating button (bottom-right above mini-map):
   Click → drawer-style panel opens on right with:
   Suggested questions ("What fields are missing across all plans?", "Compare OPD limits", "Anomalies in Premium Raters")
   Free-form text input
7. Comments layer (Figma-style pins) — pins anchor to specific cards (not viewport)
   Comment count badge shown in top bar
8. Notifications toast — bottom-left, slide-up, auto-dismiss
   "✓ 12 fields verified" · "↩ Mini's Age copied to Medi"

═══════════════════════════════════════════════════════════════
EICORE-SPECIFIC CONTENT (use this real data, not lorem ipsum)
═══════════════════════════════════════════════════════════════

Product: D.I.Y Health Insurance · Insurer: Studio Arsa Insurance Ltd · Type: Health Indemnity
3 Plans: Mini (SI ₹4L–₹5L), Medi (SI ₹6L–₹10L), Max (SI ₹11L–₹15L)

CATEGORIES PER PLAN (always these 4):
1. PLAN LIMITS — Sum Insured type, Min SI, Max SI, Available options, Floater basis
2. MEMBER DETAILS — Self, Spouse, Children, Parents, Parents-in-law, Adult dependents
3. COVERAGES (37 per plan) — Hospitalisation, Pre/Post-hosp, Day Care, OPD Cover, ICU Charges, Maternity (Normal), Maternity (C-section), Road Ambulance, Wellness Benefits, Cataract Surgery, Organ Donor Expenses, Cumulative Bonus, Restoration of Sum Insured, Room Rent (Normal Room), LASIK, AYUSH, Mental Health, ...
4. PREMIUM RATERS — Age, Family Construct, Pre-existing, Sum Insured tier, Zone loading

SAMPLE FIELDS WITH STATES (use these in the canvas):
• Mini · Premium Raters · Age — MISSING (red), required, no source
• Mini · Premium Raters · Family Construct — MISSING (red), required
• Mini · Premium Raters · Pre-existing — MISSING (red), required
• Mini · Coverages · OPD Cover — LOW CONF 75% (amber), value "₹3,000 annual"
• Mini · Coverages · LASIK Surgery — LOW CONF 75% (amber)
• Mini · Plan Limits · Min SI — VERIFIED (green), value "₹4,00,000"
• Mini · Member Details · Children — VERIFIED (green), value "91 days – 25 yrs"
• Medi · Coverages · OPD Cover — LOW CONF 75% (amber), value "₹5,00,000 annual"
• Medi · Member Details · Parents — REVIEW (amber), value "Up to 70 yrs"
• Max · Plan Limits · Max SI — VERIFIED (green), value "₹15,00,000"

═══════════════════════════════════════════════════════════════
MICRO-INTERACTIONS (animate these)
═══════════════════════════════════════════════════════════════

• Card hover: shadow elevates, dependency lines pulse (subtle teal glow on connected lines)
• Card click: 2px brand ring fades in (150ms), drawer slides in from right (250ms)
• Drawer plan-tier switch: content cross-fades (150ms in, 100ms out)
• Marquee select: drawn rectangle in brand-tint, cards inside get teal ring as they enter
• Status change: footer banner pulses once (scale 1.0 → 1.02 → 1.0 in 300ms) then settles to new color
• Filter chip toggle: non-matching cards animate to 40% opacity over 200ms
• Mode switch: canvas fades out (100ms) → new mode fades in (200ms)
• Comment pin drop: scales from 0 → 1.1 → 1 with spring easing

═══════════════════════════════════════════════════════════════
AVOID
═══════════════════════════════════════════════════════════════

✗ Tables of "Parameter | Value | Confidence" rows (the whole point is to escape these)
✗ Tabs >4 in any panel
✗ Heavy drop shadows or glassmorphism
✗ Multiple competing colors per card (one category tab, one status banner — that's it)
✗ Static "Mini / Medi / Max" rendered as 3 identical stacked sections
✗ Long paragraph text inside cards (extract to drawer)
✗ Dark mode
✗ Bright saturated colors (keep muted, premium)
✗ Lorem ipsum (use the Eicore data above)
✗ Pop-overs that block more than 1/3 of the canvas
✗ Hidden affordances — every action discoverable via icon + hover label

═══════════════════════════════════════════════════════════════
DELIVERABLES (in this order)
═══════════════════════════════════════════════════════════════

Generate 4 frames, each 1440 × 900, side-by-side:

FRAME 1 — "Tree Expansion · Default state"
The canvas with Mini Plan loaded, no card selected, all 4 categories expanded showing fields.
Show the missing Premium Raters cards in red, low-confidence OPD/LASIK in amber, verified Plan Limits in green.
Drawer is closed. Mini-map and AI Co-Pilot visible bottom-right.

FRAME 2 — "Tree Expansion · Card selected, drawer open"
User has clicked Mini · Premium Raters · Age (a missing/red card).
Drawer is open on the right with full Plan Editor for Age — empty value, missing status, BRD source passage shown.
Selected card in canvas has 2px brand ring + soft glow.

FRAME 3 — "Plan overlay mode · all 3 plans visible"
"Show all plans" toggle is on.
Same tree structure but each branch shows 3 translucent layers (Mini teal, Medi blue, Max purple).
Cards missing in Max plan show as dashed outlines.
Drawer closed.

FRAME 4 — "Extraction mode · split source view"
Mode slider switched to "Extraction".
Left: scrollable card list of all extracted parameters for Mini, with checkboxes and verify badges.
Right: BRD document open at Page 7, "18 and 65 years inclusive" passage highlighted in amber, matching the currently-selected "Age" parameter on the left.

PLUS — one detail callout frame floating beside Frame 1:
A 400px-wide zoom-in of a single workflow card showing all 4 layers (category tab, body, indicator strip, status footer) labeled with annotation lines.
```

---

## How to use this with Figma Make

1. **Copy everything between the triple backticks** above into Figma Make's prompt input
2. **Attach the 5 + 1 reference images** alongside the prompt (in the order listed in the "ATTACHED REFERENCES" block):
   - 1. Tree / node-graph layout
   - 2. Plan Editor side drawer
   - 3. Extractor split (cards ↔ source doc)
   - 4. Node card variants
   - 5. Card / status banners
   - 6. Current Eicore Builder (the "from" state — so Make knows what we're upgrading from)
   *Make uses image context heavily — without these the output drifts toward generic SaaS.*
3. **Generate**. Expect 1–2 generations to get the layout right.
4. **Iterate prompts** for refinement:
   - *"Increase the dotted background opacity by 50% — too subtle"*
   - *"Make the workflow card category tab take the full card width"*
   - *"Show the dependency lines as solid teal instead of dashed blue — too visually noisy"*
   - *"Open the drawer at 520px wide — 480 feels cramped"*

## When the Plan Editor moves to the Builder Dashboard later

The drawer spec is intentionally written as a **standalone organism** — so when you build the Builder Dashboard, just import the same drawer with the same 7 sections. The only thing that changes is the entry point (clicking a card in the dashboard's "Open Issues" list vs. clicking a node in the canvas). The internal navigation (plan switcher, field arrows, breadcrumb, ⌘K) works identically because it doesn't depend on the canvas being visible.

---

## Strategic notes for you

**Why the navigation is over-provisioned (10 patterns):**
Insurance domain experts come from spreadsheet backgrounds. They have muscle memory for keyboard shortcuts (Excel users), but they also expect breadcrumbs (web users), and the AI-extraction context demands new affordances (dependencies, source jumps). Each navigation pattern serves a different intent — keyboard for power users, command palette for explorers, breadcrumbs for new users, mini-tree for orientation. **Don't trim until you've tested with real actuaries.**

**Why Plan Tier switcher is at the top of the drawer (not the canvas):**
Because the user's most frequent question while editing is: *"What does this same field look like in Medi/Max?"* — not *"Let me switch the whole canvas to Medi."* Putting it in the drawer keeps comparison fast (one tap) without changing the canvas context.

**Why dependencies get their own section in the drawer:**
This is the differentiator vs spreadsheets. Spreadsheets can't show "this field is used in 3 rules." Eicore's whole AI-extraction story falls apart if users can't trace cascades.

**Why Comments are a footer tab, not a primary section:**
Comments are async collaboration — important but not on the critical path of "verify this field". Footer tab keeps them one click away without dominating the drawer.

---

*File saved at `/Users/swosti.nayak/Downloads/eicore-onebuzz/figma-prompts/tree-expansion-canvas.md`*
