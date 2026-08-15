/* AeroBridge Future Vision — one coherent product loop: Progression → Practice → Scenarios → Growth Record. */
import { useEffect, useMemo, useRef, useState, type ElementType } from "react";
import { toast } from "sonner";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleDot,
  Compass,
  Gauge,
  Languages,
  Layers3,
  LockKeyhole,
  Menu,
  Maximize2,
  Minimize2,
  Plane,
  Radar,
  Route,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  Terminal,
  Timer,
  TrendingDown,
  TrendingUp,
  Trophy,
  UserRound,
  X,
} from "lucide-react";

type View = "progression" | "practice" | "scenarios" | "growth" | "tracking";

type SystemState = "first-use" | "empty" | "loading" | "ready" | "in-progress" | "success" | "partial-success" | "error" | "retry" | "interrupted" | "completed" | "review" | "locked" | "unavailable";
type ErrorKind = "syntax" | "sequence" | "decision" | "hint-dependency";
type ProgressRecord = { id: string; context: string; date: string; overall: number; accuracy: number; sequencing: number; hints: number; commands: number; status: "passed" | "review" | "incomplete"; state?: SystemState; nextAction?: "Review" | "Retry" | "Practice" | "Scenario" };

type NavItem = { id: View; label: string; short: string; icon: ElementType };
type AssessmentEntry = { command: string; response: string; ok: boolean; errorKind?: ErrorKind; coach: { title: string; body: string; next: string }; expectedStep: number; step: number; hintUsed: boolean };

const assessmentOrder = ["AN", "SS", "FQD", "FXP"];

function assessmentScore(entries: AssessmentEntry[], hints: number) {
  const total = entries.length;
  const correct = entries.filter((entry) => entry.ok).length;
  const orderCorrect = entries.filter((entry) => entry.ok && entry.step === entry.expectedStep).length;
  const accuracy = total ? Math.round((correct / total) * 100) : 0;
  const sequencing = total ? Math.round((orderCorrect / total) * 100) : 0;
  const hintScore = Math.max(0, 100 - hints * 12);
  const overall = total ? Math.round(accuracy * 0.5 + sequencing * 0.35 + hintScore * 0.15) : 0;
  return { total, correct, accuracy, sequencing, hintScore, overall, orderCorrect };
}

const navItems: NavItem[] = [
  { id: "progression", label: "Progression", short: "Route", icon: Route },
  { id: "practice", label: "Practice", short: "Train", icon: Terminal },
  { id: "scenarios", label: "Scenarios", short: "Apply", icon: Radar },
  { id: "growth", label: "Growth Record", short: "Evidence", icon: Activity },
  { id: "tracking", label: "Progress Tracking", short: "Trend", icon: TrendingUp },
];

const seedProgress: ProgressRecord[] = [
  { id: "EV-041", context: "Pricing & Ticketing", date: "Today", overall: 78, accuracy: 86, sequencing: 72, hints: 1, commands: 4, status: "passed" },
  { id: "EV-038", context: "Availability & Sell", date: "Yesterday", overall: 84, accuracy: 92, sequencing: 86, hints: 0, commands: 4, status: "passed" },
  { id: "EV-034", context: "Pricing & Ticketing", date: "2 days ago", overall: 61, accuracy: 68, sequencing: 54, hints: 3, commands: 5, status: "review" },
];

const levels = [
  { code: "01", title: "Sign-in & Encode / Decode", meta: "Mastered", state: "mastered", progress: 100 },
  { code: "02", title: "Availability & Sell", meta: "Mastered", state: "mastered", progress: 100 },
  { code: "03", title: "Pricing & Ticketing", meta: "Current focus", state: "current", progress: 68 },
  { code: "04", title: "PNR Creation", meta: "Ready to start", state: "ready", progress: 0 },
  { code: "05", title: "Ancillaries & Special Services", meta: "Locked · Advanced", state: "locked", progress: 0 },
  { code: "06", title: "Queues & PNR Management", meta: "Locked · Advanced", state: "locked", progress: 0 },
];

const scenarios = [
  { id: "SC-014", title: "Group booking for a corporate client", category: "GDS", difficulty: "Medium", duration: "20 min", progress: 72, accent: "blue", skills: ["Availability", "Pricing", "Group booking"], result: "In progress", description: "Build a group itinerary for a corporate client travelling to Jeddah, then prepare the file for pricing." },
  { id: "SC-021", title: "Rebooking due to schedule change", category: "Mixed Workplace", difficulty: "Advanced", duration: "25 min", progress: 0, accent: "violet", skills: ["Rebooking", "Disruption", "English"], result: "Not started", description: "A schedule change affects a family booking. Protect the customer relationship while rebuilding the itinerary." },
  { id: "SC-009", title: "Issue ticket and ancillary services", category: "GDS", difficulty: "Easy", duration: "15 min", progress: 100, accent: "green", skills: ["Ticketing", "SSR", "Seats"], result: "Completed · 92%", description: "Complete the final steps of a reservation and attach the requested special services." },
  { id: "SC-018", title: "Full refund request (ATC)", category: "GDS", difficulty: "Hard", duration: "30 min", progress: 0, accent: "violet", skills: ["Refund", "Fare rules", "ATC"], result: "Not started", description: "Interpret the fare conditions and determine the correct refund path without losing operational detail." },
  { id: "SC-026", title: "Difficult customer at the airport", category: "Customer Service", difficulty: "Medium", duration: "18 min", progress: 0, accent: "amber", skills: ["De-escalation", "English", "Recovery"], result: "Recommended", description: "A missed connection has created an emotional customer interaction. Lead with clarity and empathy." },
];

const skillRows = [
  { code: "AN", name: "Availability", state: "Mastered", value: 92, trend: "down", tone: "good" },
  { code: "SS", name: "Sell Segment", state: "Mastered", value: 88, trend: "down", tone: "good" },
  { code: "FQD", name: "Fare Display", state: "Improving", value: 45, trend: "up", tone: "warn" },
  { code: "FXP", name: "Pricing / PNR", state: "Needs attention", value: 20, trend: "up", tone: "warn" },
  { code: "DE-ESC", name: "De-escalation", state: "Improving", value: 60, trend: "down", tone: "good" },
];

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><img src="/manus-storage/aerobridge-share-mark_5efd31e0.png" alt="" /></span>;
}

function Logo() {
  return <div className="logo-lockup"><BrandMark /><span>Aero<span>Bridge</span></span></div>;
}

function useAnimatedNumber(target: number, duration = 760) {
  const [display, setDisplay] = useState(0);
  const currentValue = useRef(0);
  useEffect(() => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      currentValue.current = target;
      setDisplay(target);
      return;
    }
    let frame = 0;
    const startedAt = performance.now();
    const startValue = currentValue.current;
    const delta = target - startValue;
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + delta * eased;
      currentValue.current = nextValue;
      setDisplay(nextValue);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return Math.round(display);
}

function AnimatedNumber({ value, suffix = "", prefix = "", duration = 760 }: { value: number; suffix?: string; prefix?: string; duration?: number }) {
  const display = useAnimatedNumber(value, duration);
  return <span className="animated-number" aria-label={`${prefix}${value}${suffix}`}>{prefix}{display}{suffix}</span>;
}

function AnimatedBar({ value, className = "" }: { value: number; className?: string }) {
  const display = useAnimatedNumber(value, 820);
  return <i className={className} style={{ width: `${display}%` }} aria-label={`${value}% progress`} />;
}

function ProgressRing({ value, size = 94, tone = "blue" }: { value: number; size?: number; tone?: string }) {
  const animatedValue = useAnimatedNumber(value, 900);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedValue / 100) * circumference;
  return <div className={`progress-ring progress-ring--${tone}`} style={{ width: size, height: size }} role="img" aria-label={`${value}% progress`}>
    <svg viewBox="0 0 100 100" aria-hidden="true"><circle className="ring-track" cx="50" cy="50" r={radius} /><circle className="ring-value" cx="50" cy="50" r={radius} style={{ strokeDasharray: circumference, strokeDashoffset: offset }} /></svg>
    <strong><AnimatedNumber value={value} suffix="%" duration={900} /></strong>
  </div>;
}

function Topbar({ onMenu, view }: { onMenu: () => void; view: View }) {
  const title = navItems.find((item) => item.id === view)?.label ?? "Progression";
  const [language, setLanguage] = useState<"EN" | "AR">("EN");
  const [searchOpen, setSearchOpen] = useState(false);
  return <header className="topbar">
    <button className="mobile-menu icon-button" onClick={onMenu} aria-label="Open navigation"><Menu size={19} /></button>
    <div className="topbar-brand"><BrandMark /></div>
    <div className="topbar-context"><span className="eyebrow">AEROBRIDGE / TRAINING ENVIRONMENT</span><strong>{title}</strong></div>
    <div className="topbar-actions">
      <button className="language-switch" aria-label="Language selector" onClick={() => { const next = language === "EN" ? "AR" : "EN"; setLanguage(next); toast.success(`Interface language set to ${next}`); }}><span className={language === "EN" ? "is-active" : ""}>EN</span><span className={language === "AR" ? "is-active" : ""}>AR</span></button>
      <button className="icon-button topbar-search" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search"><Search size={17} /></button>
      <button className="profile-chip" onClick={() => toast.info("Profile workspace is ready for your training identity.")} aria-label="Profile"><span className="avatar">KA</span><span className="profile-name">Karim Ahmed</span></button>
    </div>
    {searchOpen && <div className="command-popover"><span className="eyebrow">QUICK FIND</span><strong>Search is scoped to your learning path.</strong><small>Try Progression, Pricing, or Scenario.</small><button className="text-action" onClick={() => setSearchOpen(false)}>Dismiss <X size={13} /></button></div>}
  </header>;
}

function SideNav({ view, setView }: { view: View; setView: (view: View) => void }) {
  return <aside className="side-nav">
    <Logo />
    <div className="nav-caption">LEARNING PATH</div>
    <nav>{navItems.map((item) => { const Icon = item.icon; return <button key={item.id} className={`nav-link ${view === item.id ? "is-active" : ""}`} onClick={() => setView(item.id)}><Icon size={18} /><span>{item.label}</span>{view === item.id && <ChevronRight className="nav-chevron" size={15} />}</button>; })}</nav>
    <div className="side-divider" />
    <div className="side-mini-card"><span className="mini-orb"><ShieldCheck size={15} /></span><div><strong>Saudi readiness</strong><small>Evidence path · <AnimatedNumber value={24} suffix="%" /></small></div></div>
    <div className="side-footer"><div className="streak-row"><span>Current streak</span><strong><AnimatedNumber value={7} /> days</strong></div><div className="streak-track"><AnimatedBar value={70} /></div><small>7 of 10-day target.</small></div>
  </aside>;
}

function BottomNav({ view, setView }: { view: View; setView: (view: View) => void }) {
  const orderedItems = [navItems[0], navItems[2], navItems[1], navItems[3], navItems[4]];
  return <nav className="bottom-nav" aria-label="Primary workspace navigation">{orderedItems.map((item, index) => { const Icon = item.icon; return <button key={item.id} className={`${view === item.id ? "is-active" : ""} ${index === 2 ? "is-primary" : ""}`} onClick={() => setView(item.id)} aria-current={view === item.id ? "page" : undefined}><Icon size={19} /><span>{item.short}</span></button>; })}</nav>;
}

function StateNotice({ state, title, body, action }: { state: SystemState; title: string; body: string; action?: React.ReactNode }) {
  return <div className={`state-notice state-notice--${state}`} role={state === "error" ? "alert" : "status"}><span className="state-notice-mark" aria-hidden="true" /> <div><strong>{title}</strong><p>{body}</p>{action}</div></div>;
}

function ProgressTracking({ records, setView, setPracticeContext }: { records: ProgressRecord[]; setView: (view: View) => void; setPracticeContext: (context: string) => void }) {
  const [metric, setMetric] = useState<"overall" | "accuracy" | "sequencing">("overall");
  const values = records.map((record) => record[metric]);
  const current = values[0] ?? 0;
  const previous = values[1] ?? current;
  const delta = current - previous;
  const average = records.length ? Math.round(records.reduce((sum, record) => sum + record[metric], 0) / records.length) : 0;
  const max = Math.max(...values, 100);
  const trendLabel = delta > 0 ? "Signal improving" : delta < 0 ? "Review needed" : "Holding steady";
  const trendTone = delta > 0 ? "positive" : delta < 0 ? "warning" : "neutral";
  return <div className="page page-tracking">
    <div className="tracking-hero"><div className="page-intro"><div><span className="eyebrow">YOUR ROUTE / 05 · PERFORMANCE TREND</span><h1>Progress Tracking</h1><p>Turn each assessment into a clearer operational signal.</p></div><div className="tracking-hero-actions"><span className={`tracking-live tracking-live--${trendTone}`}><i /> {trendLabel}</span><button className="ghost-button" onClick={() => { setPracticeContext("Pricing & Ticketing"); setView("practice"); }}>Run another assessment <ArrowUpRight size={14} /></button></div></div><div className="tracking-route-line"><span className="is-past" /><span className="is-past" /><span className="is-current" /><i /><i /><i /><b>VECTOR 03 / PRICING &amp; TICKETING</b></div></div>
    {records.length === 0 && <StateNotice state="empty" title="No assessment evidence yet" body="Complete one assessment to establish your first operational signal." action={<button className="text-action" onClick={() => { setPracticeContext("Pricing & Ticketing"); setView("practice"); }}>Start assessment <ArrowUpRight size={14} /></button>} />}
    <div className="tracking-kpis"><div className="tracking-kpi tracking-kpi--primary"><span className="eyebrow">CURRENT VECTOR / READOUT</span><div className="tracking-primary-main"><div><strong><AnimatedNumber value={current} suffix="%" /></strong><span className="tracking-kpi-title">Keep the signal moving.</span></div><ProgressRing value={current} size={86} /></div><small>{delta === 0 ? "No change since last session" : `${delta > 0 ? "+" : ""}${delta}% since last session`}</small><div className="tracking-primary-rule"><span>Evidence consistency</span><b>{current >= 70 ? "STABLE" : "REVIEW"}</b></div></div><div className="tracking-kpi"><span className="eyebrow">SESSIONS LOGGED</span><strong><AnimatedNumber value={records.length} /></strong><small>Local assessment evidence</small></div><div className="tracking-kpi"><span className="eyebrow">TREND AVERAGE</span><strong><AnimatedNumber value={average} suffix="%" /></strong><small>Across recorded sessions</small></div><div className="tracking-kpi"><span className="eyebrow">HINT DISCIPLINE</span><strong><AnimatedNumber value={Math.round(records.reduce((sum, record) => sum + record.hints, 0) / Math.max(records.length, 1))} /></strong><small>Average hints per session</small></div></div>
    <section className="tracking-chart panel-surface"><div className="tracking-panel-head"><div><span className="eyebrow">PERFORMANCE SIGNAL / {metric.toUpperCase()}</span><h2>Evidence over time</h2><p>Each bar is one completed training readout.</p></div><div className="metric-switcher">{(["overall", "accuracy", "sequencing"] as const).map((item) => <button key={item} className={metric === item ? "is-selected" : ""} onClick={() => setMetric(item)}>{item}</button>)}</div></div><div className="tracking-chart-shell"><div className="chart-y-axis"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="tracking-graph" aria-label={`${metric} performance chart`}><div className="chart-gridlines"><i /><i /><i /><i /></div>{records.map((record, index) => { const value = record[metric]; const height = Math.max(10, (value / max) * 100); return <div className={`tracking-point ${index === 0 ? "is-latest" : ""}`} key={record.id}><span className="tracking-bar" style={{ height: `${height}%` }}><b>{value}%</b><i /></span><small>{record.date}</small><em>{index === 0 ? "LATEST" : `SESSION ${index + 1}`}</em></div>; })}</div></div><details className="tracking-data-table"><summary>View data table</summary><div role="table" aria-label={`${metric} evidence over time`}><div role="row" className="tracking-data-row tracking-data-row--head"><span role="columnheader">Session</span><span role="columnheader">Date</span><span role="columnheader">Value</span></div>{records.map((record, index) => <div role="row" className="tracking-data-row" key={`table-${record.id}`}><span role="cell">{index === 0 ? "Latest" : `Session ${index + 1}`}</span><span role="cell">{record.date}</span><span role="cell">{record[metric]}%</span></div>)}</div></details><div className="tracking-legend"><span><i className="legend-dot legend-dot--blue" /> Recorded session</span><span><i className="legend-dot legend-dot--green" /> Latest signal</span><span className={`trend-readout trend-readout--${trendTone}`}>{delta > 0 ? "↑" : delta < 0 ? "↓" : "→"} {Math.abs(delta)} pts / last session</span></div></section>
    <div className="tracking-lower-grid"><section className="tracking-history panel-surface"><div className="tracking-panel-head"><div><span className="eyebrow">SESSION LOG / LOCAL EVIDENCE</span><h2>Assessment history</h2></div><span className="readout-code">{records.length} READOUTS</span></div><div className="tracking-table">{records.map((record, index) => <button key={record.id} className={`tracking-row tracking-row--${record.status} ${index === 0 ? "is-latest" : ""}`} onClick={() => { setPracticeContext(record.context); setView("practice"); }}><span className="tracking-id">{record.id}</span><span><strong>{record.context}</strong><small>{record.date} · {record.commands} commands · {record.hints} {record.hints === 1 ? "hint" : "hints"}</small></span><span className="tracking-metric"><b>{record.overall}%</b><small>{record.status}</small></span><ChevronRight size={15} /></button>)}</div></section><aside className="tracking-next panel-surface"><span className="eyebrow">NEXT USEFUL READOUT</span><div className="tracking-next-icon"><TrendingUp size={18} /></div><h2>Move the signal forward.</h2><p>{delta > 0 ? "Your latest session is trending up. Keep the same sequence and reduce one hint." : "Repeat the workflow with one fewer hint, then reassess the handoff into ticketing."}</p><button className="primary-button" onClick={() => { setPracticeContext("Pricing & Ticketing"); setView("practice"); }}>Open targeted practice <ChevronRight size={16} /></button></aside></div>
  </div>;
}

function SectionHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: string }) {
  return <div className="section-header"> <div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>{action && <button className="text-action" onClick={() => toast.info(`${action} is available in the evidence view.`)}>{action}<ArrowUpRight size={14} /></button>}</div>;
}

function Progression({ setView }: { setView: (view: View) => void }) {
  const [track, setTrack] = useState<"technical" | "service">("technical");
  const [expandedLevel, setExpandedLevel] = useState("03");
  return <div className="page page-progression">
    <div className="page-intro"><div><span className="eyebrow">YOUR ROUTE / 01 · CURRENT VECTOR 03</span><h1>Progression</h1><p>Know where you are. See the next workflow.</p></div><button className="ghost-button" onClick={() => toast.info("Your route is anchored to Pricing & Ticketing.")}><Compass size={16} /> My route</button></div>
    <div className="progression-layout">
      <section className="hero-route panel-surface">
        <div className="route-motif"><span className="route-line" /><span className="route-node route-node--one" /><span className="route-node route-node--two" /><span className="route-node route-node--three" /></div>
        <div className="hero-route-copy"><span className="eyebrow">CONTINUE WHERE YOU LEFT OFF</span><span className="route-badge"><CircleDot size={13} /> TECHNICAL TRACK</span><h2>Pricing &amp;<br />Ticketing</h2><p>Level 3 · Basic workflow</p><div className="hero-meta"><span><Check size={14} /> <AnimatedNumber value={6} /> of 9 command sets</span><span><Timer size={14} /> <AnimatedNumber value={20} /> min estimated</span></div><button className="primary-button" onClick={() => setView("practice")}>Resume pricing workflow <ChevronRight size={17} /></button></div>
        <ProgressRing value={68} size={128} />
      </section>
      <section className="route-overview panel-surface"><SectionHeader eyebrow="CURRENT VECTOR" title="Your learning path" action="View map" /><div className="route-progress"><div className="route-progress-head"><span>Technical Track</span><strong><AnimatedNumber value={3} /> / 8 stages</strong></div><div className="segmented-progress"><span /><span /><span className="is-current" /><i /><i /><i /><i /><i /></div></div><div className="milestone-list"><div className="milestone is-done"><span><Check size={14} /></span><div><strong>Sign-in &amp; Encode</strong><small>Mastered · <AnimatedNumber value={100} suffix="%" /></small></div></div><div className="milestone is-done"><span><Check size={14} /></span><div><strong>Availability &amp; Sell</strong><small>Mastered · <AnimatedNumber value={100} suffix="%" /></small></div></div><div className="milestone is-current"><span>03</span><div><strong>Pricing &amp; Ticketing</strong><small>Current focus · <AnimatedNumber value={68} suffix="%" /></small></div><ChevronRight size={16} /></div><div className="milestone is-locked"><span><LockKeyhole size={14} /></span><div><strong>PNR Creation</strong><small>Ready after current stage</small></div></div></div></section>
    </div>
    <section className="track-section"><SectionHeader eyebrow="CHOOSE YOUR TRACK" title="Build capability, not just completion." /><div className="track-tabs"><button className={track === "technical" ? "is-active" : ""} onClick={() => setTrack("technical")}><Terminal size={16} /> Technical Track<span>GDS workflows</span></button><button className={track === "service" ? "is-active" : ""} onClick={() => setTrack("service")}><Languages size={16} /> Customer Service<span>Professional English</span></button></div><p className="track-description">{track === "technical" ? "From core Amadeus commands to confident reservation, pricing, and ticketing workflows." : "Practice the human side of the operation: clarity, empathy, disruption handling, and service recovery."}</p></section>
    <section className="levels-section"><SectionHeader eyebrow="STAGE MAP" title="Technical workflow milestones" action="See all stages" /><div className="level-grid">{levels.map((level) => <button key={level.code} className={`level-card level-card--${level.state}`} onClick={() => { if (level.state === "locked") toast.info("Complete Pricing & Ticketing to unlock this workflow."); else if (level.state === "current") setView("practice"); else setExpandedLevel(expandedLevel === level.code ? "" : level.code); }}><span className="level-code">{level.code}</span><span className="level-card-main"><strong>{level.title}</strong><small>{level.meta}</small>{level.progress > 0 && <span className="tiny-progress"><AnimatedBar value={level.progress} /></span>}{expandedLevel === level.code && level.state !== "locked" && <span className="level-detail">{level.state === "current" ? "Open targeted practice to move this vector forward." : "Evidence verified across recent sessions."}</span>}</span><span className="level-trailing">{level.state === "mastered" ? <Check size={16} /> : level.state === "locked" ? <LockKeyhole size={15} /> : <ChevronRight size={17} />}</span></button>)}</div></section>
  </div>;
}

function AssessmentReport({ score, hints, onRestart }: { score: ReturnType<typeof assessmentScore>; hints: number; onRestart: () => void }) {
  const verdict = score.overall >= 85 ? "Operationally ready" : score.overall >= 70 ? "Review one workflow pass" : "Rebuild the sequence with guidance";
  const recommendation = score.sequencing < score.accuracy ? "Repeat the workflow in order: availability → sell → fare display → pricing." : score.hintScore < 80 ? "Run the next attempt with fewer reference opens to test independent recall." : score.accuracy < 80 ? "Review command formats and submit one clean entry per step." : "Move to a scenario and apply the same sequence under pressure.";
  return <section className="assessment-report panel-surface" aria-live="polite"><div className="assessment-report-head"><div><span className="eyebrow">SESSION DEBRIEF / ASSESSMENT</span><h2>{verdict}</h2><p>Feedback is based on this local training session, not a live carrier system.</p></div><div className="assessment-score"><AnimatedNumber value={score.overall} suffix="%" /><small>overall</small></div></div><div className="assessment-grid"><div><span>Command accuracy</span><strong><AnimatedNumber value={score.accuracy} suffix="%" /></strong><small>{score.correct} of {score.total} accepted</small></div><div><span>Workflow order</span><strong><AnimatedNumber value={score.sequencing} suffix="%" /></strong><small>{score.orderCorrect} correctly sequenced</small></div><div><span>Hint discipline</span><strong><AnimatedNumber value={score.hintScore} suffix="%" /></strong><small>{hints} reference {hints === 1 ? "open" : "opens"}</small></div></div><div className="assessment-feedback"><span className="eyebrow">NEXT TRAINING MOVE</span><p>{recommendation}</p></div><div className="assessment-error-key" aria-label="Assessment error taxonomy"><span><i className="error-key-dot error-key-dot--syntax" /> Syntax</span><span><i className="error-key-dot error-key-dot--sequence" /> Sequence</span><span><i className="error-key-dot error-key-dot--decision" /> Decision</span><span><i className="error-key-dot error-key-dot--hint" /> Hint dependency</span></div><button className="ghost-button" onClick={onRestart}>Retry assessment <ArrowUpRight size={14} /></button></section>;
}

function Practice({ context = "Pricing & Ticketing", onAssessmentComplete }: { context?: string; onAssessmentComplete?: (record: ProgressRecord) => void }) {
  const [mode, setMode] = useState<"learn" | "practice" | "assessment">("learn");
  const [command, setCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<AssessmentEntry[]>([]);
  const [referenceOpen, setReferenceOpen] = useState(false);
  const [coachOpen, setCoachOpen] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [focused, setFocused] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [sessionSeconds, setSessionSeconds] = useState(272);
  useEffect(() => { const timer = window.setInterval(() => setSessionSeconds((seconds) => seconds + 1), 1000); return () => window.clearInterval(timer); }, []);
  const sessionMinutes = Math.floor(sessionSeconds / 60);
  const sessionRemainder = sessionSeconds % 60;
  const sessionClock = `${String(sessionMinutes).padStart(2, "0")}:${String(sessionRemainder).padStart(2, "0")}`;
  const liveAssessment = assessmentScore(commandHistory, hintCount);
  const accuracy = submitted ? liveAssessment.accuracy : 86;
  const latestEntry = commandHistory[commandHistory.length - 1];
  const sessionState = sessionComplete ? "COMPLETED" : commandHistory.length ? "READY" : "LOCAL SESSION";
  const commandState = latestEntry ? (latestEntry.ok ? "SUCCESS" : "ERROR") : "READY";
  const coachState = mode === "assessment"
    ? { title: "Assessment evidence recorded.", body: latestEntry ? "Hints stay quiet in Assessment mode. Review the returned status and explain the next operational decision in your own words." : "Assessment mode records the command outcome without exposing a shortcut.", next: latestEntry ? "Review your result" : "Submit a command" }
    : latestEntry?.coach ?? { title: "Think in workflow steps.", body: "The price display is the evidence. Check the fare family before you commit to ticketing.", next: "Review the fare display" };
  const inputRef = useRef<HTMLInputElement>(null);
  const focusCommandInput = () => window.setTimeout(() => inputRef.current?.scrollIntoView({ block: "center", behavior: "smooth" }), 120);
  const handleCommandKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    if (!commandHistory.length) return;
    const nextIndex = event.key === "ArrowUp" ? Math.min(historyIndex + 1, commandHistory.length - 1) : Math.max(historyIndex - 1, -1);
    setHistoryIndex(nextIndex);
    setCommand(nextIndex === -1 ? "" : commandHistory[commandHistory.length - 1 - nextIndex].command);
  };
  const submitCommand = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextCommand = command.trim().toUpperCase() || "FQD";
    const expectedStep = Math.max(1, assessmentOrder.indexOf(nextCommand.slice(0, 3)) + 1);
    const step = commandHistory.length + 1;
    const knownCommand = assessmentOrder.includes(nextCommand.slice(0, 3));
    const sequenceError = knownCommand && mode === "assessment" && step !== expectedStep;
    const commandProfile = nextCommand.startsWith("AN")
      ? { response: sequenceError ? "SEQUENCE ERROR · EXPECTED WORKFLOW STEP differs" : "AVAILABILITY RETURNED · 7 OPTIONS", ok: !sequenceError, errorKind: sequenceError ? "sequence" as ErrorKind : undefined, coach: { title: sequenceError ? "The command is valid but out of sequence." : "Availability is valid.", body: sequenceError ? `Return to step ${expectedStep} before continuing this assessment.` : "The schedule returned usable options. Select the segment before moving into sell.", next: sequenceError ? "Return to expected step" : "Practice sell segment" } }
      : nextCommand.startsWith("SS")
        ? { response: sequenceError ? "SEQUENCE ERROR · SELL REQUIRES THE CONFIRMED AVAILABILITY STEP" : "SEGMENT SOLD · STATUS HK1", ok: !sequenceError, errorKind: sequenceError ? "sequence" as ErrorKind : undefined, coach: { title: sequenceError ? "Protect the last confirmed step." : "The segment is held.", body: sequenceError ? "This command is recognized, but the workflow order needs review." : "Sell status HK1 confirms the itinerary is moving. Now protect the passenger record with a clean name entry.", next: sequenceError ? "Review workflow order" : "Practice name entry" } }
        : nextCommand.startsWith("FQD")
          ? { response: sequenceError ? "SEQUENCE ERROR · REVIEW SELL BEFORE FARE DISPLAY" : "FARE DISPLAY RETURNED · 3 FARE FAMILIES", ok: !sequenceError, errorKind: sequenceError ? "sequence" as ErrorKind : undefined, coach: { title: sequenceError ? "The fare step needs its prerequisite." : "Fare display returned.", body: sequenceError ? "Confirm the previous operational step before comparing fare families." : "Compare the fare family and restrictions before pricing. The next decision is evidence-led, not a guess.", next: sequenceError ? "Review confirmed steps" : "Review fare family" } }
          : nextCommand.startsWith("FXP")
            ? { response: sequenceError ? "DECISION ERROR · PRICING CONTEXT IS NOT READY" : "PRICE QUOTE COMPLETE · TOTAL FARE FOUND", ok: !sequenceError, errorKind: sequenceError ? "decision" as ErrorKind : undefined, coach: { title: sequenceError ? "Pricing needs the right operational context." : "Pricing is complete.", body: sequenceError ? "Review the fare display and confirmed itinerary before requesting a quote." : "The itinerary now has a fare. Check the total and fare basis before you move toward ticketing.", next: sequenceError ? "Review fare evidence" : "Verify fare basis" } }
            : { response: "SYNTAX ERROR · CHECK ENTRY FORMAT", ok: false, errorKind: "syntax" as ErrorKind, coach: { title: "The command needs another pass.", body: "This entry was not recognized by the local training simulation. Use AN, SS, FQD, or FXP to continue the current workflow.", next: "Open command reference" } };
    setCommandHistory((current) => [...current, { command: nextCommand, ...commandProfile, expectedStep, step, hintUsed: false }]);
    setHistoryIndex(-1);
    setCommand("");
    setSubmitted(commandProfile.ok);
    if (mode === "assessment" && commandProfile.ok && step !== expectedStep) toast.warning("Command accepted, but the workflow order needs review.");
    if (commandProfile.ok) toast.success("Command accepted. Evidence captured.");
    else toast.error("Review the command format before continuing.");
  };
  return <div className={`page page-practice ${focused ? "focus-mode" : ""}`}>
    <div className="page-intro"><div><span className="eyebrow">{focused ? "FOCUSED TRAINING / GDS WORKSPACE" : "YOUR ROUTE / 02"}</span><h1>{focused ? "Training Terminal" : "Practice"}</h1><p>{focused ? "A concentrated operational workspace for deliberate practice." : "Train the workflow. Own the outcome."}</p></div><div className="practice-intro-actions"><div className="practice-status"><span className="status-dot" /> Local session <span>{sessionClock}</span></div>{focused && <button className="ghost-button focus-exit-inline" onClick={() => setFocused(false)}><Minimize2 size={15} /> Exit focus</button>}</div></div>
    <div className="practice-layout"><section className="practice-main">
      <div className="task-strip"><div className="task-icon"><Target size={19} /></div><div><span className="eyebrow">CURRENT TASK · {context.toUpperCase()}</span><strong>Work the scenario context and prepare the next operational step.</strong></div><span className="task-progress"><AnimatedNumber value={68} suffix="%" /></span></div>
      <div className="mode-tabs">{(["learn", "practice", "assessment"] as const).map((item) => <button key={item} className={mode === item ? "is-active" : ""} onClick={() => { setMode(item); setSessionComplete(false); }}>{item === "learn" ? "Learn" : item === "practice" ? "Practice" : "Assessment"}{item === "assessment" && <span>{sessionComplete ? "Report ready" : "No hints"}</span>}</button>)}</div>
      <div key={mode} className={`terminal-panel tab-enter ${focused ? "is-focused" : ""}`}>
        <div className="terminal-head"><div className="terminal-title"><span className="terminal-light" /> AMADEUS TRAINING ENVIRONMENT <small>/ EMULATOR 1.4</small></div><div className="terminal-session-readout"><span>SESSION / {sessionState}</span><span>COMMAND / {commandState}</span><span>LOG {String(commandHistory.length + 1).padStart(2, "0")}</span></div><div className="terminal-controls"><button className={`terminal-help ${referenceOpen ? "is-active" : ""}`} onClick={() => { const nextOpen = !referenceOpen; setReferenceOpen(nextOpen); if (nextOpen && mode !== "assessment") setHintCount((count) => count + 1); }}><BookOpen size={15} /> Reference</button><button className="terminal-help terminal-focus-toggle" onClick={() => { setFocused(!focused); toast.info(focused ? "Focused training mode closed." : "Focused training mode active."); }} aria-label={focused ? "Exit focused training mode" : "Enter focused training mode"}>{focused ? <Minimize2 size={15} /> : <Maximize2 size={15} />}<span>{focused ? "Exit focus" : "Focus"}</span></button></div></div>
        <div className="terminal-body"><div className="terminal-line terminal-muted">SESSION / {mode.toUpperCase()} MODE · {sessionState}</div><div className="terminal-line terminal-muted">SCENARIO / {context.toUpperCase()}</div><div className="terminal-line terminal-muted">SESSION SOURCE / LOCAL TRAINING SIMULATION</div><div className="terminal-line terminal-success">Ready. Illustrative local response layer loaded.</div><div className="terminal-line terminal-muted">RESPONSE MODEL / ILLUSTRATIVE · VERIFY WITH YOUR COURSE MATERIAL</div><div className="terminal-history" aria-live="polite">{commandHistory.map((entry, index) => <div className="terminal-entry" key={`${entry.command}-${index}`}><span className="terminal-history-label">CMD {String(index + 1).padStart(2, "0")}</span><span className="terminal-command">{entry.command}</span><span className={entry.ok ? "terminal-success" : "terminal-error"}>{entry.response}</span></div>)}</div><div className="terminal-line terminal-gap" /><div className="terminal-line terminal-active-line"><span className="terminal-prompt">&gt;</span> {command || "_"}<span className="terminal-caret" /></div></div>
        <form className="terminal-input" onSubmit={submitCommand}><span aria-hidden="true">&gt;</span><input ref={inputRef} value={command} onFocus={focusCommandInput} onKeyDown={handleCommandKeyDown} onChange={(event) => { setHistoryIndex(-1); setCommand(event.target.value); }} placeholder="Enter command..." aria-label="Command input. Use Arrow Up and Arrow Down to review local command history." autoComplete="off" inputMode="text" /><button type="submit" aria-label="Execute command"><span>Execute</span><ArrowUpRight size={13} /></button></form>
        <div className="terminal-footnote"><span>LOCAL TRAINING SIMULATION</span><span>·</span><span>STATE / {commandState}</span><span>·</span><span>{mode === "assessment" ? "HINTS SUPPRESSED" : "GUIDANCE AVAILABLE"}</span>{mode === "assessment" && <button className="terminal-finish" onClick={() => { const score = assessmentScore(commandHistory, hintCount); const record: ProgressRecord = { id: `EV-${String(Date.now()).slice(-3)}`, context, date: "Just now", overall: score.overall, accuracy: score.accuracy, sequencing: score.sequencing, hints: hintCount, commands: score.total, status: score.overall >= 70 ? "passed" : "review", state: score.overall >= 85 ? "completed" : score.overall >= 70 ? "review" : "retry", nextAction: score.overall >= 85 ? "Scenario" : score.overall >= 70 ? "Review" : "Retry" }; setSessionComplete(true); onAssessmentComplete?.(record); toast.success("Assessment saved to Progress Tracking."); }} disabled={!commandHistory.length}>{sessionComplete ? "SESSION COMPLETE" : "FINISH SESSION"}</button>}</div>
        {referenceOpen && <div className="reference-drawer"><div><span className="eyebrow">REFERENCE / CONTEXT SUPPORT</span><strong>{mode === "assessment" ? "Reference is intentionally limited in Assessment." : `Illustrative patterns for ${context}.`}</strong><p>{mode === "assessment" ? "Use your own recall, then review the result after submission." : "Try a command only when you understand why it is the next step. This prototype uses local illustrative responses, not a live carrier system."}</p></div><div className="reference-examples">{mode !== "assessment" && ["AN / availability context", "SS / sell a selected segment", "FQD / inspect fare options", "FXP / request a price quote"].map((example) => <button key={example} onClick={() => { setCommand(example.split(" /")[0]); setReferenceOpen(false); inputRef.current?.focus(); }}>{example}</button>)}</div><button className="icon-button" onClick={() => setReferenceOpen(false)} aria-label="Close reference"><X size={15} /></button></div>}
      </div>
      {mode === "assessment" && sessionComplete && <AssessmentReport score={liveAssessment} hints={hintCount} onRestart={() => { setCommandHistory([]); setHintCount(0); setSessionComplete(false); setCommand(""); }} />}
    </section>
    <aside className={`coach-panel panel-surface ${coachOpen ? "" : "is-collapsed"}`}><div className="coach-head"><div><span className="eyebrow">COACH SUPPORT</span><h2>Guidance without shortcuts.</h2></div><button className="icon-button" onClick={() => setCoachOpen(!coachOpen)} aria-label="Toggle coach panel">{coachOpen ? <X size={16} /> : <Sparkles size={16} />}</button></div>{coachOpen && <><div className="coach-callout"><span className="coach-badge"><BrainCircuit size={15} /></span><div><strong>{coachState.title}</strong><p>{coachState.body}</p></div></div><div className="coach-divider" /><div className="coach-block"><span className="eyebrow">{latestEntry ? `LATEST COMMAND / ${latestEntry.command}` : "SYSTEM RESPONSE / AWAITING COMMAND"}</span><code className={latestEntry?.ok ? "coach-code--success" : ""}>{latestEntry?.response ?? "FORMAT ERROR · CHECK ENTRY"}</code><p>{latestEntry ? coachState.body : "The availability entry needs the airline prefix before the flight number."}</p></div><div className="coach-next"><span>Next useful move</span><strong>{coachState.next}</strong><button className="text-action" onClick={() => toast.info(`Reference opened: ${coachState.next}.`)}>Open reference <ArrowUpRight size={14} /></button></div></>}</aside>
    </div>
    <div className="practice-footer"><span><Gauge size={15} /> Accuracy <strong className={submitted ? "metric-live" : ""}><AnimatedNumber value={accuracy} suffix="%" /></strong></span><span><Timer size={15} /> Session <strong>{sessionMinutes}m {String(sessionRemainder).padStart(2, "0")}s</strong></span><span><Layers3 size={15} /> Commands mastered <strong><AnimatedNumber value={128} /> / 210</strong></span></div>
  </div>;
}

function ScenarioCard({ scenario, selected, onSelect }: { scenario: typeof scenarios[number]; selected: boolean; onSelect: () => void }) {
  return <button className={`scenario-card scenario-card--${scenario.accent} ${selected ? "is-selected" : ""}`} onClick={onSelect}><span className="scenario-number">{scenario.id}</span><span className="scenario-card-copy"><strong>{scenario.title}</strong><small>{scenario.category} · {scenario.difficulty} · {scenario.duration}</small><span className="scenario-tags">{scenario.skills.map((skill) => <em key={skill}>{skill}</em>)}</span></span><span className="scenario-card-trailing">{scenario.progress > 0 ? <span className="scenario-percent"><AnimatedNumber value={scenario.progress} suffix="%" /></span> : <ChevronRight size={17} />}</span></button>;
}

function Scenarios({ setView, setPracticeContext }: { setView: (view: View) => void; setPracticeContext: (context: string) => void }) {
  const [selectedId, setSelectedId] = useState(scenarios[0].id);
  const [filter, setFilter] = useState("All scenarios");
  const [started, setStarted] = useState<string[]>([]);
  const selected = useMemo(() => scenarios.find((item) => item.id === selectedId) ?? scenarios[0], [selectedId]);
  const filtered = scenarios.filter((scenario) => {
    if (filter === "All scenarios") return true;
    if (filter === "Not started") return scenario.progress === 0 && !started.includes(scenario.id);
    if (filter === "In progress") return (scenario.progress > 0 && scenario.progress < 100) || started.includes(scenario.id);
    if (filter === "Completed") return scenario.progress === 100;
    return true;
  });
  const selectedStarted = started.includes(selected.id);
  const selectedStatus = selected.progress === 100 ? "Completed · result available" : selectedStarted || selected.progress > 0 ? "In progress · resume when ready" : "Not started · recommended next";
  return <div className="page page-scenarios"><div className="page-intro"><div><span className="eyebrow">YOUR ROUTE / 03 · MISSION FILES</span><h1>Scenarios</h1><p>Practice the situations that make operational skill visible.</p></div><button className="ghost-button" onClick={() => toast.info("Filters are available in the scenario mission list.")}><SlidersHorizontal size={16} /> Filters</button></div><div className="scenario-stats"><div><span>Scenarios completed</span><strong><AnimatedNumber value={23} /> <small>/ 40</small></strong></div><div><span>Average score</span><strong><AnimatedNumber value={82} suffix="%" /></strong><small className="stat-positive"><TrendingUp size={13} /> <AnimatedNumber value={6} prefix="+" suffix="%" /> from last 7 days</small></div><div><span>Best category</span><strong>Pricing &amp; Ticketing</strong><small><AnimatedNumber value={92} suffix="%" /> average</small></div><div><span>Needs improvement</span><strong>Exchanges &amp; Refunds</strong><small className="stat-warning"><TrendingDown size={13} /> Revisit recommended</small></div></div><div className="scenario-toolbar"><div className="filter-tabs">{["All scenarios", "Not started", "In progress", "Completed"].map((item) => <button key={item} className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div><label className="sort-select">Sort by <select onChange={() => toast.info("Mission order updated.")}><option>Recommended</option><option>Difficulty</option><option>Recent</option></select></label></div><div className="scenario-layout"><section className="scenario-list">{filtered.map((scenario) => <ScenarioCard key={scenario.id} scenario={scenario} selected={scenario.id === selectedId} onSelect={() => setSelectedId(scenario.id)} />)}</section><aside className="scenario-detail panel-surface"><div className="detail-visual"><div className="detail-route"><span /><span /><span /><span /></div><span className="detail-badge">{selected.category} / {selected.id}</span></div><div className="detail-body"><span className="eyebrow">MISSION FILE / {selected.id}</span><h2>{selected.title}</h2><span className={`detail-status detail-status--${selected.progress === 100 ? "complete" : selectedStarted || selected.progress > 0 ? "active" : "ready"}`}>{selectedStatus}</span><p>{selected.description}</p><div className="detail-facts"><span><Gauge size={15} /> Difficulty <strong>{selected.difficulty}</strong></span><span><Timer size={15} /> Estimated time <strong>{selected.duration}</strong></span><span><Target size={15} /> Scenario type <strong>{selected.category}</strong></span></div><div className="detail-skills"><span className="eyebrow">SKILLS TESTED</span><div>{selected.skills.map((skill) => <em key={skill}>{skill}</em>)}</div></div><div className="mission-next"><span className="eyebrow">NEXT OPERATIONAL MOVE</span><strong>{selected.progress === 100 ? "Review the evidence and isolate the winning pattern." : selected.progress > 0 || selectedStarted ? "Resume the active workflow from its last confirmed state." : "Start with the mission brief before opening the terminal."}</strong><small>Coach context will follow you into Practice.</small></div><div className="mission-coach"><BrainCircuit size={14} /><span><b>{selected.progress === 100 ? "Coach readout / verified" : selected.progress > 0 || selectedStarted ? "Coach readout / active" : "Coach readout / ready"}</b><small>{selected.progress === 100 ? "Use the completed result to isolate the repeatable pattern." : selected.progress > 0 || selectedStarted ? "Protect the last confirmed step before moving forward." : "Open the brief first; the next hint will follow the mission context."}</small></span></div><button className="primary-button" onClick={() => { if (selected.progress === 100) { toast.success("Result opened. Use the evidence view to inspect the skill state."); setView("growth"); } else { setStarted((current) => current.includes(selected.id) ? current : [...current, selected.id]); setPracticeContext(selected.title); toast.success(`${selected.id} added to your active practice route.`); setView("practice"); } }}>{selected.progress === 100 ? "Review result" : selectedStarted || selected.progress > 0 ? "Resume scenario" : "Start scenario"}<ChevronRight size={17} /></button></div></aside></div></div>;
}

function Growth({ records, setView, setPracticeContext }: { records: ProgressRecord[]; setView: (view: View) => void; setPracticeContext: (context: string) => void }) {
  const [growthTab, setGrowthTab] = useState<"record" | "history" | "reports">("record");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const latestEvidence = records[0];
  const detail = skillRows.find((skill) => skill.code === selectedSkill);
  return <div className="page page-growth"><div className="page-intro"><div><span className="eyebrow">YOUR ROUTE / 04 · EVIDENCE READOUT</span><h1>Growth Record</h1><p>Turn performance evidence into the next useful workflow.</p></div><button className="ghost-button" onClick={() => toast.success("A local evidence backup point has been created.")}><ShieldCheck size={16} /> Backup</button></div><div className="growth-tabs">{(["record", "history", "reports"] as const).map((tab) => <button key={tab} className={growthTab === tab ? "is-active" : ""} onClick={() => setGrowthTab(tab)}>{tab[0].toUpperCase() + tab.slice(1)}</button>)}</div><div className="growth-tab-context"><Terminal size={13} /> VIEW / {growthTab.toUpperCase()} · {growthTab === "record" ? "CURRENT SKILL STATE" : growthTab === "history" ? "RECENT EVIDENCE EVENTS" : "READINESS SUMMARY"}</div>{latestEvidence ? <StateNotice state={latestEvidence.state ?? "review"} title={`Latest evidence / ${latestEvidence.id}`} body={`${latestEvidence.context} · ${latestEvidence.overall}% overall · ${latestEvidence.nextAction ?? "Review"} is the next recorded move.`} /> : <StateNotice state="empty" title="No evidence recorded" body="Complete a practice assessment to establish a growth record." action={<button className="text-action" onClick={() => { setPracticeContext("Pricing & Ticketing"); setView("practice"); }}>Start practice <ArrowUpRight size={14} /></button>} />}<div className="learning-loop-strip"><span className="learning-loop-step is-complete"><Check size={13} /><b>01</b><strong>Read evidence</strong></span><ChevronRight size={14} /><span className="learning-loop-step is-active"><Terminal size={13} /><b>02</b><strong>Practice the gap</strong></span><ChevronRight size={14} /><span className="learning-loop-step"><Radar size={13} /><b>03</b><strong>Apply in scenario</strong></span></div>{growthTab === "history" && <section className="growth-special-panel panel-surface"><div className="special-panel-head"><div><span className="eyebrow">HISTORY / WHAT YOU HAVE DONE</span><h2>Learning events with a next implication.</h2></div><span className="readout-code">LOG 04 / 12</span></div><div className="history-list"><button onClick={() => toast.info("Scenario outcome selected: review the related evidence.")}><span className="history-date">YESTERDAY</span><span><strong>Availability &amp; Sell</strong><small>Scenario completed · 92% accuracy · AN / SS</small></span><ArrowUpRight size={15} /></button><button onClick={() => setGrowthTab("record")}><span className="history-date">2 DAYS AGO</span><span><strong>Pricing &amp; Ticketing</strong><small>Practice session · 3 hints used · FXP needs another pass</small></span><ArrowUpRight size={15} /></button><button onClick={() => toast.info("Milestone evidence: technical foundation is complete.")}><span className="history-date">3 DAYS AGO</span><span><strong>Technical foundation</strong><small>Milestone reached · route advanced to current vector 03</small></span><ArrowUpRight size={15} /></button></div></section>}{growthTab === "reports" && <section className="growth-special-panel panel-surface"><div className="special-panel-head"><div><span className="eyebrow">REPORTS / WHAT YOUR PERFORMANCE MEANS</span><h2>Readiness is a pattern, not a single score.</h2></div><span className="readout-code">READOUT <AnimatedNumber value={72} /></span></div><div className="report-grid"><div><span className="report-question">WHAT IS RELIABLE?</span><strong>Availability &amp; Sell</strong><small><AnimatedNumber value={92} suffix="%" /> · consistent across recent scenarios</small></div><div><span className="report-question">WHAT RECURS?</span><strong>Pricing handoff</strong><small>2 errors when moving from fare display to ticketing</small></div><div><span className="report-question">WHAT NEXT?</span><strong>Targeted pressure practice</strong><small>One fewer hint, then reassess FXP evidence</small></div></div><button className="primary-button" onClick={() => { setPracticeContext("Pricing / PNR"); setView("practice"); }}>Open recommended practice <ChevronRight size={17} /></button></section>}<div className={`growth-overview ${growthTab !== "record" ? "is-secondary-view" : ""}`}><section className="growth-score panel-surface"><div><span className="eyebrow">OVERALL PROGRESS / READOUT <AnimatedNumber value={72} /></span><h2>Keep the route moving.</h2><p>Your strongest evidence is consistency across workflows.</p></div><ProgressRing value={72} size={116} /><div className="growth-score-stats"><span><strong><AnimatedNumber value={64} /></strong><small>Lessons completed</small></span><span><strong><AnimatedNumber value={48} /></strong><small>Practice sessions</small></span><span><strong><AnimatedNumber value={82} suffix="%" /></strong><small>Average score</small></span></div></section><section className="next-practice panel-surface"><span className="eyebrow">RECOMMENDED NEXT / VECTOR FXP</span><div className="next-practice-icon"><Target size={18} /></div><h2>Practice pricing under pressure.</h2><p>Two recent errors appeared when moving from fare display to ticketing.</p><button className="text-action" onClick={() => { setPracticeContext("Pricing / PNR"); setView("practice"); }}>Open targeted practice <ArrowUpRight size={14} /></button></section></div><div className={`growth-grid ${growthTab !== "record" ? "is-secondary-view" : ""}`}><section className="evidence-panel panel-surface"><SectionHeader eyebrow="WHAT YOU'RE GOOD AT" title="Strengths" action="View evidence" />{skillRows.slice(0, 2).map((skill) => <SkillRow key={skill.code} skill={skill} selected={selectedSkill === skill.code} onSelect={() => setSelectedSkill(skill.code)} />)}<div className="evidence-note evidence-note--good"><TrendingDown size={15} /><span>Clean availability work is becoming a reliable professional habit.</span></div></section><section className="evidence-panel panel-surface"><SectionHeader eyebrow="WHERE TO FOCUS" title="Needs attention" action="See patterns" />{skillRows.slice(2, 5).map((skill) => <SkillRow key={skill.code} skill={skill} selected={selectedSkill === skill.code} onSelect={() => setSelectedSkill(skill.code)} />)}<div className="evidence-note evidence-note--warn"><Sparkles size={15} /><span>Recommended: repeat the workflow with one fewer hint.</span></div><button className="loop-action" onClick={() => { setPracticeContext("Pricing / PNR"); setView("practice"); }}>Practice the highlighted gap <ArrowUpRight size={14} /></button></section></div>{detail && <section className="skill-detail panel-surface"><div><span className="eyebrow">EVIDENCE TRACE / {detail.code}</span><h2>{detail.name}</h2><p>{detail.state} at <AnimatedNumber value={detail.value} />/100. The recent evidence suggests a targeted practice loop before reassessment.</p></div><button className="primary-button" onClick={() => { setPracticeContext(detail.name); setView("practice"); }}>Open {detail.name} practice <ChevronRight size={17} /></button></section>}<section className={`activity-section ${growthTab !== "record" ? "is-secondary-view" : ""}`}><SectionHeader eyebrow="RECENT LEARNING ACTIVITY" title="A record you can act on" action="View history" /><div className="activity-list"><button onClick={() => setSelectedSkill("AN")}><span className="activity-icon activity-icon--green"><Check size={15} /></span><p><strong>Availability &amp; Sell</strong><small>Scenario completed with 92% accuracy</small></p><time>Yesterday</time></button><button onClick={() => setSelectedSkill("FXP")}><span className="activity-icon activity-icon--blue"><Terminal size={15} /></span><p><strong>Pricing &amp; Ticketing</strong><small>Practice session · 3 hints used</small></p><time>2 days ago</time></button><button onClick={() => toast.info("Technical foundation evidence is already recorded.")}><span className="activity-icon activity-icon--amber"><Trophy size={15} /></span><p><strong>Milestone reached</strong><small>Technical foundation complete</small></p><time>3 days ago</time></button></div></section></div>;
}

function SkillRow({ skill, selected, onSelect }: { skill: typeof skillRows[number]; selected?: boolean; onSelect?: () => void }) {
  return <button className={`skill-row skill-row-button ${selected ? "is-selected" : ""}`} onClick={onSelect}><div className={`skill-orb skill-orb--${skill.tone}`}><AnimatedNumber value={skill.value} /></div><div className="skill-copy"><strong>{skill.code} <span>{skill.name}</span></strong><small>{skill.state}</small><span className="skill-bar"><AnimatedBar value={skill.value} /></span></div><div className={`skill-trend skill-trend--${skill.trend}`}>{skill.trend === "down" ? <TrendingDown size={14} /> : <TrendingUp size={14} />}<span><AnimatedNumber value={skill.value} />/100</span></div><span className="skill-hover-preview"><b>Latest signal</b><small>{skill.trend === "up" ? "Improving after recent practice" : "Stable across recent scenarios"}</small><em>{skill.value < 60 ? "Coach: repeat with one fewer hint" : "Coach: apply in a scenario"}</em></span></button>;
}

export default function Home() {
  const pathToView = (path: string): View => path.includes("practice") ? "practice" : path.includes("scenarios") ? "scenarios" : path.includes("growth") ? "growth" : path.includes("tracking") ? "tracking" : "progression";
  const [view, setView] = useState<View>(() => pathToView(window.location.pathname));
  const [menuOpen, setMenuOpen] = useState(false);
  const [practiceContext, setPracticeContext] = useState("Pricing & Ticketing");
  const [progressRecords, setProgressRecords] = useState<ProgressRecord[]>(() => {
    try { const saved = window.localStorage.getItem("aerobridge-progress-records"); return saved ? JSON.parse(saved) : seedProgress; } catch { return seedProgress; }
  });
  const saveAssessment = (record: ProgressRecord) => { setProgressRecords((current) => { const next = [record, ...current.filter((item) => item.id !== record.id)].slice(0, 8); window.localStorage.setItem("aerobridge-progress-records", JSON.stringify(next)); return next; }); };
  const navigate = (next: View) => { setView(next); window.history.pushState({}, "", next === "progression" ? "/" : `/${next}`); };
  useEffect(() => { const onPopState = () => setView(pathToView(window.location.pathname)); window.addEventListener("popstate", onPopState); return () => window.removeEventListener("popstate", onPopState); }, []);
  const content = view === "progression" ? <Progression setView={navigate} /> : view === "practice" ? <Practice context={practiceContext} onAssessmentComplete={saveAssessment} /> : view === "scenarios" ? <Scenarios setView={navigate} setPracticeContext={setPracticeContext} /> : view === "growth" ? <Growth records={progressRecords} setView={navigate} setPracticeContext={setPracticeContext} /> : <ProgressTracking records={progressRecords} setView={navigate} setPracticeContext={setPracticeContext} />;
  return <div className="app-frame"><SideNav view={view} setView={navigate} /><div className="app-main"><Topbar view={view} onMenu={() => setMenuOpen(!menuOpen)} />{menuOpen && <div className="mobile-drawer"><div className="mobile-drawer-head"><Logo /><button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X size={18} /></button></div>{navItems.map((item) => { const Icon = item.icon; return <button key={item.id} className={view === item.id ? "is-active" : ""} onClick={() => { navigate(item.id); setMenuOpen(false); }}><Icon size={18} /><span>{item.label}</span></button>; })}</div>}{content}<BottomNav view={view} setView={navigate} /></div></div>;
}
