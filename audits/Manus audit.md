# AeroBridge Comprehensive Professional Design/UX Audit

**Prepared by:** Manus AI  
**Scope:** Audit and implementation-ready specification only. No production source files were modified, refactored, patched, committed, deployed, or functionally changed.

> **Executive conclusion:** AeroBridge is a strong visual prototype with a credible Flight Deck Console identity and a promising learning loop. It is ready for a **focused revision pass**, not for blind implementation. The revision must begin with Terminal interaction safety and evidence truth boundaries, then reduce competing hierarchy around the workstation, then systematize responsive/accessibility behavior across every route.

## 1. Executive Assessment

AeroBridge currently presents as a polished, premium aviation-training prototype rather than a generic SaaS dashboard. Its strongest qualities are the coherent dark navy visual language, restrained blue/green/amber operational states, deliberate use of monospace treatment for commands and readouts, clear progression language, and a credible attempt to connect assessment evidence to a next useful workflow. The source and live render both support the product brief’s intended feeling of **professionalism → focus → confidence → precision → operational readiness**.

The central product opportunity is also the central risk: the Terminal is visually recognizable and functionally present, but it is not yet sufficiently protected as the primary professional workstation. On desktop, the coach panel forms a competing reading column. On mobile, the coach is moved below the Terminal, which protects focus but can hide important feedback after a command. Session state is distributed across the terminal header, body, input footnote, coach, and footer instead of being made immediately legible in one place.

The most serious verified issue is not visual. In `Home.tsx:273-275`, an empty command is silently transformed into `FQD` before submission. This can create a false training event and must be treated as an interaction/engine safety defect, not as cosmetic polish. A second high-risk issue is evidence ownership: locally persisted assessment records coexist with hard-coded metrics and report content in `Home.tsx:67-95`, `205-207`, and `343-358`. The source does not prove a production data error, but it does prove that a later integration could show contradictory learner truth unless ownership is defined first.

The prototype should preserve its identity, Terminal-first intent, and learning-loop language. It should not become more decorative, more game-like, or more metric-heavy. The next revision should make the operational workstation calmer, clearer, more forgiving, and more truthful.

| Area | Current assessment | Main implication |
|---|---:|---|
| Product positioning | 8.0/10 | Strong aviation-training framing, but some decorative language must remain subordinate to learning utility. |
| Visual design | 8.2/10 | Premium and coherent; density and decorative layering reduce scan efficiency. |
| UX | 6.8/10 | Strong route intent; several promised actions are illustrative or incomplete. |
| UI quality | 7.8/10 | Controls and surfaces are polished; compact states need clearer semantics. |
| Design system | 7.4/10 | Token foundation exists, but late overrides and typography loading need consolidation. |
| Typography | 6.8/10 | Good role separation in intent; declared font stack is not fully evidenced as loaded. |
| Color and state communication | 7.4/10 | Operational palette is appropriate; non-color differentiation and contrast need validation. |
| Information hierarchy | 6.9/10 | Primary actions are present but frequently surrounded by competing readouts. |
| Terminal UX | 6.5/10 | Promising workstation structure; command safety, status clarity, and long-session behavior need revision. |
| Navigation | 7.5/10 | Clear five-area model and mobile rail; manual route composition is fragile. |
| Responsive behavior | 6.9/10 | Several narrow breakpoints are addressed; exact 320/360/390/430 behavior still needs validation. |
| Mobile experience | 6.8/10 | Strong mobile identity and Terminal preservation; vertical density and feedback order need refinement. |
| Accessibility | 6.2/10 | Focus and some aria support exist; custom controls, states, and motion need a complete pass. |
| Motion | 6.7/10 | Motion is restrained and partly reduced-motion aware; caret and smooth-scroll exceptions remain. |
| Consistency | 8.0/10 | The visual team language is unusually consistent for a prototype. |
| Professional maturity | 7.0/10 | Feels credible, but toast-only affordances and mock evidence reduce operational trust. |
| Functional safety | 5.8/10 | Empty-command fallback and evidence-boundary ambiguity require P0/P1 treatment. |

## 2. Audit Method and Evidence

The audit followed the requested loop: **Inspect → Analyze → Identify → Verify → Challenge → Re-check → Prioritize → Specify → Self-review**. The source archive was unpacked into an isolated audit directory and was not edited. Dependencies were installed only to run the supplied prototype. The development server was started locally and the rendered routes were inspected at `/`, `/practice`, `/scenarios`, `/growth`, and `/tracking`. The production build was also run successfully.

The principal source of truth was `client/src/pages/Home.tsx`, which contains the route view model, seeded/local evidence, shell, navigation, Practice/Terminal logic, Scenarios, Growth, and Tracking views. `client/src/index.css` was inspected for tokens, component styling, breakpoints, Terminal overrides, focus mode, navigation, state styles, and reduced-motion behavior. `client/src/App.tsx` and `client/src/main.tsx` were checked to establish the actual mounted composition. The supplied screenshots were treated as visual evidence only. Tall mobile screenshots were inspected using ordered overlapping crops; exact viewport-specific conclusions were not made where the supplied image did not prove the width.

The live prototype rendered successfully. Submitting `AN` in Learn mode produced `AVAILABILITY RETURNED · 7 OPTIONS`, changed the session command state to `SUCCESS`, updated coach guidance, and changed the displayed accuracy from 86% to 100%. The Terminal explicitly labels the response layer `LOCAL TRAINING SIMULATION` and `ILLUSTRATIVE`, which is important evidence that the current behavior is prototype behavior rather than a live carrier system.

The build completed with warnings about undefined analytics variables in `client/index.html` and runtime-only `/manus-storage` asset URLs. These are recorded as integration/deployment risks, not as proof of a design defect. The current `App.tsx` only returns `Home`; the standalone `NotFound` and `ErrorBoundary` components are therefore treated as unintegrated fallback risks, not as confirmed active route failures.

## 3. Current Product and Information Architecture

The current product loop is represented by five primary views: **Progression**, **Practice**, **Scenarios**, **Growth Record**, and **Progress Tracking**. The shell uses a desktop sidebar, sticky topbar, mobile drawer, and five-item bottom rail. `Home.tsx:350-363` derives the view from the pathname, stores view state locally, and calls `window.history.pushState` for navigation. The loop is understandable at a conceptual level, but it is implemented as a single Home composition with manually coordinated state rather than as explicit route-level screen contracts.

| Loop stage | Current screen | Strength | Verified weakness |
|---|---|---|---|
| Orientation | Progression | Clear current vector, stage map, and resume CTA. | “My route”, “View map”, and “See all stages” do not expose a real secondary surface; some are toast-only. |
| Practice | Practice / Terminal | Terminal, modes, coach, reference, and command input are present. | Empty command becomes `FQD`; session state is distributed; mode contract is implicit. |
| Assessment | Practice / Assessment | Assessment hides hints and provides a debrief after completion. | Closure is local/mock and the report is only available after a command; processing/interrupted states are not evident. |
| Growth | Growth Record | Read evidence → Practice the gap → Apply in scenario is an effective loop. | Some values are hard-coded while records are local; report language can be mistaken for authoritative learner truth. |
| Tracking | Progress Tracking | Metric switcher, data-table alternative, history, and next action exist. | Chart and KPI semantics need clearer definitions and stronger empty/loading/error coverage. |
| Scenarios | Scenarios | Mission brief and Start/Resume/Review language are strong. | Filter tabs work locally, while Filters and Sort affordances are toast-only/illustrative. |

The strongest transitions are the direct resume actions into Practice and the Growth recommendation into targeted practice. The weakest transitions are those that promise exploration or management but do not open a real surface. The implementation should not invent functionality merely to fill these gaps; it should either implement the stated interaction or make the affordance explicitly illustrative/unavailable.

## 4. Overall Scorecard

The scores above are evidence summaries, not substitutes for findings. The most important distinction is between **visual maturity** and **operational readiness**. The prototype scores higher visually than functionally because it has a strong identity and composition but still contains interaction behavior that could alter or misrepresent training evidence.

## 5. Screen-by-Screen Audit

### 5.0 Validated Finding Register

The following register is the definitive finding list. Recommendations are intentionally separated by dependency so UI changes do not imply changes to the training engine, data model, or curriculum content.

| ID | Route/component and exact evidence | User/product impact | Severity | Priority | Category and change type | Confidence | Acceptance direction |
|---|---|---|---|---|---|---|---|
| AB-01 | App shell and routing; `Home.tsx:350-363`, `App.tsx`. Manual pathname parsing, local view state, and `pushState` compose all screens inside `Home`. | Route/context ownership is fragile when the real engine is introduced. | High | P2 | Architecture; state/architecture boundary | High | Each screen has a documented route/context contract; no active-session context is lost during navigation. |
| AB-02 | Practice layout; `Home.tsx:299-314`, `index.css:377-380`; live desktop render. Coach is a competing desktop column and moves below the Terminal on mobile. | Terminal attention and latest feedback can compete or become vertically distant. | High | P1 | UI-only; visual hierarchy | High | Terminal is the primary column; coach is subordinate desktop support and optional mobile support after latest result. |
| AB-03 | Command submit; `Home.tsx:273-275`. Blank input is converted to `FQD`. | A trainee can create a false command/evidence event. | High | P0 | Engine/interaction dependent; behavior/state | High | Empty submit creates no history, score, toast, or evidence event and gives inline correction. |
| AB-04 | Terminal state; `Home.tsx:257-262`, `303-313`. State is split across header, body, footnote, coach, and footer. | Session comprehension is slower and errors are easier to miss. | High | P1 | UI-only plus state contract; hierarchy/state | High | Mode, context, session state, command state, and next move are readable in one dominant summary. |
| AB-05 | Mode tabs; `Home.tsx:240-247`, `301-302`. Mode changes reset completion but retain history without an explicit contract. | Users may not know what remains valid after switching modes. | High | P1 | Mixed; interaction/state | High | Each mode states what it exposes, preserves, resets, and records; switching behavior is testable. |
| AB-06 | Assessment closure; `Home.tsx:306`, `309`, `355-358`. Report is local/mock and only available after command history exists. | Assessment evidence can be mistaken for authoritative production evidence. | High | P1 | Mixed Engine/Data/UI; state/content | High | Completion distinguishes local illustration from validated record and exposes a defined empty/partial/interrupted path. |
| AB-07 | Command history; `Home.tsx:265-272`, `305`. Arrow-key history exists but has no visible affordance. | Discoverability is weak, especially on mobile and for new trainees. | Medium | P2 | UI-only; interaction | High | When history exists, the input exposes a visible ↑/↓ history cue and remains keyboard accessible. |
| AB-08 | Reference/coach; `Home.tsx:303`, `307`, `311`. Terminal Reference opens a drawer; coach Open reference only shows a toast. | Support model feels inconsistent and can break learning flow. | Medium | P2 | UI-only; interaction | High | Both actions open the same contextual reference surface or are explicitly labeled as unavailable. |
| AB-09 | Utility actions; `Home.tsx:168`, `219`, `229`, `335`, `343`. Search, Filters, View map, See all stages, Backup, and some section/history actions are toast-only. | Labels can promise functionality the prototype does not perform. | Medium | P2 | UI/product decision; interaction/content | High | Each action is implemented, clearly illustrative/unavailable, or removed; no misleading active affordance remains. |
| AB-10 | Evidence values; `Home.tsx:67-95`, `205-207`, `343`, `355-358`. Hard-coded metrics coexist with local records. | Conflicting numbers can undermine learner trust. | High | P0 | Data/Content dependent; data truth | High | Every displayed evidence value has one declared owner, source label, period, and consistency test. |
| AB-11 | Scenarios; `Home.tsx:321-335`; live `/scenarios`. Filter tabs filter locally, while top Filters and Sort produce toasts. | Mission discovery can be misunderstood as fully functional when it is not. | Medium | P2 | UI/Data dependent; interaction | High | Filter/sort behavior is real and testable or the controls are marked unavailable/illustrative. |
| AB-12 | StateNotice; `Home.tsx:39`, `188-190`, `204`, `343`. Broad state union exists, but only error uses alert and other states use status. | Urgent and routine announcements may be indistinguishable; many states lack visible coverage. | High | P1 | Mixed; state/accessibility | High | State matrix maps each state to visible text, icon, role, announcement urgency, and recovery action. |
| AB-13 | Motion; `Home.tsx:106-131`, `264`; `index.css:38`, `395-397`. Number animation and some transitions respect reduced motion; caret blink and smooth scroll are not explicitly disabled. | Motion-sensitive users may still experience avoidable movement. | Medium | P2 | UI-only; motion/accessibility | High | Reduced-motion mode disables caret blink, smooth scroll, number animation, and nonessential transitions. |
| AB-14 | Responsive CSS; `index.css:125-133`, `160-187`, `301`, `310-408`. 739/480/390/360 rules exist; exact 320/430 validation is not evidenced. | Narrow layouts may fail outside the tested widths. | Medium | P2 | UI-only; responsive | High | Screenshot and keyboard checks pass at 320, 360, 390, 430, tablet, laptop, and desktop widths. |
| AB-15 | Mobile navigation; `Home.tsx:183-185`, `index.css:373-376`; supplied mobile captures. Central Practice item is visually emphasized. | Emphasis supports Terminal primacy but can become game-like if over-styled. | Observation | P3 | UI-only; visual hierarchy | Medium | Practice remains primary through operational context and clarity, not reward-like decoration. |
| AB-16 | Typography; `index.css:32-34`, `client/index.html:11-12`. Premium font tokens are declared but HTML evidence shows only Inter import. | Rendered hierarchy and Arabic/mixed-code readability may diverge from design intent. | Medium | P2 | UI/Content dependent; typography | High | Intended fonts are loaded and verified for English, Arabic, codes, numbers, and long commands, or tokens are corrected. |
| AB-17 | Fallbacks; `NotFound.tsx`, `ErrorBoundary.tsx`, `App.tsx`. Standalone fallback styles are generic/light and not mounted by current App. | If integrated later, failure states may feel like another product. | Medium | P3 | Architecture/UI; fallback state | High | Any production fallback uses the AeroBridge shell and the same focus/recovery conventions. |
| AB-18 | Accessibility foundation; `index.css:42`, `Home.tsx:149`, `185`, `236`, `305`, `306`. Focus, aria labels, aria-current, live regions, and chart table exist, but custom controls need semantic verification. | Keyboard, screen-reader, and state comprehension may fail in critical flows. | High | P1 | UI-only; accessibility | Medium-High | Complete keyboard/screen-reader test matrix passes for tabs, drawers, Terminal, cards, states, and chart alternatives. |
| AB-19 | Build/runtime; `pnpm run build` succeeds with undefined analytics variables and runtime-only storage asset warnings. | Integration/deployment can fail despite visual success. | Medium | P2 | Architecture/Deployment; integration | High | Analytics variables and asset contract are defined in the target environment; build is warning-clean or warnings are documented and intentional. |
| AB-20 | Shared visual system; live routes and CSS surfaces/eyebrows/motifs. Many compact labels, layered cards, and decorative motifs compete with primary actions. | Scan cost rises and operational focus weakens. | Medium | P2 | UI-only; visual hierarchy | High | Primary action/state/result hierarchy remains clear in usability review without removing the established identity. |

### 5.1 Progression / Home orientation

**Primary task:** Understand current position in the learning path and resume the next workflow. **Primary action:** `Resume pricing workflow`. The current screen should be retained as the orientation anchor. Its current vector, mastered stages, current focus, and track switch are valuable because they support Basic/Advanced progression without requiring a dashboard-like metric explosion.

**Keep.** Keep the route vocabulary, stage map, current-focus treatment, Technical Track/Customer Service distinction, and the single dominant resume action. Keep the visual restraint of the current hero and the use of locked states to communicate curriculum sequence.

**Change.** Make the next action and its prerequisite context more explicit. The hero should state the current training objective in operational language, for example the exact workflow family being resumed, while keeping the existing product tone. Reduce decorative route-motif prominence when it competes with the task. Make the current stage card and CTA share one clear reading group.

**Add.** Add explicit state treatments for first use, no current route, loading route evidence, unavailable/locked curriculum, and interrupted session recovery. If `My route`, `View map`, and `See all stages` remain, each needs either a real UI surface or an explicitly unavailable/illustrative label.

**Remove or de-emphasize.** De-emphasize non-actionable streak and readiness summaries when they compete with the current workflow. Do not remove them if they support motivation or Saudi readiness; instead subordinate them to the current vector.

**Responsive and accessibility notes.** Validate the hero at 320, 360, 390, and 430 CSS pixels. Ensure the current stage is not conveyed by blue border alone, that locked cards have an accessible explanation, and that all buttons expose their action without requiring the decorative context.

**Dependencies.** UI-only for hierarchy and states; Content dependent for curriculum labels; Data dependent for real readiness values.

### 5.2 Practice / Terminal / Learn / Practice / Assessment

**Primary task:** Execute and understand a training workflow. **Primary action:** Enter and execute a command. This is the highest-priority route in the product.

**Keep.** Keep the terminal header, visible command/result history, explicit `LOCAL TRAINING SIMULATION` labeling, separate coach area, Reference control, Focus control, and Assessment debrief. Keep the use of command/result colors only as a supplement to text labels.

**Change.** Create one dominant session-status block at the top of the Terminal containing: mode, workflow context, session state, command state, and what the trainee should do next. The header can retain compact technical readouts, but the trainee should not have to assemble session meaning across four areas. The coach should become a subordinate support rail on desktop and a deliberate post-result support section on mobile.

**Add.** Add visible command-history affordance, a clear command-status timeline, processing/disabled/retry/interrupted states, and an explicit “what happens when you switch modes” explanation. Add a non-destructive empty-input validation state. Add session recovery language when the user leaves and returns to a partially completed session.

**Remove or de-emphasize.** Remove the impression that `FORMAT ERROR · CHECK ENTRY` is the default response before any command is entered. Replace it with an awaiting-command state. De-emphasize decorative empty terminal space if it does not help users understand output chronology.

**Responsive and accessibility notes.** On mobile, preserve the order: workflow context → current session state → latest output → command input → critical feedback → optional coach. The current CSS deliberately moves the coach below the main terminal at <=739px; preserve the principle but make the latest feedback available immediately after execution. Ensure the sticky input does not obscure the latest output or bottom navigation.

**Dependencies.** Empty-input behavior is Engine/interaction safety dependent. New state truth is Engine/Data dependent. Layout, hierarchy, labels, and focus treatment are UI-only.

### 5.3 Scenarios

**Primary task:** Select a realistic aviation/customer-service mission and start or resume it. **Primary action:** Start, Resume, or Review the selected mission.

**Keep.** Keep mission-file framing, scenario IDs, skills tested, difficulty, duration, mission brief, and the explicit next operational move. The selected detail panel is one of the strongest places where the product feels connected to real airline work.

**Change.** Make filter and sort behavior truthful. The filter tabs have local filtering logic, but the top `Filters` button and sort control currently produce toasts. If these are not implemented in the visual prototype, label them as unavailable/illustrative or remove them from the active affordance set.

**Add.** Add empty filtered results, loading catalog, unavailable scenario, interrupted mission, completed review, and resume-conflict states. Add a clear distinction between scenario completion evidence and local illustrative sample content.

**Remove or de-emphasize.** De-emphasize summary statistics that are not derived from the same evidence source as the selected mission. Do not add more metrics without a curriculum or data-owner decision.

**Dependencies.** UI-only for filter state presentation; Data dependent for catalog and statistics; Content dependent for Saudi-market scenario authenticity.

### 5.4 Growth Record: Record, History, Reports

**Primary task:** Interpret evidence and choose the next useful training action. **Primary action:** Open targeted practice or move through the three-step learning loop.

**Keep.** Keep the Read evidence → Practice the gap → Apply in scenario strip. Keep the strengths/needs-attention split and the report questions “What is reliable?”, “What recurs?”, and “What next?”. This is aligned with educational interpretation rather than vanity analytics.

**Change.** Define which values are authoritative and make that visible in the UI. The latest evidence derives from local progress records, while the overall readout, lesson count, practice count, average score, and skill rows are hard-coded. The target state should either derive all learner evidence from one owner or label illustrative values clearly.

**Add.** Add loading, no evidence, partial evidence, stale evidence, and data-source explanation states. Make History actions open the relevant evidence or scenario context rather than only showing a toast. Make Backup either provide a visible local export/confirmation artifact or present itself as unavailable in a prototype.

**Remove or de-emphasize.** De-emphasize the overall score when it is not the basis for the recommendation. The report’s strength is its pattern interpretation; keep the pattern and reduce score dominance.

**Dependencies.** Data and Content dependent for evidence truth and interpretation. UI-only for hierarchy and state presentation.

### 5.5 Progress Tracking

**Primary task:** Understand change over time and choose whether to repeat or advance. **Primary action:** Run another assessment or open targeted practice.

**Keep.** Keep the metric switcher, chart, visible data-table alternative, history rows, and next useful readout. The data-table alternative is an important accessibility foundation.

**Change.** Define the time window, comparison basis, and meaning of “stable”, “review”, “signal improving”, and “hint discipline”. The current chart is understandable visually but its semantic model is not fully surfaced. Ensure that chart labels remain readable without the decorative gradient treatment.

**Add.** Add empty, one-session, loading, unavailable, and stale-data states. Add a text summary of trend direction adjacent to the chart, not only in the legend. Make history rows expose whether they open evidence, a report, or Practice.

**Remove or de-emphasize.** Do not add more chart types until the current metrics have defined educational meaning. The product should measure operational readiness, not become an analytics dashboard.

**Dependencies.** Data dependent for metric definitions; UI-only for chart alternative and hierarchy.

### 5.6 Shared shell, navigation, overlays, and fallback states

**Primary task:** Move predictably between learning areas while preserving context. **Primary action:** Navigate to the selected area or open a clearly labeled utility.

**Keep.** Keep desktop sidebar, mobile drawer, sticky topbar, mobile bottom rail, active route treatment, language control, and profile affordance as structural elements.

**Change.** Make current route and current learning context consistent between sidebar, topbar, and mobile rail. The central Practice emphasis should communicate workstation priority rather than game progression. Replace or clearly mark toast-only utilities.

**Add.** Add a shell-level focus order specification, route transition announcement, interrupted-navigation warning for active sessions, and consistent unavailable/error fallback treatment. Integrate the AeroBridge visual shell into error and 404 states if those components are used in production.

**Dependencies.** UI-only for shell; Architecture dependent for route/error integration; Engine/Data dependent for interrupted-session protection.

## 6. Terminal Deep Audit

### 6.1 Workstation hierarchy

The current Terminal is the correct conceptual center, but the desktop layout gives the coach panel nearly equal visual status. The target state is a **primary terminal canvas with a subordinate support rail**. The Terminal should own the largest width, strongest border, and first focus target. The coach should be collapsible, remember its state within the session, and visually recede when the user is entering commands.

Acceptance-oriented target: at desktop widths, the Terminal receives at least two-thirds of the Practice content width; the coach remains visible but secondary. At mobile widths, the Terminal content, latest result, and input remain above optional coaching content. No recommendation should remove coaching or alter engine logic.

### 6.2 Session orientation

The current state is spread across `SESSION / LOCAL SESSION`, `COMMAND / READY`, body lines, `STATE / READY`, the coach’s default “FORMAT ERROR”, and footer metrics. The target header should contain one readable operational summary: **Practice mode · Pricing & Ticketing · Ready for command · Local simulation**. A compact technical readout can remain beneath it for the professional-console feel.

### 6.3 Command input and safety

The input has a useful `aria-label`, visible prompt, Execute button, and ArrowUp/ArrowDown history behavior. However, the blank-input fallback to `FQD` is unsafe. The target behavior is: empty submit does not append history, does not change assessment score, does not trigger success/error toasts, and returns a concise inline instruction such as “Enter a command before executing.” This recommendation is intentionally classified as Engine/interaction-safety dependent.

The input should visibly expose history availability when history exists, for example with a subtle “History available · ↑/↓” helper. This is UI-only and does not change command behavior. The browser autocomplete is disabled, which is appropriate for command entry; the implementation should verify that keyboard history works with screen readers and mobile virtual keyboards.

### 6.4 Output and result chronology

The current output includes session metadata, a ready line, an illustrative response-model line, and command history. The large empty gap before input creates terminal atmosphere, but long-session usability would improve if the output area had a stable scroll region with clear chronology and the latest result remained visually anchored. Avoid auto-scrolling in a way that steals focus; provide a “jump to latest” control only if the history becomes long.

Each result should expose text status, command, response, and next implication. The current `terminal-entry` structure is a good starting point. Success/error colors should remain supplementary to explicit words such as `SUCCESS`, `SYNTAX ERROR`, `SEQUENCE ERROR`, `PROCESSING`, or `INTERRUPTED`.

### 6.5 Reference and coach

Reference is a real drawer in the source, while coach “Open reference” is toast-only. The target state should make these one coherent support model: the coach action opens the same reference surface and focuses the relevant section. In Assessment mode, the reference can remain limited, but the limitation must be explicit and consistent. Opening Reference should count as a hint only when the product’s data model defines it as such; this is not a UI-only decision.

### 6.6 Modes and assessment closure

The three modes communicate a useful educational progression. The implementation needs a visible mode contract: Learn may expose examples and coaching; Practice may expose guidance with normal feedback; Assessment suppresses hints and records evidence. Switching modes should state what is preserved, what is reset, and whether the current session remains valid. The current source resets `sessionComplete` on mode change but retains history, which can confuse the trainee.

Assessment closure should show a clear final state, evidence source, score interpretation, and next action. The existing report is a strong visual pattern, but the target must distinguish a local illustrative report from a validated training record. Do not add new metrics until the curriculum/data owner defines them.

### 6.7 Focus mode and long-session comfort

Focus mode hides the coach and makes the Terminal fill the viewport, which is aligned with workstation focus. The target must ensure that focus mode has a visible exit, preserves keyboard focus predictably, does not trap the user, and does not hide critical session completion controls. The current `body:has(.focus-mode) { overflow: hidden; }` and sticky input behavior require keyboard and mobile validation.

### 6.8 Terminal state matrix

| State | Visible status | Input behavior | Coach behavior | Data implication |
|---|---|---|---|---|
| First use | “Start a local training session” | Enabled | Explain workflow, not error | No record created |
| Ready | “Ready for command” | Enabled | Contextual next step | No new event |
| Processing | “Processing command” | Disabled or queued by contract | Non-blocking progress | Engine-defined |
| Success | “Command accepted” plus response | Enabled for next step | Explain why next step matters | Candidate evidence event |
| Syntax error | Explicit syntax label | Enabled after correction | Show format guidance | Error event only if engine defines it |
| Sequence error | Explicit sequence label and expected step | Enabled with recovery path | Explain prerequisite | Evidence taxonomy dependent |
| Interrupted | “Session paused/interrupted” | Disabled until resume/retry | Explain preservation | Engine/session persistence dependent |
| Assessment complete | “Report ready” | Disabled or explicit retry | Summarize evidence | Data ownership required |
| Unavailable | “Simulation unavailable” | Disabled | Explain alternative | Environment/engine dependent |

## 7. Shared Design System Audit

The token foundation in `index.css:7-35` is a strength. The main system risk is not lack of tokens; it is the coexistence of base styles, multiple media-query blocks, and late “AeroBridge Elevation Directive” overrides. Consolidate the system around explicit semantic tokens rather than adding more one-off overrides.

| System area | Current condition | Target specification |
|---|---|---|
| Color | Strong navy/blue/green/amber/red palette. | Define semantic state tokens with text, border, icon, and surface variants; never rely on hue alone. |
| Surfaces | Layered cards and terminal surface are coherent. | Establish three surface levels and reserve the brightest treatment for the active workstation/action. |
| Borders | Multiple translucent line strengths. | Define quiet, standard, strong, focus, and state borders with documented usage. |
| Radius | Mostly consistent, with later route-specific refinements. | Use a small scale and remove unnecessary per-screen exceptions. |
| Typography | Display, body, mono, and Arabic tokens declared. | Verify/load the intended fonts or revise tokens to the fonts actually shipped; define code, label, body, heading, and numeric roles. |
| Buttons | Primary and ghost actions are clear. | Ensure every button’s label matches implemented behavior; avoid toast-only action promises. |
| Inputs | Terminal input is visually strong and focus-aware. | Add empty/error/disabled/processing states and a visible history affordance. |
| Status | StateNotice and terminal labels exist. | Define state vocabulary and non-color markers for every state. |
| Metrics | Rings, bars, KPI cards, and charts are attractive. | Require metric definition, source, period, and interpretation before adding any new metric. |
| Navigation | Desktop/mobile variants are coherent. | Document active, focus, pressed, current, unavailable, and interrupted-session states. |
| Overlays | Mobile drawer, reference drawer, focus mode, popover exist. | Define focus management, escape behavior, scroll locking, and announcement rules. |
| Spacing | Visually deliberate but dense. | Reserve a minimum readable gap between primary task, state, result, and next action. |
| Motion | Eased transitions and animated numbers support polish. | Add a complete reduced-motion contract including caret blink and smooth scrolling. |

## 8. Responsive and Accessibility Audit

### Desktop and laptop

The live desktop render confirms a strong side-navigation workstation composition. At large widths, multi-column layouts work visually, but the coach/Terminal balance and high quantity of secondary metadata need hierarchy refinement. At laptop widths, verify that the topbar context, language, search, profile, Terminal controls, and coach do not compete for the same horizontal space.

### Tablet

The source has a principal breakpoint at 740px, but no direct evidence was supplied for tablet widths. Validate the transition where the side navigation disappears, the mobile rail appears, and Practice changes from grid to column. The coach should not become taller than the useful Terminal output before the command input.

### 430px, 390px, 360px, and 320px

The source explicitly addresses 390px and 360px Terminal header behavior. At <=360px, the Terminal header becomes a two-column grid and hides the Reference label while retaining its icon. This is a sensible space-saving strategy, but it needs a semantic tooltip or accessible name and a visual test at 320px. The source does not provide a 430px-specific rule, so 430px should be treated as a validation target rather than a verified defect.

The supplied mobile captures show the intended mobile rail and a substantial topbar/page-header footprint. The evidence supports a density review, but it does not prove a specific pixel overflow at every requested width. The implementation should capture 320, 360, 390, and 430 CSS-pixel screenshots and verify that the Terminal preserves, in order, session context, output, input, and critical feedback.

### Accessibility findings

Visible focus styling exists in `index.css:42`, several buttons carry aria labels, `aria-current` is used in the bottom navigation, and the chart exposes a details-based data table. These should be preserved. The complete accessibility pass must still verify heading hierarchy, button names, tab semantics, selected state, focus order, keyboard access to custom controls, screen-reader announcements for session results, tooltip behavior on compact controls, color contrast, text scaling, and reduced motion.

Custom tabs such as mode tabs and Growth tabs should expose selected state semantically. Skill rows and scenario cards are buttons, which is a good baseline, but their expanded/selected state and relation to the detail panel should be announced. `StateNotice` currently uses `role="alert"` only for `error` and `role="status"` for all other states; this is too broad as a universal state model and should be replaced with explicit announcement rules by state urgency.

## 9. Priority Matrix

Effort is relative implementation effort after the required product/data decisions are available.

| ID | Priority | Severity | Impact | Effort | Dependency | Affected routes/files | Recommended phase |
|---|---|---|---|---|---|---|---|
| AB-03 | P0 | High | False command/evidence event | Low-Medium | Engine/interaction safety | Practice; `Home.tsx:273-275` | P0 foundations/safety |
| AB-10 | P0 | High | Contradictory learner truth | Medium-High | Data/Content | Growth/Tracking/Practice; `Home.tsx:67-95,343,355-358` | P0 foundations/safety |
| AB-04 | P1 | High | Slow session comprehension | Medium | UI + state contract | Practice; `Home.tsx:257-313` | P1 Terminal |
| AB-05 | P1 | High | Mode/session confusion | Medium | Mixed state/UI | Practice; `Home.tsx:240-302` | P1 Terminal |
| AB-06 | P1 | High | Unclear assessment closure/truth | Medium | Data/Engine | Practice/Growth/Tracking | P1 Terminal, then P2 data wiring |
| AB-12 | P1 | High | Incomplete state communication | Medium | Mixed | All screens; `StateNotice` | P0/P1 |
| AB-18 | P1 | High | Keyboard/screen-reader friction | Medium | UI | All screens | P0/P2 shared system |
| AB-02 | P1 | High | Terminal loses primary hierarchy | Medium | UI-only | Practice/CSS | P1 Terminal |
| AB-07 | P2 | Medium | History discoverability | Low | UI-only | Practice | P1 Terminal |
| AB-08 | P2 | Medium | Coach/reference inconsistency | Low-Medium | UI-only | Practice | P1 Terminal |
| AB-11 | P2 | Medium | Promise/action mismatch | Low-Medium | UI/Data | Scenarios | P2 all screens |
| AB-16 | P2 | Medium | Typography inconsistency/localization risk | Low-Medium | UI/Content | All screens; `index.html`, CSS | P2 shared system |
| AB-13 | P2 | Medium | Motion accessibility gap | Low | UI-only | All screens | P2 shared system |
| AB-14 | P2 | Medium | Unverified narrow responsive behavior | Medium | UI-only | CSS breakpoints | P2 responsive |
| AB-19 | P2 | Medium | Build/runtime integration risk | Low-Medium | Architecture/Deployment | `index.html`, assets | P0 foundations |
| AB-09 | P2 | Medium | Illustrative controls mislead | Medium | Product/UI | Progression, Scenarios, Growth | P2 all screens |
| AB-20 | P2 | Medium | Scan cost and visual competition | Medium | UI-only | All routes | P2 all screens |
| AB-01 | P2 | High | Fragile route/state boundary | High | Architecture | `Home.tsx`, `App.tsx` | P0 clarification, no redesign mandate |
| AB-15 | P3 | Observation | Potentially game-like emphasis | Low | UI-only | Mobile navigation | P3 polish |
| AB-17 | P3 | Medium | Fallback visual inconsistency if integrated | Low-Medium | Architecture/UI | `NotFound`, `ErrorBoundary` | P3 or route integration |

## 10. Target-State Design Revision Specification

The target state is a calm, precise training workstation. The user should be able to answer five questions within seconds: **What am I practicing? What mode am I in? What is the session state? What did the last command return? What is the next valid move?** These answers should not require reading every card or interpreting color.

The Practice route should have one primary column, one subordinate support rail, and a stable session contract. The task strip should identify the workflow context. The Terminal header should summarize mode, context, state, and source. The output should separate session metadata from command/result history. The input should remain visually prominent and reject empty execution. The result should expose text status and next implication. The coach should support the result without competing with command entry. Assessment should make its evidence boundary and completion state explicit.

The shared system should use semantic state tokens, consistent focus/selected/disabled patterns, loaded typography, documented spacing/radius rules, and explicit responsive contracts. Decorative route motifs may remain, but only where they do not reduce text legibility or compete with the operational action.

Scenarios should continue to feel like mission files. Growth should continue to interpret patterns rather than reward raw scores. Tracking should remain a compact operational signal view rather than expanding into an analytics product. Progression should remain the route orientation surface. These boundaries keep the experience aligned with EgyptAir Basic/Advanced progression and Saudi-market readiness rather than generic engagement design.

## 11. Phased Implementation Plan

### P0 — Foundations and safety

First, resolve the empty-command fallback and define the evidence ownership contract. Decide whether a submitted command, error, hint, assessment result, and report are engine events, UI events, or derived data. Decide which values are authoritative and which prototype values must be labeled illustrative. Verify the build-time analytics variables and runtime asset contract. Establish the shared state vocabulary and accessibility test matrix before changing visual hierarchy.

### P1 — Terminal and UX hierarchy

Refine the Terminal header into one session-status summary, subordinate the coach, make command history discoverable, unify Reference actions, define mode-switch behavior, and implement explicit ready/error/success/processing/interrupted/completed states. Preserve command semantics and existing workflow order except for the safety correction required by AB-03. Validate desktop, laptop, tablet, and narrow mobile Terminal behavior.

### P2 — Shared system and all screens

Consolidate tokens and late overrides. Verify font loading and Arabic/mixed-language typography. Apply consistent state semantics, focus management, selected/expanded behavior, accessible tab patterns, chart summaries, and responsive spacing to Progression, Scenarios, Growth, Tracking, shell, overlays, and fallbacks. Replace toast-only promises with real surfaces, explicit unavailable states, or removed affordances based on product approval.

### P3 — Polish, content, and optional enhancements

Only after P0–P2 are stable, refine motion, decorative motifs, mobile rail emphasis, hover previews, and optional map/report enhancements. Add richer content only when the EgyptAir Basic/Advanced curriculum and Saudi job-market learning outcomes define the requirement. Do not add metrics, game mechanics, or fake operational data for visual completeness.

## 12. Acceptance Criteria

### Terminal

The Terminal occupies the primary visual workspace on desktop and remains the first actionable area on mobile. A trainee can identify workflow context, mode, session state, latest result, and next move without reading more than the Terminal header and latest result. Submitting an empty command creates no command history entry, does not change score, does not trigger success/error evidence, and provides an inline instruction. ArrowUp/ArrowDown history remains functional and has a visible discoverability cue. Reference and coach actions open the same intended support surface or are explicitly marked unavailable.

### Navigation and handoffs

Every active navigation item exposes current state semantically and visually. Progression, Scenario, Growth, and Tracking actions that claim to open a destination actually open it, or are labeled unavailable/illustrative. Entering Practice from a Scenario or Growth recommendation preserves the intended context without changing command semantics. Leaving an active session either preserves it according to the engine contract or communicates the interruption explicitly.

### States

Every route defines and visually distinguishes first-use, empty, loading, ready, in-progress, success, partial-success, error, retry, interrupted, completed, review, locked, and unavailable states where applicable. Each state has text or icon support in addition to color. Urgent errors are announced appropriately; routine updates do not interrupt screen-reader users unnecessarily.

### Design system

All primary surfaces, borders, controls, labels, focus states, and status states use documented semantic tokens. No late override changes a component’s meaning without documentation. Intended display, body, mono, and Arabic fonts are either loaded successfully or replaced by a confirmed shipped stack. Primary and secondary actions meet the project’s chosen touch-target standard and remain readable under text scaling.

### All screens

Progression has a clear current vector and truthful next action. Scenarios has truthful filtering/sorting or explicit unavailable states. Growth derives or labels all evidence consistently and keeps the pattern interpretation primary. Tracking exposes a text summary and accessible table alternative. Error/404 surfaces, if used by production, share AeroBridge’s visual and interaction language.

### Responsive

At 320, 360, 390, and 430 CSS pixels, no primary action, Terminal input, status label, or bottom navigation item is clipped or overlapped. The Terminal header remains readable, compact controls retain accessible names, sticky input does not cover output, and the mobile rail does not obscure completion or error feedback. At tablet and laptop widths, Terminal and coach hierarchy remains intentional.

### Accessibility and motion

Keyboard users can navigate all primary actions, tabs, scenario cards, skill rows, drawers, and Terminal controls in logical order. Focus remains visible and is restored after closing overlays. Mode tabs expose selected state. Skill/scenario expansion is announced. Chart values are available in text/table form. Reduced motion disables number animation, caret blink, smooth-scroll behavior, and nonessential transitions.

### Regression safety

The existing command vocabulary, command ordering logic, coaching intent, assessment scoring contract, scenario-to-Practice handoff, local storage behavior, and route destinations remain unchanged unless a separately approved Engine/Data/Content decision states otherwise. No UI revision may silently introduce new commands, new metrics, fake carrier behavior, or altered training semantics.

## 13. Deferred Dependencies and Open Questions

The following must not be solved through UI invention. First, define whether the local response layer will be replaced by the real Amadeus/GDS engine and which states the engine can truthfully emit. Second, define the authoritative evidence model for commands, hints, scores, scenarios, growth reports, and tracking. Third, map every Progression stage and Scenario to the approved EgyptAir Basic/Advanced curriculum and Saudi-market role outcomes. Fourth, decide whether “Backup” means local export, server persistence, or merely a prototype placeholder. Fifth, define Arabic scope: interface translation, bilingual content, command/code directionality, date/number formatting, and mixed-language screen-reader behavior. Sixth, decide whether Search, Filters, View map, See all stages, and history actions are in scope for the next implementation or should be explicitly unavailable.

Open questions requiring product approval include whether Assessment may retain command history when the user changes mode, whether opening Reference always counts as a hint, whether a failed command is evidence or only feedback, how interrupted sessions resume, what “Saudi readiness 24%” measures, and which metrics are valid for educational decisions. Until these are answered, the report recommends no additional KPIs or gamified progress mechanics.

## 14. Final Verdict

AeroBridge **needs a focused revision pass before implementation across the real engine**. It does not need a wholesale visual redesign or a new product architecture merely to improve the UI. The existing prototype already contains the right identity, major learning areas, Terminal concept, and evidence-to-next-action direction.

Implementation should begin with P0 safety and truth-boundary decisions, especially the empty-command fallback and the separation between illustrative/local values and authoritative learner evidence. P1 should then make Terminal unquestionably primary, clarify session and mode state, and improve command/result/coach relationships. P2 should consolidate the design system and complete responsive/accessibility coverage. P3 can refine polish only after the workstation is safe and trustworthy.

The final design principle is simple: **AeroBridge should look premium because it is precise, not because it is busy.** Terminal remains the highest-priority experience. Every supporting screen should help the trainee understand Amadeus workflows, interpret real progress, and prepare for professional airline operations.

## References and Evidence Files

This audit does not rely on external market or design claims. The following local artifacts are the evidence sources used for the factual findings:

1. `client/src/pages/Home.tsx` — primary shell, screens, state, Terminal behavior, seeded/local records, and navigation.
2. `client/src/index.css` — design tokens, components, breakpoints, Terminal overrides, focus mode, navigation, states, and motion rules.
3. `client/src/App.tsx` — mounted application composition.
4. `client/src/main.tsx` — application entry point.
5. `client/index.html` — font imports and build-time analytics placeholders.
6. `client/src/pages/NotFound.tsx` and `client/src/components/ErrorBoundary.tsx` — fallback components not composed by the current `App` wrapper.
7. Live local renders at `/`, `/practice`, `/scenarios`, `/growth`, and `/tracking`.
8. Supplied screenshots, inspected as visual evidence; tall screenshots were reviewed through ordered overlapping crops using the `read-special-images` workflow.
9. `pnpm run build` output — successful build with analytics-placeholder and runtime-asset warnings.

**Audit status:** Complete. No source files were modified.
