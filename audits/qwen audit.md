# AeroBridge Comprehensive Professional Design/UX Audit

## 1. Executive Assessment

**Current product level.** The prototype is a high-quality, single-file React presentation layer (`Home.tsx`) that already reads as a coherent "Flight Deck Console": deep-navy surfaces, restrained vector-blue accents, green/amber operational semantics, monospace readouts, a terminal-first Practice surface, desktop sidebar + mobile bottom rail, and a genuinely wired product loop (context is carried into Practice via `setPracticeContext`, assessments persist to `localStorage` and surface in Growth/Tracking). This is well above average prototype maturity.

**Strongest existing qualities.**
- The loop *Progression → Practice → Assessment → Growth → Tracking → Scenarios → Next Action* is implemented with real context hand-offs, not just links (evidence: `saveAssessment`, `setPracticeContext(record.context)`, "Open targeted practice" actions on every screen).
- Terminal UX fundamentals are present: command history recall (ArrowUp/ArrowDown), session/clock readouts, mode tabs (Learn/Practice/Assessment), hint accounting on reference opens, finish-session → debrief → saved record closure.
- Accessibility intent is visible: `aria-label`s on icon controls, `role="img"` rings, `<details>` data-table alternative for the chart, `aria-current` on nav, `prefers-reduced-motion` respected in `useAnimatedNumber`.
- State language is non-color-only in most places (text chips "passed/review", arrows ↑/↓ + "pts" text, `SYNTAX ERROR ·` prefixes).

**Biggest risks.**
1. **Trust risk from "fake success" affordances**: controls that announce completed actions that never happen (Backup created, Mission order updated, language set to AR) undermine the evidence-first philosophy that is the product's core identity.
2. **Terminal calm/trust defects on first open**: the coach panel greets new sessions with a fabricated `FORMAT ERROR · CHECK ENTRY` before the user has typed anything, and an empty submit silently executes `FQD`. Both corrupt the "trustworthy workstation" feeling and can corrupt assessment evidence.
3. **Mobile KPI clipping** in Growth (`82% / Average score` stat at the right edge) and a large dead void in the empty terminal on mobile.
4. **Unverifiable visual layer**: no stylesheet was provided in the upload, so tokens/contrast/focus-visible/hover behavior could only be audited via class inventory + 5 mobile screenshots. Contrast of small muted caps text is suspected sub-AA and must be validated.

**Gap to the intended professional aviation workstation.** The skeleton and identity are right; the gap is concentrated in (a) placeholder controls that overpromise, (b) first-run/empty/error state craft in the Terminal, (c) mobile density/overflow fixes, (d) accessibility baseline (main landmark, focus management, contrast validation), and (e) honest labeling of illustrative numbers. Nothing requires an architecture change; the revision pass is almost entirely UI/CSS/copy.

## 2. Audit Method and Evidence

**Files inspected (source of truth):** `Home.tsx` (all views + shell), `App.tsx`, `index.ts` (Express static + SPA fallback), `const.ts` (OAuth URL builder — out of visual scope, noted only), `Map.tsx` (Google Maps loader), `ideas.md` (design ground truth).

**How reviewed:** static source inspection cross-referenced against five rendered mobile captures (Progression, Practice, Scenarios, Growth Record, Progress Tracking, ~360–430px widths, hosted at `*.manus.space`). The server (`index.ts`) confirms deep-linkable client routes (`/practice`, `/scenarios`, `/growth`, `/tracking`) via `index.html` fallback; `Home.tsx` confirms `pushState`/`popstate` handling.

**Not verifiable (validation needed):** the stylesheet was **not** included in the upload — therefore exact color tokens, contrast ratios, radii, spacing scale, breakpoint behavior, `:focus-visible` styling, hover-only CSS, desktop/laptop/tablet rendering, toast styling, and CSS reduced-motion coverage could not be measured. All visual-metric conclusions below are either (a) screenshot-verified, (b) class-inventory inferences, or (c) explicitly marked *validation needed*. Desktop layout is unverified (mobile captures only).

**Source/screenshot conflicts:** none material. Minor notes: topbar eyebrow "AEROBRIDGE / TRAINING ENVIRONMENT" exists in source but is hidden in mobile captures (CSS-driven, acceptable); Practice clock `04:36` in capture vs `272s` seed + interval in source (consistent). Whitespace artifacts inside string literals in the provided source (e.g. `"Pricing  & Ticketing "`) are treated as extraction artifacts, not findings.

**Dead/unused code observed:** `Map.tsx` (`MapView`) is imported by nothing; `SystemState` values `first-use`, `loading`, `interrupted`, `unavailable`, `partial-success` are never rendered; `ErrorKind` `"hint-dependency"` is never produced yet appears in the debrief legend.

## 3. Current Product and Information Architecture

**Implemented loop (verified):**
- **Progression** (`/`) → "Resume pricing workflow" → Practice. Level cards route current level to Practice; locked levels explain unlock condition via toast.
- **Practice** (`/practice`) → Assessment mode → FINISH SESSION → `AssessmentReport` + `onAssessmentComplete` → record persisted (`aerobridge-progress-records`, max 8) → appears in Tracking/Growth.
- **Scenarios** (`/scenarios`) → Start/Resume injects `selected.title` into `practiceContext` → Practice; completed scenario routes to Growth ("Review result").
- **Growth** (`/growth`) → "Practice the highlighted gap", "Open targeted practice", skill detail CTAs → Practice with skill-specific context.
- **Tracking** (`/tracking`) → history rows and "Open targeted practice" → Practice with record context.

**Strong transitions:** context-carrying is the product's best IA decision — every next-action button arrives in Practice with the correct task strip (`CURRENT TASK · {context}`), and the coach/next-move copy follows. The learning-loop strip in Growth (Read evidence → Practice the gap → Apply in scenario) makes the pedagogy explicit.

**Weak transitions / gaps:**
- "View map" (Progression) resolves to a toast pointing at the evidence view while an actual `MapView` component sits unused — the IA promise ("map") has no destination.
- Assessment is a *mode* inside Practice (good, terminal-first), but there is no persistent "last debrief" surface outside the session; if the user navigates away after finishing, the report is unmounted (state is local to `Practice`). Growth's `StateNotice` partially compensates.
- Navigation order differs between shells (sidebar: Progression, Practice, Scenarios…; bottom rail: Route, Apply, **Train(center)**, Evidence, Trend). The centered Train is intentional and good; document it so it reads as design intent.
- Placeholder utilities (search popover, profile toast, sort toast, backup toast) create dead ends inside an otherwise fully-looped IA.

## 4. Overall Scorecard

| Dimension | Score (0–10) | Rationale |
|---|---|---|
| Visual Design | 8.0 | Cohesive flight-deck identity, layered surfaces, disciplined accents; verified in captures. |
| UX | 7.0 | Loop and hand-offs excellent; placeholder overpromises and first-run terminal states drag trust. |
| UI | 7.5 | Consistent control vocabulary (`primary/ghost/text/icon-button`, chips, panels); minor overflow/truncation defects. |
| Design System | 7.0 | Consistent class semantics and component reuse; tokens/contrast unverifiable (CSS not provided); one unused component (MapView). |
| Typography | 7.5 | Correct proportional/mono split (codes, readouts, EV/SC ids mono); tabular figures not guaranteed → animated-number jitter risk. |
| Color | 7.0 | Semantic green/amber/blue consistent; violet scenario accent undocumented; muted small-caps contrast suspected sub-AA (validation needed). |
| Information Hierarchy | 8.0 | Eyebrow → H1 → support line pattern consistent; KPI cards scannable. |
| Terminal UX | 7.0 | Real workstation affordances (history recall, modes, hint accounting, closure); initial fake error, empty-submit FQD, empty void, toast noise reduce calm/precision. |
| Navigation | 8.0 | Deep links, popstate, aria-current, centered Train; missing focus management on route change. |
| Responsive | 6.5 | Mobile composition mostly strong; Growth stat clipping, terminal void, untested 320/360px. |
| Mobile | 7.0 | Bottom rail + drawer + ordered coach-below-terminal are right; touch-target sizes unverifiable (CSS missing). |
| Accessibility | 6.5 | Good semantics/labels/chart alternative; no `<main>` landmark, no skip link/focus move, hover-only content, contrast validation needed. |
| Motion | 7.0 | Purposeful number/bar/ring animations with JS reduced-motion guard; mount-animation volume per view is high; CSS motion unverified. |
| Consistency | 8.0 | One-team feel across five screens; state chips, buttons, panels repeat reliably. |
| Professional Maturity | 7.5 | Reads as operational software, not game/SaaS template; fake-success toasts and streak framing are the only consumer-app notes. |
| Functional Safety | 8.0 | Mocks are labeled "LOCAL TRAINING SIMULATION"; persistence is isolated; UI layer separable from logic. |

## 5. Screen-by-Screen Audit

### 5.1 Shared Shell (Topbar, SideNav, BottomNav, mobile drawer)
- **Primary user task:** orient + switch workspace.
- **Primary action:** nav buttons / menu.
- **Keep:** bottom rail with centered primary Train; `aria-current`; drawer with full labels; topbar page-title on mobile (orientation); EN/AR *control* presence (mission-aligned intent).
- **Change:** (AB-04) EN/AR toggle currently fires `toast.success("Interface language set to AR")` with no content/`dir` change — replace interim feedback with honest "Arabic interface in roadmap" wording until real i18n exists; (AB-12) wrap app content in a real `<main>` landmark (currently `div.app-main`), add skip link and focus-to-heading on `navigate()`; (AB-18) `BrandMark` hard-codes `/manus-storage/aerobridge-share-mark_5efd31e0.png` with no `onError` fallback — specify a local-asset fallback so brand never 404s in the GitHub/vanilla environment.
- **Add:** visible `:focus-visible` treatment spec for nav + rail (validation needed in CSS); safe-area padding for the rail on notched devices (validation needed).
- **Remove/De-emphasize:** (AB-21) topbar title duplicates the page `h1` on mobile — keep one as the accessible name source; consider eyebrow-only topbar context on desktop.
- **Required states:** drawer open/close focus trap (validation needed), active/hover/pressed nav states.
- **Responsive issues:** unverified <360px rail label crowding (validation needed).
- **Accessibility issues:** missing main landmark/skip link/focus management (AB-12); language button `aria-label="Language selector"` but behaves as a mock (AB-04).
- **Interaction issues:** search popover (AB-19) and profile toast are dead ends — label as preview or defer.
- **Dependency classification:** AB-04 Mixed (real i18n is Content/Engine; interim copy is UI-only); AB-12 UI-only; AB-18 Mixed (deployment); AB-19 Mixed.

### 5.2 Progression (`/`)
- **Primary user task:** understand current vector and resume the right work.
- **Primary action:** "Resume pricing workflow".
- **Keep:** hero route card with 68% ring + command-set/time meta; segmented 3/8 stage progress; mastered/current/locked milestone semantics; track tabs (Technical vs Customer Service) with distinct descriptions — this directly mirrors the EgyptAir Basic/Advanced dual-curriculum mission.
- **Change:** (AB-03) "View map" action toast ("…available in the evidence view") is a misdirection; either relabel to "View stage map" scrolling to `levels-section`, or wire the existing unused `MapView` only if a *route-map* has genuine instructional value (ground truth says avoid decorative imagery — default: relabel, don't add map).
- **Add:** explicit curriculum mapping line per level (e.g., "Basic course · module mapping") as a *Content-dependent* later phase; locked cards should state the unlock rule inline, not only via toast.
- **Remove/De-emphasize:** nothing material.
- **Required states:** locked (present), current (present), mastered (present), plus a future "assessment required to advance" state (deferred).
- **Responsive issues:** none verified in capture; hero ring + copy stack cleanly at mobile width.
- **Accessibility issues:** level cards are buttons containing progress `<span class="tiny-progress">` — ensure bar has text alternative (`AnimatedBar` has `aria-label`, good); expanded detail text (`level-detail`) should be associated via `aria-expanded` on the card button (currently absent).
- **Interaction issues:** mastered-level tap toggles a one-line detail of low value (AB-23 adjacent) — acceptable, but ensure tap target ≥44px.
- **Dependency classification:** AB-03 Mixed; curriculum labels Content-dependent.

### 5.3 Scenarios (`/scenarios`)
- **Primary user task:** choose the right situational practice and start/resume/review it.
- **Primary action:** scenario card select → detail CTA (Start/Resume/Review).
- **Keep:** 2×2 stat grid; filter tabs that actually filter; accent semantics (blue=in progress, green=completed, amber=recommended, violet=not started — document this mapping); detail panel with difficulty/time/type facts, skills tested, next operational move, coach readout; contextual CTA verbs (Start/Resume/Review) per ground truth.
- **Change:** (AB-02) sort `<select>` fires "Mission order updated." without reordering — either disable with "coming soon" affordance or implement local sort later (Engine/Content dependent); interim: honest toast ("Sorting preview not active in this prototype").
- **Add:** result affordance for completed scenarios beyond routing to Growth (e.g., "92% · view evidence" inline) — UI-only.
- **Remove/De-emphasize:** top-right "Filters" ghost button duplicates the working filter tabs directly below it — remove or repurpose (it currently toasts).
- **Required states:** not-started/in-progress/completed/recommended present; add empty state for filter combinations that yield zero cards (e.g., "Completed" after local data changes) — currently renders an empty list with no message (verified in code: `filtered.map` with no fallback).
- **Responsive issues:** none verified; cards stack well in capture.
- **Accessibility issues:** filter tabs lack `aria-pressed`/tablist semantics (buttons with class only); sort select has visible label (good).
- **Interaction issues:** selecting a card updates detail; on mobile the detail sits far below the list (long scroll) — consider sticky mini-summary or scroll-into-view on select (UI-only, validation needed).
- **Dependency classification:** AB-02 Mixed; empty-filter state UI-only.

### 5.4 Growth Record (`/growth`)
- **Primary user task:** interpret evidence and accept the next practice target.
- **Primary action:** "Practice the highlighted gap" / skill-row select / tab switch.
- **Keep:** Record/History/Reports tabs with distinct panels; `StateNotice` latest-evidence banner; learning-loop strip; strengths vs needs-attention pairing with trend arrows + text; skill-detail trace with CTA.
- **Change:** (AB-10) `growth-score-stats` third stat (`82% / Average score`) renders clipped at the right edge in the 360–390px capture — specify wrap to 3-column → 1-row scroll-free layout (e.g., 3-up → stacked at ≤390px); (AB-01) Backup button claims "A local evidence backup point has been created." with no write — interim honest copy ("Backup preview — persistence planned") until real storage exists (State/Data dependent later).
- **Add:** per-tab focus/scroll restoration; `aria-selected` on tabs.
- **Remove/De-emphasize:** (AB-11) `skill-hover-preview` contains unique coaching copy ("Coach: repeat with one fewer hint") reachable only by hover — surface on `:focus-visible` and tap (e.g., expand within row), because touch and keyboard users may never see it.
- **Required states:** empty (present via StateNotice), review (present), completed (via record.state); add "no evidence for this skill yet" for skill-detail when data absent (deferred, data-dependent).
- **Responsive issues:** AB-10 clipping (screenshot-verified, confidence Medium–High).
- **Accessibility issues:** tabs are buttons without `role="tablist"`/`aria-selected`; hover-only content (AB-11).
- **Interaction issues:** activity-list "Milestone reached" only toasts — acceptable as evidence entry but label as read-only.
- **Dependency classification:** AB-10 UI-only; AB-01 Mixed; AB-11 UI-only.

### 5.5 Progress Tracking (`/tracking`)
- **Primary user task:** read the trend, confirm consistency, choose the next assessment.
- **Primary action:** "Open targeted practice" / history row → Practice.
- **Keep:** metric switcher (overall/accuracy/sequencing); KPI quartet; bar chart with value labels + LATEST/SESSION captions; `<details>` data-table alternative (exemplary); legend + `↑/↓ n pts / last session` non-color trend; history rows carrying context into Practice.
- **Change:** (AB-20) `tracking-route-line` label truncates ("VECTOR 03 / PRICING & T…") at mobile — allow two-line wrap or shorten to "V03 · PRICING & TICKETING"; ensure `trend-readout` warning color pairs with existing arrow+text (it does).
- **Add:** axis/gridline value alignment check at 320px (validation needed); per-bar `tabindex`/tooltip is unnecessary given the data table — do not add (avoid redundancy).
- **Remove/De-emphasize:** nothing.
- **Required states:** empty (present with CTA), single-record (delta=0 copy present: "No change since last session") — good; add loading state when records hydrate from storage (currently synchronous; deferred).
- **Responsive issues:** AB-20 truncation (capture-verified, Low).
- **Accessibility issues:** metric switcher buttons lack `aria-pressed`; chart container `aria-label` present (good).
- **Interaction issues:** none material.
- **Dependency classification:** UI-only.

### 5.6 Practice (`/practice`) — summary (deep audit in §6)
- **Primary user task:** execute the workflow in the terminal with calibrated support.
- **Primary action:** command input → Execute; FINISH SESSION in Assessment.
- **Keep:** mode tabs; terminal head readouts; reference drawer with insertable examples; focus mode; coach-below-terminal on mobile; footer metrics; debrief → persistence.
- **Change:** AB-05 (empty submit executes `FQD`), AB-06 (initial coach shows fabricated `FORMAT ERROR · CHECK ENTRY`), AB-07 (footer `Accuracy 86%` pre-evidence + static `128 / 210` untagged), AB-08 (toast per command), AB-09 (empty terminal void).
- **Add:** interrupted-session recovery notice (state exists in `SystemState` but is never rendered) — UI-only notice shell, data hook deferred.
- **Remove/De-emphasize:** per-command success toasts (keep session-level toasts).
- **Required states:** ready/in-progress/success/error/review/completed present; loading/interrupted/unavailable absent (AB-15).
- **Responsive issues:** terminal void (AB-09); execute button label hidden on mobile in capture (icon-only) — ensure `aria-label` (present) + ≥44px target (validation needed).
- **Accessibility issues:** terminal history `aria-live="polite"` (good); input `aria-label` describes arrow-key history (good); mode tabs need `aria-pressed`/tablist semantics.
- **Interaction issues:** see §6.
- **Dependency classification:** AB-05 Mixed (input-state UI touching submit path; regression-locked), AB-06/07/08/09 UI-only/Content.

## 6. Terminal Deep Audit

**Q1: Does the Terminal feel like the primary workstation?** Mostly yes on desktop-class layout (it dominates `practice-main`), and the centered Train in the rail reinforces primacy. But on mobile the first viewport shows the task strip + mode tabs + terminal head, then a **large blank region** (AB-09) before the prompt — the workstation reads as "empty card" until history exists. The coach's fabricated error (AB-06) further breaks the professional calm. Verdict: primacy achieved, *first-impression craft* not yet.

**Q2: Session state within seconds?** Partially. `SESSION / LOCAL SESSION`, `COMMAND / READY`, `LOG 01`, and the running clock are excellent orientation. However the coach simultaneously displays `FORMAT ERROR · CHECK ENTRY` + "The availability entry needs the airline prefix…" before any input — a contradictory state pair (READY vs ERROR) that fails the "seconds to understand" test (AB-06, High).

**Q3: Command input friction?** The input row (`> Enter command...` + Execute) is visually distinct and sticky-adjacent to the body; arrow-key history recall is a genuine terminal courtesy; `autoComplete="off"` correct. Friction risks: icon-only Execute on mobile needs verified target size; empty-submit→`FQD` (AB-05) means the input contract is not trustworthy — a trainee tapping Execute "to test" will silently log an FQD assessment entry.

**Q4: Output/input/history/feedback/reference/coach/closure clarity?** Structure is right: boot lines (muted) → history entries (`CMD nn` + command + colored response with textual prefix) → active line with caret → input → footnote. Reference drawer inserts examples safely and counts hints outside Assessment (good discipline mechanic; policy question AB-17). Closure is the strongest flow in the product: FINISH SESSION (disabled until evidence exists) → debrief with accuracy/sequencing/hint-discipline + error taxonomy + recommendation → persisted record → toast → appears in Tracking/Growth. Weaknesses: triple redundancy per command (terminal line + coach block + toast, AB-08); coach "LATEST COMMAND" block duplicates the terminal line verbatim.

**Q5: States distinguishable without color?** Largely yes: responses carry prefixes (`SYNTAX ERROR ·`, `SEQUENCE ERROR ·`, `AVAILABILITY RETURNED ·`), debrief shows error-key dots *with* text labels. Gaps: no processing state (instant local responses are fine, but a future engine will need one — `loading` exists in the type only, AB-15); no interrupted state rendered; `hint-dependency` dot can never occur (AB-16).

**Q6: Long-session comfort?** Monospace output, muted boot lines, and history labels support scanning; but unbounded history growth within a fixed-height body (validation needed on scroll behavior) and the always-running clock from a 272s seed (not from session start) reduce trust. Recommend: session clock starts at 0 on first user action (UI-only timing display change; does not touch scoring), and history auto-scrolls to latest with a "jump to latest" affordance (validation needed).

**Q7: Mobile preservation order (output → input → state → feedback)?** Capture shows terminal body, input, footnote, then coach, then footer metrics — correct priority order. The void (AB-09) and coach fake-error (AB-06) are the mobile-first defects.

**Q8: Which enhancements are Engine/Data dependent?** Real processing/latency states, interrupted recovery, true session timing, hint-policy enforcement, Arabic command help — all Engine/Content. Everything recommended in P0/P1 here (copy, empty-state line, toast budget, focus/landmarks, stat wrap, honest mock labels) is UI-only and safe.

## 7. Shared Design System Audit

- **Tokens:** class inventory implies a coherent token family (`panel-surface`, `eyebrow`, `status-dot`, `readout-code`), but the stylesheet is absent from the upload → formalize a token spec (color roles: surface-0/1/2, line, text-primary/muted, accent-blue, ok-green, warn-amber, error-red, info-violet; spacing 4px scale; radius tiers; elevation 2 tiers) during implementation. *Validation needed* against the real CSS.
- **Typography:** proportional display for H1/H2 + mono for codes/readouts is correct and aviation-authentic. Gaps: no guaranteed `tabular-nums` for animated metrics (AB-14); Arabic/RTL type planning absent (deferred, Content); numeric density in KPI cards is fine but small-caps eyebrows at ~10–11px risk contrast (AB-13).
- **Surfaces/cards/panels:** consistent radius/border language across captures; hero surfaces use restrained gradients + route motifs per ground truth — keep.
- **Buttons/controls:** four-tier system (primary/ghost/text/icon) used consistently; add pressed/disabled specs; `details/summary` styling for the data table should receive the same token pass.
- **Status states:** chip family (`tracking-live--`, `detail-status--`, scenario accents) is semantically mapped but undocumented; produce a state→color→icon→text matrix so the later vanilla engine can consume it as data, not vibes.
- **Icons:** lucide set is coherent in weight/size (13–19px); ensure 24px+ hit areas via padding.
- **Motion:** JS animations respect reduced motion; CSS transitions unknown; define a motion budget (enter ≤240ms, number count ≤800ms, one hero animation per view mount) — current per-view mount animates many numbers/bars/rings simultaneously (AB-22).
- **Breakpoints:** define 1280/1024/768/430/390/360/320 with explicit rail/sidebar swap rules; current behavior verified only at mobile widths.

## 8. Responsive and Accessibility Audit

**Verified (captures, ~360–430px):** Growth stat clipping (AB-10, High); terminal empty void (AB-09); route-line label truncation (AB-20); bottom rail + drawer + coach ordering correct; icon-only Execute on mobile.
**Validation needed (no CSS/desktop captures):** 320px and 360px passes on all five routes; tablet 768px column behavior; desktop ≥1280px sidebar composition; `:focus-visible` rings; hover-only previews; touch-target measurements; toast stacking on mobile; CSS `prefers-reduced-motion` coverage; drawer focus trap.
**Accessibility verified good:** landmark-adjacent semantics (`header`, `aside`, `nav`), `aria-label`s, chart data-table alternative, `aria-live` history, reduced-motion JS guard, non-color state text.
**Accessibility defects:** no `<main>` landmark / skip link / route-change focus (AB-12); tabs/filters lack pressed/selected semantics; hover-only coaching (AB-11); contrast validation for muted caps (AB-13); `aria-expanded` missing on expandable level cards.

## 9. Priority Matrix

| ID | Pri | Sev | Impact | Effort | Dependency | Routes/Files | Phase |
|---|---|---|---|---|---|---|---|
| AB-06 | P0 | High | Trust/calm on core screen | S | UI-only | Practice/`Home.tsx` coach | 1 |
| AB-05 | P0 | High | Assessment evidence integrity | S | Mixed (regression-locked) | Practice submit | 1 |
| AB-12 | P0 | Medium | A11y baseline | S–M | UI-only | Shell | 1 |
| AB-13 | P0 | Medium* | A11y contrast (*pending validation) | M | UI-only | All/CSS | 1 |
| AB-10 | P1 | High | KPI readability mobile | S | UI-only | Growth/CSS | 2 |
| AB-04 | P1 | Medium | Mission trust (AR) | M | Mixed | Topbar | 2 |
| AB-01 | P1 | Medium | Evidence philosophy | S | Mixed | Growth | 2 |
| AB-02 | P1 | Medium | Trust | S | Mixed | Scenarios | 2 |
| AB-09 | P1 | Medium | First-run terminal | S | UI-only | Practice | 2 |
| AB-08 | P1 | Medium | Terminal calm | S | UI-only | Practice toasts | 2 |
| AB-07 | P1 | Medium | Evidence honesty | S | UI/Content | Practice footer | 2 |
| AB-11 | P2 | Medium | Coaching reach | S | UI-only | Growth | 2 |
| AB-15 | P2 | Medium | State completeness | M | Mixed | Shell/Practice | 2 |
| AB-03 | P2 | Medium | IA honesty | S | Mixed | Progression | 2 |
| AB-18 | P2 | Medium | Brand resilience | S | Mixed | Shell | 2 |
| AB-16 | P3 | Low | Taxonomy accuracy | S | Content | Debrief | 3 |
| AB-14 | P3 | Low | Metric polish | S | UI-only | All metrics | 3 |
| AB-19 | P3 | Low | Dead-end cleanup | S | Mixed | Topbar | 3 |
| AB-20 | P3 | Low | Truncation | S | UI-only | Tracking | 3 |
| AB-22 | P3 | Low | Motion budget | S | UI-only | All | 3 |
| AB-17 | P3 | Obs | Policy clarity | – | Content | Practice | Deferred |
| AB-21 | P3 | Obs | Redundancy | S | UI-only | Topbar | 3 |

## 10. Target-State Design Revision Specification

**T1 Terminal first-run (fixes AB-06/AB-09):** With zero history, the coach block shows a neutral ready readout: eyebrow `SYSTEM RESPONSE / AWAITING COMMAND`, code line `READY · LOCAL RESPONSE LAYER`, body copy explaining the expected first step for the current context, next-move = "Review the workflow order". The terminal body's empty region renders 2–3 muted illustrative prompt hints (e.g., "Try: AN … / SS … — reference available, hints are counted outside Assessment") styled as `terminal-muted`, never as system output, clearly labeled illustrative. No error-colored string may render before the first user submission.

**T2 Input contract (AB-05):** Empty/whitespace submit produces an inline `terminal-error` line `NO ENTRY · TYPE A COMMAND` and does **not** create an assessment entry, does not advance `LOG`, does not toast. Non-empty inputs behave byte-identically to today (regression-locked).

**T3 Feedback budget (AB-08):** Per-command feedback lives in (a) the terminal line and (b) the coach block. Toasts are reserved for: session finished, assessment saved, focus mode toggle, and navigation-level confirmations.

**T4 Honest mocks (AB-01/02/04/07/19):** Every non-functional control either (a) carries a "preview" affordance (subtle dashed underline + tooltip/copy "preview — not active in prototype") or (b) emits honest copy ("Sorting preview not active…"). Footer accuracy shows `—` until first accepted command; `128 / 210` gains an "illustrative" micro-tag in the preview build. EN/AR: interim toast "Arabic interface is on the roadmap"; control remains visible (mission signal) but never claims a completed switch.

**T5 Mobile KPI wrap (AB-10):** `growth-score-stats` renders 3-up ≥400px and stacked single-column ≤390px with full labels visible; no horizontal clipping at 320–430px.

**T6 Shell accessibility (AB-12/13/11):** `<main id="main">` wraps routed content; skip link as first focusable; `navigate()` moves focus to the page `h1` (`tabindex="-1"`); tabs/filters gain `aria-pressed`/`aria-selected`; level cards gain `aria-expanded`; skill-row coaching copy visible on `:focus-visible` and tap; contrast pass brings all eyebrow/muted text to ≥4.5:1 (or ≥3:1 with size bump for large-caps only).

**T7 State completeness (AB-15):** Render shells for `loading` (skeleton readout lines in terminal + KPI shimmer), `interrupted` (StateNotice with Resume action restoring last mode/context from `localStorage` — storage key schema unchanged, additive key only), `unavailable` (StateNotice with retry affordance). No scoring/workflow logic touched.

**T8 Token & motion spec (AB-14/22):** tabular-nums on all animated/mono numerics; motion budget §7; document state→color→icon→text matrix; document scenario accent mapping (blue/violet/green/amber).

## 11. Phased Implementation Plan

**Phase 0 — Safety/Trust (P0):** AB-05, AB-06, AB-12, AB-13. Constraint: AB-05 ships with the §12 regression suite; contrast changes are token-level only.
**Phase 1 — Terminal & Mobile Hierarchy (P1):** AB-10, AB-09, AB-08, AB-07, AB-04, AB-01, AB-02. Sequence: terminal copy/state changes before toast-budget changes to avoid double-editing the same JSX.
**Phase 2 — Shared System & All Screens (P2):** AB-11, AB-15, AB-03, AB-18, Scenarios empty-filter state, tab semantics, token/matrix documentation.
**Phase 3 — Polish (P3):** AB-14, AB-16, AB-19, AB-20, AB-21, AB-22, motion budget.
**Deferred:** AB-17 (hint policy), real i18n/RTL, real search/sort/backup, MapView product decision, curriculum content mapping.
**Sequencing constraints:** never edit `assessmentScore`, `submitCommand` response strings, `assessmentOrder`, record schema, or route paths; CSS token pass (Phase 2) must not rename semantic classes consumed by the future vanilla engine without a mapping table.

## 12. Acceptance Criteria

**Terminal:** (1) First open shows zero error-styled strings; coach shows READY readout. (2) Empty submit yields inline `NO ENTRY` line; `LOG` counter and history length unchanged; assessment score for identical non-empty input sequences is byte-identical pre/post change. (3) ArrowUp/Down history recall unchanged. (4) FINISH SESSION disabled until ≥1 entry; debrief values match `assessmentScore` formula output exactly.
**Navigation:** (5) Tab into page reaches skip link first; Enter lands on `<main>`; route change focuses `h1`; `aria-current` correct on rail/sidebar/drawer.
**States:** (6) Empty, ready, in-progress, success, error, review, completed render with text+icon+color; loading/interrupted/unavailable shells render without engine wiring; no state relies on color alone.
**Design system:** (7) Token matrix documented; all numerics tabular; contrast ≥4.5:1 for body/muted text (measured, not assumed).
**Screens:** (8) Growth stats unclipped at 320/360/390/430; (9) Scenarios zero-result filter shows empty state with reset action; (10) no control claims a completed action it does not perform (copy audit passes).
**Responsive:** (11) full pass at 1280/1024/768/430/390/360/320 with screenshots; rail targets ≥44px.
**Accessibility:** (12) keyboard-only completion of: resume → command → finish → view record; reduced-motion disables count-ups and CSS transitions.
**Motion:** (13) ≤1 hero animation per view mount; enter durations ≤240ms.
**Regression safety:** (14) route paths, nav order, `localStorage` schema (`aerobridge-progress-records`, max 8), command strings (AN/SS/FQD/FXP), response strings, and scoring weights unchanged; automated or manual diff of terminal transcripts before/after.

## 13. Deferred Dependencies and Open Questions

**Engine/Data:** real processing/latency states; interrupted-session persistence; true session timing; backup persistence; sort algorithm; search index; hint-policy enforcement (AB-17). **Content:** real i18n/RTL + Arabic type stack; EgyptAir Basic/Advanced module mapping per level/skill; whether `hint-dependency` should be producible (AB-16) is a pedagogy decision. **Architecture/Product:** MapView purpose (route metaphor vs instructional map) — default recommendation is *do not integrate* unless instructional value is proven; asset hosting strategy for `BrandMark` (AB-18). **Validation needed:** everything listed in §2/§8 (CSS tokens, contrast, desktop renders, focus-visible, touch targets, drawer trap). None of these may be solved by UI invention in the interim phases.

## 14. Final Verdict

**The prototype needs a focused revision pass, not foundational clarification.** The architecture, loop, identity, and terminal skeleton already embody the intended professional aviation-training workstation; every P0/P1 finding is a UI/copy/CSS-level correction with clear acceptance criteria and zero engine entanglement. Execute Phases 0–2, re-audit against §12, and the design layer will be ready to serve as the visual specification for the real engine.