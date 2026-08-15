# AeroBridge Comprehensive Professional Design/UX Audit

## 1. Executive Assessment

The prototype presents a coherent, visually mature **Flight Deck Console** identity: deep navy surfaces, restrained Vector Blue accents, green/amber operational states, monospace command/readout content, layered cards, desktop side navigation, and mobile bottom navigation with Train as the intentional centre. The product loop (Progression → Practice → Assessment → Growth → Tracking → Scenarios → Next Action) is present and largely navigable.

**Strongest existing qualities**
- Clear professional aviation training positioning (not generic SaaS, crypto, or gaming UI).
- Terminal is treated as the operational heart, with focus mode, session readouts, command history navigation (Arrow Up/Down), reference drawer, coach panel, and explicit “LOCAL TRAINING SIMULATION” labelling.
- Evidence-first language (“Latest evidence / EV-041”, “Readiness is a pattern, not a single score”) aligns with the educational mission of EgyptAir Basic/Advanced → Saudi market readiness.
- Responsive foundations exist (breakpoints at ~740 px, 1100 px, 1450 px; specific 390 px / 360 px terminal header stacking).
- Reduced-motion support and some ARIA/live-region usage are already present.

**Biggest risks / gaps**
- Density and hierarchy occasionally favour visual polish over immediate operational clarity (especially on mobile Terminal header and Growth tabs).
- Some status communication still leans heavily on colour; non-colour differentiation is incomplete for error kinds and long-session states.
- Information architecture transitions (especially Growth Record ↔ Progress Tracking ↔ Practice) are present but not always explicit about the *next useful action* in context.
- Typography scale and monospace/proportional balance for mixed English/Arabic/aviation codes is good in Terminal but uneven elsewhere.
- Accessibility gaps remain around heading hierarchy, touch targets on dense mobile rows, and chart alternatives beyond the existing data table.
- The prototype correctly labels itself as illustrative/local; any future engineer must keep this boundary absolute.

**Gap to intended state**  
The visual language is already close to a premium aviation training workstation. The remaining work is refinement of hierarchy, Terminal long-session comfort, state language consistency, responsive tightening at 320–430 px, and accessibility hardening — not a redesign. Functional engine/command behaviour must remain untouched.

## 2. Audit Method and Evidence

**Source inspected**
- `/client/src/App.tsx` (routes everything to Home)
- `/client/src/pages/Home.tsx` (entire product: Progression, Practice/Terminal, Scenarios, Growth Record, Progress Tracking, navigation, mock assessment engine, localStorage)
- `/client/src/index.css` (design tokens, all layout, Terminal, responsive, motion, focus-mode rules)
- Supporting: `ErrorBoundary.tsx`, `ThemeContext.tsx`, `useMobile.tsx`, `package.json`, `vite.config.ts`
- Screenshots supplied (55514–55528) used only as visual corroboration; source + rendered behaviour are authoritative.

**How the prototype was reviewed**
- Full source read of Home.tsx (363 lines) and index.css (408+ lines including late refinement blocks).
- Static analysis of class names, state machine (`SystemState`, `ErrorKind`), navigation order, Terminal submit logic, focus-mode CSS, and media queries.
- No live browser run of the extracted package was required for the majority of findings; visual structure and CSS rules are self-evident. Where behaviour is dynamic (localStorage, toast, Arrow history), source logic was verified.

**Not verifiable without live render / device**
- Exact pixel collisions at 320 px under real font metrics.
- Actual touch-target hit areas on physical devices.
- Live reduced-motion media-query behaviour under system settings.
- Real Arabic (Cairo) rendering and bidirectional layout (language switch is toast-only).

**Source vs screenshot conflicts**
- None material. Screenshots match the component structure, copy, and visual language in Home.tsx / index.css. Minor differences in mock data values are expected (illustrative).

## 3. Current Product and Information Architecture

**Existing loop**
1. **Progression** — “Know where you are. See the next workflow.” Current vector hero + stage map + track switch.
2. **Practice (Terminal)** — Learn / Practice / Assessment modes; command entry; coach + reference; focus mode; assessment debrief.
3. **Scenarios** — Mission files with start/resume/review.
4. **Growth Record** — Record / History / Reports tabs; evidence interpretation; next action.
5. **Progress Tracking** — Trend chart, KPIs, session log, next readout.

**Navigation**
- Desktop (≥1100 px): fixed side nav, labels “Progression / Practice / Scenarios / Growth Record / Progress Tracking”.
- Mobile: bottom nav reordered Route · Apply · **Train** · Evidence · Trend (Train elevated as primary).
- Topbar: brand, context eyebrow + title, EN/AR, search popover, profile chip.
- History API + popstate for basic deep-link simulation.

**Strengths**
- Explicit “next useful move” language appears on most screens.
- Assessment completion writes to localStorage and surfaces in Tracking/Growth.
- Coach and reference are deliberately suppressed or limited in Assessment mode.

**Weaknesses**
- Growth tabs (Record/History/Reports) hide large sections via `.is-secondary-view { display: none }` rather than true progressive disclosure; context can feel discontinuous.
- No persistent “you are here in the loop” indicator beyond the bottom-nav active state and page eyebrows.
- Practice context is passed as a string; resume from Scenario correctly sets it, but the Terminal task strip does not always restate the originating scenario ID.

## 4. Overall Scorecard

| Dimension              | Score | Rationale |
|------------------------|-------|-----------|
| Visual Design          | 8.5   | Strong Flight Deck identity, restrained accents, good surfaces. |
| UX                     | 7.5   | Clear loop, good next-action language; some context loss on tab switches. |
| UI                     | 8.0   | Consistent cards, chips, buttons; Terminal controls dense on mobile. |
| Design System          | 7.0   | Solid CSS tokens; incomplete component tokenisation and state variants. |
| Typography             | 7.5   | Good mono for Terminal; mixed-language and scale hierarchy uneven. |
| Color                  | 8.0   | Professional palette; some states still colour-primary. |
| Information Hierarchy  | 7.5   | Strong on Progression/Tracking; Growth tabs and mobile Terminal weaker. |
| Terminal UX            | 8.0   | Core workstation feel present; long-session and mobile header need polish. |
| Navigation             | 8.5   | Side + bottom correctly prioritise Train; labels clear. |
| Responsive             | 7.0   | Solid ≥740 px; 320–430 px Terminal and Growth need tightening. |
| Mobile                 | 7.0   | Bottom nav good; Terminal input sticky but header crowding remains. |
| Accessibility          | 6.5   | Focus-visible, some ARIA, reduced motion; heading/touch/chart gaps. |
| Motion                 | 8.0   | Purposeful, reduced-motion respected; no decorative distraction. |
| Consistency            | 8.0   | One visual language across screens. |
| Professional Maturity  | 8.5   | Feels like aviation training software, not a template. |
| Functional Safety      | 9.0   | Clear local/simulation labelling; UI changes can stay UI-only. |

## 5. Screen-by-Screen Audit

### Progression (`view === "progression"`)
- **Primary user task**: Orient to current vector and resume the active workflow.
- **Primary action**: “Resume pricing workflow”.
- **Keep**: Hero route card, progress ring, stage map, track switch (Technical / Customer Service), locked states with lock icon + toast.
- **Change**: Make the “View map” / “See all stages” actions either functional or remove the affordance until content exists.
- **Add**: Explicit “Next action after current stage” line under the current milestone.
- **Remove / de-emphasize**: Decorative route-node motif if it competes with the progress ring on small screens.
- **Required states**: first-use, locked, current, mastered (already present).
- **Responsive**: Level grid collapses well; hero min-height can feel tall on 360 px.
- **Accessibility**: Level cards are buttons (good); ensure expanded detail is announced.
- **Interaction**: Expand/collapse of mastered levels is secondary; keep lightweight.
- **Dependency**: UI-only.

### Practice / Terminal (`view === "practice"`)
See Section 6 for deep audit. Summary: strongest screen; keep the three modes, focus mode, local simulation labelling, coach, reference, and assessment finish flow. Tighten mobile header and long-session readability.

### Scenarios
- **Primary task**: Choose or resume a mission that makes operational skill visible.
- **Primary action**: Start / Resume / Review result.
- **Keep**: Stats strip, filter tabs, selected detail panel with mission coach readout, skills tags, difficulty/time.
- **Change**: Ensure “Recommended” filter or default sort surfaces the next pedagogically useful scenario more clearly.
- **Add**: Clear link from completed scenario result → Growth evidence entry.
- **Remove**: None critical.
- **States**: not started, in progress, completed (present).
- **Responsive**: Two-column layout at ≥740 px works; list + detail stacking is correct.
- **A11y**: Cards are buttons; detail panel needs a heading hierarchy.
- **Dependency**: UI-only (content of scenarios is illustrative).

### Growth Record
- **Primary task**: Interpret evidence and choose the next practice/scenario action.
- **Primary action**: Open recommended / targeted practice.
- **Keep**: Three tabs, learning-loop strip (01 Read → 02 Practice → 03 Apply), latest evidence notice, strengths / needs-attention panels, skill detail drawer.
- **Change**: Avoid `display: none` for secondary tabs if possible; use visibility or true tab panels so screen-reader context is clearer. Strengthen the “what recurs / what next” report language already present.
- **Add**: Persistent link from any evidence row to the corresponding Terminal context.
- **States**: empty, review, completed (handled via StateNotice).
- **Responsive**: Growth score ring positioning on ≤739 px is already refined; report grid becomes single column (good).
- **Dependency**: UI-only; data remains local mock.

### Progress Tracking
- **Primary task**: Read trend signal and decide whether to reassess or practice.
- **Primary action**: “Open targeted practice” / “Run another assessment”.
- **Keep**: KPI strip, metric switcher (overall/accuracy/sequencing), bar chart with data-table alternative, session log, next-readout card.
- **Change**: Ensure the data table is always available and keyboard-reachable; consider a text summary of the trend for screen readers.
- **Add**: Explicit “evidence consistency” definition tooltip or footnote.
- **States**: empty (StateNotice present).
- **Responsive**: Chart and KPIs reflow acceptably.
- **Dependency**: UI-only.

### Shared shell (Topbar, SideNav, BottomNav, ErrorBoundary)
- Keep Train as the elevated mobile centre control.
- Topbar context eyebrow truncation at ≤480 px is intentional and correct.
- Mobile drawer is functional.
- ErrorBoundary exists; ensure it surfaces a calm, professional recovery message consistent with the console language.

## 6. Terminal Deep Audit

**Does the Terminal feel like the primary workstation?**  
Yes. Darker surface (`#040a14`), cyan border accent, monospace body, sticky input, focus mode that hides coach and expands the panel, and explicit session/command/log readouts all reinforce operational primacy. It is not “one card among many”.

**Session state within seconds**  
Present: `SESSION / READY | COMMAND / SUCCESS|ERROR | LOG 01`. Footnote also restates state and hint policy. On narrow mobile the session readout is hidden or stacked (CSS at ≤360 px improves this). Improvement: keep a one-line persistent status that never disappears on mobile.

**Command input affordance**  
Clear `>` prompt, placeholder, Execute button, Arrow Up/Down history, `inputMode="text"`, 16 px font on mobile (good for iOS zoom avoidance). Focus-within ring exists in late CSS. Sticky bottom input on mobile is correct.

**Output / history / feedback relationship**  
History entries are structured (CMD nn | command | response) with left border and colour for success/error. Coach mirrors the latest entry. Reference drawer is contextual and limited in Assessment. Clear separation of concerns.

**Success / error / warning states**  
Colour is primary (green / red). Error kinds (syntax / sequence / decision / hint-dependency) exist in data and are shown in the AssessmentReport key, but not yet on every history line with icon or text prefix. Recommendation: add non-colour markers (icon or short label) on history entries and coach.

**Long-session comfort**  
`max-height` + overflow on terminal-body, sticky input, focus mode that maximises vertical space, and reduced-motion support are good. Line-height 1.9 / 2.0 is comfortable. Consider a subtle “scroll to latest” control after many entries and ensure the active prompt line remains visible without excessive gap.

**Mobile order**  
Source orders Terminal above Coach; sticky input and safe-area padding are present. Header crowding at ≤390 px is the main remaining issue (title + controls + readout). Late CSS already stacks at ≤360 px — extend the same discipline to 390–430 px.

**Engine / data dependency**  
All command responses, scoring, and coach text are local illustrative. Any UI recommendation must not alter the mock command matching, assessment scoring formula, or localStorage shape. Reference and coach content are UI/content, not engine.

**Additional Terminal findings**
- Assessment “FINISH SESSION” is correctly disabled until history exists and writes a ProgressRecord.
- Focus mode correctly hides task strip, mode tabs, and coach.
- Caret blink respects reduced motion.
- Placeholder and aria-label are present; keep them.

## 7. Shared Design System Audit

**Tokens present**  
Navy scale, `--line` / `--line-strong`, text hierarchy, blue/cyan/green/amber/violet/red, panel surfaces, radius (16 / 11), shadows, fonts (Space Grotesk, Cairo, IBM Plex Mono), ease curve.

**Gaps**
- No formal semantic state tokens (e.g. `--state-success-bg`, `--state-error-border`) beyond colour variables.
- Button variants (primary / ghost / text-action) are consistent but lack disabled/loading visual tokens.
- Spacing scale is ad-hoc (mostly 8–14 px gaps); a 4/8-based scale would improve density control.
- Elevation is limited to two shadows; cards sometimes rely only on border.
- Icon size is mostly 14–19 px; document a small set.
- Arabic font is declared but not exercised (language switch is toast-only).

**Controls**  
Primary and ghost buttons, icon buttons, mode tabs, filter tabs, language switch, progress rings/bars are coherent. Inputs (Terminal) are custom and appropriate.

**Status language**  
Green/amber/red + mono labels. Need icon + text fallbacks for every critical state.

## 8. Responsive and Accessibility Audit

**Desktop ≥1100 px**  
Side nav + generous padding; Terminal two-column with sticky coach. Solid.

**Laptop / tablet 740–1099 px**  
Two-column Practice and Scenarios; bottom nav still present until 1100. Acceptable.

**430 / 390 / 360 / 320 px**  
- Bottom nav 5-column with Train elevated — good.
- Terminal header stacking rules exist for ≤360 px; 390–430 still risk title truncation and control crowding.
- Growth score ring absolute positioning is handled.
- Topbar eyebrow hides ≤480 px — correct.
- Touch targets: many list rows and filter tabs are <44 px high on the densest views — Medium severity.

**Accessibility (verified in source)**
- `focus-visible` outline (cyan) present.
- Some `aria-label`, `aria-live`, `role="img"`, `role="table"`, `aria-current`.
- Reduced-motion media queries disable animations and transitions.
- Gaps: incomplete heading hierarchy (multiple h1/h2 without clear outline per view), no skip link, chart lacks full text alternative beyond the collapsible table, language switch does not change `dir` or font, some icon-only buttons rely solely on aria-label.

**Manual validation still required**
- Real keyboard tab order through Terminal + coach + reference.
- Screen-reader announcement of assessment completion and history entries.
- Physical device touch targets and safe-area behaviour.
- Arabic rendering and RTL.

## 9. Priority Matrix

| ID | Priority | Severity | Impact | Effort | Dependency | Affected | Phase |
|----|----------|----------|--------|--------|------------|----------|-------|
| T-01 | P0 | High | Session orientation on mobile | M | UI-only | Practice Terminal header | P0 |
| T-02 | P0 | High | Non-colour error differentiation | M | UI-only | Terminal history + coach | P0 |
| A-01 | P0 | High | Touch targets & focus | M | UI-only | All dense lists / nav | P0 |
| N-01 | P1 | Medium | Next-action continuity | S | UI-only | Growth ↔ Practice handoff | P1 |
| T-03 | P1 | Medium | Long-session scroll comfort | S | UI-only | Terminal body | P1 |
| R-01 | P1 | Medium | 390–430 px Terminal header | S | UI-only | Practice CSS | P1 |
| D-01 | P1 | Medium | State token completeness | M | UI-only | index.css | P1 |
| G-01 | P2 | Medium | Growth tab disclosure | M | UI-only | Growth | P2 |
| C-01 | P2 | Low | Chart text alternative | S | UI-only | Tracking | P2 |
| T-04 | P2 | Low | Reference / coach density on mobile | S | UI-only | Practice | P2 |
| S-01 | P3 | Low | Decorative motif de-emphasis | S | UI-only | Progression | P3 |
| L-01 | P3 | Observation | Real AR / RTL | L | Content + Architecture | Topbar | Deferred |

## 10. Target-State Design Revision Specification

**Overall**
Preserve the existing Flight Deck Console visual language, colour tokens, fonts, navigation structure, and all command/assessment logic. Refine hierarchy, state communication, Terminal mobile comfort, and accessibility only.

**Terminal (highest priority)**
- Persistent one-line session status visible at all widths (SESSION · COMMAND · LOG).
- History entries show short non-colour prefix (e.g. “OK”, “SEQ”, “SYN”, “DEC”) in addition to colour.
- On 320–430 px: header stacks title / readout / controls without overlap; input remains sticky with ≥16 px font and ≥44 px hit area.
- Focus mode remains full-bleed, coach hidden, input sticky.
- Long sessions: keep latest entry and active prompt in view; optional “Jump to latest” if history exceeds viewport.
- Assessment finish and scoring behaviour unchanged.

**Navigation & loop**
- Keep Train elevated in mobile bottom nav.
- Every evidence or recommendation card ends with an explicit primary action that sets Practice context and navigates to Practice.
- Growth tabs use true progressive disclosure (not pure `display:none` if it harms AT).

**States**
- Every SystemState and ErrorKind has a visual + text + (where critical) icon treatment.
- Empty / first-use / locked / review / completed use the existing StateNotice pattern consistently.

**Design system**
- Document and use semantic state colours, spacing scale (4/8), and button/input disabled/loading variants without changing visual identity.
- Ensure all interactive elements meet 44×44 px minimum on touch breakpoints or have adequate padding.

**Responsive**
- Explicit rules for 320, 360, 390, 430 px focused on Terminal header, Growth score, and bottom-nav labels.
- No horizontal scroll; no clipped primary CTAs.

**Accessibility**
- Logical heading outline per view.
- Visible focus retained.
- Chart always has the data-table alternative and a short text summary.
- Language switch remains non-functional for content until real i18n exists; do not fake RTL.

**Motion**
- Keep current purposeful animations; continue respecting `prefers-reduced-motion`.

## 11. Phased Implementation Plan

**P0 – Foundations & safety (must ship before any visual polish that risks behaviour)**
- Terminal mobile header stacking and persistent session readout (T-01, R-01).
- Non-colour state markers on Terminal history and coach (T-02).
- Touch-target and focus-visible audit on all primary controls (A-01).
- Confirm no change to command matching, scoring, localStorage shape, or assessment finish flow.

**P1 – Terminal & core UX hierarchy**
- Long-session comfort and jump-to-latest (T-03).
- Next-action continuity from Growth/Tracking/Scenarios into Practice (N-01).
- State token hardening in CSS (D-01).

**P2 – Shared system & remaining screens**
- Growth tab disclosure and report clarity (G-01).
- Chart text alternative (C-01).
- Mobile coach/reference density (T-04).
- Progression motif and secondary action cleanup (S-01).

**P3 – Polish & deferred**
- Real Arabic/RTL only after content and architecture decisions.
- Optional micro-copy tightening and decorative reduction.

**Sequencing constraint**  
P0 must be regression-tested against existing command entry, history navigation, assessment scoring, and focus-mode behaviour before P1 visual work proceeds.

## 12. Acceptance Criteria

**Terminal**
- Session state (SESSION / COMMAND / LOG) is readable within 2 seconds at 320–430 px without horizontal scroll.
- Every history entry communicates success vs error kind without relying solely on colour.
- Command input remains sticky, ≥16 px font, ≥44 px hit area, Arrow Up/Down history intact.
- Focus mode hides coach, maximises Terminal, and exits cleanly.
- Assessment finish still produces a ProgressRecord and writes to localStorage unchanged.
- “LOCAL TRAINING SIMULATION” labelling remains visible.

**Navigation & loop**
- Train remains the elevated centre control on mobile.
- From any Growth or Tracking recommendation the user can reach Practice with the correct context string in one primary action.

**States**
- Empty, locked, review, completed, error, success each have text + colour (+ icon where critical).

**Design system**
- No new colours outside the existing palette; semantic tokens map to existing values.
- Primary interactive elements meet touch-target minimums at ≤739 px.

**All screens**
- Visual identity (navy, blue accents, mono Terminal, card language) unchanged.
- No new routes, no new data models, no engine changes.

**Responsive**
- No horizontal overflow at 320, 360, 390, 430, 740, 1100, 1450 px.
- Terminal and Growth remain usable without zoom.

**Accessibility**
- Visible focus ring on all interactive elements.
- Chart has data-table alternative.
- Reduced-motion disables non-essential animation.
- Heading hierarchy is logical per view.

**Regression safety**
- Existing Amadeus-style command responses (AN/SS/FQD/FXP + syntax/sequence/decision), assessment scoring formula, hint counting, and localStorage key remain byte-for-byte equivalent in behaviour.
- Focus mode, reference open, coach toggle, and mode tabs continue to function exactly as today.

## 13. Deferred Dependencies and Open Questions

- **Engine / real Amadeus emulation**: out of scope; keep local illustrative layer.
- **Real trainee data, live airline data, backend progress**: UI must continue to treat all numbers as local/mock.
- **Full Arabic content + RTL layout**: requires content and architecture decisions; current language switch is illustrative only.
- **Official EgyptAir Basic/Advanced curriculum mapping into stage content**: content dependency; do not invent new stages or metrics.
- **Search / profile / backup functionality**: currently toast stubs; leave as stubs or wire only when product decides.
- **Whether Growth and Tracking should merge or stay separate**: product decision; UI can improve handoff without merging.

## 14. Final Verdict

**The prototype is ready for a focused revision pass, not a foundational redesign or architecture clarification.**

The visual language, product loop, Terminal-first posture, and professional aviation-training identity are already strong and aligned with the educational mission (EgyptAir Basic/Advanced → Saudi market readiness). The work required is disciplined UI/UX refinement — especially Terminal mobile orientation, non-colour state communication, touch/accessibility hardening, and next-action continuity — while strictly preserving the existing command behaviour, scoring, and local simulation boundary.

A later engineer can implement the P0 → P1 → P2 plan above without changing functional behaviour, provided every change is treated as UI-only and regression-tested against the current Terminal and assessment flows.