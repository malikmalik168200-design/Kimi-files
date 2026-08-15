# AeroBridge Comprehensive Professional Design/UX Audit

**Scope:** Audit and implementation-ready specification only. No files modified, no code written, no architecture changed. Every finding below is either **source-verified** (traced to an exact file/line/class/selector in `AEROBRIDGE_SOURCE_CLEAN.zip`), **screenshot-verified** (confirmed against the six rendered mobile screenshots provided), or explicitly marked **requires live validation** where the prototype could not be executed in this review environment (see §2).

---

## 1. Executive Assessment

**Current product level:** AeroBridge is a genuinely well-crafted mobile-first prototype, not a generic template. It has a distinctive dark "Flight Deck Console" identity, a real (not decorative) design-token vocabulary, deliberate mobile-input engineering, and an exemplary reduced-motion implementation. The Practice/Terminal screen — correctly positioned as the product's core — shows evidence of a dedicated, later refinement pass (see §7, the `--ab-*` token layer) that specifically targeted "the terminal is the workstation" as a design goal. This is closer to a professional aviation-software product than a template with aviation words pasted on it.

**Strongest existing qualities (keep and protect):**
- **Terminal mobile ergonomics.** The command input forces `font-size: 16px` to prevent iOS auto-zoom, sits `position: sticky` above `env(safe-area-inset-bottom)`, and scrolls into view on focus — this is non-obvious, correctly-executed mobile engineering (§6).
- **Reduced-motion support.** A global `prefers-reduced-motion` catch-all (`animation-duration:.001ms!important`) is layered with dozens of component-specific refinements. This is more thorough than most production apps (§7).
- **Deliberate, restrained centering of Terminal in the mobile nav**, with a code comment stating the exact intent the audit brief asks about: *"Center the primary workspace in the mobile rail without turning it into a game control."* (`index.css`, bottom-nav `.is-primary` block, §6/§9).
- **A real accessible alternative to the one data visualization in the product** — the Progress Tracking bar chart has a genuine `role="table"` fallback inside a native `<details>` disclosure (TRK-01, §5.5).
- **Working cross-screen data flow within a session**: finishing an Assessment in Practice writes a real record to `localStorage` and both Growth Record and Progress Tracking immediately reflect it; History rows in both screens can hand a trainee back into Practice with context pre-loaded.

**Biggest risks (full detail in §5–§8, IDs referenced):**
1. **PRA‑01 — Critical.** The Terminal's Coach panel shows a hardcoded, red-styled *"FORMAT ERROR · CHECK ENTRY"* message with fabricated corrective text **before the trainee has typed anything**, directly beneath a correctly-neutral "AWAITING COMMAND" label. This is a first-use trust defect on the single most important screen in the product.
2. **GLB‑01 — Critical, product-level.** The EN/AR language toggle — present on every screen — is fully cosmetic: it flips a local highlight and fires a toast; `<html lang="en">` never changes, no `dir="rtl"` exists anywhere, and there is no translation layer. Given the platform's explicit mission (Saudi-market readiness, mixed English/Arabic operational content), this is the single largest gap between stated purpose and shipped behavior.
3. **GLB‑02 — Critical, foundational.** All three purpose-declared typefaces (`Space Grotesk` display, `IBM Plex Mono` terminal, `Cairo` Arabic) are referenced as CSS tokens but **never loaded** — the Google Fonts `<link>` block in `index.html` is commented out and explicitly marked for deletion, and no local font files exist. Every screen currently renders in browser/OS fallback fonts, not the designed typography.
4. **GLB‑04 — High, product-wide.** The primary call-to-action button used on every screen (`.primary-button`: white text on `--blue #6f8fff`) measures **2.98:1** contrast — a clear WCAG AA failure (4.5:1 required) on the product's most-repeated interactive element.
5. A recurring pattern of **illustrative summary numbers that don't correspond to the actual dataset** — Scenarios claims "23/40 completed," Progression claims "3 / 8 stages" against a defined set of 6, Growth Record's History tab claims "LOG 04/12" while rendering 3 — which, taken together, is the kind of inconsistency that quietly undermines the "precision, trustworthy" positioning the product is going for.

**Gap to the intended premium aviation workstation:** Narrower than a first glance at raw finding-count suggests. Most of what's wrong is shallow to fix (a font link, a viewport meta attribute, a button color, a hardcoded string) and none of it requires touching the engine, the command logic, or the assessment model. The exceptions are two real state-model questions that *do* need a product/engineering decision before UI work can "finish" them: whether Learn-mode hint usage should count toward Assessment scoring (PRA‑02), and what Arabic/RTL support is actually meant to be for this release (GLB‑01). Both are flagged as deferred dependencies in §13, not solved here.

---

## 2. Audit Method and Evidence

**What was inspected.** The complete contents of `AEROBRIDGE_SOURCE_CLEAN.zip` were extracted and read in full, not sampled:
- `client/src/pages/Home.tsx` (363 lines / ~60 KB) — every component read top to bottom: `BrandMark`, `Logo`, `useAnimatedNumber`/`AnimatedNumber`/`AnimatedBar`, `ProgressRing`, `Topbar`, `SideNav`, `BottomNav`, `StateNotice`, `ProgressTracking`, `SectionHeader`, `Progression`, `AssessmentReport`, `Practice` (the Terminal), `ScenarioCard`, `Scenarios`, `Growth`, `SkillRow`, and the top-level `Home` shell (routing, persistence, state wiring).
- `client/src/index.css` (408 lines / ~99 KB) — read in full: the `:root` design-token block, every `@media` breakpoint (11 distinct breakpoints found), every component style block, every `prefers-reduced-motion` and `hover:hover/pointer:fine` scoped rule.
- `client/index.html`, `client/src/App.tsx`, `client/src/main.tsx`, `client/src/const.ts`, `shared/const.ts`, `client/src/hooks/useMobile.tsx`, `client/src/contexts/ThemeContext.tsx`, `client/src/components/ErrorBoundary.tsx`, `client/src/pages/NotFound.tsx`, `client/src/components/ManusDialog.tsx`, `client/src/components/Map.tsx`, `package.json`.
- All six mobile screenshots (Progression; Scenarios list + detail; Practice/Terminal with Coach panel open; Growth Record — Record, History, and Reports tabs; Progress Tracking), used to visually confirm source-level findings and to establish real rendered layout at the captured viewport (~412–424 CSS px wide, Android Chrome).
- Contrast ratios for 17 color-token pairs were computed directly (WCAG relative-luminance formula) rather than estimated by eye; results are in §7 and §8.

**How the prototype was reviewed.** This review environment has no outbound network access and no browser-automation tool, and the project's own dependencies (React 19.2.1, Vite 7.1.7, Tailwind 4.1.14, Radix/shadcn primitives) are not installed and cannot be installed here. **The prototype could not be built or executed live.** Per the source-of-truth rules governing this audit, findings are therefore based on (a) direct reading of the actual source code and computed values (colors, breakpoints, ARIA attributes, event handlers) — the strongest form of evidence available, since it reflects exactly what ships, not an approximation of it — cross-checked against (b) the six real, browser-rendered screenshots supplied. Where a finding depends on live interaction this review could not perform (hover/touch timing, on-screen-keyboard overlap, focus restoration after a tab remount, screen-reader announcement behavior), it is explicitly labeled **"requires live validation"** rather than asserted as fact. This distinction is preserved throughout §5–§9.

**What was not verifiable:**
- Live keyboard-navigation flow and focus order (no browser session).
- Actual screen-reader announcement behavior (`aria-live` regions are confirmed to exist in source; what NVDA/VoiceOver/TalkBack actually speak was not tested).
- Rendering at 320px and 430px specifically — CSS rules for these exact widths were inventoried (§8), but pixel-level layout at those widths was not rendered.
- Whether the `AmadeusTraining` command-matching logic (inside `Practice`) produces domain-accurate feedback — this is content/engine territory, out of this audit's scope by the brief's own instruction, and is flagged as a deferred dependency, not evaluated.

**Source/screenshot conflicts found:** None material. The six screenshots match the source's conditional rendering exactly in every case checked (nav order, tab states, KPI numbers, coach default copy, chart values). One nuance worth recording: the on-screen visual style of the Coach panel's default error text could not be independently re-confirmed pixel-for-pixel against the CSS-computed red (`#f27076`), but the CSS rule producing it (`.coach-block code { color: var(--red) }`, unconditionally, with the success class never applying when no command exists) is unambiguous, so PRA‑01 is reported at source-verified confidence regardless.

---

## 3. Current Product and Information Architecture

**The product loop, as actually implemented**, is a five-view single-page app (`type View = "progression" | "practice" | "scenarios" | "growth" | "tracking"`) with real (not simulated) URL sync — `window.history.pushState` plus a `popstate` listener means each view has a shareable path and the browser back button genuinely works. This is a positive, easy-to-miss finding: many "prototype" builds fake navigation; this one has real, if hand-rolled, routing (the `wouter` dependency is installed and patched but not actually used for this — see GLB‑12-adjacent note in §7).

State is lifted once, in the root `Home` component, and passed down as props — `progressRecords` (persisted to `localStorage` under `aerobridge-progress-records`), `practiceContext` (a string, used to tell Practice what it's currently practicing), and `view`. This means the loop's cross-screen handoffs are **real, not decorative**:

- Progression's "Resume pricing workflow" → sets context, opens Practice.
- Scenarios' "Resume scenario" / "Start scenario" → sets context to the scenario's title, opens Practice.
- Growth Record's skill-detail CTA and "Open recommended practice" → sets context, opens Practice.
- Progress Tracking's history rows and "Open targeted practice" → sets context, opens Practice.
- Finishing an Assessment in Practice → computes a score, pushes a new record → Growth Record and Progress Tracking update immediately, in the same session.

**Where this is strong:** every screen genuinely converges on Practice, and every "next action" button that promises to open Practice actually does, with real context. The loop's spine is sound.

**Where transitions are weak, precisely:**
- **Numbers that don't reconcile with content.** The loop's supporting screens (Scenarios, Progression, Growth Record) each show a headline statistic implying a larger body of content than what is actually defined: Scenarios' "23 / 40 completed" against 5 defined scenario objects; Progression's "3 / 8 stages" against a 6-item `levels` array; Growth Record's "LOG 04 / 12" against 3 rendered history entries. None of these are wired to `.length` of their underlying arrays — they are separate hardcoded literals. This is the single most repeated pattern in the whole codebase and is the fastest thing undermining "operational readiness" framing, because a trainee who explores past the first screen will notice the arithmetic doesn't hold up.
- **Decorative controls that look like they advance the loop but don't.** Five `SectionHeader` "action" links (`View map`, `See all stages`, `View evidence`, `See patterns`, `View history`), the Scenarios "Filters" button, the Scenarios sort `<select>`, and the Growth Record "Backup" button all resolve to the same kind of generic `toast.info(...)` rather than performing the implied navigation or action (full inventory in §7). None of these break the *primary* loop (Progression → Practice → Assessment → Growth → Tracking → Scenarios all connect correctly), but they sit right next to the real, working CTAs and are visually indistinguishable from them until tapped.
- **"Route" is overloaded.** `navItems[0]` (the Progression screen) has the short label **"Route"** for the mobile bottom nav, while a separate, unrelated breadcrumb — **"YOUR ROUTE / 0N"** — appears at the top of *every* screen as the umbrella label for the whole five-step journey (01 Progression, 02 Practice, 03 Scenarios, 04 Growth Record, 05 Tracking, matching `navItems` array order). Because the mobile bottom nav *reorders* Practice and Scenarios for center-emphasis (§6, §9 GLB‑10), a trainee tapping the second visible bottom-nav icon lands on a screen whose own breadcrumb says "03," and the third icon lands on a screen whose breadcrumb says "02." Desktop's `SideNav` does not reorder, so this specific confusion is mobile-only.

**Net assessment of the IA:** the five-screen loop is the right shape and is genuinely wired end-to-end — this is not a case of disconnected mockup screens. The work needed is almost entirely about making what's *displayed* match what's *true* (real counts, real actions behind real-looking buttons) rather than restructuring anything.


---

## 4. Overall Scorecard

Scores are relative to the stated target (a premium, professional aviation training workstation), not to generic consumer-app norms. Evidence pointers reference the Finding IDs detailed in §5–§8.

| Dimension | Score /10 | Rationale |
|---|---|---|
| Visual Design | 8 | Distinctive, cohesive dark "Flight Deck" identity with real gradients, glows, and layered cards, not template defaults. Held back by GLB‑02: the typography that defines this identity (Space Grotesk / IBM Plex Mono) isn't actually loading. |
| UX (flow/loop) | 7 | The five-screen loop genuinely converges on Practice with real data handoffs (§3). Undercut by the recurring hardcoded-vs-real-data pattern (SCN‑01, PRG‑01, GRW‑03) and decorative dead-end CTAs (§7 inventory). |
| UI (components/controls) | 7 | Individual components — cards, chips, the terminal chrome, the coach panel — are well-built and purposeful. Consistency gaps (missing tab semantics, two parallel token systems) keep this from an 8–9. |
| Design System | 6 | Real, purposeful token vocabulary with genuine reuse across screens. GLB‑13 (a second, Terminal-scoped `--ab-*` token layer with slightly different values for the same semantic colors) and GLB‑12 (a property declared four times across the file) show accumulation that needs consolidating before it compounds further. |
| Typography | 4 | The *system* is well thought out — a display font, a monospace command font, and a dedicated Arabic font are all named as distinct roles (§7). None of the three are actually loaded (GLB‑02). This is the largest gap between design intent and shipped reality in the audit. |
| Color | 7 | Purposeful, restrained semantic palette (blue/cyan/green/amber/red mapped to clear roles) with mostly strong measured contrast (§7, §8). Four concrete, narrow AA failures (GLB‑04, GLB‑05, GLB‑06) prevent a higher score — all are safe, single-value fixes. |
| Information Hierarchy | 7 | Consistent eyebrow → title → body rhythm on every screen; clear "current focus" framing. The illustrative-vs-real-data mismatches (§3) undercut confidence in headline numbers specifically. |
| Terminal UX | 7 | The product's most deliberately engineered surface — see §6 for the full breakdown. One first-use-critical defect (PRA‑01) and one integrity question (PRA‑02) keep this from an 8–9 it's otherwise close to earning. |
| Navigation | 6 | Real URL-sync and working back-button (a genuine, non-obvious strength). Desktop/mobile order mismatch and the "Route" term overload (GLB‑10) are concrete, fixable confusion risks. |
| Responsive | 7 | Evidenced, deliberate tuning at exactly 390px and 360px with real overlap-prevention logic and code comments explaining the fix (§8). The true 320px floor (`body{min-width:320px}`) has no dedicated rule, and the 740–1099px tablet range has no distinct navigation identity (GLB‑16). |
| Mobile | 8 | Excellent low-level mobile engineering: safe-area insets, 16px input font to prevent iOS zoom, sticky command input, deliberate content-order (§6). |
| Accessibility | 5 | Real strengths — global `:focus-visible` styling, exemplary `prefers-reduced-motion` coverage, live regions on the terminal history and assessment report, a genuine table alternative to the one chart — sit alongside concrete, verified failures: disabled pinch-zoom (GLB‑03), primary-button contrast (GLB‑04), and a systemic absence of `aria-pressed`/`aria-selected`/`role="tab"` across every tab-like control in the app (GLB‑07, confirmed at zero occurrences). |
| Motion | 8 | The reduced-motion implementation is more thorough than most production apps — a global `!important` catch-all layered with dozens of scoped refinements (§6, §7). Nothing gratuitous; the one full-remount transition (Practice mode tabs) is short (220ms) and itself respects reduced motion. |
| Consistency | 6 | Reads as one product on first pass. The layered-edit evidence — GLB‑12, GLB‑13, and differing "this is illustrative/local" disclosure between screens (Practice states it explicitly and repeatedly; Scenarios and Growth Record's headline numbers do not) — shows where separate refinement passes haven't been reconciled. |
| Professional Maturity | 6 | Calm, precise tone throughout the copy that *is* real (Practice's "Illustrative local response layer loaded... verify with your course material" is genuinely good practice). Undercut fastest by exactly the kind of small thing a "precision" product can't afford: a Coach panel that shows a fake error on first load (PRA‑01), and buttons that promise navigation and deliver a toast (§7). |
| Functional Safety | 7 | The codebase is a single large component with lifted state and clear prop-drilling — legible for its size. Nearly every recommendation in this report is copy, CSS, or a small conditional-render change, not state-model surgery, which keeps implementation risk low. The one exception (PRA‑02) touches shared state deliberately and is flagged as its own deferred item rather than folded into a UI fix. |

**Method note:** scores reflect gap-to-target, not raw quality — a 6 here means "solid, with specific named issues," not "broken." No score above substitutes for the underlying evidence; every score is traceable to findings in the sections that follow.

---

## 5. Screen-by-Screen Audit

### 5.0 Shared Shell (Topbar, SideNav, BottomNav, Mobile Drawer)

**Primary user task:** Orient within the five-view loop and reach any view in one action from anywhere.
**Primary action:** Tap a nav destination (bottom nav on mobile, sidebar on desktop, hamburger drawer as a secondary path).

**What to Keep:**
- Real URL sync with working back/forward (`pathToView`/`pushState`/`popstate` in `Home()`) — genuinely functional, not simulated.
- The deliberate, restrained center-emphasis on the mobile bottom nav's Practice/Train button (`.is-primary`: tinted background + top inset highlight, not a heavy FAB) — the accompanying source comment states the exact intent this audit was asked to verify.
- `color-scheme: dark` set on `html`, global `:focus-visible` styling on all core interactive tags, `min-width:320px` as an explicit, deliberate design floor on `body`.

**What to Change:**
- **[GLB‑10] Navigation order mismatch between desktop and mobile.**
  *Evidence:* `navItems` array order (`Home.tsx`) is Progression, Practice, Scenarios, Growth, Tracking — this drives `SideNav` directly and drives the "YOUR ROUTE / 0N" breadcrumb numbering on every screen. `BottomNav` reorders via `const orderedItems = [navItems[0], navItems[2], navItems[1], navItems[3], navItems[4]]` — Progression, **Scenarios, Practice**, Growth, Tracking — specifically to center Practice. Screenshots confirm: mobile bottom nav reads "Route, Apply, Train, Evidence, Trend" (2nd/3rd swapped vs. canonical order).
  *Impact:* A mobile trainee tapping the 2nd bottom-nav icon lands on Scenarios, whose own breadcrumb reads "YOUR ROUTE / 03" — not "02." Tapping the 3rd icon lands on Practice, whose breadcrumb reads "02." The position in the tab bar and the position claimed by the screen itself disagree, mobile-only.
  *Severity:* Medium. *Priority:* P2. *Category:* Content (the breadcrumb numbering scheme) + UI (whether reordering is kept). *Changes:* content/copy, not architecture. *Confidence:* High (fully source-verified).
  *Recommendation direction:* Two independent, non-conflicting options for a later engineer to choose between: (a) keep the mobile center-emphasis reorder but change the breadcrumb from a fixed "YOUR ROUTE / 0N" sequence number to a non-numeric wayfinding label (e.g., an icon + the view's own name) so it can't disagree with tab position; or (b) keep the numbered breadcrumb but compute it from each view's position *within the currently-displayed nav order* rather than the canonical array. Do not do both — pick one source of truth for "where am I in the sequence."
  *Acceptance criteria:* On the narrowest supported viewport, tapping each of the five bottom-nav icons in left-to-right order never produces a breadcrumb/label that a trainee could read as "out of order" relative to the icon's position.

- **[GLB‑10b] "Route" is used for two different things at once.** The bottom nav's short label for the Progression screen specifically is "Route" (`navItems[0].short`); the eyebrow "YOUR ROUTE / 0N" on every screen is the umbrella label for the whole five-step journey. *Severity:* Low–Medium. *Priority:* P2. *Category:* Content. *Confidence:* High. *Recommendation:* rename one of the two — e.g., the Progression tab's short label to something distinct from the persistent breadcrumb term ("Route" the destination vs. "Route" the journey should not share a word), since they refer to different things at different scales.

- **[GLB‑14] Mobile hamburger drawer duplicates BottomNav with no unique content.** *Evidence:* the mobile-drawer's list is `navItems.map(...)` — the identical five destinations already reachable via `BottomNav`, no additional items (no settings/help/account). *Impact:* a second full-screen-overlay path to the same five taps, on a product that otherwise minimizes navigation friction. *Severity:* Low (Observation). *Priority:* P3. *Category:* Content/Product decision, not a UI bug. *Confidence:* High. *Recommendation:* either give the drawer content the bottom nav doesn't have (account, settings, help, sign-out — none currently exist in-product, so this is a product-scope question, not something to invent here) or fold the hamburger into a lighter-weight affordance. Flagged as an open question in §13, not solved here.

**What to Add:** Nothing structural — the shell's job (get anywhere in one tap) is already accomplished. The additions needed are correctness fixes above, not new elements.

**What to Remove or De-emphasize:** Nothing in the shell itself; see §7 for the inventory of non-functional header controls (search, profile chip, language toggle) which live in `Topbar` and are addressed there as a system-wide pattern rather than per-screen.

**Required states:** default, active-route (confirmed via `aria-current` — present, good), and for the drawer: open/closed (confirmed via `drawer-in` keyframe, reduced-motion safe).

**Responsive issues:**
- **[GLB‑16] Tablet range (740–1099px) has no distinct navigation identity.** *Evidence:* `.side-nav{display:none}` and `.bottom-nav{display:none}`/`.mobile-menu{display:none}` both flip at exactly `min-width:1100px`; meanwhile content grids (`scenario-layout`, `growth-overview`, level grids) go multi-column starting at `min-width:740px`. Between 740–1099px, the app shows desktop-density multi-column content above/beside mobile-style bottom-nav-plus-hamburger chrome. *Severity:* Medium. *Priority:* P2. *Category:* UI-only (a CSS breakpoint question). *Confidence:* High that the structural fact is true; **requires live/visual validation** to confirm whether it reads as awkward in practice, since a bottom-nav-on-tablet pattern is common and not inherently wrong. *Acceptance criteria:* render the shell at 768px, 834px, and 1024px and confirm the navigation chrome and content density feel like one coherent decision, not two breakpoints that happen to overlap.

**Accessibility issues:**
- **[GLB‑03] Viewport disables pinch-zoom.** *Evidence:* `client/index.html` — `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">`. *Impact:* low-vision users cannot zoom the page; a recognized WCAG 1.4.4/1.4.10 conformance issue. *Severity:* High. *Priority:* P1 (P0-eligible given trivial fix cost). *Category:* UI-only. *Confidence:* High. *Recommendation:* remove `maximum-scale=1` (and add `user-scalable=yes` if being explicit). *Acceptance criteria:* pinch-to-zoom and browser zoom both work on every screen without the layout breaking below 400% per WCAG 1.4.4, or a documented exception is recorded if a specific interactive surface (e.g., the terminal) needs a deliberate carve-out.
- **[GLB‑07] Systemic missing ARIA state on tab-like controls.** *Evidence:* a full-file scan of `Home.tsx` finds `aria-label` ×17, `aria-hidden` ×4, `aria-live` ×2, `aria-current` ×1, and **zero** occurrences of `aria-pressed`, `aria-selected`, `aria-expanded`, or `role="tab"`/`role="tablist"` anywhere in the 363-line file. This affects every visually tab-like segmented control in the product: Practice's Learn/Practice/Assessment `mode-tabs`, Progress Tracking's Overall/Accuracy/Sequencing `metric-switcher`, Progression's Technical/Customer Service `track-tabs`, Growth Record's Record/History/Reports `growth-tabs`, and Scenarios' All/Not started/In progress/Completed `filter-tabs` — five separate control groups, one shared gap. *Impact:* screen-reader users get "button," not "tab, selected" — the current selection state is not programmatically exposed anywhere in the product. *Severity:* High (systemic). *Priority:* P1. *Category:* UI-only (ARIA attributes, no visual or logic change). *Confidence:* High (exhaustively grep-verified, not sampled). *Recommendation:* apply `role="tablist"`/`role="tab"`/`aria-selected` (or, where the control is closer to a toggle than a tab panel switch — e.g., the metric-switcher — `aria-pressed`) consistently across all five groups from one shared pattern, not five separate implementations. *Acceptance criteria:* every one of the five control groups above exposes its current selection to assistive technology; a screen-reader user can determine which tab is active without relying on visual color alone.

**Interaction issues:** none beyond what's captured above.

**Dependency classification:** all shell findings are **UI-only** except GLB‑14 (drawer content), which is a **product-scope/Content** decision.

---

### 5.1 Progression

**Primary user task:** Understand where the trainee currently stands in the curriculum and what to do next.
**Primary action:** "Resume [current] workflow" → opens Practice with context pre-set.

**What to Keep:**
- The "Continue where you left off" hero card (current level name, level number, command-set fraction, time estimate, `ProgressRing`) is a strong, single, unambiguous next action — exactly what a "Progression → next action" screen should lead with.
- Three genuinely distinct level-card interaction states (locked → contextual toast naming the prerequisite; current → opens Practice; mastered → expands an evidence note) — a real, working state model, not a static list.
- `ProgressRing` and `AnimatedBar` both correctly respect `prefers-reduced-motion` via the shared `useAnimatedNumber` hook.

**What to Change:**
- **[PRG‑01] "3 / 8 stages" does not correspond to any defined content.**
  *Evidence:* `<strong><AnimatedNumber value={3} /> / 8 stages</strong>` — both numbers are literal, hardcoded values in the JSX, not derived from `levels.length` (which is **6**, confirmed by counting the `levels` array: Sign-in & Encode, Availability & Sell, Pricing & Ticketing, PNR Creation, Ancillaries & Special Services, Queues & PNR Management). The 8-segment dot indicator directly below it is likewise not tied to `levels.length`.
  *Impact:* a trainee who counts the visible stage cards (6, all shown under "See all stages") against the claimed total (8) will find the product's own numbers don't add up — this is the fastest way to erode trust in a product whose stated brand promise is precision.
  *Severity:* Medium-High. *Priority:* P1. *Category:* Content/Data-dependent (not fixable by restyling — either the two undefined stages need real content, or the copy/indicator need to honestly reflect 6). *Confidence:* High (exact literal values confirmed in source). *Recommendation direction:* do not silently change "8" to "6" without a product decision — it's possible 2 more stages are intentionally planned and simply not yet authored, in which case the honest fix is to label the *visible* set correctly ("3 of 6 available now") rather than imply 8 exist today. *Acceptance criteria:* the fraction and dot-count shown are always derived from the same array the stage list below renders, so they cannot diverge again.

- **[PRG‑02] Selecting "Customer Service" track doesn't change the milestone list.**
  *Evidence:* the Technical/Customer Service `track-tabs` toggle updates local `track` state, which is read by exactly one paragraph (`track-description`) directly below it. The "STAGE MAP / Technical workflow milestones" heading and the six level cards beneath it map over the single, unconditional `levels` array — `track` is never referenced there.
  *Impact:* after selecting "Customer Service," the page shows a Customer-Service description paragraph immediately above a section still explicitly labeled "**Technical** workflow milestones," still listing GDS/Amadeus-technical stage names. Given the brief's own instruction that every product division must serve genuine learning progression, this is the clearest concrete instance where a division's selection doesn't propagate.
  *Severity:* Medium-High. *Priority:* P1/P2 (P1 for the honesty fix, P2 for full content). *Category:* Content/Data-dependent (a real Customer Service stage set doesn't exist yet) + UI (the grid needs to read `track` state once that content exists). *Confidence:* High. *Recommendation direction:* until Customer Service content exists, the safest UI-only interim fix is to make the toggle honestly reflect availability (e.g., a "content coming soon" state for the second tab) rather than let it silently leave stale Technical content on screen under a mismatched selection. *Acceptance criteria:* selecting either track never leaves a heading or card set referencing the *other* track's name on screen.

- **[PRG‑03] Expandable "mastered" cards are weakly discoverable.**
  *Evidence:* clicking a mastered level card toggles an inline `level-detail` note, but the card's trailing icon is a `Check` (implying "done, nothing more here") in every state, doesn't rotate/change on expand, and no `aria-expanded` is set on the button.
  *Impact:* the interaction works but nothing before the first click suggests it's available.
  *Severity:* Low-Medium. *Priority:* P2. *Category:* UI-only. *Confidence:* High. *Acceptance criteria:* a mastered card visibly communicates it's expandable before the first tap (icon change, chevron, or subtitle text), and exposes `aria-expanded` reflecting state.

**What to Add:** nothing structural.

**What to Remove or De-emphasize:** the "View map" and "See all stages" `SectionHeader` actions are non-functional (see §7 systemic inventory) — until wired to a real destination, consider removing the arrow-icon affordance specifically here, since it visually promises navigation this screen (uniquely, as the trainee's entry point) can least afford to under-deliver on.

**Required states:** first-use (no progress yet — not currently distinguishable in source from "some progress"; flagged as unverified, low confidence, worth a design decision), in-progress (current, shown), all-mastered (not observable in current mock data — worth confirming the hero card's copy still makes sense at 100%).

**Responsive issues:** the level-grid goes to 2 columns at 740px and a refined 3-column treatment at 1450px — both source-confirmed; no narrow-width-specific issues found beyond the shell-level ones in §5.0.

**Accessibility issues:** PRG‑03's `aria-expanded` gap (above); otherwise consistent with shell-level findings (GLB‑07 covers `track-tabs` specifically).

**Interaction issues:** PRG‑02, PRG‑03 above.

**Dependency classification:** PRG‑01 and PRG‑02 are Content/Data-dependent at their root; PRG‑03 is UI-only.

---

### 5.2 Practice / Terminal

Covered in full depth in **§6 (Terminal Deep Audit)**, per the report's required structure. Summary for this section only:

**Primary user task:** Execute and learn Amadeus/GDS commands with immediate, comprehensible feedback.
**Primary action:** Type a command, submit, read the result and coaching guidance.
**Headline findings:** PRA‑01 (Critical — default fake-error Coach state), PRA‑02 (High — hint/history not isolated per mode), PRA‑03–PRA‑09 (Terminal-specific polish and strengths). Full evidence, severity, and acceptance criteria for each are in §6.

---

### 5.3 Scenarios

**Primary user task:** Choose and work a realistic, graded operational situation.
**Primary action:** "Resume scenario" / "Start scenario" → opens Practice with the scenario as context.

**What to Keep:**
- The filter-tab row (All / Not started / In progress / Completed) is **genuinely functional** — `filtered = scenarios.filter(...)` — unlike several other controls on this screen (below).
- The scenario detail panel's status, "next operational move," and coach-readout copy **genuinely vary** by state (not-started / in-progress / completed) with well-differentiated language for each — a real, working example of the state-communication-beyond-color the brief asks for.
- The primary CTA correctly branches: a completed scenario routes to "Review result" (→ Growth Record), an active/new one routes to Practice.

**What to Change:**
- **[SCN‑01] Header KPI stats are disconnected from the actual scenario set.**
  *Evidence:* "23/40 completed," "82% average," "Best category: Pricing & Ticketing 92%," and "Needs improvement: Exchanges & Refunds" are literal hardcoded values (`<AnimatedNumber value={23}/>`, etc.). The `scenarios` array defines exactly **5** items, spanning categories GDS, Mixed Workplace, GDS, GDS, Customer Service — **"Exchanges & Refunds" does not appear as a category anywhere in the defined data.**
  *Impact:* identical in kind to PRG‑01 — the product's own summary claims more content than exists, and in this case names a category ("Exchanges & Refunds") that a trainee could never actually click into.
  *Severity:* Medium-High. *Priority:* P1/P2. *Category:* Content/Data-dependent. *Confidence:* High. *Acceptance criteria:* every number and named category in the KPI row is derived from the same `scenarios` data the cards below render, so it cannot reference content that doesn't exist.

- **[SCN‑02] "Filters" button duplicates the visible filter-tab row with no added function.**
  *Evidence:* `onClick={() => toast.info("Filters are available in the scenario mission list.")}` — a `SlidersHorizontal`-icon button in the primary header row that visually promises an additional filter surface but only points at the tab row already on screen.
  *Severity:* Medium. *Priority:* P2. *Category:* UI-only (remove or repurpose) unless real additional filter dimensions (difficulty, duration, skill tags — all already present as data on each scenario) are intended, in which case it's Content/Data-dependent to build a real filter panel from them. *Confidence:* High. *Recommendation:* either remove the button (the tab row already covers status filtering) or scope it to genuinely new filter dimensions the tab row doesn't cover.

- **[SCN‑03] Sort control doesn't sort.**
  *Evidence:* the sort `<select>`'s `onChange` fires `toast.info("Mission order updated.")` without touching the `filtered`/render order.
  *Severity:* Medium. *Priority:* P2. *Category:* UI-only if a stable sort key already exists on scenario data (it does: difficulty, estimated time, category — sortable today with no new data needed). *Confidence:* High.

- **[SCN‑04] Long scenario titles pass into a task-strip built for short labels.**
  *Evidence:* starting/resuming a scenario sets Practice's context to the scenario's full `title` (e.g., "Rebooking due to schedule change," "Difficult customer at the airport") which Practice renders uppercase, inline, next to a fixed-position percentage badge (`CURRENT TASK · {context.toUpperCase()}`). The only context values seen in the provided screenshots are shorter category-style strings ("Pricing & Ticketing").
  *Severity:* Medium. *Priority:* P2. *Category:* UI-only (a wrapping/truncation rule). *Confidence:* Medium — the data-flow fact is source-verified; the actual wrapping behavior **requires live validation** at 360–430px with the longest title in the current data set ("Rebooking due to schedule change," "Group booking for a corporate client"). *Acceptance criteria:* the task-strip never clips the percentage badge or overlaps text when given the longest title string currently in `scenarios`.

**What to Add:** nothing structural — see Content/Data notes above for what SCN‑01's numbers need once resolved.

**What to Remove or De-emphasize:** SCN‑02's "Filters" button, pending the decision above.

**Required states:** not-started / in-progress / completed (all three confirmed present and distinct in source and screenshots).

**Responsive issues:** none beyond SCN‑04 and the shell-level 320px note (§8).

**Accessibility issues:** `filter-tabs` covered by GLB‑07 (systemic tab-semantics gap).

**Interaction issues:** SCN‑02, SCN‑03 above.

**Dependency classification:** SCN‑01 Content/Data; SCN‑02/03 UI-only-or-Content depending on product decision; SCN‑04 UI-only, needs live validation.

---

### 5.4 Growth Record

**Primary user task:** Understand recent performance evidence and what it implies for the next practice session.
**Primary action:** "Open recommended/targeted practice" → opens Practice with the relevant skill/gap as context.

**What to Keep:**
- The Record/History/Reports three-tab structure cleanly separates "what's true right now," "what happened," and "what it means" — a genuinely useful information split for a training product, not three views of the same list.
- SkillRow's click-to-expand "skill-detail" panel is a **real, fully keyboard-accessible interaction** (a true `<button>`, wired `onSelect`, working CTA into targeted Practice) — this is a positive finding worth calling out explicitly given how many *other* controls on this screen are decorative (below).
- The hover-preview on each skill row (`skill-hover-preview`) is **correctly built for accessibility**: it triggers on both `:hover` *and* `:focus-visible` (confirmed via the exact selector `.skill-row-button:hover .skill-hover-preview, .skill-row-button:focus-visible .skill-hover-preview`), and is deliberately hidden entirely — not left broken — below 740px (`.skill-hover-preview{display:none}` inside the mobile media query). This is careful, correct work and should be the reference pattern anywhere else a hover-revealed detail is considered.

**What to Change:**
- **[GRW‑01] Skill trend-arrow color is mapped to literal direction, not to whether that direction is good news.**
  *Evidence:* CSS: `.skill-trend--down{color:var(--green)}`, `.skill-trend--up{color:var(--amber)}` — unconditionally, regardless of the skill's `tone`. In the current mock data every row happens to correlate the two (`tone:"good"` rows are always `trend:"down"`; `tone:"warn"` rows are always `trend:"up"`), which masks the issue today but doesn't make the mapping correct: a mastered skill (`tone:"good"`) that began regressing would still render a *reassuring green* down-arrow, and a weak skill (`tone:"warn"`) that started genuinely improving would still render a *cautionary amber* up-arrow.
  *Impact:* directly touches audit dimension #7/#12 (states communicated through more than color, and non-misleading color use) — this is a real semantic-modeling risk that current mock data happens not to expose.
  *Severity:* Medium-High. *Priority:* P2 (not urgent while mock data masks it; must be fixed before real, varied data is connected). *Category:* Mixed — Content (the underlying meaning of "trend" needs a clear definition: is down ever bad?) + UI (the color-to-meaning mapping). *Confidence:* Medium-High — the CSS fact is fully source-verified; the judgment that it's *wrong* rather than *intentional domain semantics* is a reasoned inference, flagged accordingly. *Recommendation direction:* derive the arrow's color from whether the change is favorable given that skill's direction-of-improvement, not from raw up/down, or pair the arrow with a `tone`-colored (not `trend`-colored) treatment so only one channel carries "good/bad" meaning. *Acceptance criteria:* construct a hypothetical row (mastered skill trending down in a genuinely bad way) and confirm it does not render with reassuring styling.

- **[GRW‑02] "Backup" implies real data protection but performs none.**
  *Evidence:* `onClick={() => toast.success("A local evidence backup point has been created.")}` — no export, download, or additional persistence beyond what's already auto-saved to `localStorage` on every assessment.
  *Impact:* a `ShieldCheck`-icon button, in a training product where trainees may reasonably care about not losing progress, implies a safeguard that doesn't exist.
  *Severity:* Medium. *Priority:* P2. *Category:* Engine/Data-dependent to build real (export/cloud-sync); UI-only to relabel/remove in the interim. *Confidence:* High. *Recommendation:* until a real backup mechanism exists, don't present a confirmation toast that asserts one was "created."

- **[GRW‑03] History tab claims 12 entries, renders 3, with no way to see the rest.**
  *Evidence:* `LOG 04 / 12` header text against three rendered `<article>` rows, no pagination or "view all" control anywhere in the `History` tab markup.
  *Severity:* Medium. *Priority:* P2. *Category:* Content/Data-dependent (same family as PRG‑01/SCN‑01). *Confidence:* High.

- **[GRW‑04] Residual touch-tablet gap on the hover-preview.**
  *Evidence:* the preview is hidden below 740px and correctly focus-visible-triggered above it, but the 740–1099px range (touch-primary tablets, per GLB‑16) gets neither reliable `:hover` nor a guaranteed focus-visible-on-tap trigger.
  *Severity:* Low-Medium. *Priority:* P3. *Category:* UI-only. *Confidence:* Medium; **requires validation on an actual tablet device.**

**What to Add:** nothing structural.

**What to Remove or De-emphasize:** none — see fixes above instead of removal; each of these controls has a legitimate place once wired correctly.

**Required states:** default/has-evidence (shown); empty (`records.length===0` → `StateNotice state="empty"` — confirmed present in source but **not reachable/exercisable** in the current prototype since seed data is never empty and no reset exists; flagged as source-verified-but-unverified-in-practice).

**Responsive issues:** none specific beyond GRW‑04 and shell-level notes.

**Accessibility issues:** `growth-tabs` covered by GLB‑07.

**Interaction issues:** GRW‑01, GRW‑02, GRW‑03 above.

**Dependency classification:** GRW‑01 Mixed; GRW‑02 Engine/Data (real fix) or UI (interim); GRW‑03 Content/Data; GRW‑04 UI-only.

---

### 5.5 Progress Tracking

**Primary user task:** See whether performance is trending in the right direction and what to do about it.
**Primary action:** "Open targeted practice" → opens Practice with the recommended focus as context.

**What to Keep — feature prominently:**
- **[TRK‑01] The chart has a genuine, correctly-built accessible alternative.** *Evidence:* a native `<details><summary>View data table</summary>` disclosure containing a real `role="table"` with `role="row"`/`role="columnheader"`/`role="cell"`, populated from the same `records` data the visual bars use. This is exactly what audit dimension #11 (chart/data alternatives) asks for, already correctly implemented, and should be the template for any future chart added to the product rather than something to redesign.
- **[TRK‑04] The trend delta uses an actual glyph, not color alone.** *Evidence:* `{delta > 0 ? "↑" : delta < 0 ? "↓" : "→"}` alongside the `trend-readout--{tone}` color class — a genuine non-color signal sitting next to the color one, correctly satisfying dimension #7.
- KPI numbers here (sessions logged: 3, trend average, hint discipline) **do** derive from the real `records` array/localStorage-backed data, unlike the hardcoded stats found on Scenarios and Progression — worth noting as the positive counter-example to SCN‑01/PRG‑01.

**What to Change:**
- **[TRK‑02] The chart doesn't use either already-installed charting dependency.** *Evidence:* `recharts` (`^2.15.2`) and a shadcn `chart.tsx` wrapper are both present in the codebase; the actual "Evidence over time" visualization is a hand-built set of styled `<div>`s with inline `height:%` styles. *Impact:* none currently visible — the hand-built version works correctly and is itself accessible via TRK‑01's table. *Severity:* Low (Observation). *Priority:* P3. *Category:* Design-System coherence / dependency hygiene, not a user-facing bug. *Confidence:* High. *Recommendation:* worth aligning only if/when the chart needs richer interaction (tooltips, more data points) than the current hand-rolled version comfortably supports; not urgent otherwise.
- The `metric-switcher` (Overall/Accuracy/Sequencing) is covered by the systemic GLB‑07 tab-semantics finding, not repeated here.

**What to Add:** nothing structural.

**What to Remove or De-emphasize:** nothing.

**Required states:** empty (`StateNotice state="empty"`, same reachability caveat as Growth Record — confirmed in source, not exercisable in the current seed-data prototype); populated (shown, confirmed).

**Responsive issues:** none specific found beyond shell-level notes.

**Accessibility issues:** `metric-switcher` (GLB‑07) is the only gap on an otherwise strong screen.

**Interaction issues:** none beyond TRK‑02 (Observation-level, not a real issue).

**Dependency classification:** TRK‑02 is Design-System/Observation only; everything else on this screen is either already correct or already covered by a systemic finding logged elsewhere.

---

## 6. Terminal Deep Audit

The Terminal (`Practice` component, `Home.tsx` lines ~239–317) is the largest, most carefully built single component in the codebase, and it shows. This section covers it at the depth the brief requires, then answers the brief's explicit Terminal-specific questions directly.

### 6.1 Layout and Hierarchy

Structure, top to bottom, confirmed in source and matching the screenshots exactly: task-strip (current context + percentage) → mode-tabs (Learn/Practice/Assessment) → terminal-panel (header, scrollable history, active-input echo line, real input row, footnote) → coach-panel (sticky on ≥740px, stacked below on mobile via explicit `order` properties, confirmed by `.page-practice .practice-layout{flex-direction:column}` with `.practice-main{order:1}`/`.coach-panel{order:2}` at `max-width:739px`).

This is a correct hierarchy for the stated goal: the terminal is visually and structurally first, full-width on mobile, with coaching support literally subordinate to it in document order — not a peer "card among many." The mode-tabs use `key={mode}` on the wrapping panel, which forces a full unmount/remount (not just a content swap) on every tab switch, triggering a 220ms `tab-enter` animation (itself correctly disabled under `prefers-reduced-motion`).

### 6.2 Session Information

The terminal header shows, left to right: a status dot + "AMADEUS TRAINING ENVIRONMENT / EMULATOR 1.4," then three live readouts — `SESSION / {state}` (LOCAL SESSION → READY → COMPLETED), `COMMAND / {state}` (READY → SUCCESS/ERROR), and `LOG {NN}` (padded command count) — then Reference and Focus controls. All three readouts are driven by real state (`commandHistory`, `mode`, `sessionComplete`), not decorative. **A trainee can determine session state within seconds** — this holds up under inspection, not just at a glance.

One content nuance worth flagging precisely: **[PRA‑05]** the session timer (`sessionSeconds`) initializes at a pre-seeded **272 (4:32)**, not 0:00, on every fresh entry into Practice, and increments live from there (`setInterval`, 1000ms) — confirmed by the screenshots' visible 4:36/4:39 timestamps, consistent with a session that had already been running when captured. There is no copy anywhere distinguishing "this is a continued session" from "this is a fresh one." *Severity:* Low (Observation). *Priority:* P3. *Category:* Content/State. *Confidence:* High. *Recommendation:* either start at 0:00 for a genuinely new entry, or add explicit "resumed" framing if the pre-seeded value is intentional.

### 6.3 Command Input

This is the strongest-executed part of the entire product and should be treated as the reference implementation for mobile input elsewhere. Confirmed, specifically:

- `font-size: 16px` is explicitly forced on the mobile input (`max-width:739px` block) — this is the correct, deliberate prevention of iOS Safari's auto-zoom-on-focus-below-16px behavior. Easy to get wrong, correctly handled here.
- The input row is `position: sticky` above `env(safe-area-inset-bottom)`, and the input itself carries `scroll-margin-bottom: 120px` alongside a `scrollIntoView({block:"center"})` call on focus — deliberately keeping the input visible above the OS on-screen keyboard.
- `aria-label="Command input. Use Arrow Up and Arrow Down to review local command history."` — documents both purpose and the keyboard-history shortcut in one accessible name; genuinely good practice, not the minimum.
- `autoComplete="off"`, `inputMode="text"` — both correct choices for a command-entry field.
- `:focus-within` on the whole input row (not just the `<input>`) adds a glow treatment — clear, whole-row feedback that command-entry mode is active.
- Up/Down arrow key history recall is real (`historyIndex` state, `handleCommandKeyDown`), not decorative.

**[PRA‑04] The scrolling output area echoes the in-progress command with a blinking caret directly above the real input.** *Evidence:* `terminal-active-line` renders `<span className="terminal-prompt">&gt;</span> {command || "_"}<span className="terminal-caret"/>` as the last line of the scrollable history — a live mirror of the same `command` value the real `<input>` below it holds. Screenshots confirm both are visible simultaneously (a `>　_` cursor line inside the output area, then a separate bordered `> Enter command...` input box beneath it). *Impact:* two visually similar prompt-and-caret affordances sit in immediate vertical proximity; only the lower one is real, labeled, and focusable. This is a deliberate "authentic terminal" device and may read as intentional once a trainee has used it once — the open question is first-use clarity. *Severity:* Medium. *Priority:* P2. *Category:* UI-only. *Confidence:* Medium — the duplication is source-verified; whether it actually confuses a first-time trainee **requires live/user validation**, not something this review can assert as fact. *Acceptance criteria:* a first-time user in a moderated session can identify the correct place to type within a few seconds without prompting.

### 6.4 Output and Command/Result Separation

Each `terminal-entry` shows the submitted command, its response, and — implicitly — success/error via the entry's styling class. The whole history region carries `aria-live="polite"`, so newly-appended entries are announced; the currently-typed (not-yet-submitted) text is correctly kept *outside* this live region, so keystrokes aren't announced. This is a sound pattern.

**[PRA‑03] Per-command toast notifications duplicate signal already carried by two other channels.** *Evidence:* every submission additionally fires `toast.success`/`toast.error`/`toast.warning`, on top of (a) the terminal history entry's own color/text and (b) the Coach panel's "LATEST COMMAND" block, which updates on the same submission. *Impact:* on a long session (the product's own "long-session comfort" is an explicit audit dimension) this is a third, transient, motion-adding channel repeating information the other two already carry persistently and accessibly. *Severity:* Medium. *Priority:* P2. *Category:* UI-only. *Confidence:* High for the mechanism; **the felt "noisiness" over a real 20+ command session requires live/longitudinal validation**, flagged as such rather than asserted. *Recommendation direction:* consider reserving toasts for events that don't already have a persistent, in-context home (e.g., session-level milestones) rather than every single command.

### 6.5 Reference / Suggestions

The Reference drawer (non-assessment modes only) shows example commands as tappable chips; selecting one populates the input and **correctly returns focus** to it afterward (`inputRef.current?.focus()`) — continuity is preserved, not dropped. This is good, deliberate keyboard/focus hygiene.

**[PRA‑02] Opening Reference increments a hint counter that is shared across Learn, Practice, and Assessment modes.** *Evidence:* the Reference toggle handler runs `if (mode !== "assessment") setHintCount((count) => count + 1)` on open — meaning opening Reference during **Learn mode**, the product's own low-stakes, exploratory, default-first mode, counts identically toward the same `hintCount` used later to compute `assessmentScore(commandHistory, hintCount)`. Switching between Learn/Practice/Assessment tabs (`onClick={() => { setMode(item); setSessionComplete(false); }}`) resets **only** `sessionComplete` — `hintCount` and `commandHistory` persist across every mode switch within a Practice session. The Assessment tab's own "No hints" badge is a static per-tab label, not a live reflection of whether hints have already been used earlier in the same session.
*Impact:* a trainee who explores freely in Learn mode (opening Reference two or three times, as the mode is designed to encourage) and then moves to Assessment carries that hint count into a score whose own UI language ("No hints," "HINTS SUPPRESSED") implies a clean evaluation. This is a real question about assessment integrity, not a cosmetic one.
*Severity:* High. *Priority:* P1 for a UI-only transparency mitigation; the underlying isolation question is a **State/Data-dependent open item**, listed again in §13 rather than resolved here, since changing what counts toward a score is explicitly out of this audit's UI-only mandate.
*Category:* State/Data-dependent at the root; a UI-only partial mitigation is available and safe to specify now: **surface the carried-over hint/command count explicitly when a trainee enters Assessment mode** (e.g., "Entering Assessment with 2 hints and 5 commands already logged this session"), so the behavior is at minimum transparent rather than silent, without touching the scoring logic itself.
*Confidence:* High (fully source-verified: the exact condition, the exact reset scope, and the exact score-consuming function were all read directly).
*Acceptance criteria (for the UI-only mitigation):* a trainee switching into Assessment mode with a non-zero carried-over hint or command count sees that count stated before submitting their first Assessment command, in language that doesn't require reading source code to understand.

### 6.6 Coach Panel

Sticky on ≥740px (stays visible while the terminal scrolls), fully hidden in Focus Mode (§6.8), and — this is the section's most important single finding:

**[PRA‑01] CRITICAL. The Coach panel's default (no-command-yet) state renders a fabricated, red-styled error.**
*Evidence, exact:* when `latestEntry` is undefined (true on every fresh entry into Practice, before any command is submitted), the Coach block renders:
- Eyebrow: `"SYSTEM RESPONSE / AWAITING COMMAND"` — correct, neutral.
- Code line: `latestEntry?.response ?? "FORMAT ERROR · CHECK ENTRY"` — resolves to the literal fallback string, styled by `.coach-block code { color: var(--red) }` (`#f27076`), because the only override (`coach-code--success`) requires `latestEntry?.ok`, which is `undefined` and therefore falsy when there is no entry. The red styling is **not conditional on an actual error** — it is the code element's unconditional base color, only ever overridden *away* from red on genuine success.
- Body text: a specific, fabricated corrective instruction — `"The availability entry needs the airline prefix before the flight number."` — describing a mistake that has not occurred, since no command has been typed.

This matches the first screenshot of Practice pixel-for-pixel: "SYSTEM RESPONSE / AWAITING COMMAND" sits directly above what reads as a live error message, on the very first view a trainee gets of the product's central screen.

*Impact:* directly contradicts the product's own stated intended feeling — "Professionalism → Focus → Confidence → Precision" — at the single moment (first load) where first impressions are formed. It is also simply confusing: the header says nothing has happened, the content below says something specific and wrong went wrong.
*Severity:* Critical. *Priority:* P0. *Category:* UI/Content-only — this is a conditional-rendering and copy fix, touches no state model, no command logic, no scoring. It is one of the lowest-risk, highest-impact fixes in this entire audit.
*Confidence:* High (source- and screenshot-verified in agreement).
*Recommendation direction:* the default/no-entry state should show neutral placeholder guidance (or nothing) — never error-styled content, and never a specific corrective instruction referencing a mistake that hasn't happened. A generic "Submit a command to see coaching feedback here" (or the existing default *body copy* used elsewhere for the pre-command coaching tip — "Think in workflow steps..." — reused instead of the fake error) satisfies the same layout without the false signal.
*Acceptance criteria:* on first entry into Practice, before any command is submitted, nothing in the Coach panel is styled or worded as an error.

### 6.7 States

Confirmed distinguishable, and — correctly — not by color alone in the cases checked: success/error carry both color *and* differing copy/icon context (`StateNotice`'s `role="alert"` for error vs `role="status"` otherwise is a correct, spec-conformant pairing); the assessment error-taxonomy legend (Syntax/Sequence/Decision/Hint-dependency) pairs each color dot with a text label. The one clear counter-example to "not by color alone" is PRA‑01 above, and the one *fragile* (not yet wrong, but risky) example is GRW‑01 in §5.4, which lives on Growth Record, not Terminal itself.

### 6.8 Focus Mode

Correctly built: hides task-strip, mode-tabs, and coach-panel; expands the terminal to `calc(100dvh - 176px)` on mobile / `calc(100vh - 220px)` on desktop; keeps the input sticky within the expanded panel; `body:has(.focus-mode){overflow:hidden}` correctly prevents background scroll leaking behind it (a modern, correct use of `:has()`).

**Open question, not a defect:** Focus Mode removes Coach entirely rather than collapsing it to a re-openable affordance. This is a defensible reading of "deliberate practice" (remove support, concentrate on the terminal), but it's a product/pedagogy judgment call, not a clear UI bug — flagged here at **Medium confidence** as a question for whoever owns the learning-design intent, not asserted as something to change. If kept as full-hide, no action needed; if a lightweight peek-at-guidance affordance is wanted, that's a small, safe addition.

### 6.9 Assessment Closure

"Finish Session" is correctly `disabled` until at least one command exists (`disabled={!commandHistory.length}`), computes a score from the full `commandHistory`/`hintCount` (subject to PRA‑02's cross-mode caveat above), and hands off to `AssessmentReport`, which correctly uses `aria-live="polite"` so the arriving report is announced, and correctly states in its own copy: *"Feedback is based on this local training session, not a live carrier system"* — exactly the kind of transparency this audit was asked to check for, already present and worth preserving verbatim as the house style for every other illustrative surface in the product (see §7's inconsistency note on this exact point).

### 6.10 Mobile Behavior and Long-Session Comfort

Confirmed order on mobile (≤739px), matching the brief's own question ("does mobile preserve Terminal output, command input, session state, and critical feedback in that order?") **yes, precisely**: terminal panel (header → history → input) renders first in document order via explicit flex `order:1`, coach-panel second via `order:2`. Two additional, specific breakpoint findings sit here and are detailed fully in §8: deliberate, evidenced restructuring of the terminal header at exactly 390px and 360px (with a code comment naming the exact overlap problem being solved), and no equivalent dedicated rule at the stated 320px floor.

### 6.11 Answers to the Brief's Terminal-Specific Questions

- **Does the Terminal genuinely feel like the primary workstation rather than one card among many?** Yes, with source evidence beyond visual impression: it's first in document order, full-width, the only screen with a dedicated second design-token layer (§7), the only nav item deliberately centered with an explanatory code comment, and the only screen with a purpose-built Focus Mode.
- **Can the trainee understand session state within seconds?** Yes — three live, state-driven readouts in the header, confirmed real (not decorative).
- **Can the trainee find and use command input with minimal visual friction?** Yes on functionality; PRA‑04 (dual prompt/caret affordance) is a real but narrow first-use clarity question, not a functional barrier.
- **Is the relationship between output, input, history, feedback, reference, coach, and assessment closure clear?** Structurally yes — each has a distinct, consistent location. PRA‑01 damages this at the single most important moment (first load), and PRA‑03 adds a redundant channel on top of an otherwise clear one.
- **Are success, error, warning, invalid, processing, and interrupted states distinguishable without relying only on color?** Mostly yes (§6.7); PRA‑01 is the exception, and GRW‑01 (Growth Record, not Terminal) is the fragile one.
- **Is long-session reading comfortable?** Font/line-height choices are deliberate and generous (12px/line-height:2 in Focus Mode specifically); PRA‑03's repeated toasts are the main identified friction over a long session.
- **Does mobile preserve Terminal output, command input, session state, and critical feedback in that order?** Confirmed yes (§6.10).
- **Are any Terminal enhancements actually Engine/Data/Content dependent rather than UI-only?** Yes — PRA‑02's true fix (isolating hint/history per mode) is State/Data-dependent, correctly separated in this report from its UI-only transparency mitigation; the rest of this section's findings are UI-only.

---

## 7. Shared Design System Audit

### 7.1 Tokens

`client/src/index.css` defines a real, purposeful token set at `:root` (line 7): five navy surface steps (`--navy-950` → `--navy-750`), two line/border opacities, three text steps (`--text`/`--text-soft`/`--text-faint`), a semantic color set (`--blue`/`--blue-bright`/`--cyan`/`--green`/`--amber`/`--violet`/`--red`), panel/radius tokens, and — importantly — **three named font-role tokens**: `--font-display` ("Space Grotesk"), `--font-ar` ("Cairo," a real Arabic-optimized typeface), and `--font-mono` ("IBM Plex Mono"). This is a well-considered system on paper: it explicitly anticipates Arabic typography as a first-class role, not an afterthought.

**[GLB‑13] A second, parallel token layer exists, scoped to Practice only, with different values for the same semantic roles.** *Evidence:* a second `:root` block (line 329, under the comment "AeroBridge Elevation Directive — preserve Flight Deck Console identity; prioritize Terminal, calm precision, and operational readability") defines `--ab-surface-0/1/2`, `--ab-border`, `--ab-text-primary/secondary/muted`, and `--ab-success/warning/error/info`, applied via a `.page-practice` scope. These are **not aliases** of the original tokens — they carry distinct hex values for the same semantic role, e.g. `--red: #f27076` vs `--ab-error: #ef8a96`; `--green: #3ed598` vs `--ab-success: #55d6a6`; `--text: #eff4ff` vs `--ab-text-primary: #f4f7ff`. *Impact:* error/success/text colors on the Terminal screen are subtly different shades from the identical semantic roles everywhere else in the product — small enough to be imperceptible side-by-side today, significant as a maintenance hazard (a future "fix the error color" change made in one token system won't reach the other). *Severity:* High for design-system coherence specifically (dimension #5). *Priority:* P1/P2 — consolidate before more refinement passes accumulate on either layer. *Category:* UI-only (a token-naming/consolidation exercise; no logic changes). *Confidence:* High (both blocks read in full, values compared directly). *Recommendation direction:* fold `--ab-*` into the base token set as the *canonical* values (they appear to be the more recent, more deliberately tuned pass, per the accompanying comment) rather than deleting them — extend the refinement outward instead of maintaining two systems. *Acceptance criteria:* a single token set drives color everywhere; grepping the stylesheet for a legacy `--ab-` reference after consolidation returns nothing.

**[GLB‑12] The same property is independently declared four times for `.bottom-nav`, three of them redundant.** *Evidence:* `grid-template-columns` for `.bottom-nav` appears at line 119 (`repeat(4,1fr)` — incorrect for the 5 nav items actually rendered, but harmlessly superseded), line 313 (`repeat(5,minmax(0,1fr))`, unconditional, correct — this is what actually wins the cascade and is why the screenshots render correctly), line 320 (same value, redundantly re-declared inside a `max-width:739px` block), and line 375 (same value again, this time with `!important`, inside a *second* `max-width:739px` block). **The rendered result is correct and matches every screenshot** — this is not a live bug — but it is clear, source-verified evidence of accumulated, patch-style edits to the same rule rather than consolidated updates, each new pass apparently unaware the previous one had already fixed it. *Severity:* Low (Observation/maintainability, not user-facing). *Priority:* P3. *Category:* Design-System hygiene. *Confidence:* High. *Recommendation:* consolidate to one declaration; treat this as a signal to audit the rest of the stylesheet for similar redundant overrides during any future CSS pass, not just this one property.

### 7.2 Typography

**[GLB‑02] CRITICAL. None of the three declared typefaces are actually loaded.** *Evidence, complete chain:*
1. `client/index.html` contains a Google Fonts `<link>` block, but it is **commented out** and the comment text explicitly reads *"THIS IS THE START OF A COMMENT BLOCK, BLOCK TO BE DELETED"* / *"BLOCK TO BE DELETED"* around it.
2. `client/public/` contains only a `.gitkeep` file — no self-hosted font files exist.
3. No `@font-face` rule exists anywhere in `index.css` (confirmed by full-file read).
4. `index.css` nonetheless declares `--font-display: "Space Grotesk", system-ui, sans-serif`, `--font-ar: "Cairo", system-ui, sans-serif`, and `--font-mono: "IBM Plex Mono", monospace`, and these tokens are applied throughout the stylesheet (headings, body, terminal content).

*Impact:* every screen in the product currently renders in browser/OS fallback fonts (`system-ui`/`sans-serif`, or the platform's default monospace) — not Space Grotesk, not IBM Plex Mono, not Cairo. On Android Chrome (the environment the screenshots were captured in), the fallback is a clean system sans (visually presentable, which is likely why this hasn't been noticed by inspection alone), but it is **not** the distinctive geometric identity the design tokens specify, and — more importantly given the product's stated mission — **the dedicated Arabic font role is entirely theoretical**: even if the EN/AR toggle were wired to do something (GLB‑01), there is currently no mechanism by which Arabic text would render in an Arabic-appropriate typeface rather than whatever generic fallback the OS supplies.
*Severity:* Critical. *Priority:* P0. *Category:* UI-only (restoring the font `<link>`, or self-hosting the three families) — zero engine/logic risk, purely a loading fix.
*Confidence:* High (every link in the causal chain independently confirmed: the commented-out block, the empty public folder, the absent `@font-face`, and the tokens that reference names with nothing supplying them).
*Recommendation direction:* restore font loading for all three declared families (a standard Google Fonts link covers Space Grotesk/IBM Plex Mono/Cairo, or self-host if a strict no-external-request policy is wanted) before any other visual polish work, since typography this foundational affects every other screen simultaneously.
*Acceptance criteria:* inspecting computed `font-family` on a heading, a terminal command line, and (once GLB‑01 is addressed) Arabic body text each resolves to the intended named family, not a fallback.

Beyond the loading question, the *system* itself is sound and worth preserving exactly as designed: a distinct display face for UI chrome, a distinct monospace face for command/output content (correctly separating "this is data/code" from "this is UI," per audit dimension #6), and a distinct, dedicated Arabic face rather than assuming one stack covers both scripts.

### 7.3 Color and Contrast

Computed WCAG relative-luminance contrast ratios for the product's core color pairs (method: standard WCAG formula, not visual estimation):

| Pair | Ratio | AA-normal (4.5:1) | AA-large (3:1) |
|---|---|---|---|
| `--text` on `--navy-950` | 18.05:1 | Pass | Pass |
| `--text-soft` on `--navy-950` | 8.42:1 | Pass | Pass |
| `--text-faint` on `--navy-950` | 3.66:1 | **Fail** | Pass |
| `--text-soft` on `--panel-solid` | 7.31:1 | Pass | Pass |
| `--text-faint` on `--panel-solid` | 3.18:1 | **Fail** | Pass |
| `--text-faint` on `--navy-750` (card) | 2.94:1 | **Fail** | **Fail** |
| `--blue` text on `--navy-950` | 6.68:1 | Pass | Pass |
| `--blue-bright` on `--navy-950` | 8.10:1 | Pass | Pass |
| `--cyan` (focus ring) on `--navy-950` | 10.35:1 | Pass | Pass |
| `--green` on `--navy-950` | 10.59:1 | Pass | Pass |
| `--amber` on `--navy-950` | 9.81:1 | Pass | Pass |
| `--red` on `--navy-950` | 6.97:1 | Pass | Pass |
| `--ab-error` on Terminal panel surface | 7.19:1 | Pass | Pass |
| `--ab-success` on Terminal panel surface | 9.50:1 | Pass | Pass |
| Input placeholder `#617090` on `--navy-950` | 4.01:1 | **Fail** (needs 4.5) | Pass |
| **White `#fff` on `.primary-button` `--blue` `#6f8fff`** | **2.98:1** | **Fail** (needs 4.5) | **Fail** (needs 3.0) |

**[GLB‑04] HIGH. The product's primary call-to-action button fails contrast on every screen it appears on.** *Evidence:* `.primary-button { background: var(--blue); color: #fff; font-size: 12px; font-weight: 700 }` — 12px/700 does not meet WCAG's "large text" exception (which requires ≥18.66px bold or ≥24px regular), so the applicable threshold is 4.5:1; measured is 2.98:1. This button is "Resume pricing workflow" (Progression), "Resume scenario" (Scenarios), "Open recommended/targeted practice" (Growth Record, Progress Tracking) — the single most-repeated, highest-intent interactive element in the product. *Severity:* High. *Priority:* P0/P1 (trivial, safe, single-value fix; no reason to defer). *Category:* UI-only. *Confidence:* High (exact hex values, exact computed ratio). *Recommendation:* darken `--blue` for this specific use, or use a darker text color, until the pairing clears 4.5:1 — verify against the darkened value before shipping, since a partial darkening could still fall short. *Acceptance criteria:* recomputed contrast for the shipped `.primary-button` pairing is ≥4.5:1.

**[GLB‑05] MEDIUM-HIGH. `--text-faint` fails AA-normal in its typical contexts, and fails AA-large outright on card surfaces.** *Evidence:* table above — 3.66:1 on the base background, 3.18:1 on panel surfaces, 2.94:1 on `--navy-750` cards (this last one fails even the relaxed large-text bar). `--text-faint` is used for small supporting text (timestamps, secondary labels) throughout the product — exactly the size category where WCAG's stricter normal-text threshold applies, not the exception to it. *Severity:* Medium-High. *Priority:* P1/P2. *Category:* UI-only. *Confidence:* High for the ratios; **which specific on-screen instances use `--text-faint` at sub-large size on a `--navy-750` background specifically requires a targeted visual pass** to prioritize (the token-level fact is certain; the full list of affected screens/components was not individually re-verified for font-size at every usage site). *Acceptance criteria:* every use of `--text-faint` either meets 4.5:1 against its actual rendered background, or is resized/reweighted to legitimately qualify for the large-text exception.

**[GLB‑06] MEDIUM. Terminal input placeholder text falls just short of AA-normal.** *Evidence:* `#617090` on `--navy-950` = 4.01:1 against a required 4.5:1 (the input itself is 16px regular, not large text). *Severity:* Medium. *Priority:* P2. *Category:* UI-only. *Confidence:* High. *Acceptance criteria:* recomputed ratio ≥4.5:1.

**[GLB‑11] Focus-ring color is inconsistent (not a contrast failure — both values pass).** *Evidence:* the global default (`button:focus-visible, input:focus-visible, select:focus-visible`) uses `--cyan` (#57c9e8, 10.35:1); a later, more specific selector list (covering `.primary-button`, `.ghost-button`, `.mode-tabs button`, `.filter-tabs button`, `.growth-tabs button`, `.track-tabs button`, `.terminal-help`, `.loop-action`, and others) uses `--blue-bright` (#86a1ff, 8.10:1) instead, and — due to higher selector specificity — wins for everything on that list. Elements *not* on that list (plain icon buttons, form `<select>`s not otherwise covered) fall back to cyan. *Severity:* Low. *Priority:* P3. *Category:* Design-System consistency, not accessibility risk (both pass comfortably). *Confidence:* High. *Recommendation:* pick one focus-ring color as canonical and apply it via the general rule so specific overrides aren't needed.

### 7.4 Motion

The reduced-motion implementation is a genuine strength, not a passing grade. A global catch-all (`@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .001ms !important; transition-duration: .001ms !important; scroll-behavior: auto !important; } }`) sits at the top of the stylesheet and alone would satisfy the requirement for the entire app; it is then layered with more than a dozen additional, component-scoped `animation:none`/`transition:none` refinements (terminal entries, tab-enter, growth/tracking panels, scenario cards, skill rows, bottom-nav buttons) that are functionally redundant given the `!important` catch-all but demonstrate the team returned to this repeatedly and carefully rather than setting it once and forgetting it. `useAnimatedNumber` (driving every `AnimatedNumber`/`AnimatedBar`/`ProgressRing`) independently reads `prefers-reduced-motion` via `matchMedia` and skips the counting animation entirely when set. Hover-only enhancements are correctly scoped to `@media (hover:hover) and (pointer:fine)`, avoiding the common mobile "sticky hover" failure mode. Nothing decorative or gratuitous was found; the one full-remount animation (Practice's tab switch, 220ms) is short, purposeful, and itself respects reduced motion.

### 7.5 Non-Functional / Decorative Affordances — Full Inventory

**[GLB‑08]** One systemic pattern, twelve confirmed instances, each firing a generic `toast.info`/`toast.success` in place of the action its icon or label implies:

| Control | Screen | Fires |
|---|---|---|
| Language toggle (EN/AR) | Topbar, every screen | Toggles local highlight only + toast; see GLB‑01 below for the full, elevated treatment this one specifically deserves |
| Search / "Quick find" popover | Topbar, every screen | Static hint panel, no real search execution |
| Profile chip ("KA") | Topbar, every screen | `toast.info("Profile workspace is ready...")` |
| "View map" (SectionHeader action) | Progression | `toast.info` |
| "See all stages" (SectionHeader action) | Progression | `toast.info` |
| "View evidence" (SectionHeader action) | Growth Record | `toast.info` |
| "See patterns" (SectionHeader action) | Growth Record | `toast.info` |
| "View history" (SectionHeader action) | Growth Record | `toast.info` |
| "Filters" button | Scenarios | `toast.info`, duplicates the working filter-tab row (SCN‑02) |
| Sort `<select>` | Scenarios | `toast.info`, does not resort (SCN‑03) |
| "Backup" | Growth Record | `toast.success`, implies protection that doesn't exist (GRW‑02) |

*Severity:* varies by instance (individually logged above/below); as a **pattern**, Medium-High, because it is the single most repeated source of "looks functional, isn't" across the product, and directly works against the "Confidence/Precision" feeling the brief asks for. *Priority:* P1 for the two elevated instances below (GLB‑01, and the primary-CTA-adjacent ones); P2 for the rest. *Category:* mixed — most are UI-only to remove/relabel, several (search, real filtering/sorting) are legitimately Content/Engine-dependent to make real. *Confidence:* High — every row above was confirmed by reading its exact handler.

**[GLB‑01] CRITICAL — elevated separately from the inventory above.** The EN/AR toggle deserves standalone, top-tier treatment rather than being read as "one more decorative button," for three compounding, independently-confirmed reasons:
1. It is present and prominent on **every single screen** (Topbar is shared shell), not scoped to one view.
2. `client/index.html` hardcodes `<html lang="en">`, never updated anywhere in the codebase — confirmed by a full-file search finding zero `dir="rtl"` occurrences and zero `i18next`/`useTranslation`/any i18n library reference anywhere in `client/src/`.
3. It sits directly against the platform's own stated mission — Saudi-market readiness, EgyptAir Basic/Advanced curriculum, "mixed-language content" as an explicit audit dimension (#6) — making this the single largest, most visible gap between what the product's chrome promises and what it does.

*Severity:* Critical. *Priority:* P0 as a **product decision**, not a P0 engineering build-out (full RTL + translation is genuinely substantial work — see §13). The P0-appropriate UI-only action available *now*, without engine/content work, is: do not present a toggle that visually implies a working language switch if it isn't one this release — either scope it honestly (a "coming soon" treatment) or, if Arabic support is imminent, this is the moment to specify the `dir="rtl"` mirroring and font-swap (`--font-ar`) behavior so a later engineer can build it against a clear target (see §10).
*Category:* Content + Engine + Architecture (a real fix needs a translation layer, RTL layout mirroring throughout the CSS, and the already-defined-but-unloaded `--font-ar` actually wired to `[dir="rtl"]` content) — explicitly **not** solvable as a UI-only patch, and explicitly **not** attempted here per this audit's scope boundary. Logged again in §13.
*Confidence:* High (every claim above independently source-verified, not inferred).

### 7.6 Dead / Unwired Code Present in Source

**[GLB‑09]** Three components exist in the codebase but are never invoked by the running app:

- **`ErrorBoundary.tsx`** — a real React error boundary (catches render errors, shows a fallback UI with a raw `error.stack` dump and a reload button) — but `main.tsx` renders `<App/>` directly with no boundary wrapping it, and `App.tsx` renders `<Home/>` directly. **An unhandled render error anywhere in the 363-line `Home.tsx` would currently show a blank page, not this fallback.** Separately, even if wired, the fallback's own styling (`bg-background`, `text-destructive`, generic Tailwind defaults) doesn't match the AeroBridge design system used everywhere else, and exposing a raw stack trace to a trainee is inappropriate for a production training product. *Severity:* Medium (resilience gap) + Medium (fallback content/styling, if/when wired). *Priority:* P1. *Category:* Engine/State (the wiring question — flagged for awareness, not fixed here) + UI/Content (the fallback's design, safe to specify now regardless of the wiring decision). *Confidence:* High. *Acceptance criteria (for the UI-only part):* if/when mounted, the fallback uses AeroBridge's own surface/text tokens and shows calm, professional, non-technical copy ("Something went wrong. Your progress is saved locally.") with technical detail available only in developer tooling, never rendered to the trainee.
- **`NotFound.tsx`** — uses `bg-gradient-to-br from-slate-50 to-slate-100`, `text-slate-900`, light-mode Tailwind defaults entirely disconnected from the dark navy system. **Confirmed unreachable**: `pathToView` (the only routing logic that exists) has a guaranteed final fallback to `"progression"` for any unmatched path, and nothing in `App.tsx` ever renders `<NotFound/>`. *Severity:* Low (dead code; zero live user impact today). *Priority:* P3. *Category:* Hygiene. *Confidence:* High (the fallback logic was read directly, not assumed).
- **`ThemeContext.tsx`** — a light/dark theme provider, never wrapped around the app; the product's single dark theme is simply hardcoded in CSS, consistent with the "preserve dark navy foundation" brief. *Severity:* none (zero impact — no light mode is ever shown, by design, matching every screenshot). *Priority:* P3 (cleanup only). *Confidence:* High.

None of these three currently affect what a trainee sees. They are logged because the brief explicitly asked the error-boundary and "unavailable" states to be reviewed (audit scope), and because leftover, off-brand, disconnected components are a real risk if wired in later without this context.

---

## 8. Responsive and Accessibility Audit

All breakpoints below are the actual values found in `index.css` (11 distinct `@media` rules), not assumed conventional ones. Organized per the brief's required breakdown; each entry states whether it is source-verified or requires live validation.

### Desktop (≥1450px)
- **Source-verified:** `SideNav` visible (has been since 1100px); `Topbar`'s brand mark hidden (redundant with sidebar's own logo, hidden at `min-width:1100px`); level-grid goes to 3 columns; additional padding refinements apply.
- **No issues found** at this tier beyond the cross-cutting findings already logged (GLB‑04 contrast, GLB‑07 tab semantics, GLB‑13 token split) which apply at every width equally since they're not breakpoint-dependent.

### Laptop (1100–1449px)
- **Source-verified:** this is exactly where the mobile→desktop nav swap happens — `SideNav` appears, `BottomNav`/`mobile-menu` disappear, all at the single `min-width:1100px` threshold, with no intermediate step.
- **[GLB‑16-adjacent, Low]** the swap is a single jump with no transitional treatment between "mobile chrome" and "desktop chrome" — source-confirmed as a fact; whether it reads as an abrupt visual jump when resizing across 1100px **requires live validation** (browser resize is not testable in this environment). Not scored as a defect, logged as unverified.

### Tablet (740–1099px)
- **[GLB‑16] Source-verified structural finding, repeated here in its breakpoint-specific form:** content grids (scenario-layout, growth-overview, level-grid) go multi-column starting at `min-width:740px`, but navigation chrome does not become "desktop" until `1100px` — so this entire 359px-wide range shows multi-column desktop-density content above/beside mobile-style bottom-nav-plus-hamburger chrome, with no breakpoint-specific navigation treatment of its own. *Requires live validation* to judge visual impact; the structural fact itself is certain.
- **[GRW‑04] Source-verified, tablet-specific:** the skill-hover-preview (Growth Record) is not hidden until `max-width:739px`, so it remains present but relies on `:hover`/`:focus-visible` triggers that a touch-primary tablet in this range may satisfy unreliably. *Requires validation on an actual tablet device.*

### 430px
- **Source-verified:** falls within the general `max-width:739px` mobile treatment; no `max-width:430px`-specific rule exists anywhere in the file. This is not necessarily a gap — 430px is close to the 739px mobile ceiling and the general mobile rules have the most room to work with here — but it means nothing was *specifically* tuned for this exact width; it inherits the same rules as, e.g., 600px. **Requires live validation** to confirm no incidental issue exists; no defect is asserted.

### 390px
- **Source-verified, positive finding:** `@media (max-width:390px)` contains a **deliberate, Terminal-specific fix** — the terminal header's title gets `max-width:136px` with tightened line-height, and the first `terminal-help` control's text label is hidden (icon-only) to reclaim space. This is real, evidenced, purpose-built responsive engineering at exactly the width the brief asked about, not a coincidental inheritance from a wider rule.

### 360px
- **Source-verified, positive finding — the most specifically-tuned width in the entire stylesheet:** `@media (max-width:360px)` **restructures the terminal header into a two-row CSS grid** (title on row 1, session-readout on row 2, controls spanning both rows on the right) specifically, per the accompanying code comment, to *"stack operational readouts instead of allowing overlap."* This is the clearest evidence in the whole codebase of deliberate, problem-driven (not decorative) responsive work: a real overlap problem was identified and solved at this exact width. The "Focus" button's text label is also hidden (icon-only) here. Other `max-width:360px` rules additionally adjust `StateNotice` font sizing and `BottomNav` minimum height.

### 320px
- **[GLB‑15] No breakpoint-specific rule exists below 360px.** *Evidence:* the narrowest `max-width` rule in the entire file is 360px; `body{min-width:320px}` establishes 320px as an explicit, deliberate design floor, but nothing in the stylesheet specifically re-verifies layout at that floor. *Impact:* the 360px rule's own justification — preventing terminal-header overlap via a two-row grid restructure — was written to solve a problem at 360px; whether that same restructured layout still has adequate room 40px narrower, at the declared minimum, is **unverified**, not confirmed-broken. Given how tightly-reasoned the 360px fix's own comment is about avoiding overlap, this is a real gap worth closing rather than assuming is fine by inheritance. *Severity:* Medium. *Priority:* P1/P2 (cheap to verify, and directly extends work already proven necessary one step away). *Category:* UI-only. *Confidence:* High that the gap exists in source; **explicitly requires live rendering at 320px to confirm actual impact** — not asserted as a visible defect here. *Acceptance criteria:* render the Terminal header (the component with the most breakpoint-specific work already invested) at exactly 320px and confirm no element overlaps or is clipped; extend the 360px grid restructure downward if needed.

### Cross-Cutting Accessibility Findings (apply at every width)

| Finding | Evidence | Severity | Confidence |
|---|---|---|---|
| GLB‑03 — pinch-zoom disabled | `maximum-scale=1` in `index.html` viewport meta | High | High, source-verified |
| GLB‑07 — no tab/pressed/selected ARIA anywhere | Zero `aria-pressed`/`aria-selected`/`role="tab"` in a full-file scan; 5 affected control groups named in §5.0 | High | High, exhaustively verified |
| GLB‑04 — primary-button contrast | 2.98:1 measured vs 4.5:1 required | High | High, computed |
| GLB‑05 — `--text-faint` contrast | 3.66:1 / 3.18:1 / 2.94:1 across three surfaces, all below 4.5:1 | Medium-High | High for ratios; usage-site audit still needed |
| GLB‑06 — placeholder contrast | 4.01:1 vs 4.5:1 required | Medium | High, computed |
| PRG‑03 — expand affordance lacks `aria-expanded` | Confirmed absent on mastered level cards | Low-Medium | High |

**Genuine accessibility strengths, confirmed and worth explicit protection during any redesign pass:**
- Global `:focus-visible` styling (not old-style `:focus`, correctly avoiding mouse-click ring flashes) on all core interactive elements, with computed contrast of 8–10:1 for both ring colors in use.
- `aria-live="polite"` correctly applied to the terminal history and the assessment report (dynamic content genuinely announced).
- `StateNotice`'s `role="alert"` (error) vs `role="status"` (everything else) is a correct, spec-conformant pairing, not a guess.
- The Progress Tracking chart's `role="table"` alternative (TRK‑01) is a real, working, already-correct pattern — the strongest accessibility artifact in the codebase.
- `color-scheme: dark` set at the document level, correctly informing native browser UI (scrollbars, form controls) to match the app's theme.
- `ProgressRing` uses the correct `role="img" aria-label` + `aria-hidden` inner-SVG pattern.

**What could not be verified in this review and is explicitly flagged rather than guessed at:** live screen-reader announcement behavior, real keyboard tab-order across a full session, on-screen-keyboard/viewport interaction on an actual device, and touch-vs-hover behavior on a real tablet (GRW‑04). All four are standard manual-QA items, not blocked on any of the fixes recommended above.

---

## 9. Priority Matrix

Sorted by phase, then severity. Effort is relative T-shirt sizing (XS = single value/attribute; S = single component, no new state; M = a few components or a new conditional; L = needs a product/content decision before implementation can start). Full evidence for every row is in §5–§8; this table is a navigation aid, not a replacement for it.

| ID | Priority | Severity | Impact | Effort | Dependency | Affected files/routes | Phase |
|---|---|---|---|---|---|---|---|
| PRA‑01 | P0 | Critical | Fake error shown on first Terminal load | XS | UI/Content | `Home.tsx` (`Practice`, coach-block) | P0 |
| GLB‑02 | P0 | Critical | Zero declared typefaces actually load, product-wide | S | UI-only | `client/index.html`, `index.css` `:root` | P0 |
| GLB‑03 | P0 | High | Pinch-zoom disabled, WCAG 1.4.4 | XS | UI-only | `client/index.html` viewport meta | P0 |
| GLB‑04 | P0 | High | Primary CTA fails contrast on every screen | XS | UI-only | `index.css` `.primary-button` | P0 |
| GLB‑01 | P0 (decision) | Critical | EN/AR toggle fully non-functional; core mission gap | L | Content+Engine+Architecture | `Topbar`, `index.html`, whole stylesheet | P0 (scope now) / P2‑P3 (build) |
| GLB‑07 | P1 | High | No tab/pressed/selected ARIA on 5 control groups | M | UI-only | `Home.tsx` (5 tab-like components), `index.css` | P1 |
| GLB‑13 | P1 | High | Two parallel color-token systems (base vs `--ab-*`) | M | UI-only | `index.css` (2 `:root` blocks) | P1 |
| PRA‑02 | P1 | High | Hints/history not isolated per Learn/Practice/Assessment | S (mitigation) / L (root fix) | UI (mitigation) / State-Data (root) | `Home.tsx` (`Practice`) | P1 (mitigation) / Deferred (root, §13) |
| GLB‑09a | P1 | Medium | ErrorBoundary not mounted; unhandled errors show blank page; fallback UI off-brand | S | Engine/State (wiring) + UI (restyle) | `main.tsx`, `ErrorBoundary.tsx` | P1 |
| GLB‑15 | P1 | Medium | No breakpoint tuning below 360px; declared floor is 320px | S | UI-only, needs live validation | `index.css` (terminal header rules) | P1 |
| PRG‑01 | P1 | Medium-High | "3 / 8 stages" vs 6 defined levels | S (honesty fix) / L (content) | Content/Data | `Home.tsx` (`Progression`) | P1 (fix) / P2 (content) |
| SCN‑01 | P1/P2 | Medium-High | KPI stats reference a category that doesn't exist | S (honesty fix) / L (content) | Content/Data | `Home.tsx` (`Scenarios`) | P1 (fix) / P2 (content) |
| GLB‑05 | P1/P2 | Medium-High | `--text-faint` fails AA-normal in 3 of 3 measured contexts | S | UI-only | `index.css` `:root`, all screens | P1/P2 |
| GLB‑10 | P2 | Medium | Desktop/mobile nav order mismatch; "Route" term overload | M | Content+UI | `Home.tsx` (`BottomNav`, `SideNav`), all screens | P2 |
| GLB‑16 | P2 | Medium | No distinct tablet (740–1099px) nav treatment | M, needs visual validation | UI-only | `index.css` breakpoints | P2 |
| PRG‑02 | P2 | Medium | Track toggle leaves stale "Technical" content visible | S (honesty fix) / L (content) | Content/Data + UI | `Home.tsx` (`Progression`) | P2 |
| GRW‑01 | P2 | Medium-High | Trend arrow color = literal direction, not favorability | M | Content+UI | `Home.tsx` (`SkillRow`), `index.css` | P2 |
| GRW‑02 | P2 | Medium | "Backup" implies protection that doesn't exist | XS (relabel) / L (real feature) | UI (interim) / Engine (real) | `Home.tsx` (`Growth`) | P2 |
| GRW‑03 | P2 | Medium | History claims 12, shows 3, no pagination | S | Content/Data | `Home.tsx` (`Growth`, History tab) | P2 |
| SCN‑02 | P2 | Medium | "Filters" button duplicates working filter tabs | XS | UI-only | `Home.tsx` (`Scenarios`) | P2 |
| SCN‑03 | P2 | Medium | Sort control doesn't sort | S | UI-only | `Home.tsx` (`Scenarios`) | P2 |
| SCN‑04 | P2 | Medium | Long scenario titles into a short-label task-strip | S, needs live validation | UI-only | `Home.tsx` (`Practice` task-strip) | P2 |
| PRA‑03 | P2 | Medium | Per-command toasts triplicate signal on long sessions | S | UI-only | `Home.tsx` (`Practice`) | P2 |
| PRA‑04 | P2 | Medium | Dual prompt/caret affordance (echo line + real input) | S, needs live validation | UI-only | `Home.tsx` (`Practice`), `index.css` | P2 |
| PRA‑06 | P2 | Medium | Tab-switch remount (`key={mode}`) risks losing keyboard focus | S, needs live validation | UI-only | `Home.tsx` (`Practice`) | P2 |
| GLB‑06 | P2 | Medium | Terminal input placeholder fails AA-normal by a small margin | XS | UI-only | `index.css` (`.page-practice .terminal-input input::placeholder`) | P2 |
| PRG‑03 | P2 | Low-Medium | Expandable mastered cards lack visible affordance + `aria-expanded` | S | UI-only | `Home.tsx` (`Progression`) | P2 |
| GRW‑04 | P3 | Low-Medium | Hover-preview reliability gap on touch tablets (740–1099px) | S, needs device validation | UI-only | `index.css` (`.skill-hover-preview`) | P3 |
| GLB‑11 | P3 | Low | Focus-ring color inconsistency (cyan vs blue-bright); both pass contrast | XS | UI-only | `index.css` (focus-visible rules) | P3 |
| GLB‑12 | P3 | Low (Observation) | `.bottom-nav` grid-columns declared 4×, 3 redundant | XS | Hygiene | `index.css` | P3 |
| GLB‑14 | P3 | Low (Observation) | Hamburger drawer duplicates BottomNav, no unique content | — | Product decision | `Home.tsx` (`Topbar`/drawer) | P3, open question (§13) |
| PRA‑05 | P3 | Low (Observation) | Session timer starts at 4:32, not 0:00, no explanatory copy | XS | Content | `Home.tsx` (`Practice`) | P3 |
| PRA‑09 | P3 | — (open question) | Focus Mode fully hides Coach; may or may not be intended | — | Product/pedagogy decision | `Home.tsx` (`Practice`), `index.css` `.focus-mode` | P3, open question (§13) |
| TRK‑02 | P3 | Low (Observation) | Chart is hand-rolled; `recharts`/`chart.tsx` installed but unused | — | Hygiene | `Home.tsx` (`ProgressTracking`) | P3 |
| GLB‑09b | P3 | Low (Observation) | `NotFound.tsx`/`ThemeContext.tsx` are dead, off-brand, or unused code | XS | Hygiene | `NotFound.tsx`, `ThemeContext.tsx` | P3 |

**Reading this table:** P0 rows are all either single-value fixes (a CSS color, an HTML attribute) or a single conditional-render fix, with the sole exception of GLB‑01, which is P0 *as a scoping decision* (stop presenting a non-functional toggle as if it works) while its full build-out is explicitly multi-phase and partly deferred (§13). Nothing in P0 or P1 requires touching command logic, scoring logic, or the assessment model.

---

## 10. Target-State Design Revision Specification

Concrete enough to implement without guessing, described without code, organized by area. Every item below traces to a finding ID in §5–§9.

**Typography (resolves GLB‑02).** All three declared families load and render as designed: `Space Grotesk` for display/UI chrome, `IBM Plex Mono` for all command/output/terminal content, `Cairo` for Arabic text specifically. Loading mechanism (hosted link vs. self-hosted files) is an implementation choice; the acceptance bar is that computed `font-family` on a heading, a terminal line, and Arabic body copy each resolve to the named family, not a fallback. This should land before any other visual-polish work, since it changes the metrics (line length, wrapping) every other screen was visually reviewed against.

**Color and contrast (resolves GLB‑04, GLB‑05, GLB‑06, GLB‑13).** One consolidated token set — the `--ab-*` values, being the more recently and deliberately tuned pass, should become canonical rather than being discarded — with the following corrected pairings, each re-verified at ≥4.5:1 for its actual rendered text size: primary-button text/background, `--text-faint` wherever it appears at non-large size, and the terminal input placeholder. No new colors are needed; this is a small set of value adjustments plus a naming consolidation, not a new palette.

**Coach panel default state (resolves PRA‑01).** Before any command exists, the Coach panel shows neutral, non-error-styled guidance — the existing default *body* copy ("Think in workflow steps...") is sufficient content; the eyebrow correctly already says "AWAITING COMMAND." The `<code>` line should not render at all, or should show placeholder text explicitly marked as an example, in a neutral (not red) treatment, until a real command exists.

**Tab/toggle semantics (resolves GLB‑07).** One shared interaction pattern — not five separate implementations — applied to: Practice's Learn/Practice/Assessment, Tracking's Overall/Accuracy/Sequencing, Progression's Technical/Customer Service, Growth Record's Record/History/Reports, and Scenarios' status filters. Each exposes its current selection programmatically (via `aria-selected` within a `role="tablist"`/`role="tab"` structure, or `aria-pressed` where the control is closer to a toggle than a panel-switcher — a later engineer should pick whichever matches each control's actual behavior, since Practice's tabs swap entire panels while Tracking's toggle changes a chart's data series without swapping panels). Visual appearance does not need to change; this is a semantics-only addition.

**Content-count honesty (resolves PRG‑01, SCN‑01, GRW‑03).** Establish one rule and apply it in all three places: any summary number or fraction shown to a trainee is computed from the same array/dataset the detail view beneath it renders — never a separate literal. Where the *intent* is genuinely a larger dataset than currently exists (e.g., 8 planned stages vs. 6 authored), the honest interim state names what's actually available now rather than implying the rest is reachable today.

**Non-functional affordances (resolves GLB‑08 and its named instances).** For each of the twelve inventoried controls, one of two outcomes — decided per-control, not blanket: (a) remove or visually de-emphasize the control until its real function is built (appropriate for "Filters" on Scenarios, which duplicates working functionality already on screen), or (b) wire it to the real, already-available data it should be touching (appropriate for Scenarios' sort control, since sortable fields already exist on every scenario object). Neither outcome requires new data models.

**Navigation order and "Route" naming (resolves GLB‑10).** Pick one source of truth for "what number/position is this screen" and use it everywhere the concept appears (bottom nav order, sidebar order, and the "YOUR ROUTE / 0N" breadcrumb) — see the two concrete options specified in §5.0. Separately, rename either the Progression tab's short label or the umbrella breadcrumb term so "Route" does not refer to two different-scoped things at once.

**EN/AR toggle (resolves GLB‑01, scoping only — full build is deferred, §13).** Until real i18n/RTL exists, the toggle should not visually imply a working switch. If Arabic support is scheduled for a near-term phase, the UI-ready groundwork that's safe to do now without engine/content work is: confirm `--font-ar` (Cairo) is wired to apply automatically whenever `[dir="rtl"]` is set on a container, so that whenever the real switch is built, typography is already correctly scoped and doesn't need a second pass.

**320px validation (resolves GLB‑15).** Extend the existing 360px terminal-header two-row grid restructure — already source-proven to solve a real overlap problem — down to and confirmed at the declared 320px floor. No new pattern is needed, only confirming/extending the one already built.

---

## 11. Phased Implementation Plan

**P0 — Foundations and Safety.** Everything here is a single-value or single-condition fix with no state-model or command-logic risk, and should land together as one pass since several touch the same files:
1. GLB‑02 (load the three declared fonts) — do this **first** within P0, since it changes visual metrics every other fix will be checked against.
2. GLB‑03 (remove `maximum-scale=1`).
3. GLB‑04 (fix primary-button contrast).
4. PRA‑01 (remove the default fake-error Coach state).
5. GLB‑01 — **as a scoping decision only**: stop presenting the language toggle as functional this phase. No engine work in P0.

*Sequencing constraint:* GLB‑02 before any other visual QA in this list, since font-loading changes text metrics that a contrast/layout check should be run against, not before.

**P1 — Terminal and UX Hierarchy.** Concentrated on the Terminal (the brief's own stated priority) plus the design-system consolidation that several Terminal fixes depend on:
1. GLB‑13 (consolidate the two token systems) — do this **before** GLB‑07, since the tab-semantics pattern work will touch styling in both the base and `.page-practice`-scoped rules, and should be written against one consolidated system, not two.
2. GLB‑07 (tab/toggle ARIA semantics, all five instances, one shared pattern).
3. PRA‑02 mitigation (surface carried-over hint/command count transparently on entering Assessment) — UI-only; the root state-isolation question stays in §13.
4. GLB‑09a (mount `ErrorBoundary` at the app root; restyle its fallback to match the design system).
5. GLB‑15 (extend the 360px terminal-header fix down to 320px; validate).
6. PRG‑01 and SCN‑01 honesty fixes (derive displayed counts from real arrays) — the *content* backing them (the missing 2 stages, the missing 35 scenarios) is a separate, deferred, Content-owned track (§13); the UI-only honesty fix can land in P1 regardless of when that content arrives.
7. GLB‑05 (`--text-faint` contrast correction).

**P2 — Shared System and All Screens.** Everything screen-specific not already required by P0/P1, plus the remaining cross-cutting items:
1. GLB‑10 (navigation order/"Route" naming resolution).
2. GLB‑16 (tablet navigation identity — needs live/visual validation before deciding the fix, so schedule a validation pass at the start of this phase, not the end).
3. PRG‑02, PRG‑03 (Progression track-toggle honesty fix, expand-affordance visibility).
4. GRW‑01, GRW‑02, GRW‑03 (trend-color mapping, Backup relabel, History pagination honesty fix).
5. SCN‑02, SCN‑03, SCN‑04 (Filters/Sort resolution, task-strip long-title handling).
6. PRA‑03, PRA‑04, PRA‑06 (toast frequency, dual-prompt clarity, tab-remount focus handling).
7. GLB‑06, GLB‑11 (placeholder contrast, focus-ring color consolidation).

*Sequencing constraint:* GLB‑16's validation step should happen early in this phase since PRG/GRW/SCN screen work will be reviewed at tablet widths anyway as part of normal QA — combine the passes rather than re-testing tablet width twice.

**P3 — Polish, Content, Optional.** Lowest urgency; safe to schedule opportunistically:
1. GLB‑12 (CSS rule consolidation/cleanup).
2. GLB‑09b (remove or repurpose dead `NotFound`/`ThemeContext` code).
3. GRW‑04 (tablet hover-preview device validation).
4. PRA‑05 (session-timer seed value/copy).
5. TRK‑02 (chart-library alignment, only if/when richer chart interaction is actually needed).
6. GLB‑14, PRA‑09 — both are **open questions for product/pedagogy input**, not implementation items; see §13.

**Cross-phase dependency notes:**
- Nothing in P0–P2 depends on GLB‑01's full build-out (§13) — the rest of the product's fixes are independent of the i18n/RTL decision and should not be blocked waiting on it.
- Nothing in P0–P3 depends on PRA‑02's root state-isolation fix (§13) — the P1 transparency mitigation is a complete, independent, shippable improvement on its own.
- P1's GLB‑13 token consolidation should genuinely precede P1's GLB‑07 and P2's GRW‑01 (which touches `.skill-trend` colors) — both later items are easiest to write correctly against one token system rather than two.

---

## 12. Acceptance Criteria

Grouped as required. Each item is independently measurable/observable — a reviewer can confirm pass/fail without interpretation. Cross-references point back to the finding IDs carrying full evidence.

**Terminal (PRA‑01–PRA‑09, §6)**
- On first entry into Practice, before any command is submitted, nothing in the Coach panel is styled or worded as an error (PRA‑01).
- Entering Assessment mode with a non-zero carried-over hint or command count from an earlier mode in the same session states that count in trainee-readable language before the first Assessment submission (PRA‑02 mitigation).
- Over a simulated 15+ command session, success/error signal is not repeated in three separate channels simultaneously without a documented reason (PRA‑03).
- A first-time user can identify the real command-entry field within a few seconds without prompting, distinct from the scrolling output area's echoed line (PRA‑04, requires moderated-session validation).
- Switching Learn/Practice/Assessment tabs while keyboard focus is inside the terminal input does not silently move focus to `document.body` (PRA‑06, requires live keyboard-navigation validation).
- The command input continues to force 16px font-size, remain sticky above the safe-area inset, and scroll into view on focus — regression check, not a new requirement (protects the existing PRA‑07 strength).

**Navigation (GLB‑10, GLB‑14, GLB‑16, §5.0)**
- Tapping each of the five bottom-nav icons in order never produces a breadcrumb/label a trainee could read as contradicting that icon's position.
- "Route" (or whichever term is chosen) refers to exactly one concept everywhere it appears in the product's chrome.
- SideNav and BottomNav present the same destinations in a way that doesn't require separately memorizing two different orders (exact resolution approach is an open implementation choice per §10).
- The hamburger drawer either contains content the bottom nav doesn't, or is resolved per the product decision in §13 — not left as an unexamined duplicate.

**States (PRA‑01, GRW‑01, StateNotice patterns, §6.7, §5.4)**
- Every state currently distinguishable only by literal color-name mapping (specifically GRW‑01's trend arrows) is re-verified against a hypothetical case where direction and favorability diverge, and does not mislead in that case.
- `StateNotice`'s existing `role="alert"`/`role="status"` split is preserved unchanged as new states are added — regression check.
- Empty states (`Growth`, `ProgressTracking`, confirmed present in source but unreachable in current seed data) are exercised at least once via a manual data-clearing test before being considered verified in practice, not just present in source.

**Design System (GLB‑02, GLB‑05, GLB‑06, GLB‑11, GLB‑12, GLB‑13, §7)**
- A single token set drives color everywhere; searching the stylesheet for a legacy `--ab-`-prefixed reference after consolidation returns nothing.
- Computed `font-family` on a heading, a terminal line, and Arabic body text (once GLB‑01 progresses) each resolve to the intended named family.
- `.primary-button`, `--text-faint` (at every non-large-text usage site), and the terminal placeholder each independently re-measure at ≥4.5:1 against their actual rendered background.
- Exactly one focus-ring color is used across all interactive elements, or any deliberate exception is documented as intentional rather than incidental.
- No CSS property is declared for the same selector more than once without a comment explaining why (protects against GLB‑12 recurring).

**All Screens (PRG‑01–03, SCN‑01–04, GRW‑01–04, TRK‑02, §5.1–§5.5)**
- Every summary number or fraction shown anywhere in the product is computed from the same dataset its corresponding detail view renders (resolves PRG‑01, SCN‑01, GRW‑03 as one shared rule, not three separate fixes).
- Switching Progression's track toggle never leaves a heading or card referencing the *other* track's name on screen (PRG‑02).
- A mastered, expandable level card visibly communicates it's expandable before the first tap (PRG‑03).
- The Scenarios "Filters" and sort controls either perform their implied action using data already present on each scenario object, or are removed/relabeled — not left silently inert (SCN‑02, SCN‑03).
- The Practice task-strip does not clip or overlap its percentage badge when given the longest context string currently defined in `scenarios` (SCN‑04).
- "Backup" either performs a real, verifiable action or no longer claims to (GRW‑02).
- The skill-hover-preview's existing dual `:hover`/`:focus-visible` trigger and its complete `display:none` below 740px are both preserved unchanged — regression check (protects the existing GRW strength) — while the 740–1099px tablet gap (GRW‑04) is separately validated on a real device.

**Responsive (§8)**
- The terminal header renders without overlap or clipping at exactly 320px, extending the existing 360px fix rather than replacing it (GLB‑15).
- The 740–1099px tablet range's navigation chrome is deliberately reviewed at 768px, 834px, and 1024px and confirmed as one coherent decision (GLB‑16).
- The existing 390px and 360px terminal-header restructuring rules continue to function unchanged as other fixes land — regression check (protects real, evidenced existing work).

**Accessibility (§8)**
- Pinch-zoom and browser zoom both function on every screen without breaking layout (GLB‑03).
- All five tab-like control groups expose `aria-selected`/`aria-pressed` (or equivalent) reflecting current state (GLB‑07).
- Existing strengths are preserved unchanged: global `:focus-visible` coverage, `aria-live="polite"` on the terminal history and assessment report, `StateNotice`'s alert/status role pairing, the Progress Tracking chart's `role="table"` alternative, `ProgressRing`'s `role="img"`/`aria-hidden` pairing — all regression checks, not new work.

**Motion (§7.4)**
- The global `prefers-reduced-motion` catch-all and every component-scoped refinement continue to suppress all animation/transition when the setting is active — regression check on an already-exemplary implementation; no new motion work is required by this audit.

**Regression Safety — existing commands and workflows remain unchanged**
- Every currently-functional cross-screen handoff continues to work identically after all P0–P2 fixes land: Progression → Practice, Scenarios → Practice, Growth Record skill-detail → Practice, Progress Tracking history rows → Practice, and Practice's Finish Session → Growth Record/Progress Tracking update.
- `localStorage`-backed progress persistence (`aerobridge-progress-records`) continues to read/write identically; none of the fixes in this report touch `saveAssessment`, `assessmentScore`, or any other scoring/state logic except where PRA‑02 is explicitly, separately authorized as a deferred item.
- Up/Down arrow command-history recall, Reference-drawer chip insertion-with-refocus, and all three level-card interaction states (locked/current/mastered) behave identically before and after this report's fixes are implemented.
- No fix in P0–P3 requires a new dependency; `wouter`, `recharts`, and `framer-motion` remain installed-but-unused unless a specific future decision (e.g., TRK‑02) chooses to adopt one of them, which is explicitly out of scope for this report.

---

## 13. Deferred Dependencies and Open Questions

These require a product, content, engineering, or pedagogical decision this audit is explicitly not authorized to make. Each is a decision point, not a recommendation to build a specific solution.

**Architecture / Product decisions:**
- **GLB‑01, full build.** What level of Arabic/RTL support is actually planned for this release: full bidirectional layout mirroring + translated content, or a longer-term roadmap item? This determines whether `--font-ar`/Cairo should be wired now or later, and whether the toggle should be hidden, relabeled "coming soon," or built out. Not a UI decision — a scope decision.
- **GLB‑14.** Should the mobile hamburger drawer carry content the bottom nav doesn't (account, settings, help — none currently exist in the product), or should it be removed/merged given it's currently 100% redundant with BottomNav? Needs a product-scope answer, not a UI restyle.
- **GLB‑16.** Does the product want a dedicated tablet navigation identity (something between full mobile chrome and full sidebar), or is bottom-nav-on-tablet an accepted, intentional pattern? Needs a decision before the P2 fix is scoped, not just a visual tweak.
- **PRA‑09.** Should Focus Mode retain any lightweight access to Coach guidance, or is full removal correct for the "deliberate practice" framing? A pedagogy call, not a UI call.

**Engine / State-Model decisions:**
- **PRA‑02, root fix.** Should hint usage and command history be isolated per Learn/Practice/Assessment mode, or is a single continuous session-level count the intended model? This changes `assessmentScore`'s inputs and how `hintCount`/`commandHistory` are scoped in state — explicitly a State/Data change, not something this UI-only audit will specify further than the transparency mitigation already given in §6.5/§10.
- **GLB‑09a wiring.** Confirming `ErrorBoundary` should be mounted at the app root is a low-risk, near-certainly-correct call, but is technically an application-shell/engineering decision (where exactly in the tree, what it should do on repeated errors, whether it should log anywhere) beyond this audit's UI-only mandate to fully specify.

**Content decisions (the UI-only "honesty" fixes in §10/§11 can land regardless of when these resolve):**
- **PRG‑01.** Do 2 more Technical Track stages actually exist in the EgyptAir Basic/Advanced curriculum and simply need authoring, or was "8" always meant to be "6"? This audit cannot determine curriculum truth.
- **PRG‑02.** A full Customer Service track stage map, parallel to the 6-stage Technical Track, does not currently exist in source and needs real content, not a UI pattern.
- **SCN‑01.** The claimed "40" total scenarios and the "Exchanges & Refunds" category both need either real content or a corrected claim — this audit found 5 scenarios across 4 real categories and cannot determine which of "the claim" or "the content" is the intended target state.
- **GRW‑03.** 9 additional History entries beyond the 3 currently rendered need either real content or a corrected claim, same pattern as above.
- **GRW‑02.** A genuine backup/export mechanism (what "Backup" should actually do) is a product-and-engineering decision, not specified further here.

**Explicitly out of scope, not evaluated:** the accuracy or pedagogical quality of the Amadeus/GDS command-matching logic itself (what counts as a correct command, how errors are classified into the Syntax/Sequence/Decision/Hint-dependency taxonomy, how `assessmentScore`'s weighting was chosen) — this is Engine/Content territory the brief itself places outside a UI/UX audit, and no source-level claim about its correctness is made anywhere in this report.

---

## 14. Final Verdict

**AeroBridge needs a focused revision pass — it is not ready for implementation as-is, and it does not need foundational architecture clarification first.**

The reasoning, directly from the evidence above: nothing in this audit points to a structural problem with the product's shape. The five-screen loop is coherent and genuinely wired end-to-end (§3); the single-component architecture, while unconventional, is legible and lifts state cleanly, which is *why* nearly every fix in this report is classified UI-only or Content-only rather than Engine-dependent (§9's Priority Matrix: every P0 item and the large majority of P1/P2 items carry Effort XS–M and Dependency "UI-only"). A product that needed foundational clarification would show up in this kind of line-by-line source audit as inconsistent state ownership, unclear data flow, or components that don't know what they're supposed to do — none of that was found. What was found instead is a well-intentioned prototype with a specific, recognizable failure pattern repeated across it: **things that look finished (a number, a button, a toggle, an error message) sitting slightly ahead of what's actually wired underneath them.** That is a revision-pass problem, not an architecture problem.

The evidence for "needs a focused pass" rather than "ready now": PRA‑01 (a fabricated error on the product's most important screen, at the most important moment — first load) and GLB‑02 (none of the product's three intentional typefaces are actually loading) are both severe enough, and both cheap enough to fix, that shipping without addressing them would mean shipping a materially different, worse product than the one the source code and design tokens actually specify. Neither requires new architecture; both require a small, well-defined change.

The one genuine exception — the one place this audit recommends pausing for something closer to foundational clarification before UI work proceeds — is **GLB‑01**, the Arabic/RTL question. Not because the fix is technically hard in isolation, but because building real RTL support without first deciding its actual scope (full mirroring? which screens? translated content from where?) risks exactly the kind of half-wired-again pattern already found everywhere else in this audit. That one decision should be made deliberately, before engineering time is spent on it — everything else in this report can proceed in parallel without waiting on it (§11's cross-phase dependency notes).

**Recommended immediate next step:** implement the five P0 items (§11) as one small, low-risk batch — they touch a font link, a viewport meta attribute, one CSS color value, and one conditional render — then re-run this audit's screenshot comparison against the six views provided here to confirm no regression, before proceeding to P1.
