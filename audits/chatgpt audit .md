AeroBridge Comprehensive Professional Design/UX Audit

1. Executive Assessment

Overall assessment

AeroBridge is visually much closer to a credible aviation training workstation than to a generic SaaS dashboard. The current prototype has a strong visual identity, a coherent dark Flight Deck Console foundation, a credible terminal treatment, compact operational readouts, a useful Progression → Practice → Evidence loop, and a disciplined blue/green/amber status language.

The strongest work is concentrated in:

- Practice / Terminal: the prototype clearly treats the terminal as a serious operational surface rather than a decorative dashboard widget.
- Progression: “Resume pricing workflow” establishes an immediate next action and makes the learner’s current vector understandable.
- Growth Record: the “read evidence → practice the gap → apply in scenario” concept is unusually coherent for a training product.
- Shared visual language: deep navy, blue interaction accents, green success, amber caution, monospace command/readout typography, layered cards, and restrained atmospheric imagery form a recognizable product signature.
- Mobile composition: the supplied narrow-screen renders demonstrate that the core layouts have been intentionally designed for mobile rather than simply compressed from desktop.

The main gap is not basic visual quality. It is operational credibility and educational truthfulness.

The current prototype frequently presents local illustrative numbers, “Saudi readiness,” “readiness” language, hardcoded scenario outcomes, hardcoded skill states, and static evidence as though they are authoritative learner signals. The Practice screen does explicitly disclose its local/illustrative nature, but surrounding screens are less disciplined. For a product intended to prepare trainees for real airline operational roles, the interface must make an extremely clear distinction between:

real trainee evidence → calculated interpretation → illustrative prototype data → curriculum guidance.

That distinction is currently inconsistent.

The second major gap is state completeness and Terminal closure. The code declares a substantial state taxonomy ("first-use", "empty", "loading", "ready", "in-progress", "success", "partial-success", "error", "retry", "interrupted", "completed", "review", "locked", "unavailable") but the actual UI does not implement a complete, consistent state system across routes. Many states are implicit, simulated, or represented only by color/text combinations.

The third major gap is accessibility and typography discipline. The source declares Space Grotesk, Cairo, and IBM Plex Mono, but the HTML does not load those fonts and the repository contains no local font assets. Arabic typography is therefore not dependable. The interface also relies heavily on very small text sizes and low-salience muted labels. The faint text color is approximately 3.66:1 against the base background, which is insufficient for normal-size body text under WCAG AA.

The fourth gap is prototype action integrity. Several controls are presented as meaningful navigation/actions but only produce a toast. Examples include “View map,” “See all stages,” “My route,” several evidence actions, and parts of scenario/history review. This is acceptable for a share prototype only when clearly identified as prototype behavior; otherwise it creates a misleading affordance.

Product-level verdict

The prototype needs a focused revision pass before it should become the visual reference for the real engine.

It does not need a redesign or architectural reset.

The visual foundation should be preserved. The next pass should tighten hierarchy, accessibility, state language, prototype-truth labeling, Terminal ergonomics, curriculum traceability, and implementation boundaries.

---

2. Audit Method and Evidence

Source inspected

Primary source inspected from:

- "client/src/App.tsx"
- "client/src/pages/Home.tsx"
- "client/src/pages/NotFound.tsx"
- "client/src/components/ErrorBoundary.tsx"
- "client/src/index.css"
- "client/src/main.tsx"
- "client/index.html"
- "package.json"
- "tsconfig.json"
- "server/index.ts"
- "ideas.md"

The source contains the complete share-preview implementation in a single principal page module:

- "Progression"
- "Practice"
- "Scenarios"
- "Growth"
- "ProgressTracking"
- shared "Topbar"
- shared "SideNav"
- shared "BottomNav"
- assessment reporting
- state notice
- skill/evidence presentation

The active routing is implemented directly in "Home.tsx"; "App.tsx" renders only "Home".

Screens / routes evidenced

Source route states:

- "/"
- "/practice"
- "/scenarios"
- "/growth"
- "/tracking"

The source maps route selection through "pathToView()" and uses "history.pushState()" for navigation.

Rendered evidence reviewed

Seven supplied rendered references were inspected, including narrow mobile compositions for:

- Progression
- Practice
- Scenarios
- Growth Record / Record
- Growth Record / History
- Growth Record / Reports
- Progress Tracking

The supplied images demonstrate intentional mobile composition and validate the overall visual direction.

Runtime verification

A local runtime attempt was made from the extracted source. Runtime execution was not completed because:

- "node_modules" is absent from the provided archive.
- "pnpm" is not installed in the environment.
- "corepack pnpm" attempted to retrieve the required package manager and failed because network/DNS access to the npm registry was unavailable.

Therefore:

Source inspection is authoritative for implementation behavior. Supplied rendered screenshots are authoritative only for the rendered states they visibly demonstrate.

Desktop runtime behavior was not independently browser-verified in this environment; desktop findings below are based on source CSS breakpoints and layout rules rather than a live desktop session.

Important source/screenshot relationship

The screenshots visibly contain "/manus-storage/..." imagery, while the provided source archive does not contain those image files in "client/public". The source references them directly from:

- "client/src/index.css:81"
- "client/src/index.css:113"
- "client/src/index.css:116"
- "client/src/pages/Home.tsx:99"

This means the archive is not fully self-contained as a visual artifact. That is not necessarily a product defect in the hosted prototype environment, but it is an implementation dependency that must be documented before the design becomes the long-term reference.

---

3. Current Product and Information Architecture

Existing product loop

The active route architecture is:

Progression → Practice → Scenarios → Growth Record → Progress Tracking

with Assessment embedded inside Practice.

This is visible directly in "navItems" in "Home.tsx:59-65".

That structure is coherent, but the conceptual learning loop described in the product brief is slightly different:

Progression → Practice → Assessment → Growth → Tracking → Scenarios → Next Action

The current implementation compresses some of those relationships.

Strong areas

Progression → Practice

This is the strongest transition.

"Progression" presents:

- current vector
- current skill
- current level
- progress percentage
- estimated time
- command-set progress
- primary “Resume pricing workflow” action

Evidence: "Home.tsx:219-229".

This is exactly the type of action-oriented orientation an operational training workstation needs.

Practice → Assessment

This is also clear because the three modes are explicit:

- Learn
- Practice
- Assessment

Evidence: "Home.tsx:301".

The distinction is useful and should be preserved.

Assessment → Growth / Tracking

The technical connection exists. Completing assessment creates a "ProgressRecord" and saves it to local storage through "saveAssessment()".

Evidence:

- "Home.tsx:358"
- Practice assessment completion at approximately "Home.tsx:308-310"

However, the learner-facing meaning of that evidence is not fully explained. Assessment outputs are converted into:

- accuracy
- sequencing
- hint score
- overall

without a sufficiently clear learner-facing explanation of what those metrics mean educationally.

Growth → Practice

The Growth Record has a strong next-action concept:

«“Practice the gap”»

and:

«“Open recommended practice”»

This is one of the prototype’s strongest UX ideas.

Scenarios → Practice

Scenario cards communicate:

- difficulty
- duration
- category
- skills
- completion state
- next operational move

The main CTA transitions the trainee into Practice and carries context via "setPracticeContext()".

Evidence: "Home.tsx:321-335".

This is a strong design decision and should remain.

Structural weaknesses

Assessment is visually buried inside Practice

Assessment is important enough educationally to deserve a clear conceptual transition, but it currently exists as a tab within the Practice screen.

That is not inherently wrong. For this product, keeping Assessment within the Terminal workflow may actually be preferable.

The issue is that the system does not explicitly communicate:

Practice mode → assessment mode → submit/finalize → assessment debrief → Growth/next action.

The final transition appears only after “FINISH SESSION.”

Target state should make that state transition visually explicit without creating another top-level route.

Tracking is too detached from educational interpretation

Progress Tracking contains useful numerical evidence, but the interface can feel like a performance dashboard rather than an aviation-training interpretation layer.

The strongest language is the next-action area:

«“Move the signal forward.”»

The weaker language is the collection of KPI blocks and trend metrics, which can become dashboard-like.

The design should continually answer:

What does this evidence mean for my next operational behavior?

not simply:

What number changed?

Scenarios are strong operationally but weakly connected to curriculum provenance

The scenario list is convincing, but the source provides no explicit curriculum trace such as:

- Basic / Advanced
- lesson/module
- competency
- source-course mapping
- command family
- Saudi job-role relevance

This cannot be invented through UI. It is a Content/Data dependency.

---

4. Overall Scorecard

Dimension| Score| Rationale
Visual Design| 8.5/10| Strong identity, layered surfaces, controlled atmospheric imagery, good hierarchy
UX| 7.4/10| Strong next-action patterns but incomplete state/closure behavior
UI| 8.0/10| Components feel purpose-built and coherent
Design System| 7.2/10| Good tokens and repeated patterns, but several late CSS overrides indicate accumulated refinement rather than a fully rationalized system
Typography| 6.5/10| Excellent intended pairing, but declared fonts are not actually provisioned
Color| 8.0/10| Strong semantic palette; muted text frequently falls below comfortable accessibility thresholds
Information Hierarchy| 7.8/10| Good macro hierarchy; some secondary metrics compete with primary training tasks
Terminal UX| 7.8/10| Strong foundation, clear input, history, reference, coach, focus mode; output density and session-state closure need refinement
Navigation| 7.5/10| Clear 5-route model; prototype actions and contextual routes need stronger truthfulness
Responsive| 7.1/10| Clearly intentional mobile rules; insufficient direct verification across requested widths
Mobile| 7.6/10| Strong compact architecture and centered Practice priority
Accessibility| 5.8/10| Visible focus exists, but text sizing, muted contrast, state semantics, target sizing, dialog/focus management, and chart semantics need work
Motion| 7.5/10| Motion has purpose; reduced-motion coverage is thoughtfully considered
Consistency| 7.6/10| Strong shared language; fallback/error screens break the identity
Professional Maturity| 7.0/10| Visually mature but currently too illustrative in some evidence/readiness claims
Functional Safety| 6.5/10| Good separation intent, but several UI surfaces expose or imply unsupported authoritative evidence

Overall design maturity

7.5/10

The prototype is sufficiently mature to serve as the foundation for the real UI reference, but it is not yet ready to be treated as the definitive production design system.

---

5. Screen-by-Screen Audit

5.1 Progression

Primary user task

Understand current learning position and decide what to practice next.

Primary action

"Resume pricing workflow".

What to Keep

- “Continue where you left off” framing.
- Current vector.
- Current stage progress.
- Mastered/current/locked stage language.
- Large, immediate resume CTA.
- Technical Track vs Customer Service split.
- Stage map.

Evidence: "Home.tsx:219-229".

What to Change

The page currently mixes three concepts:

1. current action
2. overall learning path
3. future curriculum map

The hero and current-vector card are strong. The lower “Track” and “Stage Map” sections should become progressively less visually dominant.

Target hierarchy:

Current operational task → immediate supporting evidence → upcoming stage → long-term map.

What to Add

A compact curriculum provenance label for the active stage, such as conceptually:

"Basic / Pricing & Ticketing / Lesson X"

The actual curriculum mapping must come from Content/Data, not invented UI.

What to Remove or De-emphasize

De-emphasize decorative route motifs that imply navigational precision without representing actual route state.

Do not remove the visual motif entirely; it is part of the identity.

Required states

- first-use
- current
- mastered
- ready
- locked
- unavailable
- review required
- completed
- curriculum mismatch / not yet assigned

The source currently has only a small subset.

Responsive issues

The mobile render is successful overall.

The main risk is vertical elongation: the progression page becomes a very tall sequence of equally weighted cards.

The page would benefit from stronger visual compression after the current-stage section.

At 320px, the existing "max-width: 360px" rules are relied upon rather than a dedicated 320px design.

Accessibility issues

- “Locked” currently depends heavily on reduced opacity and icon state.
- "LockKeyhole" communicates meaning visually but the textual state does exist, which is good.
- Tiny "eyebrow" labels are too small for important contextual information.
- The active/current state should not depend on blue border/glow alone.

Interaction issues

“View map,” “My route,” and “See all stages” appear actionable but do not produce actual destination behavior.

Evidence:

- "My route" → toast at "Home.tsx:219"
- "View map" → "SectionHeader" toast at "Home.tsx:212"
- "See all stages" → "SectionHeader" toast at "Home.tsx:229"

Dependency classification

Mixed

Visual hierarchy is UI-only.

Curriculum provenance and actual route-map behavior are Content/Data/Architecture dependent.

---

5.2 Practice / Terminal

Primary user task

Perform a GDS command workflow with enough guidance to learn the operational sequence, then demonstrate independent recall.

Primary action

Enter and execute a command.

What to Keep

This is the highest-quality screen in the prototype.

Keep:

- terminal-first composition
- current task strip
- Learn / Practice / Assessment modes
- terminal header
- session status
- command state
- command history
- fixed command input
- reference
- focused mode
- coach panel
- assessment report
- explicit local simulation disclaimer

Evidence: "Home.tsx:239-315" and CSS "index.css:233-256".

What to Change

1. The terminal output hierarchy is still too sparse

The screenshot shows a large amount of empty terminal space before the command-entry line.

Source: "index.css:110", then refinements at approximately "index.css:236".

The large ".terminal-gap" space is visually theatrical but not educational.

The terminal should use the available vertical area to improve operational readability rather than simply leave a large empty field.

2. Output, history, and current input should feel more like one command system

The relationship is present, but the visual distinction between:

- system response
- prior entry
- current entry
- coach interpretation

can be strengthened.

3. The command input is the correct focal point, but the Execute action is visually underspecified on mobile

The mobile screenshots show a good command field and compact icon execution button, but the button becomes nearly icon-only.

That is acceptable only if the surrounding semantics and focus are unmistakable.

What to Add

- visible current-step indicator
- explicit assessment progress such as "STEP 2 OF 4"
- stronger distinction between “session state” and “command state”
- command-response grouping
- visible retry/recovery affordance after an error
- explicit interrupted-session recovery state

Do not add any engine behavior. These are UI representations of existing or future state.

What to Remove or De-emphasize

The large decorative empty terminal region.

Repeated “local simulation” messaging can be visually reduced once the local state is established at session start.

Required states

Terminal requires a complete state model:

State| Required UI
First use| Explain workspace + where to type
Ready| Input clearly primary
Processing| Disable duplicate execution + show processing
Success| Successful response + next useful move
Partial success| Accepted command but incomplete workflow
Error| Error category + corrected next step
Invalid syntax| Syntax explanation
Sequence error| Previous prerequisite shown
Decision error| Evidence/context deficiency shown
Interrupted| Session preserved + Resume
Assessment ready| Assessment constraints explicit
Assessment active| No-hint state explicit
Assessment complete| Debrief + next action
Completed| Persisted state visible
Retry| Explain why retry is needed
Reference open| Clearly secondary to terminal
Focus mode| Full-screen workstation

The TypeScript state taxonomy at "Home.tsx:38-39" already anticipates many of these concepts, but implementation is incomplete.

Responsive issues

The mobile terminal architecture is strong.

The biggest concern is cumulative compression at very narrow widths:

- terminal title
- session data
- reference
- focus
- command field
- sticky input
- bottom navigation

At 360px and below, the CSS explicitly hides parts of terminal controls, which demonstrates an intentional attempt to prevent collision.

Evidence: "index.css:179-186", "207-215", and "240-245".

The next revision should prioritize command entry and output above all terminal chrome at 320px.

Accessibility issues

- Terminal uses correct input semantics.
- Command input has a useful accessible label.
- Visible focus is implemented globally.
- Reduced motion is addressed.

However:

- "terminal-help" controls are small.
- The command history is not represented as a semantic list/log.
- "terminal-body" uses visual structure more than semantic structure.
- The state change should be announced more deliberately when a command executes.
- The reference drawer needs focus management.
- Focus mode needs modal/focus semantics rather than only CSS.

Interaction issues

Empty submission silently becomes FQD

Source: "Home.tsx:275"

const nextCommand = command.trim().toUpperCase() || "FQD";

This is not a UI design preference; it is a functional simulation behavior.

For the eventual real engine, the UI must not imply that an empty command is an intentional FQD submission.

Classification: Engine dependent / Functional safety.

Reference increments hint count simply by opening

Source: "Home.tsx:303"

Opening Reference increments "hintCount".

That is a meaningful assessment-state decision and must remain an engine/content contract, not become a UI assumption.

The visual layer should distinguish:

- reference opened
- hint consumed
- hint available
- hint used

without defining those meanings itself.

Dependency classification

Mixed

Visual hierarchy, focus, layout, target sizing = UI-only.

Command semantics, scoring, hints, assessment rules, command engine = Engine/Data/Content dependent.

---

5.3 Assessment Debrief

Primary user task

Understand what happened during the assessment and decide the next training move.

Primary action

Retry / move to next appropriate training state.

What to Keep

- “Operationally ready” / “Review one workflow pass” / “Rebuild the sequence” language.
- Accuracy
- Workflow order
- Hint discipline
- Next training move
- Error taxonomy

Evidence: "Home.tsx:233-236".

This is one of the strongest examples of translating evidence into action.

What to Change

The wording “Operationally ready” is too strong for the current local illustrative engine.

It should only appear when a production scoring rubric explicitly defines the threshold and competency scope.

What to Add

A concise explanation of the assessment scope:

- command set assessed
- sequence assessed
- scenario/context assessed
- whether this is a course milestone or a practice checkpoint

What to Remove or De-emphasize

Avoid treating the overall score as the primary truth.

The assessment should communicate:

what is reliable / what failed / why / what to practice next.

Required states

- not started
- active
- saved
- review
- passed
- retry
- interrupted

Dependency classification

State/Data dependent

---

5.4 Scenarios

Primary user task

Select a realistic operational scenario and enter it with enough context to understand what is being tested.

Primary action

Start / Resume / Review scenario.

What to Keep

The scenario detail panel is excellent.

It includes:

- mission identity
- category
- difficulty
- time
- scenario type
- skills
- operational next move
- coach readout
- CTA

Evidence: "Home.tsx:321-335".

This is much closer to a real operational training workstation than generic “course card” design.

What to Change

Scenario summary statistics are too dashboard-like:

- "23 / 40"
- "82%"
- "+6% from last 7 days"
- "92%"
- “Needs improvement”

These are hardcoded prototype values.

Evidence: "Home.tsx:335" and related constants in "Home.tsx:82-88".

The interface must not make these appear like validated trainee evidence unless they are.

What to Add

Curriculum and job-role context should eventually be visible:

- Basic / Advanced
- module/lesson
- operational competency
- relevant airline-role skill
- assessed command family

These are Content/Data dependencies.

What to Remove or De-emphasize

Decorative route-map treatment should never compete with the mission brief.

It currently works because the mission text remains primary.

Required states

- not started
- recommended
- in progress
- paused
- completed
- review available
- failed/retry
- unavailable
- locked by prerequisite

Responsive issues

The scenario list/detail split is structurally good on desktop and collapses naturally on mobile.

The mobile scenario screenshot shows strong vertical ordering.

At narrow widths, the detail panel is tall; this is acceptable because the trainee needs context, but the primary CTA should remain reachable without requiring excessive backtracking.

Interaction issues

Scenario “filters” are only partially real.

The filter tabs do filter.

The visible “Filters” button only displays a toast:

"Home.tsx:335".

This creates a misleading distinction between filter control and filter state.

Dependency classification

Mixed

UI structure = UI-only.

Scenario definitions, competency mapping, results = Content/Data dependent.

---

5.5 Growth Record

Primary user task

Interpret recent evidence and decide how to convert it into the next learning action.

Primary action

Practice the identified gap.

What to Keep

This is another strong area.

Particularly successful:

- Record / History / Reports
- Latest evidence banner
- “Read evidence → Practice the gap → Apply in scenario”
- strengths vs needs attention
- skill selection
- targeted practice
- recent activity

The screenshots confirm the hierarchy is readable even on mobile.

What to Change

The interface currently mixes three evidence levels:

1. local assessment evidence
2. summarized learner interpretation
3. broad professional readiness

These need stronger separation.

For example:

"Growth Record" can safely say:

«“Pricing & Ticketing · 78% overall”»

but:

«“Readiness is a pattern, not a single score.”»

is a much broader interpretation.

That interpretation must be tied to a validated competency framework before being used as authoritative learner status.

What to Add

An evidence provenance treatment:

- Assessment source
- Date
- Attempt
- Skill
- Evidence type
- Local/illustrative vs verified

This is particularly important for future migration to the real engine.

What to Remove or De-emphasize

The “Backup” control currently says:

«“A local evidence backup point has been created.”»

but no actual backup model is visible in the source.

This is prototype theater unless that concept is intentionally part of the future product.

Recommendation: either clearly label it as a preview control or remove it from the design reference until the behavior is defined.

Required states

- no evidence
- latest evidence
- historical evidence
- review recommended
- evidence superseded
- evidence incomplete
- evidence unavailable
- scenario-confirmed
- assessment-only

Accessibility issues

Growth uses very small text extensively.

The screenshot shows dense mono labels that look stylish but will not support low-vision use well.

Dependency classification

Mixed

---

5.6 Progress Tracking

Primary user task

Understand whether performance is improving and identify the next operational practice.

Primary action

Open targeted practice / run another assessment.

What to Keep

- Current vector readout
- trend signal
- assessment history
- chart + data table
- next useful readout

The “View data table” fallback is a very good accessibility direction.

Evidence: "Home.tsx:206".

What to Change

The page risks becoming a conventional analytics dashboard.

The product mission is not “analytics.”

It is:

operational readiness through evidence.

Tracking should therefore visually privilege:

1. skill
2. behavior
3. trend
4. next action

rather than KPI quantity.

What to Add

For every tracked metric:

- what it measures
- why it matters
- how it affects practice

The chart itself should be secondary.

What to Remove or De-emphasize

The “Trend Average” KPI can be visually reduced.

A single average is less educationally useful than a skill-specific interpretation.

Accessibility issues

The table fallback is excellent.

The chart itself is still largely visual. The "aria-label" attached to ".tracking-graph" does not provide a robust semantic data series by itself.

The data table should become the authoritative accessible representation.

Dependency classification

Data/UI mixed

Chart presentation = UI.

Trend calculation, scoring, threshold meanings = Data/Engine dependent.

---

5.7 Shared Shell / Navigation

Keep

- Persistent desktop sidebar from "index.css:129-133"
- Mobile bottom navigation
- strong current-state styling
- centered Practice position on mobile
- topbar context

Change

The mobile bottom navigation prioritizes:

"Route / Apply / Train / Evidence / Trend"

This is visually clean, but “Train” as the central item is somewhat game-like.

A better semantic framing is still possible without changing the route model: Practice should remain central because it is the workstation, not because it is the “game loop button.”

Accessibility

The bottom-nav touch areas are reasonable, but icon-only semantics are not sufficient for low-vision users when the labels are rendered at 7–8px.

Source: "index.css:118-119" and later mobile overrides.

Dependency classification

UI-only.

---

5.8 Error Boundary / Not Found

Primary task

Recover from an unavailable route or unexpected application failure.

Current status

"ErrorBoundary.tsx" exists but is not mounted from "App.tsx".

"App.tsx" renders:

return <Home />;

No error boundary is applied.

"NotFound.tsx" exists but is also not used by the current custom route mapping.

Important issue

The existing "NotFound" design is visually inconsistent with AeroBridge:

- light background
- generic card
- generic blue CTA
- generic SaaS/utility aesthetic

This would break product identity immediately if exposed.

ErrorBoundary issue

The current error boundary renders the full error stack directly:

"client/src/components/ErrorBoundary.tsx:32-36"

That is inappropriate for an end-user training workstation.

The target UI should present:

- concise operational failure message
- safe explanation
- retry/reload
- preserve training context where possible
- no raw stack trace

Dependency classification

Architecture / UI mixed

The design specification can define the visual state.

Integration into the application root is an implementation/architecture concern and should not be solved by page-level styling.

---

6. Terminal Deep Audit

6.1 Does the Terminal genuinely feel like the primary workstation?

Yes, with reservations.

Evidence:

- dedicated terminal panel
- darker surface
- distinct command language
- large command area
- command input
- reference
- coach
- focus mode
- session readout

Source: "Home.tsx:302-310", "index.css:233-244".

The visual intent is strong enough that the Terminal can become the definitive product workstation.

The reservation is that the surrounding Practice page still contains:

- task strip
- tabs
- coach
- footer metrics
- other status elements

which can collectively compete with the working surface.

The terminal should be the unquestioned center of gravity.

---

6.2 Can the trainee understand session state within seconds?

Mostly yes.

The terminal header communicates:

- session state
- command state
- log number

Source: "Home.tsx:303".

This is a strong pattern.

The issue is that the top-level Practice status also contains:

- “Local session”
- timer

creating multiple session-state locations.

Target state should establish a clear hierarchy:

Session identity → workflow state → command state → timer

rather than four semi-independent signals.

---

6.3 Can the trainee find and use command input with minimal friction?

Yes on mobile and desktop conceptually.

The input is clearly styled and visually anchored.

The mobile input is especially well prioritized.

Source: "index.css:236, 243".

Potential improvements:

- stronger persistent focus cue
- clearer relationship to current command step
- explicit processing state
- explicit correction path after errors

---

6.4 Is output/readability comfortable for long sessions?

Not yet fully.

The intended typography is correct:

"--font-mono"

but the source does not actually load IBM Plex Mono.

The terminal output itself is compact, and the large blank region creates visual quiet, but long-session readability is not proven.

The output needs:

- stable vertical rhythm
- semantic grouping
- slightly stronger response text
- less dependence on faint labels
- clearer distinction between instructional text and actual GDS-like output

The current design can feel like a polished prototype terminal rather than an authentic operational training terminal because the instructional metadata competes with the command-response content.

---

6.5 Output, input, history, feedback, reference, coach, closure

Output

Good hierarchy, but too much empty space.

Input

Strong.

History

Present and useful.

Arrow Up/Down history navigation is a good operational affordance.

Evidence: "Home.tsx:265-272".

Reference

Good concept.

The reference is clearly secondary and contextual.

However, opening it increases hints, which is a state/assessment rule, not simply a presentation action.

Coach

Good concept and appropriately worded:

«“Guidance without shortcuts.”»

This strongly supports the educational mission.

Closure

The assessment report is good.

However, completion should move the trainee toward the correct next layer more explicitly:

Assessment → evidence interpretation → targeted practice or scenario.

Currently the report itself ends mainly with Retry.

---

6.6 Success / Error / Warning / Invalid / Processing / Interrupted

The prototype visually supports:

- success
- error
- warning
- review
- completed
- locked

but does not yet have an equally strong language for:

- processing
- interrupted
- recoverable failure
- partial success

The state taxonomy exists in TypeScript but not fully in the UI.

This is an important design-system opportunity because aviation software depends heavily on precise operational state language.

---

6.7 Mobile Terminal order

The intended mobile order is mostly correct:

1. Practice context
2. task
3. mode
4. terminal
5. command input
6. coach
7. summary metrics
8. navigation

This is appropriate.

The primary change should be to ensure that the command input never loses priority to:

- coach
- metric footer
- global navigation
- decorative terminal header content.

---

6.8 Focus mode

Focus mode is a strong idea and should be retained.

Source: "index.css:193-200", "233-244".

It is particularly valuable for the real product because a trainee may spend extended time performing command sequences.

Target-state requirements:

- clear entry point
- clear exit point
- session identity retained
- command input remains reachable
- no accidental loss of context
- accessibility focus management
- keyboard Escape behavior if appropriate
- reduced-motion compliance

The current implementation visually behaves like a full-screen layer but is not semantically a modal/dialog region.

---

7. Shared Design System Audit

7.1 Tokens

Strengths

The source has a clear foundational token set:

- navy surfaces
- line colors
- text hierarchy
- blue
- cyan
- green
- amber
- violet
- red
- radii
- shadows
- easing
- typography

Source: "index.css:4-28".

Later, additional "--ab-*" tokens are added at the bottom of the stylesheet.

Gap

The second token layer ("--ab-surface-*", "--ab-border", etc.) overlaps conceptually with the original tokens.

This indicates refinement accumulation.

The eventual design system should have one canonical token vocabulary.

Recommendation

Normalize into:

- semantic surface tokens
- semantic border tokens
- text tokens
- status tokens
- interaction tokens
- typography tokens
- motion tokens

Do not create route-specific design tokens unless they represent a true semantic state.

---

7.2 Typography

This is one of the most important issues.

The CSS declares:

- ""Space Grotesk""
- ""Cairo""
- ""IBM Plex Mono""

but there is no corresponding font loading in "client/index.html".

The Google Fonts example is explicitly commented out.

There are also no local font files in the archive.

Therefore the actual typography may depend on whatever fonts are available on the user's device.

Target

Use a deterministic font strategy.

For the final engine:

- display/UI: a stable proportional UI font
- Arabic: a tested Arabic font with matching metrics
- command/readouts: a stable monospace font
- numerical values: tabular numerals
- command strings: monospace
- explanatory text: proportional

Arabic

This must be treated as a first-class requirement, not a future skin.

The interface contains an EN/AR control now, but the source does not implement a true Arabic layout or typography system.

The Arabic requirement should include:

- RTL layout
- mirrored navigation where appropriate
- correct text direction in mixed Arabic/English strings
- preserved left-to-right command syntax
- numerical/date treatment
- bidi isolation for GDS commands and airport/airline codes
- tested line breaks

Dependency: Content/Architecture/UI mixed.

---

7.3 Surfaces and Cards

The surfaces are visually strong.

However, almost every section is a card/panel.

This creates a risk of “dashboard accumulation.”

Target state should introduce stronger distinction among:

- workspace
- supporting context
- evidence
- secondary utility
- historical record

Not every section should look equally elevated.

---

7.4 Buttons

Primary/ghost/text actions are coherent.

The system needs a clearer distinction between:

- primary operational command
- navigation
- contextual utility
- destructive/restart
- informational link

The current text-action style is visually good but can be too small.

---

7.5 Inputs

The command input is strong.

Other form/input patterns are effectively absent from the prototype, meaning the broader input system is not yet proven.

---

7.6 Status states

The color semantics are coherent:

- green = success
- amber = warning/review
- red = error
- blue/cyan = active/information

The key missing layer is shape/icon/label redundancy.

Status should communicate through:

icon + label + text + color

rather than color alone.

Some parts already do this well.

---

7.7 Metrics

Metrics are visually attractive, but the system currently overuses:

- percentages
- rings
- micro-bars
- trend arrows

This creates subtle gamification.

Aviation training should feel measured, not gamified.

Recommendation:

Use progress visualization when it answers a concrete operational question.

Do not use progress visualization merely because a number exists.

---

7.8 Navigation

Desktop sidebar:

- strong
- stable
- appropriate for a workstation

Mobile bottom rail:

- strong
- compact
- intentional

The only concern is that the rail uses extremely small labels.

---

7.9 Overlays

Reference drawer:

Good structure.

Needs:

- focus trap
- Escape
- clear relationship to terminal
- possibly "aria-expanded"
- clear return focus

Mobile drawer:

Good visually.

Needs:

- focus management
- Escape
- background scroll lock
- semantic dialog/navigation labeling

---

7.10 Spacing

Spacing is generally disciplined.

The main issue is not inconsistent spacing but density variance:

- some areas are impressively dense
- some areas have large cinematic emptiness

This is particularly visible in the Terminal.

---

7.11 Radius and elevation

Radius system is coherent.

Elevation is attractive but sometimes excessive.

The strongest surfaces should be:

1. primary workstation
2. primary action
3. evidence

not every panel.

---

7.12 Motion

Motion is purposeful enough to keep.

Positive evidence:

- reduced-motion rules are explicitly present
- number animations are constrained
- terminal-entry animation is modest
- focus mode is structured rather than flashy

Recommendation:

Retain motion but reduce repeated animation when navigating repeatedly between evidence views.

---

8. Responsive and Accessibility Audit

8.1 Desktop

Source breakpoint:

"@media (min-width: 1100px)".

Desktop changes include:

- persistent sidebar
- hidden bottom nav
- increased page padding
- multi-column layouts
- expanded Practice terminal
- wider Growth layout
- 3-column level grid

This is a sound workstation strategy.

Desktop risk

The 238px sidebar plus large content padding means the functional workspace can become unnecessarily narrow on mid-sized laptop screens.

Manual validation required at:

- 1024px
- 1152px
- 1280px
- 1366px
- 1440px

---

8.2 Laptop / Tablet

The breakpoint is relatively coarse:

- below 740px = mobile
- 740–1099px = tablet/smaller desktop-like mode

This is likely to work, but there is no dedicated intermediate layout strategy for 768–900px widths.

Manual validation required.

---

8.3 430px

The source uses the general mobile layout through 739px.

There is a 480px rule that hides the topbar eyebrow.

This is a good simplification.

The 430px composition should remain readable.

Validation needed for:

- terminal header
- task-strip truncation
- bottom nav labels
- scenario cards
- growth report cards

---

8.4 390px

The source specifically refines Terminal controls at "max-width: 390px".

That is good evidence of intentional design.

However, the design still needs manual validation for:

- reference/focus controls
- terminal title
- input
- sticky footer
- bottom nav

---

8.5 360px

The source explicitly handles 360px.

Good evidence:

- topbar spacing reduced
- avatar reduced
- language control reduced
- terminal header stacks
- session readout moves below title
- terminal control text collapses

This is a strong responsive refinement.

---

8.6 320px

There is no dedicated 320px layout.

The application sets:

body { min-width: 320px; }

but relies primarily on the 360px rules.

That is not enough to establish a verified 320px workstation.

Recommendation

Do a dedicated 320px visual pass.

Priority areas:

1. terminal input
2. bottom nav
3. topbar
4. scenario detail
5. growth reports
6. progression hero

---

8.7 Contrast

The design has many successful high-contrast pairs.

However, the muted text token:

"--text-faint: #5d6a85"

against:

"--navy-950: #050914"

is approximately 3.66:1.

That is not sufficient for normal-size text under WCAG AA.

The problem is amplified because much of the UI uses 7–10px text.

This affects:

- eyebrows
- metadata
- activity timestamps
- helper text
- terminal state labels
- scenario metadata
- chart labels

Recommendation

Create a minimum readable-text rule:

- primary text: AAA preferred
- secondary text: AA
- metadata may be visually quiet but not below AA where it conveys meaning
- non-text decorative labels can remain subdued

---

8.8 Focus

Global ":focus-visible" styling is a strong foundation:

"index.css:28".

However, many custom overlay controls lack the surrounding focus management needed for:

- drawer
- reference panel
- focus mode
- search popover

---

8.9 Touch targets

Many buttons are appropriately sized.

Risk areas:

- text-action links
- terminal help buttons
- very compact utility controls
- bottom navigation labels below 44px visual height
- small reference example buttons

Aviation workflow training on mobile should favor at least 44×44px interactive zones for frequent actions.

---

8.10 State communication

There is good use of explicit text such as:

- Mastered
- Current focus
- Locked
- Review
- Completed
- Error

This is good.

Continue moving toward:

icon + text + color

for every operational state.

---

8.11 Charts

The “View data table” implementation is a strong accessibility pattern.

Target state:

- data table is not merely fallback
- chart and table represent the same dataset
- chart labels communicate trend
- keyboard interaction is not required merely to interpret the chart

---

8.12 RTL

Arabic is currently a visual toggle concept, not a demonstrated RTL implementation.

This must remain an explicit dependency.

No visual audit should treat EN/AR as implemented localization until RTL behavior is verified.

---

9. Priority Matrix

ID| Priority| Severity| Finding| Impact| Effort| Dependency| Affected routes/files| Phase
AB-001| P0| Critical| Prototype evidence/readiness appears authoritative in places where values are hardcoded/illustrative| Trust + educational validity| Medium| Data/Content/Mixed| Progression, Scenarios, Growth, Tracking, "Home.tsx"| P0
AB-002| P0| Critical| Terminal must remain visually and semantically primary during migration to real engine| Core learning workflow| Medium| UI/Engine boundary| Practice, "Home.tsx", "index.css"| P0
AB-003| P0| High| Complete Terminal state language is not implemented despite state taxonomy existing| Error recovery + learning quality| Medium| State/Engine dependent| Practice| P0
AB-004| P0| High| ErrorBoundary exists but is not integrated; raw stack is user-visible| Reliability + safety| Medium| Architecture/UI| "App.tsx", "ErrorBoundary.tsx"| P0
AB-005| P0| High| 404 screen breaks AeroBridge visual identity| Product trust| Low| UI| "NotFound.tsx"| P0
AB-006| P1| High| Declared fonts are not loaded/provisioned| Typography + Arabic readiness| Medium| UI/Content| "index.html", "index.css"| P1
AB-007| P1| High| Muted text contrast is insufficient for frequent small metadata| Accessibility| Low| UI| "index.css"| P1
AB-008| P1| High| Arabic switch does not demonstrate true RTL/mixed-script behavior| Saudi-market readiness| High| UI/Content/Architecture| "Home.tsx", global shell| P1
AB-009| P1| High| Empty command silently becomes FQD| Functional safety + learner trust| Low| Engine| "Practice"| P1/Engine
AB-010| P1| High| Assessment/report semantics can overclaim “operational readiness”| Professional safety| Medium| Content/Data| Practice/Growth| P1
AB-011| P1| Medium| Many visible actions only produce toasts| Affordance integrity| Low| UI| Progression/Growth/Scenarios| P1
AB-012| P1| Medium| Terminal contains too much decorative empty space| Long-session efficiency| Low| UI| Practice/CSS| P1
AB-013| P1| Medium| Reference opening doubles as hint consumption without visible semantic distinction| Assessment transparency| Medium| Engine/Data| Practice| P1
AB-014| P1| Medium| Chart accessibility relies on a separate optional table| Interpretation access| Low| UI| Tracking| P1
AB-015| P2| Medium| Navigation/learning loop is visually coherent but not fully explicit across Assessment/Growth/Tracking/Scenarios| Orientation| Medium| UI| Shared shell| P2
AB-016| P2| Medium| Too many cards/metrics compete with workstation hierarchy| Cognitive load| Medium| UI| All routes| P2
AB-017| P2| Medium| Design tokens are duplicated/overridden late in stylesheet| Maintainability| Medium| UI architecture| "index.css"| P2
AB-018| P2| Medium| 320px layout is not separately validated| Mobile reliability| Medium| UI| All mobile routes| P2
AB-019| P2| Low| Search control is a static quick-find prompt rather than a true navigation/search surface| Affordance clarity| Medium| Content/Architecture| Topbar| P2
AB-020| P2| Low| Growth “Backup” suggests functionality not represented in visible product model| Trust| Low| Mixed| Growth| P2
AB-021| P3| Low| Some decorative route-map/atmosphere treatments can be reduced in dense informational screens| Focus| Low| UI| Progression/Growth/Scenarios| P3
AB-022| P3| Observation| Skill trends use arrows such as “down” where the semantic meaning can be ambiguous| Interpretation clarity| Low| Content/UI| Growth| P3
AB-023| P3| Observation| Tiny monospace metadata creates visual sophistication at the expense of readability| Accessibility| Low| UI| All routes| P3

---

10. Target-State Design Revision Specification

10.1 Product-level target state

AeroBridge should feel like:

a premium airline training workstation that happens to use a modern interface, not a dashboard that happens to contain aviation content.

The visual hierarchy should be:

Workstation → Evidence → Next action → Context → Historical detail

not:

Cards → KPIs → Cards → Charts → Workstation.

---

10.2 Global shell

Desktop

- Persistent left navigation.
- Terminal remains the dominant destination.
- Topbar contains route context, language, search/quick-find, profile.
- Avoid excessive decorative chrome.

Mobile

- Bottom navigation remains.
- Practice remains central.
- Topbar remains compact.
- Mobile drawer remains secondary navigation.
- All frequent actions should have sufficiently large interactive zones.

---

10.3 Progression target state

The screen should communicate exactly three things in sequence:

1. Where am I?
2. What should I do now?
3. What comes after that?

Recommended visual order:

Current Vector → Resume → Current Stage Evidence → Next Stage → Full Map

The long-term stage map should never visually overpower the current action.

---

10.4 Practice target state

This should become the canonical AeroBridge workstation.

Terminal header

Required visible hierarchy:

Session → Workflow → Command State → Step

Example concept:

PRICING & TICKETING
SESSION ACTIVE · STEP 2 OF 4
COMMAND READY

Output

Use explicit groups:

- system context
- command
- response
- operational interpretation

The actual GDS response should visually dominate the explanatory metadata.

Input

The command field should:

- remain visually dominant
- clearly indicate focus
- support keyboard history
- show processing state
- prevent ambiguous duplicate execution
- retain context after errors

Coach

The coach should answer:

What does this result mean?

not merely:

What should I click next?

This maintains the “guidance without shortcuts” philosophy.

Reference

Reference should remain secondary.

Visually indicate:

- available
- opened
- hint consumed, if that is the actual rule
- unavailable during assessment

Do not let UI styling define assessment semantics.

Focus mode

Target state:

- full-screen workstation
- session identity persistent
- input persistent
- error feedback persistent
- keyboard-accessible
- screen-reader sensible
- no raw browser/desktop distractions

---

10.5 Assessment target state

Assessment should feel like a deliberate professional evaluation, not merely another tab.

Visual flow:

Assessment Ready → Assessment Active → Result → Interpretation → Next Action

The final result should prioritize:

1. what was demonstrated
2. what was inconsistent
3. why
4. what to practice next

The aggregate score is secondary.

---

10.6 Scenarios target state

Every scenario should eventually show:

- mission
- operational role relevance
- curriculum placement
- skill(s) tested
- prerequisites
- expected duration
- current status
- next action

The mission description should remain concise.

The visual mission-file metaphor is worth preserving because it supports the aviation workstation identity.

---

10.7 Growth Record target state

Growth should be the interpretation layer.

Each evidence item should answer:

- What happened?
- What does it mean?
- What remains unreliable?
- What is the next practice?
- What should be proven next?

The interface should avoid turning Growth into a social/progress “achievement” system.

---

10.8 Progress Tracking target state

Tracking should answer:

Is the learner getting closer to reliable execution?

Every metric should have contextual meaning.

Preferred structure:

Skill → evidence → trend → implication → practice

rather than:

metric → chart → metric → trend line.

---

10.9 Error / unavailable target state

AeroBridge failure screens must still look like AeroBridge.

Never fall back to generic white cards or generic utility layouts.

Required failure language:

- what happened
- whether progress is preserved
- what action is safe
- whether retry is available

No raw stack traces.

---

10.10 Prototype truthfulness

Every illustrative/mock screen should establish its status once, then use compact labeling thereafter.

Recommended conceptual labels:

- Local training simulation
- Illustrative response
- Preview evidence
- Sample learner record
- Demo-only readiness signal

The final UI should not repeatedly shout “mock,” but it must never create false confidence.

---

10.11 Curriculum alignment

The UI specification should reserve a consistent small metadata location for:

Course → Module → Skill → Exercise

The exact curriculum data must come from the approved EgyptAir Basic/Advanced content model.

Do not create placeholder mappings.

---

11. Phased Implementation Plan

P0 — Foundations / Safety

Objective

Protect the integrity of the future real engine and establish the visual contract.

Work:

- lock Terminal-first hierarchy
- define semantic UI state vocabulary
- define evidence provenance treatment
- remove misleading authoritative readiness presentation
- define error/recovery visual language
- define production-safe error boundary presentation
- ensure Not Found/fallback identity
- formalize UI/engine/data boundary

Dependencies

Before implementing the later UI, the team needs agreed definitions for:

- assessment state
- evidence state
- readiness terminology
- local vs verified evidence
- command state semantics

---

P1 — Terminal and UX Hierarchy

Objective

Turn Practice into the definitive reference screen.

Work:

- tighten terminal hierarchy
- improve output grouping
- reduce decorative empty space
- refine input and execution affordance
- define command/error/retry presentation
- formalize reference and coach hierarchy
- refine assessment closure
- formalize focus mode accessibility behavior
- mobile Terminal pass

This is the highest-value design work.

---

P2 — Shared System and All Screens

Objective

Normalize all routes into one mature AeroBridge product language.

Work:

- typography provisioning
- Arabic/RTL specification
- color contrast
- token cleanup
- card/elevation hierarchy
- button states
- overlay patterns
- navigation refinements
- Growth/Tracking interpretation hierarchy
- Scenario filter/action integrity
- responsive pass for 320/360/390/430 and desktop widths

---

P3 — Polish / Content / Optional Enhancements

Work:

- animation refinement
- micro-interactions
- refined visual imagery
- advanced scenario filtering
- richer evidence drill-down
- optional command-reference enhancements

Do not prioritize these before P0–P2.

---

12. Acceptance Criteria

Terminal

- The Terminal is visually dominant on every supported viewport.
- Command input is immediately identifiable without relying on color.
- A trainee can identify session state, command state, and current task within 3 seconds.
- Success, error, syntax, sequence, processing, and interrupted states are visually distinct.
- Output is readable without excessive zoom.
- Command history can be inspected without losing the current command.
- Reference behavior is visually secondary to command execution.
- Focus mode preserves session context.
- Assessment closure always presents a next action.
- No UI change modifies command execution semantics.

Navigation

- Current route is visible in desktop and mobile navigation.
- Practice remains the primary operational destination.
- Back/forward browser navigation restores the correct route view.
- Navigation labels remain readable at 320px.
- No visible control implies functionality that does not exist without being clearly labeled as preview behavior.

States

- Every major route has defined first-use, empty, loading, ready, in-progress, success, partial-success, error, retry, interrupted, completed, review, locked, and unavailable states where relevant.
- Color is never the only state signal.
- State language is consistent across routes.

Design system

- One canonical semantic token layer exists.
- Typography is deterministic and does not depend on unspecified device fonts.
- Small metadata meets approved accessibility thresholds.
- Buttons and frequent controls meet touch-target requirements.
- Primary, secondary, text, destructive, and utility actions have consistent state treatments.

All screens

- Every screen answers “What is this?”, “What should I do next?”, and “Why does this matter?”
- Decorative elements do not compete with operational content.
- Evidence is clearly distinguished from illustrative content.
- Readiness terminology is only used where validated.

Responsive

- Dedicated validation passes are completed at:
  - 320px
  - 360px
  - 390px
  - 430px
  - 768px
  - 1024px
  - 1280px
  - 1440px
- No horizontal scrolling occurs in standard route content.
- Terminal input remains usable at 320px.
- Bottom navigation remains operable at 320px.
- Focus mode remains usable on mobile.

Accessibility

- All interactive elements expose an accessible name.
- All state changes have appropriate semantics.
- Overlay opening and closing preserves focus correctly.
- Reference/drawer surfaces are keyboard accessible.
- Reduced-motion preference disables nonessential motion.
- Charts have equivalent accessible data representation.
- Arabic/RTL behavior is explicitly tested before enabling language switching as a production feature.

Motion

- Motion communicates state or hierarchy.
- No decorative animation distracts from command execution.
- Reduced-motion behavior preserves usability.
- Repeated metric animations do not create perceived instability in evidence-heavy screens.

Regression safety

- Existing command syntax behavior remains unchanged.
- Existing workflow sequence logic remains unchanged.
- Existing assessment scoring logic remains unchanged unless separately approved.
- Existing local persistence remains unchanged.
- Existing route URLs remain unchanged.
- UI changes do not create a second source of truth for engine state.
- UI does not fabricate command results, learner evidence, or readiness states.
- The visual layer must remain replaceable without altering core command/workflow logic.

---

13. Deferred Dependencies and Open Questions

Engine dependencies

Do not solve through UI invention:

- actual command parsing
- command validity
- command sequence rules
- session persistence semantics
- interruption recovery
- assessment scoring
- hint consumption
- command history persistence
- state transition ownership

The UI may present these states, but it must not redefine them.

Data dependencies

Required before production-quality Growth/Tracking:

- authoritative assessment records
- evidence provenance
- competency taxonomy
- trend rules
- readiness thresholds
- session history
- scenario outcomes

Content dependencies

Must be decided outside the visual layer:

- exact EgyptAir Basic curriculum mapping
- exact EgyptAir Advanced curriculum mapping
- Saudi airline-role competencies
- professional English objectives
- scenario difficulty rubric
- evidence interpretation rules

Architecture dependencies

- error-boundary integration
- not-found routing
- font provisioning
- RTL infrastructure
- persistent navigation semantics
- focus-management infrastructure

Product questions

1. What exact definition should AeroBridge use for “Saudi readiness”?
2. Is readiness a course-completion concept, competency concept, or employment-readiness concept?
3. Which assessments produce authoritative evidence?
4. Which metrics are learner-facing and which are instructor-facing?
5. When does a local practice result become official evidence?
6. Which terminology is approved for “mastered,” “ready,” “passed,” and “operationally ready”?

These must be resolved before the UI uses those terms as authoritative states.

---

14. Final Verdict

Status: Needs a focused revision pass before implementation as the definitive UI reference.

The prototype should not be redesigned from scratch.

Its strongest qualities should be preserved:

- Flight Deck Console identity
- deep navy foundation
- restrained blue interaction language
- green/amber operational states
- monospace command/readout treatment
- desktop sidebar
- mobile bottom rail
- terminal-first Practice
- evidence-driven Growth
- scenario mission framing
- next-action orientation

The highest-priority work is not aesthetic polish.

It is:

truthfulness → Terminal hierarchy → state completeness → accessibility → typography → curriculum provenance → responsive verification.

The most important specification principle for the later engineer is:

«The UI may interpret engine state, but it must never invent engine truth.»

AeroBridge is already visually distinctive enough to support a premium aviation-training identity. The next revision should make that identity more operationally trustworthy, more accessible, more explicit about evidence provenance, and even more centered on the Terminal as the place where professional skill is actually built.

The source should therefore be treated as a strong visual foundation and prototype reference, not yet as the final production design system.