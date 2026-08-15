AeroBridge Comprehensive Professional Design/UX Audit
1. Executive Assessment
Current Product Level: High-fidelity functional prototype with a strong, cohesive visual identity and a clearly articulated learning loop. It successfully communicates the "Flight Deck Console" aesthetic and places the Terminal at the center of the experience. However, it remains a prototype with hardcoded mock states, non-functional shell features (search, language), mobile fragility below 390px, and accessibility gaps that would prevent deployment in a professional training environment.
Strongest Existing Qualities:
Terminal Focus Mode: The immersive focus mode (focus-mode) is the single strongest UX decision. It elevates the Terminal from a page component to a primary workstation, which aligns perfectly with the educational mission.
Visual Identity Cohesion: The deep navy surface language, Vector Blue accents, restrained gradients, and monospace readouts create an authentic aviation operations aesthetic that distinguishes AeroBridge from generic ed-tech or SaaS templates.
Learning Loop Articulation: The product loop (Progression → Practice → Assessment → Growth → Tracking → Scenarios → Next Action) is visible in the UI through explicit context handoffs (e.g., Tracking KPIs linking to Practice, Growth recommending specific skill practice).
State Language: The SystemState taxonomy ("ready", "in-progress", "review", "locked", etc.) is operationally appropriate and consistently applied in StateNotice and assessment flows.
Biggest Risks:
Mobile Terminal Usability: On viewports below 739px, critical session state readouts are intentionally hidden (display: none), the header stacks into an unreadable 8px font grid, and the coach panel is displaced below the fold. For trainees who may only have mobile access, this fractures the primary workstation experience.
Prototype Artifacts Eroding Trust: Hardcoded accuracy (86%), a session clock starting at 4:32, and a command input that silently defaults to "FQD" when empty create the risk that trainees will mistake mock behavior for engine behavior. In an aviation training context, precision is credibility.
Accessibility Compliance Gap: Missing focus traps, no skip links, color-only micro-states, and extremely small touch targets could prevent compliance with workplace accessibility standards required in the Saudi aviation training market.
Design System Drift: While tokens exist, their application is inconsistent (11px, 12px, 14px, 16px, 18px, 20px, 22px, 24px border-radius values coexist). This will compound maintenance cost when scaling to the full EgyptAir Basic/Advanced curriculum.
Gap to Intended State: Medium. The foundation is architecturally sound and visually distinctive. The gap is not conceptual; it is executional. A focused P0–P1 pass on Terminal mobile behavior, accessibility foundations, and design system consolidation will bring the prototype to a state where it can be safely mapped onto the real engine without UX debt.
2. Audit Method and Evidence
Files Inspected:
Home.tsx — Primary application shell, all 5 route views, Terminal component, assessment logic, navigation components.
App.tsx — Root component wrapper.
const.ts — Runtime login URL generation (auth boundary, minimal UI impact).
index.css — Complete styling system, responsive breakpoints, motion definitions, component skins.
Map.tsx — Google Maps integration component (unused in current prototype).
index.ts — Express server bootstrap (static file serving, no UI impact).
ideas.md — Design ground truth and mission constraints.
Methodology:
Static source code analysis of component hierarchy, state logic, prop drilling, event handlers, and JSX structure.
CSS cascade and responsive breakpoint inspection (320px–1450px range).
Accessibility heuristic evaluation against WCAG 2.1 AA criteria via source inspection (ARIA usage, heading hierarchy, focus management, color dependency, touch target sizing).
Functional safety review to identify where a UI change could bleed into command evaluation, scoring logic, or state ownership.
What Could Not Be Verified Without Runtime:
Exact color contrast ratios (requires a contrast checker tool on rendered output).
Screen reader announcement behavior for aria-live="polite" regions and animated number updates.
Physical touch target feasibility on 320px–430px devices.
Animation frame performance under load.
body:has(.focus-mode) behavior in older Firefox versions.
Source/Screenshot Conflicts: None identified. The source matches the described design ground truth in ideas.md.
3. Current Product and Information Architecture
Existing Product Loop:
plain
Progression (Route Map)
    ↓ [Resume workflow]
Practice / Terminal (Learn → Practice → Assessment)
    ↓ [Finish Session]
Assessment Report
    ↓ [Save to localStorage]
Growth Record + Progress Tracking
    ↓ [Recommended next action]
Scenarios (Apply under pressure)
    ↓ [Start / Resume]
Back to Practice (with scenario context)
Strengths:
Context Handoffs Are Explicit: The setPracticeContext prop is drilled through Progression, Scenarios, Growth, and ProgressTracking, allowing any screen to launch Practice with a specific context string. This makes the loop feel connected rather than siloed.
Evidence Persistence: localStorage stores progress records, so Tracking and Growth have data to visualize across sessions.
Terminal as Hub: Scenarios, Growth, and Tracking all route into Practice rather than duplicating command interfaces. This reinforces Terminal centrality.
Weaknesses:
No Persistent "Next Action" Surface: The "Next Action" concept exists only as copy inside panels (e.g., "Open targeted practice"). There is no persistent, glanceable widget (e.g., a sticky footer chip or sidebar mini-card) that tells the trainee what to do next when they land on any screen.
Scenarios → Assessment Gap: Scenarios route to Practice, but there is no scenario-specific assessment mode. The Assessment mode in Practice uses the generic AN/SS/FQD/FXP sequence regardless of scenario context. This weakens the "apply under pressure" promise.
Progression Service Track is Hollow: The track state toggles between "technical" and "service", but only the description paragraph changes. The level grid, milestones, and route overview remain identical. For the EgyptAir curriculum, this is a significant content gap.
Search and Language Are Dead Ends: The Topbar search opens a popover with static text. The language switch toggles a toast but does not change layout direction or content. These create false affordances.
4. Overall Scorecard
Table
Dimension	Score	Rationale
Visual Design	7/10	Strong, distinctive Flight Deck Console identity. Deductions for inconsistent card radius/shadow proliferation and decorative clip-path noise in Tracking KPIs.
UX	7/10	Clear loop, good context handoffs, strong Terminal focus. Deductions for missing empty states, non-functional shell features, and lack of persistent next-action surfacing.
UI	7/10	Components are well-constructed with hover/focus states. Deductions for crowded mobile terminal controls, marginal touch targets, and hardcoded mock values.
Design System	6/10	Tokens exist but are applied inconsistently. Radius, spacing, and shadow values proliferate. Needs consolidation into a stricter, fewer-token system.
Typography	6/10	Excellent font choices. Deductions for operational readouts dropping to 7–9px on mobile (below comfortable reading size) and lack of systematic type scale.
Color	7/10	Excellent identity and operational semantics. Deductions for --text-faint contrast risk and decorative gradient noise on premium readout cards.
Information Hierarchy	7/10	Eyebrow labels and progress rings establish context well. Deductions for Growth tab switching hiding primary context, and Scenario detail density.
Terminal UX	7/10	Focus mode is excellent. Desktop terminal is calm and readable. Deductions for mobile session-state hiding, fragile header stacking, and displaced coach.
Navigation	7/10	Desktop sidebar is excellent. Mobile bottom nav accommodates 5 items. Deductions for missing back/breadcrumb flow, no focus trap in drawer, and weak active state prominence.
Responsive	6/10	Breakpoints are logical. Deductions for fragile layouts at 320–390px, terminal header stacking issues, and focus mode padding not accounting for intermediate sizes.
Mobile	6/10	Bottom nav is functional. Deductions for extremely small fonts, hidden session state, coach below the fold, and marginal touch targets.
Accessibility	5/10	Some ARIA, reduced motion respected globally, focus states exist. Deductions for missing skip links, no focus traps, color-only micro-states, and inadequate screen-reader support for dynamic terminal output.
Motion	7/10	Animations are purposeful and communicate hierarchy. prefers-reduced-motion is handled globally via CSS and in hooks. Deductions for decorative bar sweeps and KPI clip-paths that add noise.
Consistency	7/10	Strong cross-screen identity. Deductions for card treatment variance, button height inconsistency, and some screens using custom gradients outside the shared panel-surface language.
Professional Maturity	7/10	Feels operational and authentic. Deductions for prototype artifacts (hardcoded stats, default "FQD" command, non-functional search/language) that undermine trust in a precision-oriented domain.
Functional Safety	8/10	Clean separation between UI and command logic is mostly maintained. Deductions for UI state (mock accuracy, session time) bleeding into perceived functional truth.
5. Screen-by-Screen Audit
Shared Shell (Topbar, SideNav, BottomNav, Mobile Drawer)
Primary User Task: Orient within the learning loop and access global controls.
Primary Action: Route switching, language toggle, search, profile access.
What to Keep:
Desktop sidebar persistent navigation with active state indicator (blue left border + chevron).
Topbar eyebrow + title context pattern.
BottomNav 5-item grid with safe-area padding.
BrandMark and Logo lockup identity.
What to Change:
Mobile Drawer: Add backdrop click-to-close, exit animation, and focus trap. Currently only closes via X button or nav selection.
Search Popover: Convert from static message to functional quick-find, or replace with a disabled-state button until the feature is implemented. A non-functional search icon in a professional tool creates confusion.
Language Switch: Disable or remove until RTL/Arabic layout is implemented. A toggle that only shows a toast is a false affordance.
What to Add:
Skip-to-main-content link (visually hidden, focusable).
Focus trap and Escape-key handling for search popover, mobile drawer, and reference drawer.
Backdrop overlay for mobile drawer.
What to Remove or De-emphasize:
Decorative radial gradients in Topbar background (subtle, but add render cost without operational value).
Required States:
Loading: Not currently implemented for route transitions.
Error: No global error boundary surface.
Empty: N/A for shell.
Responsive Issues:
At 360px, Topbar actions compress to 33px buttons. Acceptable but tight.
At 320px, profile name is already hidden; only avatar remains. Good.
Bottom nav at 360px uses 7px font labels. Very small but functional.
Accessibility Issues:
No skip link.
Mobile drawer lacks focus trap and aria-modal.
Search popover lacks role="dialog" and focus management.
Language switch is a <button> but performs no actionable change.
Dependency Classification: UI-only.
Progression (Home / Route Map)
Primary User Task: Understand current position in the curriculum and select the next workflow.
Primary Action: Resume current level, switch track, browse milestones.
What to Keep:
Hero route card with resume CTA. The hero-route gradient + route motif is visually distinctive and operationally clear.
Milestone list with mastered/current/locked states.
Track tabs (Technical / Service) as a clear curriculum switcher.
What to Change:
Service Track Content: The track state only changes the description paragraph. The level-grid and milestone-list should eventually render service-track-specific milestones. For now, add an explicit "Service track content in preparation" empty state rather than showing technical milestones under both tabs.
What to Add:
Explicit empty/locked state messaging for levels 05–06 ("Complete Pricing & Ticketing to unlock..."). The toast on click is ephemeral; a persistent inline message is better.
A "Next Action" strip below the hero card: "Your next move: Resume Pricing & Ticketing →" to reinforce the loop.
What to Remove or De-emphasize:
The route-motif decorative nodes (.route-node--one, etc.) are purely atmospheric. Keep them—they add identity without harming usability.

 **Required States:**
- Loading: Not present.
- Empty: Service track needs an explicit empty state.
- Locked: Present but only via toast; should have inline messaging.

**Responsive Issues:**
- At 739px and below, the `progression-layout` stacks to single column. The hero route card remains usable but the `hero-route h2` drops to `clamp(25px, 7vw, 39px)`, which at 390px is approximately 27px. Acceptable.
- `level-grid` switches to 2 columns at 740px and 3 columns at 1100px. Good.

**Accessibility Issues:**
- Milestone buttons lack `aria-pressed` or `aria-expanded` for the `expandedLevel` toggle behavior.
- The `level-card` buttons use `onClick` handlers that conditionally navigate or show toasts. Keyboard activation is supported natively by `<button>`, which is correct.

**Dependency Classification:** UI-only (service track content is Content dependent, but the empty-state recommendation is UI-only).

---

### Practice / Terminal (Learn / Practice / Assessment)

**Primary User Task:** Execute Amadeus-style commands, receive feedback, and build operational fluency.

**Primary Action:** Enter commands, review output, use reference, read coach guidance, finish assessment.

**What to Keep:**
- Focus mode (`focus-mode`) is the strongest UX feature in the entire prototype. It removes chrome, maximizes terminal real estate, and makes the Terminal feel like a workstation. Preserve exactly.
- The three-mode tab system (Learn / Practice / Assessment) with distinct coach and hint behaviors.
- Command history with keyboard navigation (Arrow Up/Down).
- The `terminal-entry` grid layout (label, command, response) on desktop.
- The `reference-drawer` contextual help pattern.
- Assessment report with explicit error taxonomy (syntax, sequence, decision, hint-dependency).

**What to Change:**
- **Default Command Behavior:** `submitCommand` defaults empty input to `"FQD"` (`const nextCommand = command.trim().toUpperCase() || "FQD";`). This is a prototype artifact that will confuse trainees. In a professional training environment, an empty submission should return a validation message, not a silent default. **Evidence:** `Home.tsx`, line ~350.
- **Hardcoded Session Clock:** `useState(272)` initializes the timer at 4:32. This is acceptable for a prototype but must be documented as a UI-only mock that will be replaced by engine-driven session timing. **Evidence:** `Home.tsx`, line ~320.
- **Hardcoded Accuracy Footer:** `const accuracy = submitted ? liveAssessment.accuracy : 86;` displays 86% before any command is entered. This creates a false sense of state. The footer should show a placeholder ("—") or "Awaiting first command" until submission occurs. **Evidence:** `Home.tsx`, line ~325.
- **Mobile Terminal Header Stacking:** At 360px, `.terminal-head` uses `display: grid` with `grid-template-columns: minmax(0, 1fr) auto`, stacking `.terminal-title` and `.terminal-session-readout` in rows 1 and 2. The title drops to 8px font with `line-height: 1.35`, and the session readout drops to 7px. This is below comfortable reading size for operational text. **Evidence:** `index.css`, lines ~900–920.
- **Hidden Session Readout on Mobile:** `.terminal-session-readout { display: none; }` at `max-width: 739px`. This removes the SESSION / COMMAND / LOG readouts entirely on mobile. For a trainee using a tablet or phone, this strips away critical orientation. **Evidence:** `index.css`, line ~880.
- **Coach Panel Placement on Mobile:** The coach panel is rendered `order: 2` below the terminal on mobile (`max-width: 739px`). In a long session, the coach guidance is pushed below the fold. For Assessment mode, where hints are suppressed, this is less critical, but for Learn mode, it buries the primary instructional content.

**What to Add:**
- **Input Validation State:** A visible "Command required" or "Enter a valid command" message when submitting empty input, replacing the silent `"FQD"` default.
- **Persistent Session State Bar (Mobile):** A minimal sticky bar at the top of the terminal body (or above the input) showing SESSION / COMMAND / LOG state on mobile, since the header readout is hidden.
- **Command Autocomplete Suggestions:** A dropdown below the input suggesting valid commands (AN, SS, FQD, FXP) as the user types. This aids recall without opening the reference drawer. This is UI-only and does not change command evaluation logic.
- **Scroll-to-latest on New Entry:** When a new `terminal-entry` is added, the terminal body should auto-scroll to the bottom. Currently, `terminal-body` has `overflow: auto` but no explicit scroll-into-view behavior for new entries.
- **Assessment Mode Confirmation:** A confirmation step before "Finish Session" in Assessment mode to prevent accidental closure.

**What to Remove or De-emphasize:**
- The `terminal-gap` div (130px height) that creates artificial whitespace in the terminal body. Replace with flexbox `justify-content: flex-end` on the active line container to keep the prompt near the input without fixed whitespace.
- The decorative radial gradient in `.terminal-body` (`radial-gradient(80% 55% at 50% 0%, rgba(10, 64, 72, .18), transparent 80%)`). It adds render cost and subtle visual noise without operational value.

**Required States:**
- First-use: Not present. A first-use coach overlay or welcome state would help orient new trainees.
- Empty: Terminal shows "Ready. Illustrative local response layer loaded." Good.
- Loading: Not applicable for local simulation.
- In-progress: Present via `sessionState` and `commandState`.
- Success/Error: Present via `terminal-success` and `terminal-error` classes.
- Partial-success: Not explicitly styled; sequence errors show as errors.
- Retry: Present in Assessment report via "Retry assessment".
- Interrupted: Not implemented.
- Completed: Present via `sessionComplete` and Assessment report.
- Review: Present in Assessment report.
- Locked: N/A.
- Unavailable: N/A.

**Responsive Issues:**
- At 390px, `.terminal-title` is capped at `max-width: 136px`, causing aggressive wrapping of "AMADEUS TRAINING ENVIRONMENT / EMULATOR 1.4".
- At 360px, `.terminal-input button span { display: none; }` hides the "Execute" text, leaving only the icon. The button shrinks to 64px width. Touch target is acceptable (min-height: 38px), but the affordance is reduced.
- Focus mode at mobile uses `height: calc(100dvh - 148px)` for the terminal panel. On devices with dynamic toolbars (iOS Safari), this may cause the input to be obscured by the virtual keyboard. The `scroll-margin-bottom: 120px` on the input helps, but the panel height calculation does not account for keyboard height.

**Accessibility Issues:**
- Terminal output uses `aria-live="polite"` on `.terminal-history`, which is correct for screen reader announcement of new entries. However, the `terminal-entry` grid layout may not read logically in a screen reader (label, command, response are visually side-by-side but semantically flat).
- The blinking caret (`.terminal-caret`) has `animation: blink 1.1s steps(2,start) infinite`. This is not a violation, but it should respect `prefers-reduced-motion`. It currently does not have a reduced-motion override.
- The command input lacks an `aria-describedby` linking to the current coach guidance.
- Error states (`.terminal-error`) rely on color alone. They should be prefixed with "ERROR:" or use an icon/label to communicate state non-visually.

**Dependency Classification:** UI-only (with the caveat that session timing and accuracy will eventually be engine-driven, but the UI representation is independent).

### Scenarios

**Primary User Task:** Select a mission file, review its operational context, and launch into Practice.

**Primary Action:** Filter scenarios, select a card, read the detail panel, start/resume/review.

**What to Keep:**
- The card + detail panel split layout on desktop.
- Filter tabs (All / Not started / In progress / Completed).
- The `mission-next` and `mission-coach` contextual guidance blocks in the detail panel.
- Skill tags on cards and in detail.

**What to Change:**
- **Filter State Persistence:** The `started` state (tracking which scenarios have been launched) is local to the component and lost on refresh. This is acceptable for a prototype, but the UI should eventually sync with engine-driven progress. For now, add a visual indicator that "In progress" is locally tracked.
- **Detail Panel Animation:** The `mission-detail-in` animation (`translateX(10px)`) is subtle and appropriate. Keep it.

**What to Add:**
- **Empty State for Filters:** When a filter returns zero scenarios (e.g., "Completed" when none are completed), show an explicit empty state: "No completed scenarios yet. Start a mission to build your record."
- **Scenario Difficulty Indicator:** Currently "Easy / Medium / Advanced" is text-only. Add a visual indicator (e.g., 1–3 bars or dots) to make difficulty scannable at a glance.
- **Estimated Time vs. Actual Time:** The duration is static. When a scenario is in progress or completed, show actual elapsed time alongside the estimate.

**What to Remove or De-emphasize:**
- The `detail-visual` background image (`aerobridge-share-route-map_87f339e8.jpg`) and its decorative route line overlay. It adds atmosphere but no operational data. Keep it for identity, but ensure it never obscures the badge or text.

**Required States:**
- Empty: Missing for filtered lists.
- Loading: Not present.
- Locked: Not applicable (all scenarios appear accessible).
- Recommended: Present via `result: "Recommended"` on SC-026, but not visually distinguished from "Not started".

**Responsive Issues:**
- At 739px and below, `.scenario-layout` stacks to single column. The detail panel moves below the list. This is acceptable, but the detail panel should be collapsible or should auto-scroll into view when a card is selected, since it may be off-screen.
- `.scenario-stats` uses 2 columns on mobile. At 320px, the strong text (e.g., "Exchanges & Refunds") may truncate aggressively.

**Accessibility Issues:**
- Scenario cards are `<button>` elements with good keyboard support.
- The detail panel's primary action button changes text dynamically ("Start scenario", "Resume scenario", "Review result"). Ensure `aria-label` updates to match the visual text, or use the button text as the accessible name.

**Dependency Classification:** UI-only (scenario data and progress will eventually be engine-driven).

---

### Growth Record

**Primary User Task:** Review performance evidence, identify strengths and gaps, and navigate to targeted practice.

**Primary Action:** Switch tabs (Record / History / Reports), select a skill row, read evidence, launch practice.

**What to Keep:**
- The three-tab structure (Record / History / Reports).
- The `learning-loop-strip` visualization of Read Evidence → Practice Gap → Apply in Scenario.
- Skill rows with hover preview tooltips.
- The `evidence-panel` split (Strengths vs. Needs Attention).

**What to Change:**
- **Tab Switching Hides Primary Content:** When switching to "History" or "Reports", the `.growth-overview`, `.growth-grid`, and `.activity-section` are hidden via `.is-secondary-view { display: none !important; }`. This is a heavy-handed approach that removes the user's primary context. A better pattern is to keep the overview visible and replace only the lower content, or use a more graceful transition.
- **Skill Detail Panel Animation:** The `.skill-detail` panel appears when a skill is selected. It uses `animation: readout-panel-in 240ms`. Good. However, on mobile, it stacks vertically and the primary button becomes full-width. Acceptable.

**What to Add:**
- **Empty State for Skill Selection:** If no skill is selected, show a prompt: "Select a skill to view its evidence trace and recommended practice."
- **Progress Over Time Mini-Chart:** In the skill detail panel, show a sparkline or 3–4 recent data points for that skill's value over time. This is UI-only and can consume existing `records` data filtered by context.

**What to Remove or De-emphasize:**
- The `.is-secondary-view` class and its `display: none !important` pattern. Replace with conditional rendering or a softer opacity/height transition that preserves layout stability.

**Required States:**
- Empty: Present for no evidence via `StateNotice`.
- Loading: Not present.

**Responsive Issues:**
- At 739px, `.growth-overview` stacks to single column. The `growth-score` card becomes block-level with `padding: 18px 18px 70px` to reserve space for the absolute-positioned progress ring. This is a clever layout but fragile; if the ring size changes, the padding must be recalculated.
- `.activity-list` uses 3 columns at 1100px+ and single column below. Good.

**Accessibility Issues:**
- The `learning-loop-strip` uses color (green for complete, blue for active) but also uses icons (`Check`, `Terminal`, `Radar`). Good non-color communication.
- Skill row buttons have hover tooltips (`.skill-hover-preview`) that are hidden on mobile (`display: none`). This is acceptable since mobile relies on tap-to-select instead of hover.

**Dependency Classification:** UI-only.

---

### Progress Tracking

**Primary User Task:** Monitor performance trends over time and identify the next training move.

**Primary Action:** Switch metrics (overall / accuracy / sequencing), read chart, review history, launch practice.

**What to Keep:**
- The KPI hero card (`.tracking-kpi--primary`) with its premium readout styling.
- The animated bar chart with gradient bars and capsule tops.
- The data table alternative inside `<details>` for accessibility.
- The `tracking-next` sidebar recommendation panel.
- The route line visualization (`.tracking-route-line`).

**What to Change:**
- **KPI Decorative Noise:** The `.tracking-kpi:nth-child(2)::before`, `:nth-child(3)::before`, and `:nth-child(4)::before` use complex `clip-path` polygons with multiple gradients to create "route map" decorations. These are visually heavy, add CSS maintenance burden, and do not communicate additional information. Simplify to subtle gradient backgrounds or remove the clip-paths entirely.
- **Chart Animation on Every Render:** The `tracking-bar-rise` animation runs on every render because it is tied to CSS animation, not state. If the user switches metrics rapidly, bars re-animate from zero. This is distracting. Add a `animation-play-state` control or use transition-based height changes instead of keyframe animations for metric switching.
- **Metric Switcher Placement:** The `.metric-switcher` is inside `.tracking-panel-head`, which at 739px stacks vertically. The buttons are small (9px font, 7px padding) and tightly packed.

**What to Add:**
- **Empty Chart State:** When `records.length === 0`, the chart section should be entirely replaced by the empty state notice, not just the KPIs. Currently, the chart shell renders with zero bars, which looks broken.
- **Trend Line Overlay:** Add an SVG trend line connecting the tops of the bars to visualize trajectory more clearly than the delta readout alone.

**What to Remove or De-emphasize:**
- The `::after` pseudo-element circles on KPI cards (`.tracking-kpi::after`). They are decorative and add visual clutter without operational meaning.

**Required States:**
- Empty: Present but only for the hero section. The chart lacks an explicit empty state.
- Loading: Not present.
- Error: Not present.

**Responsive Issues:**
- At 739px, `.tracking-kpis` switches to 2 columns with the primary card spanning full width. The `::before` clip-path decorations are reduced to `opacity: .72`, but they still add visual weight.
- `.tracking-chart-shell` uses `min-height: 270px` on desktop and `230px` on mobile. The chart grid lines (`chart-gridlines`) are absolutely positioned and may misalign with bar tops if the container height changes dynamically.
- `.tracking-lower-grid` stacks to single column on mobile. Good.

**Accessibility Issues:**
- The chart relies on color (blue bars, green latest) but has the data table alternative. Good.
- The `tracking-bar` has no `role` or `aria-label`. Add `role="img"` and `aria-label="Session 1, 78% overall"` to each bar.
- The `chart-gridlines` are decorative and correctly use `pointer-events: none`.

**Dependency Classification:** UI-only.
## 6. Terminal Deep Audit

This section provides concentrated analysis of the Terminal/Practice experience, which is the heart of the product.

### Layout and Hierarchy

**Current Structure:**
```
page-practice
├── page-intro (eyebrow, title, status, focus toggle)
├── practice-layout
│   ├── practice-main
│   │   ├── task-strip (context + progress)
│   │   ├── mode-tabs (Learn / Practice / Assessment)
│   │   ├── terminal-panel
│   │   │   ├── terminal-head (title, readout, controls)
│   │   │   ├── terminal-body (history + active line)
│   │   │   ├── terminal-input (form + input + execute)
│   │   │   ├── terminal-footnote (metadata + finish button)
│   │   │   └── reference-drawer (conditional)
│   │   └── assessment-report (conditional)
│   └── coach-panel (conditional, sticky on desktop)
└── practice-footer (accuracy, session time, commands mastered)
```

**Assessment:** The hierarchy is correct. The terminal panel is the dominant element. The coach panel is secondary and sticky on desktop, which is appropriate.

**Issues:**
1. **Practice Footer on Mobile:** At `max-width: 739px`, `.focus-mode .practice-footer { display: none; }`. In normal mode on mobile, the footer remains visible but uses `flex-wrap` with 20px gaps. At 360px, this wraps to 2 lines and consumes significant vertical space. Consider collapsing the footer into a single-line status bar on mobile.
2. **Task Strip in Focus Mode:** `.focus-mode .task-strip { display: none; }`. This is correct—focus mode should strip non-essential chrome. However, the task context is lost. The `terminal-head` should display the scenario context in focus mode to compensate.

### Session Orientation

**Current State Communication:**
- `terminal-session-readout` shows SESSION / COMMAND / LOG on desktop.
- `terminal-footnote` shows LOCAL TRAINING SIMULATION, STATE, and hint availability.
- `practice-status` in the page intro shows a green dot + "Local session" + clock.

**Issues:**
1. **Mobile Session Readout Missing:** As noted in Section 5, `.terminal-session-readout { display: none; }` on mobile removes all three status indicators. A trainee on a tablet cannot see whether the session is READY, ERROR, or COMPLETED without scrolling to the footnote.
2. **Command State Ambiguity:** `commandState` is derived from the latest entry: `latestEntry ? (latestEntry.ok ? "SUCCESS" : "ERROR") : "READY"`. This means after one error, the header shows "ERROR" even if subsequent commands succeed. It should reflect the state of the *latest* command, not a persistent error state. Actually, looking at the code, it *does* reflect the latest command. But the header still shows "ERROR" after a syntax error until a new command is entered. This is correct behavior, but the visual weight of "ERROR" in the header is high. Consider demoting it to the footnote and keeping the header focused on session mode.

### Command Input

**Current Behavior:**
- Input is a standard `<input>` inside a `<form>`.
- Placeholder: "Enter command..."
- Auto-complete is off.
- Keyboard history via Arrow Up/Down.
- Execute button with text + icon.

**Issues:**
1. **Silent Default Command:** `command.trim().toUpperCase() || "FQD"` is the most dangerous prototype artifact in the entire application. It trains the user that pressing Enter without input is a valid operation that executes FQD. In a real GDS, this would be a no-op or error. **Severity: High. Priority: P0.**
2. **No Input Validation Visual Feedback:** If the user types an invalid command (not in `AN`, `SS`, `FQD`, `FXP`), the response is "SYNTAX ERROR". This is correct. But there is no pre-submission validation (e.g., red border on input) to catch format errors before execution.
3. **Input Font Size on Mobile:** `font-size: 16px` is used to prevent iOS zoom. Good. But at 360px, the input is cramped next to the execute button.
4. **Caret Animation:** The `.terminal-caret` blinks with CSS animation. It does not respect `prefers-reduced-motion`. Add `@media (prefers-reduced-motion: reduce) { .terminal-caret { animation: none; opacity: 1; } }`.

### Output and History

**Current Behavior:**
- Output is rendered as a flat list of `.terminal-entry` divs.
- Each entry has a label (CMD 01), the command string, and the response string.
- Newest entries append to the bottom.
- `aria-live="polite"` on `.terminal-history`.

**Issues:**
1. **No Auto-Scroll:** There is no `useEffect` or `ref` scrolling the terminal body to the bottom when `commandHistory` changes. The trainee must manually scroll to see the latest result. In a long session, this is friction.
2. **History Label Semantics:** `CMD 01`, `CMD 02` are visually clear but semantically anonymous. Screen readers will announce "CMD 01 AN availability returned 7 options" as a single block because the grid layout flattens the structure. Wrap each entry in a `<dl>` or add `aria-label` to the container: `aria-label="Command 1: AN. Result: Availability returned 7 options"`.
3. **Error Recovery:** When a syntax error occurs, the coach panel updates with guidance. However, the terminal body shows the error in red and stops. There is no "Did you mean?" or suggestion inline. The reference drawer must be manually opened.

### Suggestions and Reference

**Current Behavior:**
- Reference drawer toggles via button.
- In Assessment mode, reference is "intentionally limited".
- In Learn/Practice, it shows four example buttons that populate the input.

**Issues:**
1. **Reference Drawer Animation:** It uses `animation: terminal-entry-in 180ms`. Good.
2. **Hint Count Increment:** `setHintCount((count) => count + 1)` fires when the reference is opened. This is a UI state change that affects assessment scoring. The logic is correct, but the visual feedback is subtle. Add a toast or inline indicator: "Reference opened. Hint recorded."

### Coach Panel

**Current Behavior:**
- Collapsible via X/Sparkles button.
- Shows contextual title, body, and next action based on latest entry.
- Sticky positioning on desktop (`top: 93px`).

**Issues:**
1. **Mobile Displacement:** On mobile, the coach panel is rendered below the terminal. In a long session with many commands, the coach is far below the fold. A trainee in Learn mode must scroll down after every command to read guidance. **Recommendation:** On mobile, convert the coach to a bottom sheet or floating action button that expands into an overlay, keeping it within one tap of the terminal.
2. **Coach Content Density:** The `.coach-callout` uses a flex layout with an icon, title, and paragraph. The paragraph is 11px with 1.6 line-height. On mobile, this is readable but dense. Increase to 12px minimum for body text in instructional panels.

### Assessment Closure

**Current Behavior:**
- "Finish Session" button appears in Assessment mode.
- On click, it calculates `assessmentScore`, creates a `ProgressRecord`, saves to `localStorage`, and shows `AssessmentReport`.
- Report shows verdict, accuracy, sequencing, hint discipline, and next training move.

**Issues:**
1. **No Confirmation Step:** A single click finishes the session. Add a confirmation dialog or require two clicks for sessions with >0 commands.
2. **Report Animation:** `animation: terminal-entry-in 220ms` is applied to the report. Good.
3. **Error Taxonomy Icons:** The `.assessment-error-key` uses colored dots. These need `title` attributes or text labels for screen readers.

### Focus Mode

**Current Behavior:**
- Toggles via fullscreen icon in terminal controls.
- Adds `focus-mode` class to `.page-practice`.
- Hides coach, task strip, mode tabs, and bottom nav.
- Terminal panel expands to fill viewport.

**Issues:**
1. **Focus Trap Missing:** Focus mode does not trap focus. A keyboard user can Tab out of the terminal and into the browser chrome or hidden page elements. Add a focus trap that cycles focus within the terminal panel.
2. **Exit Mechanism:** Focus mode can be exited via the "Exit focus" button or the inline ghost button. Good. But there is no Escape-key handler.
3. **Mobile Focus Mode Padding:** `.focus-mode { padding: 10px 9px calc(14px + env(safe-area-inset-bottom)); }` at 360px is tight. The terminal head touches the screen edges. Increase to `14px 14px`.

### Long-Session Usability

**Issues:**
1. **No Session Pause:** The timer runs continuously. There is no pause/resume mechanism. For a 25-minute scenario, this is acceptable, but for open-ended practice, a pause would reduce anxiety.
2. **No Command Count Limit Warning:** The assessment score divides by `entries.length`. There is no maximum command limit, but the UI does not warn if the trainee exceeds a reasonable number of attempts.
3. **Terminal Body Max-Height:** `.terminal-body { max-height: 520px; }` on desktop. In focus mode, this is overridden to `max-height: none`. Good. But in normal desktop mode, 520px may feel cramped on a 1440p monitor. Consider `max-height: 70vh` instead of a fixed pixel value.

### Mobile Command Entry

**Issues:**
1. **Virtual Keyboard Obscuring Input:** At 390px and below, `.terminal-input` is sticky at the bottom. When the virtual keyboard opens, the viewport shrinks and the input may be pushed up. The `scroll-margin-bottom: 120px` on the input helps, but the terminal body may not scroll to keep the active line visible.
2. **Execute Button Icon-Only:** At 360px, the execute button shows only an icon (text hidden). The icon is `ArrowUpRight` (size 13). This is small and may be hard to tap accurately. Increase touch target to 44×44px minimum.

---

## 7. Shared Design System Audit

### Tokens

**Current State:**
CSS custom properties are defined in `:root` but are inconsistently applied. For example:
- Border radius: `--radius: 16px` and `--radius-sm: 11px` exist, but components use `border-radius: 12px`, `14px`, `10px`, `9px`, `8px`, `7px`, `6px`, `5px`, `99px`, and `999px` directly.
- Shadows: `--shadow` and `--shadow-blue` exist, but many components use inline `box-shadow` values.
- Colors: The `--ab-*` tokens (AeroBridge Elevation Directive) are defined but only partially applied in the `.page-practice` scope. The rest of the app uses the older `--navy-*` and semantic tokens.

**Recommendation:** Consolidate to a strict token set:
- 3 border-radius tokens: `--radius-sm: 8px`, `--radius: 12px`, `--radius-lg: 16px`, `--radius-pill: 999px`.
- 3 shadow tokens: `--shadow-raised`, `--shadow-floating`, `--shadow-glow`.
- 4 surface tokens: `--surface-base`, `--surface-elevated`, `--surface-overlay`, `--surface-terminal`.
- 2 border tokens: `--border-subtle`, `--border-strong`.

### Typography

**Current State:**
- Display font: `Space Grotesk` (excellent choice for the aviation domain).
- Arabic font: `Cairo` (defined but never applied; no RTL layout exists yet).
- Mono font: `IBM Plex Mono` (excellent for command readouts).
- Font sizes range from 7px to 50px with no systematic scale.

**Recommendation:** Establish a type scale:
- **Operational (Mono):** 9px labels, 10px readouts, 11px body, 12px commands.
- **Interface (Display):** 10px captions, 11px buttons, 12px body, 14px subheadings, 17px headings, 20px hero, 28px display.
- **Minimum readable size:** 11px for interface text, 10px for mono labels. Never go below 10px on mobile.

### Surfaces and Cards

**Current State:**
- `.panel-surface` is the primary card abstraction.
- However, `.hero-route`, `.growth-score`, `.tracking-kpi--primary`, and `.scenario-detail` all use custom gradients and backgrounds that bypass `.panel-surface`.

**Recommendation:** Create surface variants:
- `.panel-surface--hero`: For the primary CTA card (replaces custom hero-route background).
- `.panel-surface--readout`: For KPI and score cards (replaces custom tracking-kpi backgrounds).
- `.panel-surface--terminal`: For the terminal panel (already partially exists).

### Buttons

**Current State:**
- `.primary-button`, `.ghost-button`, `.text-action`, `.icon-button`, `.loop-action`, `.terminal-help`, `.terminal-finish`.
- Heights vary: 34px, 38px, 42px, 45px, 49px, 52px.

**Recommendation:** Consolidate to 3 button sizes:
- **Small:** 32px height (icon buttons, compact actions).
- **Medium:** 40px height (standard buttons, nav items).
- **Large:** 48px height (primary CTAs, terminal execute).

### Status States

**Current State:**
The `SystemState` type covers 13 states, but only a subset have explicit visual treatments:
- `empty`: `.state-notice--empty` (amber left border).
- `error`: `.state-notice--error` (red left border).
- `review`: `.state-notice` default (blue left border).
- `locked`: `.level-card--locked` (opacity 0.56).
- `mastered`: `.milestone.is-done` (green).

**Missing Treatments:**
- `loading`: No spinner or skeleton pattern.
- `first-use`: No onboarding overlay.
- `interrupted`: No specific styling beyond amber border.
- `partial-success`: No distinct treatment from `success`.

**Recommendation:** Create a `.state-skeleton` and `.state-spinner` pattern. Add a `.state-notice--interrupted` with an appropriate icon (e.g., `AlertTriangle`).

### Spacing

**Current State:**
Spacing is largely ad-hoc: 3px, 4px, 5px, 6px, 7px, 8px, 9px, 10px, 11px, 12px, 13px, 14px, 15px, 16px, 17px, 18px, 19px, 20px, 21px, 22px, 24px, 25px, 28px, 29px, 30px, 32px, etc.

**Recommendation:** Consolidate to a 4px base grid:
- 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px.
- Replace all ad-hoc values with the nearest token.

### Motion

**Current State:**
- Global `prefers-reduced-motion` override exists and nullifies transitions/animations.
- Component-specific animations: `blink`, `drawer-in`, `console-tab-enter`, `terminal-entry-in`, `tracking-bar-rise`, `tracking-signal-sweep`, `metric-confirm`, `readout-panel-in`, `mission-detail-in`, `route-content-in`.
- Timing functions: `--ease: cubic-bezier(.23, 1, .32, 1)` is used consistently.

**Issues:**
1. **Decorative Motion:** `tracking-signal-sweep` (a white bar sweeping across the latest chart bar) is purely decorative and may be distracting during data analysis.
2. **Animation Duration Proliferation:** Durations range from 160ms to 900ms. Consolidate to:
   - Micro (hover, focus): 150ms
   - Standard (panel, tab): 220ms
   - Emphasis (ring, bar): 760–900ms

**Recommendation:** Remove `tracking-signal-sweep`. Keep all other animations; they serve hierarchy and feedback purposes.

## 8. Responsive and Accessibility Audit

### Desktop (≥1100px)

**Verified Issues:**
- Sidebar navigation is persistent and usable.
- Terminal body min-height is 450px. Comfortable.
- Coach panel is sticky and visible.

**Minor Issues:**
- `.hero-route h2` at 50px is large but acceptable. At 1100px exactly, the progress ring may overlap with text if the viewport is narrow (e.g., 1100px width with sidebar = ~860px content width). The `hero-route` uses `flex` with `gap: 17px`, which should prevent overlap.

### Laptop (740px–1099px)

**Verified Issues:**
- Sidebar hidden; bottom nav appears.
- `.page` padding reduces to `42px 28px 56px`.
- Terminal body min-height drops to 370px. Still acceptable.
- `.practice-layout` switches to single column. Coach panel moves below terminal. This is acceptable on a laptop if the screen is tall, but on a 768px-height laptop, the coach may be below the fold.

### Tablet (739px breakpoint)

**Verified Issues:**
- `.side-nav { display: none; }`.
- `.bottom-nav` appears.
- `.scenario-layout`, `.practice-layout`, `.progression-layout`, `.growth-overview`, `.growth-grid`, `.tracking-lower-grid` all stack to single column.
- `.terminal-session-readout { display: none; }`.
- `.scenario-stats` switches from 4 columns to 2 columns.

### 430px Width

**Verified Issues:**
- Topbar eyebrow is hidden at 480px and below. Good.
- `.page` padding is `28px 18px 94px`. The 94px bottom padding accounts for the bottom nav. Good.
- `.bottom-nav` uses 5 columns with 8px font labels. Readable.
- `.terminal-head` uses `display: grid` with title and controls. The title wraps to 2 lines at 8px font. Very small but functional.

### 390px Width

**Verified Issues:**
- `.page-practice .terminal-title { max-width: 136px; }`. This forces "AMADEUS TRAINING ENVIRONMENT" to wrap aggressively. The `/ EMULATOR 1.4` subtitle is forced to a new line.
- `.terminal-controls .terminal-help:first-child span { display: none; }`. The "Reference" text is hidden, leaving only the icon. The "Focus" text is also hidden.
- `.terminal-input button span { display: none; }`. Execute button is icon-only.
- `.tracking-kpis` is 2 columns. The primary card spans full width. The other three KPIs are in a 2×2 grid. Acceptable.

### 360px Width

**Verified Issues:**
- `.topbar { gap: 6px; padding-inline: 9px; }`.
- `.topbar-brand .brand-mark { width: 27px; height: 27px; }`.
- `.bottom-nav button span { font-size: 7px; }`. This is extremely small. At 360px with 5 items, each item has ~72px width. The label "Progress" (8 characters at 7px) is ~56px wide. It fits but is at the edge of legibility.
- `.terminal-head { min-height: 76px; }`. The stacked grid layout adds height.
- `.terminal-session-readout { display: none; }`. Still hidden.
- `.terminal-body { min-height: 300px; max-height: min(47vh, 360px); }`. The `max-height: min(47vh, 360px)` means on a tall phone, the terminal body is capped at 360px. On a short phone (e.g., iPhone SE at 667px height), 47vh is ~314px. This is tight but functional.

### 320px Width

**Verified Issues:**
- `.topbar-context strong { font-size: 12px; }`.
- `.language-switch span { padding-inline: 5px; }`.
- `.avatar { width: 28px; height: 28px; }`.
- `.bottom-nav { min-height: 66px; padding-inline: 3px; }`.
- `.bottom-nav button { font-size: 7px; }`.
- `.bottom-nav button svg { width: 17px; height: 17px; }`.
- `.scenario-card-copy strong { font-size: 11px; }` but the card is only 79px tall. At 320px, with 11px padding, the content area is very narrow.
- `.terminal-entry { grid-template-columns: 40px minmax(0, 1fr); }`. The command and response stack vertically. The `.terminal-error` and `.terminal-success` are in `grid-column: 2`. This creates a readable stack: label on left, command + response on right. Good adaptation.

**Accessibility Findings (All Viewports):**
- **Color Contrast (Assumption):** `--text-faint: #5d6a85` on `--navy-950: #050914` likely passes WCAG AA for large text but may fail for small text (7–9px labels). Verification needed with a contrast checker.
- **Touch Targets:** `.icon-button` is 38×38px (passes 44×44px? No, it is slightly below the recommended 44×44px). At 360px, `.icon-button` drops to 33×33px. **Fails WCAG 2.5.5 (Target Size).**
- **Keyboard Navigation:** The app uses native `<button>` elements, which are keyboard-focusable. However, there is no visible `:focus-visible` style on `.scenario-card`, `.level-card`, or `.tracking-row` that differs from hover. The global `button:focus-visible` rule applies, but custom interactive elements may need explicit focus rings.
- **Screen Reader:** `aria-live="polite"` is used on terminal history and assessment report. Good. But `aria-label` on the progress ring (`aria-label={`${value}% progress`}`) is good, while the animated number span uses `aria-label={`${prefix}${value}${suffix}`}`. Good.
- **Reduced Motion:** The global `@media (prefers-reduced-motion: reduce)` nullifies all transitions and animations. Good. The `useAnimatedNumber` hook also checks `prefers-reduced-motion`. Excellent.

---

## 9. Priority Matrix

| ID | Finding | Priority | Severity | Impact | Effort | Dependency | Affected Routes/Files | Phase |
|---|---|---|---|---|---|---|---|---|
| T01 | Terminal empty input defaults to "FQD" | P0 | Critical | High | Low | UI-only | Practice (`Home.tsx`) | P0 Safety |
| T02 | Hardcoded accuracy (86%) before submission | P0 | High | High | Low | UI-only | Practice (`Home.tsx`) | P0 Safety |
| T03 | Mobile terminal session readout hidden | P0 | High | High | Low | UI-only | Practice (`index.css`) | P0 Safety |
| T04 | Focus mode lacks focus trap | P0 | High | High | Low | UI-only | Practice (`Home.tsx`) | P0 Safety |
| T05 | No skip-to-main-content link | P0 | High | Medium | Low | UI-only | Shared shell (`Home.tsx`) | P0 Safety |
| T06 | Search and Language are non-functional | P0 | Medium | Medium | Low | UI-only | Topbar (`Home.tsx`) | P0 Safety |
| T07 | Mobile coach panel below fold | P1 | High | High | Medium | UI-only | Practice (`Home.tsx`, `index.css`) | P1 Terminal |
| T08 | Terminal input lacks auto-scroll to latest | P1 | High | Medium | Low | UI-only | Practice (`Home.tsx`) | P1 Terminal |
| T09 | Terminal caret ignores reduced motion | P1 | Medium | Low | Low | UI-only | Practice (`index.css`) | P1 Terminal |
| T10 | No input validation for empty command | P1 | High | Medium | Low | UI-only | Practice (`Home.tsx`) | P1 Terminal |
| T11 | Assessment lacks finish confirmation | P1 | Medium | Medium | Low | UI-only | Practice (`Home.tsx`) | P1 Terminal |
| T12 | Service track shows technical content | P1 | Medium | Medium | Low | Content | Progression (`Home.tsx`) | P1 Terminal |
| T13 | Design system token consolidation | P1 | Medium | High | Medium | UI-only | `index.css` | P2 System |
| T14 | Button size consolidation | P1 | Low | Medium | Low | UI-only | `index.css` | P2 System |
| T15 | Tracking KPI decorative clip-path noise | P1 | Low | Medium | Low | UI-only | Tracking (`index.css`) | P2 System |
| T16 | Chart animation re-triggers on metric switch | P1 | Medium | Medium | Low | UI-only | Tracking (`index.css`) | P2 System |
| T17 | Growth tab switch hides primary context | P1 | Medium | Medium | Medium | UI-only | Growth (`Home.tsx`, `index.css`) | P2 System |
| T18 | Missing empty states (scenarios filter, tracking chart) | P1 | Medium | Medium | Low | UI-only | Scenarios, Tracking (`Home.tsx`) | P2 System |
| T19 | Touch targets below 44px on mobile | P1 | Medium | Medium | Medium | UI-only | `index.css` | P2 System |
| T20 | Mobile drawer lacks focus trap | P1 | Medium | Medium | Low | UI-only | Shared shell (`Home.tsx`) | P2 System |
| T21 | Terminal body max-height fixed at 520px | P2 | Low | Low | Low | UI-only | Practice (`index.css`) | P2 System |
| T22 | Decorative gradient noise in terminal body | P2 | Low | Low | Low | UI-only | Practice (`index.css`) | P2 System |
| T23 | No command autocomplete suggestions | P2 | Low | Medium | Medium | UI-only | Practice (`Home.tsx`) | P3 Polish |
| T24 | Trend line overlay on tracking chart | P2 | Low | Low | Medium | UI-only | Tracking (`Home.tsx`) | P3 Polish |
| T25 | Session pause/resume | P3 | Low | Low | Medium | Engine | Practice (`Home.tsx`) | P3 Optional |
| T26 | Skill detail sparkline | P3 | Low | Low | Medium | UI-only | Growth (`Home.tsx`) | P3 Optional |

---

## 10. Target-State Design Revision Specification

This section describes the desired end state for the visual and UX layer without writing implementation code.

### Terminal Experience

**Session Orientation:**
- **Desktop:** Retain current three-part readout (SESSION / COMMAND / LOG) in the terminal header.
- **Mobile:** Replace the hidden header readout with a persistent 1-line status bar inside the terminal body, positioned above the history. It shows: `Session: READY | Command: SUCCESS | Log: 04`. Font: 9px mono. Color: `--text-faint`. Background: transparent. This bar is hidden in focus mode.

**Command Input:**
- Empty submission is rejected with a visible inline message below the input: "Enter a command to continue." The message uses `--amber` color and appears for 2 seconds before fading.
- The input border glows `--cyan` on focus (already present) and `--red` briefly (200ms) when an empty submission is attempted.
- Execute button is always labeled "Execute" on desktop. On mobile ≤390px, it shows an icon + "Go" text (not icon-only) to maintain minimum touch target and affordance.
- Input auto-scrolls the terminal body to bottom on every submission.

**Command History:**
- Each new entry triggers a smooth scroll of `.terminal-body` to `scrollHeight`.
- Error entries are prefixed with an icon (alert circle) in addition to red color.
- History items have `role="listitem"` and the container has `role="list"` with `aria-label="Command history"`.

**Coach Panel:**
- **Desktop:** Retain sticky right panel.
- **Mobile ≤739px:** Convert to a floating action button (FAB) in the bottom-right corner (above the bottom nav). Tapping it expands a bottom sheet overlay with the coach content. The FAB shows the `Sparkles` icon and a pulsing dot when new guidance is available. This keeps coaching one tap away without consuming vertical space.

**Focus Mode:**
- Focus trap cycles through: input → execute button → reference button → focus toggle → exit focus button.
- Escape key exits focus mode.
- The terminal header in focus mode shows the current task context (e.g., "Pricing & Ticketing") in the title area, since the task strip is hidden.

**Assessment Closure:**
- "Finish Session" requires a two-step confirmation: first click changes the button text to "Confirm finish", second click executes. The button turns `--amber` in the confirmation state.
- The assessment report remains as-is but adds `aria-labelledby` pointing to the report heading.

### Navigation and Shell

- **Skip Link:** A visually hidden `<a href="#main-content">Skip to main content</a>` is the first focusable element. The `<main>` wrapper has `id="main-content"`.
- **Search:** The search button is visually disabled (opacity 0.5, `cursor: not-allowed`) with a `title="Search coming soon"` tooltip. It is not clickable.
- **Language:** The language switch is visually disabled with `title="Arabic support coming soon"`. It is not clickable.
- **Mobile Drawer:** Adds a backdrop overlay (`rgba(0,0,0,0.6)`). Clicking the backdrop closes the drawer. Focus is trapped within the drawer. Escape closes the drawer. The drawer animates out (reverse of `drawer-in`) when closing.

### Progression

- **Service Track:** When "Customer Service" is selected, the `.track-section` displays an explicit empty state: "Customer Service track is in preparation. Continue with the Technical track to build your operational foundation." The level grid and milestones are hidden. The Technical tab remains clickable.
- **Next Action Strip:** Below the hero route card, a full-width strip shows: "Next: Resume Pricing & Ticketing →". It uses `.ghost-button` styling and links directly to Practice.

### Scenarios

- **Filter Empty State:** When a filter returns zero results, the `.scenario-list` is replaced with: "No [filter] scenarios found. Try another filter or view all scenarios." Centered, with an icon.
- **Difficulty Visual:** Each scenario card shows 1–3 small dots next to the difficulty text (Easy=1, Medium=2, Advanced=3). Color: `--text-faint`.

### Growth

- **Tab Context Preservation:** When switching to History or Reports, the `.growth-overview` (score ring + stats + next practice) remains visible at the top. Only the content below the tabs is replaced. The `.is-secondary-view` class is removed.

### Tracking

- **KPI Simplification:** Remove `clip-path` decorations from secondary KPIs. Replace with subtle gradient backgrounds using existing `--navy-*` tokens.
- **Chart Empty State:** When `records.length === 0`, the entire `.tracking-chart` is replaced by a centered empty state: "Complete an assessment to see your performance trend." with a CTA to Practice.
- **Metric Switch Animation:** Replace keyframe `tracking-bar-rise` with a CSS `transition: height 520ms var(--ease)` on `.tracking-bar`. This prevents re-animation on metric switch.

### Design System Consolidation

- **Radius Tokens:** All components use one of: 8px (buttons, tags), 12px (cards, panels), 16px (hero cards, modals), 999px (pills, badges).
- **Shadow Tokens:** All floating elements use one of: `var(--shadow-raised)` (cards), `var(--shadow-floating)` (drawers, modals), `var(--shadow-glow)` (terminal focus).
- **Button Sizes:** Small (32px), Medium (40px), Large (48px). Touch targets are never smaller than 44×44px.
- **Type Scale:** Minimum 10px for mono labels, 11px for interface body, 12px for coach body, 16px for input.

---

## 11. Phased Implementation Plan

### Phase P0: Foundations and Safety (Week 1)

**Goal:** Remove prototype artifacts that undermine trust and establish accessibility baseline.

1. **T01:** Remove silent `"FQD"` default in `submitCommand`. Add empty-input validation.
2. **T02:** Replace hardcoded `accuracy: 86` with `"—"` or "Awaiting first command" until `submitted === true`.
3. **T03:** Add mobile session status bar inside terminal body.
4. **T04:** Implement focus trap in focus mode (cycle within terminal panel).
5. **T05:** Add skip-to-main-content link.
6. **T06:** Disable search and language buttons with tooltips.

**Dependencies:** None. All UI-only.
**Regression Risk:** Low. Only affects visual presentation and input validation.

### Phase P1: Terminal and UX Hierarchy (Week 2)

**Goal:** Perfect the Terminal experience across all viewports.

1. **T07:** Implement mobile coach FAB + bottom sheet.
2. **T08:** Add auto-scroll to terminal body on new history entry.
3. **T09:** Add reduced-motion override for terminal caret.
4. **T10:** Add empty-input validation message.
5. **T11:** Add two-step finish confirmation.
6. **T12:** Add service track empty state.
7. **T19:** Increase mobile touch targets to 44×44px minimum.

**Dependencies:** P0 complete.
**Regression Risk:** Low to Medium. Coach FAB requires new component but does not affect command logic.

### Phase P2: Shared System and All Screens (Week 3)

**Goal:** Consolidate design system and polish all routes.

1. **T13:** Consolidate tokens (radius, shadow, spacing).
2. **T14:** Consolidate button sizes.
3. **T15:** Remove KPI clip-path decorations.
4. **T16:** Replace chart keyframe animation with transition.
5. **T17:** Refactor Growth tabs to preserve overview.
6. **T18:** Add empty states for scenario filters and tracking chart.
7. **T20:** Add mobile drawer focus trap and backdrop.
8. **T21:** Change terminal body max-height to `70vh`.
9. **T22:** Remove decorative terminal body gradient.

**Dependencies:** P1 complete.
**Regression Risk:** Medium. Token consolidation touches many components. Requires visual regression testing.

### Phase P3: Polish and Optional Enhancements (Week 4)

**Goal:** Add quality-of-life improvements that are not blockers.

1. **T23:** Command autocomplete dropdown.
2. **T24:** Trend line overlay on tracking chart.
3. **T25:** Session pause/resume (requires engine decision).
4. **T26:** Skill detail sparkline.

**Dependencies:** P2 complete. T25 requires engine boundary decision.
**Regression Risk:** Low.

---

## 12. Acceptance Criteria

### Terminal

- [ ] Submitting an empty command in the terminal input displays a validation message and does not execute any command.
- [ ] The accuracy metric in the practice footer shows "—" before the first command is submitted.
- [ ] On mobile (≤739px), a 1-line session status bar is visible inside the terminal body showing session state, latest command state, and log count.
- [ ] When a new command is submitted, the terminal body auto-scrolls to reveal the new entry.
- [ ] Focus mode traps keyboard focus within the terminal panel; Tab cycles through input, execute, reference, focus toggle, and exit focus.
- [ ] Pressing Escape in focus mode exits focus mode.
- [ ] The "Finish Session" button requires two clicks to confirm in Assessment mode.
- [ ] The blinking caret is static (no animation) when `prefers-reduced-motion: reduce` is active.
- [ ] Error entries in command history display an alert icon in addition to red text.

### Navigation

- [ ] A "Skip to main content" link is the first focusable element and is visible on focus.
- [ ] The search button is visually disabled and non-interactive.
- [ ] The language switch is visually disabled and non-interactive.
- [ ] The mobile drawer has a backdrop overlay; clicking the backdrop closes the drawer.
- [ ] The mobile drawer traps focus; Escape closes the drawer.
- [ ] All navigation items maintain their existing route behavior.
### States

- [ ] The Progression screen shows an explicit empty state when the Customer Service track is selected.
- [ ] The Scenarios screen shows an explicit empty state when a filter returns zero results.
- [ ] The Tracking screen shows an explicit empty state for the chart when no records exist.
- [ ] All existing `SystemState` visual treatments (empty, error, review, locked, mastered) remain unchanged.

### Design System

- [ ] No border-radius value outside of 8px, 12px, 16px, or 999px is used.
- [ ] No shadow value outside of the three defined tokens is used.
- [ ] No button height outside of 32px, 40px, or 48px is used.
- [ ] No interface text is smaller than 11px on desktop or 10px on mobile.
- [ ] All interactive elements have a minimum touch target of 44×44px on mobile.

### All Screens

- [ ] The Growth overview (score ring, stats, next practice) remains visible when switching between Record, History, and Reports tabs.
- [ ] Scenario cards display 1–3 difficulty dots corresponding to Easy/Medium/Advanced.
- [ ] The tracking chart bars use CSS transitions instead of keyframe animations for height changes.

### Responsive

- [ ] At 320px, the terminal header does not overflow its container.
- [ ] At 360px, bottom nav labels remain legible (minimum 7px, no truncation).
- [ ] At 390px, the terminal title does not wrap more than 2 lines.
- [ ] At 430px, the scenario list and detail panel are usable without horizontal scroll.
- [ ] At 1100px+, the sidebar is visible and the bottom nav is hidden.
- [ ] Focus mode is usable at all breakpoints without horizontal scroll.

### Accessibility

- [ ] All `<button>` elements have visible focus indicators.
- [ ] `aria-live="polite"` regions announce new terminal entries and assessment reports.
- [ ] `prefers-reduced-motion: reduce` disables all animations and transitions.
- [ ] Color is not the sole means of communicating error state in the terminal (icon + text).
- [ ] The progress ring has an accessible label indicating the percentage.

### Regression Safety

- [ ] The command evaluation logic (`assessmentOrder`, `assessmentScore`, command profiles for AN/SS/FQD/FXP) is unchanged.
- [ ] The `ProgressRecord` data structure and `localStorage` persistence logic are unchanged.
- [ ] The `SystemState` type and its usage are unchanged.
- [ ] The navigation route map (`pathToView`, `navigate`) is unchanged.
- [ ] The `useAnimatedNumber` hook behavior is unchanged except for the caret reduced-motion override.

---

## 13. Deferred Dependencies and Open Questions

**Engine Dependencies (Do Not Solve via UI):**
- **Session Timing:** The session clock currently increments via `setInterval`. The engine must eventually own session start/end timestamps and elapsed time.
- **Command Evaluation:** The current command profiles (`AN`, `SS`, `FQD`, `FXP`) are hardcoded illustrative responses. The real engine must provide actual GDS response simulation.
- **Scoring Logic:** `assessmentScore` is a local heuristic. The engine must eventually own scoring weights and hint penalties.
- **Scenario Progress:** `started` and `progress` in scenarios are local state. The engine must persist scenario completion and scores.

**Content Dependencies (Do Not Solve via UI):**
- **Customer Service Track:** The EgyptAir Advanced curriculum content for the service track must be authored before the UI can display meaningful milestones.
- **Arabic Localization:** RTL layout, Arabic typography (`Cairo` is already defined), and translated content require content and localization pipeline decisions.

**Architecture Dependencies (Do Not Solve via UI):**
- **Authentication:** `const.ts` defines OAuth login URL generation. The UI should not implement auth flows.
- **Backend API:** No API integration exists in the prototype. Any "save to cloud" or "sync progress" features must wait for API contracts.
- **Google Maps Integration:** `Map.tsx` is present but unused. If route visualization is required for scenarios, it must be driven by engine data, not UI invention.

**Open Questions:**
1. **Does the real engine support pause/resume for sessions?** This affects whether a pause button should be added to the Terminal.
2. **What is the minimum supported iOS/Android version?** This affects whether `env(safe-area-inset-bottom)` is sufficient or if polyfills are needed.
3. **Is offline training a requirement?** If so, the `localStorage`-only persistence in the prototype may need service worker support, which is an architecture decision.
4. **Are there regulatory accessibility requirements (e.g., Saudi accessibility standards)?** This affects whether WCAG 2.1 AA is sufficient or if additional compliance is needed.

---

## 14. Final Verdict

**Status: Ready for a focused revision pass.**

The AeroBridge prototype is **not** ready for direct mapping onto the real engine without a P0–P1 revision. However, it is also **not** in a state that requires foundational product or architecture clarification. The visual identity is mature, the learning loop is coherent, and the Terminal focus is correctly prioritized.

The prototype needs a **safety and trust pass** (P0) to remove prototype artifacts that would undermine credibility in an aviation training context, followed by a **Terminal perfection pass** (P1) to ensure the primary workstation is usable across all devices. The P2 design system consolidation can happen in parallel with engine integration planning.

**The highest-value work is:**
1. Removing the silent "FQD" default.
2. Fixing mobile session orientation.
3. Adding the coach FAB on mobile.
4. Consolidating tokens to prevent drift during scaling.

Once these four items are complete, the prototype can be safely handed to an implementation engineer for mapping onto the real engine without UX debt compounding.

**Risk if implemented as-is:** Trainees may develop incorrect mental models about command behavior due to silent defaults and hardcoded stats. Mobile users will have a fragmented experience that undermines the "calm, precise, readable" workstation goal. Design system inconsistency will slow future curriculum expansion.

**Confidence in this assessment:** High. All findings are traceable to specific source lines and observable CSS rules.