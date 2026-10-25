import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Compass,
  Download,
  Flame,
  Flag,
  Globe2,
  Grid2X2,
  Home,
  Keyboard,
  Lightbulb,
  Menu,
  RotateCcw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  Upload,
  X,
  Zap,
} from "lucide-react";
import { countries, type Country } from "./data/countries";
import {
  createProgress,
  loadProgress,
  saveProgress,
  exportProgress,
  importProgress,
  recordAnswer,
  buildSession,
  getChoices,
  getCountryStatus,
  getStats,
  type Progress,
} from "./lib/learning";
import WorldIllustration from "./components/WorldIllustration";

type Page = "learn" | "library" | "progress";
type Mode = "learn" | "review" | "challenge";
type Session = {
  mode: Mode;
  queue: Country[];
  index: number;
  study: Country[];
  studyIndex: number;
  phase: "study" | "quiz" | "done";
  choices: Country[];
  selected: string | null;
  correct: number;
  results: { code: string; correct: boolean }[];
  timed: boolean;
  remaining: number;
  xpStart: number;
};
const REGIONS = [
  "Europe",
  "Asia",
  "Africa",
  "North America",
  "South America",
  "Oceania",
] as const;
const REGION_META: Record<
  string,
  { emoji: string; color: string; description: string }
> = {
  Europe: {
    emoji: "🏰",
    color: "sage",
    description: "From familiar tricolors to Nordic crosses.",
  },
  Asia: {
    emoji: "⛩️",
    color: "peach",
    description: "Discover a continent of contrasts.",
  },
  Africa: {
    emoji: "🌍",
    color: "sand",
    description: "Bold colors. Extraordinary stories.",
  },
  "North America": {
    emoji: "🏔️",
    color: "blue",
    description: "Stars, stripes, and island sunshine.",
  },
  "South America": {
    emoji: "🌴",
    color: "pink",
    description: "A colorful journey south.",
  },
  Oceania: {
    emoji: "🏝️",
    color: "lilac",
    description: "Across the big blue Pacific.",
  },
};
const ESSENTIAL_CODES = [
  "jp",
  "fr",
  "br",
  "ca",
  "it",
  "gb",
  "us",
  "de",
  "in",
  "au",
  "es",
  "kr",
  "cn",
  "za",
  "mx",
  "se",
  "ch",
  "ar",
  "gr",
  "nz",
];
const STATUS_LABELS = {
  new: "Undiscovered",
  learning: "Learning",
  review: "Ready to review",
  mastered: "Mastered",
};
function FlagImage({
  code,
  name = "",
  className = "",
}: {
  code: string;
  name?: string;
  className?: string;
}) {
  return (
    <img
      className={`flag-image ${className}`}
      src={`/flags/${code}.svg`}
      alt={name ? `Flag of ${name}` : ""}
      draggable={false}
    />
  );
}
function Button({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`button ${className}`} {...props}>
      {children}
    </button>
  );
}
function Modal({
  children,
  title,
  onClose,
  wide = false,
}: {
  children: ReactNode;
  title: string;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "Tab") {
        const items = Array.from(
          ref.current?.querySelectorAll<HTMLElement>(
            'button:not(:disabled), input:not([type="hidden"]), select, a[href], [tabindex="0"]',
          ) ?? [],
        ).filter((el) => !el.hidden && el.getClientRects().length > 0);
        if (!items?.length) return;
        const first = items[0],
          last = items[items.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = old;
      window.removeEventListener("keydown", key);
      before?.focus();
    };
  }, []);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`modal ${wide ? "modal-wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={ref}
      >
        <div className="modal-header">
          <h2>{title}</h2>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
function App() {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [page, setPage] = useState<Page>("learn");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<
    "settings" | "save" | "challenge" | "about" | "reset" | "exit" | null
  >(null);
  const [detail, setDetail] = useState<Country | null>(null);
  const [region, setRegion] = useState("All regions");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [challengeRegion, setChallengeRegion] = useState("All regions");
  const [session, setSession] = useState<Session | null>(null);
  const [toast, setToast] = useState("");
  const [storageOk, setStorageOk] = useState(true);
  const [importError, setImportError] = useState("");
  const [importCandidate, setImportCandidate] = useState<Progress | null>(null);
  const importInput = useRef<HTMLInputElement>(null);
  const stats = getStats(progress);
  useEffect(() => {
    setStorageOk(saveProgress(progress));
  }, [progress]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(t);
  }, [toast]);
  const navigate = (to: Page) => {
    setPage(to);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const playSound = (correct: boolean) => {
    if (!progress.settings.sound) return;
    try {
      const ctx = new AudioContext();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = correct ? 660 : 220;
      g.gain.setValueAtTime(0.07, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      o.start();
      o.stop(ctx.currentTime + 0.2);
      o.onended = () => void ctx.close();
    } catch {
      /* Sound is optional. */
    }
  };
  const startSession = (
    mode: Mode = "learn",
    continent?: string,
    timed = false,
    custom?: Country[],
  ) => {
    let queue =
      custom ??
      buildSession(progress, {
        mode,
        continent: continent === "All regions" ? undefined : continent,
        size: mode === "challenge" ? 20 : 10,
      });
    if (mode === "learn" && !continent && !custom && stats.seen < 20) {
      const essentials = ESSENTIAL_CODES.map((c) =>
        countries.find((x) => x.code === c)!,
      ).filter((c) => !progress.cards[c.code]);
      const due = queue.filter((c) => !!progress.cards[c.code]);
      queue = [
        ...due,
        ...essentials,
        ...queue.filter((c) => !ESSENTIAL_CODES.includes(c.code)),
      ]
        .filter((c, i, a) => a.findIndex((x) => x.code === c.code) === i)
        .slice(0, 10);
    }
    if (!queue.length) {
      setToast("You’re all caught up! Try a new lesson or a world challenge.");
      return;
    }
    const study =
      mode === "learn" ? queue.filter((c) => !progress.cards[c.code]) : [];
    setSession({
      mode,
      queue,
      index: 0,
      study,
      studyIndex: 0,
      phase: study.length ? "study" : "quiz",
      choices: getChoices(queue[0]),
      selected: null,
      correct: 0,
      results: [],
      timed,
      remaining: 60,
      xpStart: progress.xp,
    });
    setModal(null);
    setDetail(null);
    window.scrollTo(0, 0);
  };
  const answer = (code: string) => {
    if (!session || session.selected || session.phase !== "quiz") return;
    const c = session.queue[session.index];
    const correct = code === c.code;
    setProgress((p) => recordAnswer(p, c.code, correct));
    playSound(correct);
    setSession(
      (s) =>
        s && {
          ...s,
          selected: code,
          correct: s.correct + (correct ? 1 : 0),
          results: [...s.results, { code: c.code, correct }],
        },
    );
  };
  const continueSession = () => {
    setSession((s) => {
      if (!s) return s;
      if (s.phase === "study") {
        if (s.studyIndex + 1 < s.study.length)
          return { ...s, studyIndex: s.studyIndex + 1 };
        return {
          ...s,
          phase: "quiz",
          queue: [...s.queue].sort(() => Math.random() - 0.5),
          choices: [],
        };
      }
      if (!s.selected) return s;
      if (s.index + 1 >= s.queue.length) return { ...s, phase: "done" };
      return {
        ...s,
        index: s.index + 1,
        selected: null,
        choices: getChoices(s.queue[s.index + 1]),
      };
    });
  };
  // Choices are created once when study ends; they remain stable while answering.
  useEffect(() => {
    if (session?.phase === "quiz" && !session.choices.length)
      setSession((s) => s && { ...s, choices: getChoices(s.queue[s.index]) });
  }, [session]);
  useEffect(() => {
    if (!session?.timed || session.phase !== "quiz") return;
    const t = setInterval(
      () =>
        setSession((s) =>
          s && s.phase === "quiz"
            ? s.remaining <= 1
              ? { ...s, remaining: 0, phase: "done" }
              : { ...s, remaining: s.remaining - 1 }
            : s,
        ),
      1000,
    );
    return () => clearInterval(t);
  }, [session?.timed, session?.phase]);
  useEffect(() => {
    if (!session || modal) return;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('input, select, textarea, a, [role="switch"]') ||
        e.repeat
      )
        return;
      if (
        e.key === "Enter" &&
        target.closest("button") &&
        !target.closest(".answer-option:disabled")
      )
        return;
      if (
        ["1", "2", "3", "4"].includes(e.key) &&
        session.phase === "quiz" &&
        !session.selected
      ) {
        const c = session.choices[Number(e.key) - 1];
        if (c) answer(c.code);
      }
      if (
        e.key === "Enter" &&
        (session.phase === "study" || session.selected)
      ) {
        e.preventDefault();
        continueSession();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });
  const downloadSave = () => {
    const blob = new Blob([exportProgress(progress)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `flagg-save-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setToast("Your progress is packed and ready to go.");
  };
  const readSave = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportCandidate(null);
    setImportError("");
    try {
      if (file.size > 5_000_000)
        throw new Error("Please choose a Flagg save file smaller than 5 MB.");
      const candidate = importProgress(await file.text());
      setImportCandidate(candidate);
      setImportError("");
    } catch (err) {
      setImportError(
        err instanceof Error
          ? err.message
          : "This save file could not be read.",
      );
    }
    e.target.value = "";
  };
  const dailyPercent = Math.min(
    100,
    (stats.todayAnswers / stats.dailyGoal) * 100,
  );
  const essentialsDone = ESSENTIAL_CODES.filter(
    (c) => progress.cards[c],
  ).length;
  const renderOverview = () => (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">A LITTLE CURIOSITY GOES A LONG WAY</div>
          <h1>
            Your world is getting bigger<span className="heading-dot">.</span>
          </h1>
          <p>One flag, one small win, one step closer to the whole world.</p>
        </div>
        <div className="date-label">
          <span className="live-dot" /> YOUR NEXT CHAPTER AWAITS
        </div>
      </div>
      <section className="hero-card">
        <div className="hero-copy">
          <div className="hero-label">
            <span /> BIG WORLD. SMALL STEPS.
          </div>
          <h2>
            A little practice.
            <br />A whole world.
          </h2>
          <p>
            Learn the world’s flags in a way that sticks.
            <br className="desktop-br" /> A few minutes today. A little more
            world tomorrow.
          </p>
          <Button className="button-dark" onClick={() => startSession()}>
            {stats.seen ? "Continue learning" : "Start learning"}
            <ArrowRight size={17} />
          </Button>
          <div className="hero-caption">
            <span className="mini-flag">
              <Flag size={12} />
            </span>
            10 flags per session <span>·</span> About 3 minutes
          </div>
        </div>
        <div className="hero-illustration">
          <WorldIllustration />
          <span className="map-coordinate">
            48° 51′ N &nbsp; 2° 21′ E &nbsp; / &nbsp; THE WORLD IS YOURS
          </span>
        </div>
        <div className="hero-edition">THE FLAGG FIELD NOTES — VOL. 01</div>
      </section>
      <div className="stats-grid">
        <Stat
          icon={<Flag size={18} />}
          label="Flags discovered"
          value={
            <>
              {stats.seen}
              <span> / 195</span>
            </>
          }
          foot={
            <>
              <span className="micro-track">
                <i style={{ width: `${(stats.seen / 195) * 100}%` }} />
              </span>
              <span>{Math.round((stats.seen / 195) * 100)}% of the world</span>
            </>
          }
        />
        <Stat
          icon={<RotateCcw size={18} />}
          label="Ready to review"
          value={
            <>
              {stats.due}
              <span> flags</span>
            </>
          }
          foot={
            <>
              <span className={`status-dot ${stats.due ? "orange" : ""}`} />
              {stats.due
                ? "A little refresh goes a long way"
                : "A fresh start. A world to discover."}
            </>
          }
        />
        <Stat
          icon={<Target size={19} />}
          label="Recall accuracy"
          value={
            <>
              {stats.totalAnswers ? `${Math.round(stats.accuracy)}%` : "—"}
              <span>{stats.totalAnswers ? "" : " yet"}</span>
            </>
          }
          foot={
            stats.totalAnswers
              ? `${stats.correctAnswers} correct answers. Keep it up.`
              : "Your first small win is waiting"
          }
        />
        <Stat
          icon={<Flame size={19} />}
          label="Current streak"
          value={
            <>
              {stats.streak}
              <span>{stats.streak === 1 ? " day" : " days"}</span>
            </>
          }
          foot={
            <>
              <span className="tiny-spark">✧</span>
              {stats.streak
                ? "Look at you showing up!"
                : "Every journey starts with day one"}
            </>
          }
        />
      </div>
      <div className="dashboard-lower">
        <section className="journey-section">
          <div className="section-heading">
            <h2>
              Your learning journey{" "}
              <span className="small-pill">MADE FOR YOU</span>
            </h2>
            <button
              className="text-button"
              onClick={() => navigate("progress")}
            >
              View progress <ArrowUpRight size={15} />
            </button>
          </div>
          <button className="essentials-card" onClick={() => startSession()}>
            <div className="lesson-symbol">
              <Compass size={27} strokeWidth={1.5} />
            </div>
            <div className="essentials-copy">
              <div className="eyebrow">
                CHAPTER 01 <span>·</span> THE FOUNDATIONS
              </div>
              <h3>
                {essentialsDone === 20
                  ? "Keep your world growing"
                  : "Start with the essentials"}
              </h3>
              <p>
                {essentialsDone === 20
                  ? "The foundations are yours. Find your next discovery."
                  : "Meet the flags you’ll see everywhere."}
              </p>
              <div className="lesson-progress">
                <span>
                  <i style={{ width: `${(essentialsDone / 20) * 100}%` }} />
                </span>
                <small>{essentialsDone} / 20 discovered</small>
              </div>
            </div>
            <div className="flag-fan">
              <FlagImage code="fr" />
              <FlagImage code="jp" />
              <FlagImage code="br" />
            </div>
            <span className="round-arrow">
              <ArrowRight size={18} />
            </span>
          </button>
          <div className="section-subheading">
            <h3>Or, pick a part of the world</h3>
            <span>6 regions. Endless little discoveries.</span>
          </div>
          <div className="region-grid">
            {REGIONS.map((r) => {
              const count = countries.filter((c) => c.continent === r).length;
              const known = countries.filter(
                (c) => c.continent === r && progress.cards[c.code],
              ).length;
              return (
                <button
                  key={r}
                  className={`region-card ${REGION_META[r].color}`}
                  onClick={() => startSession("learn", r)}
                >
                  <div className="region-card-top">
                    <span className="region-emoji">{REGION_META[r].emoji}</span>
                    <ArrowUpRight size={15} />
                  </div>
                  <h4>{r}</h4>
                  <div className="region-card-bottom">
                    <span>{count} flags</span>
                    <span>
                      {known
                        ? `${Math.round((known / count) * 100)}%`
                        : "Explore"}{" "}
                      <ChevronRight size={12} />
                    </span>
                  </div>
                  <div className="region-track">
                    <i style={{ width: `${(known / count) * 100}%` }} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
        <aside className="daily-card">
          <div className="section-heading">
            <h2>A little, every day</h2>
            <span className="goal-icon">
              <Target size={18} />
            </span>
          </div>
          <div className="goal-ring">
            <svg viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="59" />
              <circle
                className="ring-value"
                cx="70"
                cy="70"
                r="59"
                strokeDasharray={`${dailyPercent * 3.707} 370.7`}
              />
            </svg>
            <div>
              <strong>
                {Math.min(stats.todayAnswers, stats.dailyGoal)}
                <span> / {stats.dailyGoal}</span>
              </strong>
              <small>flags practiced today</small>
            </div>
            <span className="ring-spark">✧</span>
          </div>
          <div className="week-row">
            {Array.from({ length: 7 }, (_, i) => {
              const d = new Date();
              const day = (d.getDay() + 6) % 7;
              d.setDate(d.getDate() - day + i);
              const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
              const done = !!progress.days[key]?.answers;
              return (
                <div
                  className={`week-day ${i === day ? "today" : ""} ${done ? "complete" : ""}`}
                  key={i}
                >
                  <span>{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                  <b>
                    {done ? <Check size={12} /> : i === day ? <span /> : <i />}
                  </b>
                </div>
              );
            })}
          </div>
          <div className="daily-divider" />
          <div className="daily-note">
            <span>
              <Lightbulb size={17} />
            </span>
            <div>
              <h4>Consistency beats cramming.</h4>
              <p>
                Small sessions build lasting memories. <br />
                Your future self will thank you.
              </p>
            </div>
          </div>
          <button
            className="text-button goal-edit"
            onClick={() => setModal("settings")}
          >
            Make it your daily habit <Settings2 size={14} />
          </button>
        </aside>
      </div>
      <section className="explore-banner">
        <div className="explore-icon">
          <Globe2 size={23} strokeWidth={1.4} />
        </div>
        <div>
          <h3>195 flags. So many stories.</h3>
          <p>Get curious. Explore the world, one country at a time.</p>
        </div>
        <button className="text-button" onClick={() => navigate("library")}>
          Explore the flag library <ArrowRight size={16} />
        </button>
      </section>
      <PageFooter />
    </>
  );
  const filteredCountries = countries
    .filter(
      (c) =>
        (region === "All regions" || c.continent === region) &&
        (filter === "all" ||
          (filter === "new"
            ? !progress.cards[c.code]
            : getCountryStatus(progress, c.code) === filter)) &&
        `${c.name} ${c.capital}`.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  const renderLibrary = () => (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">THE WORLD, AT YOUR FINGERTIPS</div>
          <h1>
            A flag for every story<span className="heading-dot">.</span>
          </h1>
          <p>Meet all 195 flags. Follow your curiosity.</p>
        </div>
        <span className="library-count">
          <Globe2 size={17} /> 195 countries
        </span>
      </div>
      <div className="library-toolbar">
        <label className="search-field">
          <Search size={18} />
          <input
            placeholder="Find a country or capital…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search countries"
          />
          {search && (
            <button
              className="icon-button"
              aria-label="Clear search"
              onClick={() => setSearch("")}
            >
              <X size={16} />
            </button>
          )}
        </label>
        <label className="select-field">
          <Globe2 size={17} />
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            aria-label="Filter by region"
          >
            <option>All regions</option>
            {REGIONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <ChevronDown size={14} />
        </label>
      </div>
      <div className="filter-row">
        <div className="filter-tabs">
          {[
            ["all", "All flags"],
            ["new", "Undiscovered"],
            ["learning", "Learning"],
            ["review", "Due for review"],
            ["mastered", "Mastered"],
          ].map(([v, l]) => (
            <button
              key={v}
              aria-pressed={filter === v}
              className={filter === v ? "active" : ""}
              onClick={() => setFilter(v)}
            >
              {l}
            </button>
          ))}
        </div>
        <span>{filteredCountries.length} flags to explore</span>
      </div>
      {filteredCountries.length ? (
        <div className="flag-library-grid">
          {filteredCountries.map((c) => (
            <button
              className="country-card"
              key={c.code}
              onClick={() => setDetail(c)}
            >
              <div className="country-flag">
                <FlagImage code={c.code} name={c.name} />
                {getCountryStatus(progress, c.code) === "mastered" && (
                  <span className="mastered-badge">
                    <Check size={13} />
                  </span>
                )}
              </div>
              <div className="country-card-info">
                <div>
                  <h3>{c.name}</h3>
                  <p>{c.continent}</p>
                </div>
                <ArrowUpRight size={15} />
              </div>
              <span
                className={`country-status ${getCountryStatus(progress, c.code)}`}
              >
                {STATUS_LABELS[getCountryStatus(progress, c.code)]}
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={32} />
          <h3>No flags found</h3>
          <p>Try another country, capital, or region.</p>
          <Button
            onClick={() => {
              setSearch("");
              setRegion("All regions");
              setFilter("all");
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
      <div className="scope-note">
        <CircleHelp size={14} /> Our atlas covers the 193 UN member states, plus
        Palestine and Vatican City. Transcontinental countries are grouped in
        one region.
      </div>
      <PageFooter />
    </>
  );
  const renderProgress = () => (
    <>
      <div className="page-heading">
        <div>
          <div className="eyebrow">EVERY SMALL WIN COUNTS</div>
          <h1>
            Look how far you’ve come<span className="heading-dot">.</span>
          </h1>
          <p>Your journey, at your pace. There’s a whole world ahead.</p>
        </div>
        <Button className="button-outline" onClick={() => setModal("save")}>
          <Download size={16} /> Save your journey
        </Button>
      </div>
      <div className="progress-hero">
        <div className="progress-globe">
          <Globe2 size={62} strokeWidth={1} />
        </div>
        <div>
          <div className="eyebrow">YOUR WORLD EXPLORER PASSPORT</div>
          <h2>
            {stats.seen
              ? stats.mastered >= 195
                ? "World citizen"
                : stats.seen >= 50
                  ? "Seasoned explorer"
                  : "Curious explorer"
              : "A new adventure begins"}
          </h2>
          <p>
            {stats.seen} flags discovered · {stats.mastered} flags mastered ·{" "}
            {stats.xp} XP earned
          </p>
        </div>
        <div className="passport-level">
          <Sparkles size={17} /> LEVEL {stats.level}
        </div>
      </div>
      <div className="progress-columns">
        <section className="panel">
          <div className="section-heading">
            <h2>Your world, by region</h2>
            <Globe2 size={18} />
          </div>
          {REGIONS.map((r) => {
            const cc = countries.filter((c) => c.continent === r);
            const seen = cc.filter((c) => !!progress.cards[c.code]).length;
            const mastered = cc.filter(
              (c) => getCountryStatus(progress, c.code) === "mastered",
            ).length;
            return (
              <div className="region-progress-row" key={r}>
                <span
                  className={`region-progress-icon ${REGION_META[r].color}`}
                >
                  {REGION_META[r].emoji}
                </span>
                <div>
                  <div className="region-progress-title">
                    <h3>{r}</h3>
                    <span>
                      {seen} / {cc.length}
                    </span>
                  </div>
                  <div className="wide-track">
                    <i style={{ width: `${(seen / cc.length) * 100}%` }} />
                    <b style={{ width: `${(mastered / cc.length) * 100}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
          <div className="chart-legend">
            <span>
              <i /> Discovered
            </span>
            <span>
              <i /> Mastered
            </span>
          </div>
        </section>
        <section className="panel milestones">
          <div className="section-heading">
            <h2>Little wins. Big milestones.</h2>
            <Trophy size={18} />
          </div>
          {[
            {
              name: "First steps",
              note: "Discover your first flag",
              target: 1,
            },
            {
              name: "Finding your bearings",
              note: "Discover 20 flags",
              target: 20,
            },
            {
              name: "Beyond the horizon",
              note: "Discover 50 flags",
              target: 50,
            },
            {
              name: "Around the world",
              note: "Discover 100 flags",
              target: 100,
            },
            {
              name: "A world of possibility",
              note: "Discover all 195 flags",
              target: 195,
            },
          ].map((m, i) => (
            <div
              className={`milestone ${stats.seen >= m.target ? "achieved" : ""}`}
              key={m.target}
            >
              <span className="milestone-medal">
                {stats.seen >= m.target ? (
                  <Check size={20} />
                ) : i === 0 ? (
                  <Flag size={20} />
                ) : i === 4 ? (
                  <Globe2 size={20} />
                ) : (
                  <Compass size={20} />
                )}
              </span>
              <div>
                <h3>{m.name}</h3>
                <p>{m.note}</p>
              </div>
              <span>
                {stats.seen >= m.target
                  ? "UNLOCKED"
                  : `${Math.min(stats.seen, m.target)}/${m.target}`}
              </span>
            </div>
          ))}
          <div className="mastery-goal">
            <span className="milestone-medal">
              <Trophy size={20} />
            </span>
            <div>
              <h3>The long game: world citizen</h3>
              <p>Master every flag. Make the whole world stick.</p>
              <div className="wide-track">
                <b style={{ width: `${(stats.mastered / 195) * 100}%` }} />
              </div>
            </div>
            <strong>
              {stats.mastered}
              <span> / 195</span>
            </strong>
          </div>
        </section>
      </div>
      <section className="panel activity-panel">
        <div className="section-heading">
          <div>
            <h2>Showing up is the first step</h2>
            <p>Your practice over the last 7 days</p>
          </div>
          <span className="streak-chip">
            <Flame size={16} />
            {stats.streak}-day streak
          </span>
        </div>
        <div className="activity-chart">
          {Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            const n = progress.days[key]?.answers ?? 0;
            const max = Math.max(
              stats.dailyGoal,
              ...Object.values(progress.days).map((x) => x.answers),
            );
            return (
              <div className="activity-column" key={key}>
                <strong>{n}</strong>
                <div>
                  <i style={{ height: `${Math.max(3, (n / max) * 100)}%` }} />
                </div>
                <span>
                  {i === 6
                    ? "Today"
                    : d.toLocaleDateString("en", { weekday: "short" })}
                </span>
              </div>
            );
          })}
        </div>
      </section>
      <div className="science-note">
        <Lightbulb size={22} />
        <div>
          <h3>Discovered is the beginning. Mastered is when it sticks.</h3>
          <p>
            A flag becomes mastered after three consecutive correct answers
            across spaced reviews. New flags return sooner; familiar ones get
            more breathing room.
          </p>
        </div>
      </div>
      <PageFooter />
    </>
  );
  const renderSession = () => {
    if (!session) return null;
    const country =
      session.phase === "study"
        ? session.study[session.studyIndex]
        : session.queue[session.index];
    const correct = session.selected === country?.code;
    const reviewed = session.results.length;
    const mistakes = session.results
      .filter((r) => !r.correct)
      .map((r) => countries.find((c) => c.code === r.code)!);
    return (
      <div className="session-screen">
        <header className="session-header">
          <button
            className="brand"
            onClick={() => setModal("exit")}
            aria-label="Back to dashboard"
          >
            <span className="brand-icon">
              <Flag size={21} />
            </span>
            flagg<span className="brand-period">.</span>
          </button>
          <span className="session-type">
            <span className="live-dot" />
            {session.phase === "study"
              ? "GET TO KNOW YOUR FLAGS"
              : session.mode === "challenge"
                ? "THE WORLD CHALLENGE"
                : session.mode === "review"
                  ? "A LITTLE REFRESH"
                  : "YOUR DAILY DISCOVERY"}
          </span>
          <button className="text-button" onClick={() => setModal("exit")}>
            End session <X size={17} />
          </button>
        </header>
        {session.phase === "done" ? (
          <main className="session-complete">
            <div className="celebration-icon">
              <Trophy size={40} strokeWidth={1.5} />
              <span>✧</span>
            </div>
            <div className="eyebrow">ANOTHER LITTLE WIN FOR YOU</div>
            <h1>
              {reviewed && session.correct === reviewed
                ? "Look at you, world explorer."
                : reviewed
                  ? "That’s how learning happens."
                  : "There’s always a next adventure."}
            </h1>
            <p>
              {reviewed
                ? session.correct === reviewed
                  ? "A perfect round. The world just got a little more familiar."
                  : "Every attempt makes a connection. Keep showing up — it’s working."
                : "The clock ran out. Take your time with a guided lesson."}
            </p>
            <div className="results-stats">
              <div>
                <strong>
                  {session.correct}
                  <span> / {reviewed}</span>
                </strong>
                <small>correct answers</small>
              </div>
              <div>
                <strong>+{progress.xp - session.xpStart}</strong>
                <small>XP earned</small>
              </div>
              <div>
                <strong>
                  {reviewed
                    ? Math.round((session.correct / reviewed) * 100)
                    : 0}
                  %
                </strong>
                <small>session accuracy</small>
              </div>
            </div>
            {mistakes.length > 0 && (
              <div className="mistake-recap">
                <h3>A few flags to get to know better</h3>
                <div>
                  {mistakes.map((c) => (
                    <span key={c.code}>
                      <FlagImage code={c.code} />
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="complete-actions">
              <Button className="button-dark" onClick={() => setSession(null)}>
                Back to my journey <ArrowRight size={17} />
              </Button>
              {mistakes.length > 0 ? (
                <Button
                  className="button-outline"
                  onClick={() =>
                    startSession("review", undefined, false, mistakes)
                  }
                >
                  <RotateCcw size={16} />
                  Practice these again
                </Button>
              ) : (
                <Button
                  className="button-outline"
                  onClick={() => startSession()}
                >
                  Another little adventure
                </Button>
              )}
            </div>
            <p className="session-save-note">
              <ShieldCheck size={14} />
              {storageOk
                ? "Your progress is saved on this device."
                : "Browser saving is unavailable. Export a save file from the dashboard."}
            </p>
          </main>
        ) : (
          <main className="quiz-main">
            <div className="session-progress-top">
              <span>
                {session.phase === "study"
                  ? "Take a good look. Make a connection."
                  : "A little recall makes it stick."}
              </span>
              <span>
                {session.phase === "study"
                  ? `${session.studyIndex + 1} of ${session.study.length} to discover`
                  : `${session.index + 1} of ${session.queue.length} flags`}
                {session.timed && (
                  <b className={session.remaining < 15 ? "timer low" : "timer"}>
                    <Timer size={15} />
                    {session.remaining}s
                  </b>
                )}
              </span>
            </div>
            <div className="session-track">
              <i
                style={{
                  width: `${(session.phase === "study" ? session.studyIndex / session.study.length : session.index / session.queue.length) * 100}%`,
                }}
              />
            </div>
            <div className="quiz-prompt">
              <span className="small-pill">
                {session.phase === "study"
                  ? "MEET A NEW FLAG"
                  : "TRUST YOUR MEMORY"}
              </span>
              <h1>
                {session.phase === "study"
                  ? `Say hello to ${country.name}.`
                  : "Which country flies this flag?"}
              </h1>
              <p>
                {session.phase === "study"
                  ? `${country.continent} · Capital: ${country.capital}`
                  : "Look closely. You’ve got this."}
              </p>
            </div>
            <div
              className={`quiz-flag-card ${session.phase === "study" ? "study-flag" : ""}`}
              role="img"
              aria-label={
                session.phase === "study"
                  ? `Flag of ${country.name}`
                  : "Country flag to identify"
              }
            >
              <FlagImage code={country.code} />
              <span className="flag-card-corner">
                {session.phase === "study" ? "FIELD NOTES" : "FLAGG / RECALL"}
              </span>
            </div>
            {session.phase === "study" ? (
              <>
                <div className="memory-note">
                  <Lightbulb size={21} />
                  <div>
                    <h3>A little way to remember</h3>
                    <p>{country.flagHint}</p>
                  </div>
                </div>
                <div className="study-action">
                  <Button className="button-dark" onClick={continueSession}>
                    {session.studyIndex + 1 === session.study.length
                      ? "Let’s put it to practice"
                      : "Got it. Meet the next flag"}
                    <ArrowRight size={17} />
                  </Button>
                  <span>
                    {session.studyIndex + 1 === session.study.length
                      ? "Time for a little recall. No pressure."
                      : "You’ll practice these flags after your introduction."}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="answer-grid">
                  {session.choices.map((c, i) => (
                    <button
                      key={c.code}
                      onClick={() => answer(c.code)}
                      disabled={!!session.selected}
                      className={`answer-option ${session.selected ? (c.code === country.code ? "correct" : c.code === session.selected ? "incorrect" : "muted") : ""}`}
                    >
                      <span className="answer-key">{i + 1}</span>
                      <span>{c.name}</span>
                      {session.selected && c.code === country.code ? (
                        <Check size={19} />
                      ) : session.selected === c.code ? (
                        <X size={19} />
                      ) : null}
                    </button>
                  ))}
                </div>
                {session.selected ? (
                  <div
                    className={`answer-feedback ${correct ? "is-correct" : "is-incorrect"}`}
                    aria-live="polite"
                  >
                    <div className="feedback-heading">
                      <span className="feedback-icon">
                        {correct ? (
                          <Check size={19} />
                        ) : (
                          <Lightbulb size={19} />
                        )}
                      </span>
                      <div>
                        <h3>
                          {correct
                            ? "That’s right. Nicely spotted!"
                            : `A new connection: this is ${country.name}.`}
                        </h3>
                        <p>{country.flagHint}</p>
                      </div>
                    </div>
                    <Button className="button-dark" onClick={continueSession}>
                      {session.index + 1 === session.queue.length
                        ? "See how you did"
                        : "Next flag"}
                      <ArrowRight size={17} />
                    </Button>
                  </div>
                ) : (
                  <div className="keyboard-note">
                    <Keyboard size={15} /> Press 1–4 to answer <span>·</span>{" "}
                    Enter to continue
                  </div>
                )}
              </>
            )}
          </main>
        )}
      </div>
    );
  };
  return (
    <>
      {session ? (
        renderSession()
      ) : (
        <div className="app-shell">
          <aside className={`sidebar ${menuOpen ? "mobile-open" : ""}`}>
            <div className="sidebar-top">
              <button className="brand" onClick={() => navigate("learn")}>
                <span className="brand-icon">
                  <Flag size={22} strokeWidth={1.8} />
                </span>
                flagg<span className="brand-period">.</span>
              </button>
              <button
                className="mobile-close icon-button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
              >
                <X size={19} />
              </button>
            </div>
            <div className="sidebar-tagline">
              A little more world, every day.
            </div>
            <div className="nav-label">YOUR EXPLORER’S DESK</div>
            <nav aria-label="Main navigation">
              <button
                className={`nav-item ${page === "learn" ? "active" : ""}`}
                aria-current={page === "learn" ? "page" : undefined}
                onClick={() => navigate("learn")}
              >
                <Home size={18} />
                Overview
                {page === "learn" && <span className="nav-active-dot" />}
              </button>
              <button
                className={`nav-item ${page === "library" ? "active" : ""}`}
                aria-current={page === "library" ? "page" : undefined}
                onClick={() => navigate("library")}
              >
                <Grid2X2 size={18} />
                Flag library<span className="nav-count">195</span>
              </button>
              <button
                className={`nav-item ${page === "progress" ? "active" : ""}`}
                aria-current={page === "progress" ? "page" : undefined}
                onClick={() => navigate("progress")}
              >
                <TrendingUp size={18} />
                My progress
              </button>
            </nav>
            <div className="nav-label practice-nav-label">
              A LITTLE PRACTICE
            </div>
            <nav aria-label="Practice modes">
              <button
                className="nav-item"
                onClick={() => {
                  setMenuOpen(false);
                  startSession("review");
                }}
              >
                <RotateCcw size={18} />
                Smart review
                {stats.due > 0 && (
                  <span className="review-badge">{stats.due}</span>
                )}
              </button>
              <button
                className="nav-item"
                onClick={() => {
                  setMenuOpen(false);
                  setModal("challenge");
                }}
              >
                <Zap size={18} />
                Challenge mode
                <span className="new-dot" />
              </button>
            </nav>
            <div className="sidebar-bottom">
              <div className="explorer-card">
                <div className="explorer-card-top">
                  <span className="explorer-avatar">
                    <Compass size={21} strokeWidth={1.5} />
                  </span>
                  <div>
                    <strong>Curious explorer</strong>
                    <span>
                      Level {stats.level} <i>·</i> {stats.xp} XP
                    </span>
                  </div>
                  <Sparkles size={14} />
                </div>
                <div className="explorer-xp">
                  <i
                    style={{
                      width: `${((progress.xp - (stats.level - 1) ** 2 * 100) / (stats.level ** 2 * 100 - (stats.level - 1) ** 2 * 100)) * 100}%`,
                    }}
                  />
                </div>
                <small>
                  {stats.level ** 2 * 100 - progress.xp} XP to your next level
                </small>
              </div>
              <button className="nav-item" onClick={() => setModal("save")}>
                <Download size={17} />
                Save & restore
                <ArrowUpRight size={14} className="push-right" />
              </button>
              <button className="nav-item" onClick={() => setModal("settings")}>
                <Settings2 size={17} />
                Your preferences
              </button>
              <div className="local-label">
                <span className={`status-dot ${storageOk ? "" : "orange"}`} />
                {storageOk
                  ? "Your progress stays with you"
                  : "Export to keep your progress"}
              </div>
            </div>
          </aside>
          {menuOpen && (
            <div className="sidebar-scrim" onClick={() => setMenuOpen(false)} />
          )}
          <div className="workspace">
            <header className="topbar">
              <div className="topbar-title">
                <button
                  className="icon-button mobile-menu"
                  aria-label="Open navigation"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen(true)}
                >
                  <Menu size={21} />
                </button>
                <Compass size={17} />
                <span>
                  {page === "learn"
                    ? "Learning dashboard"
                    : page === "library"
                      ? "Your world atlas"
                      : "Your explorer’s journal"}
                </span>
              </div>
              <div className="topbar-right">
                <button
                  className="save-indicator"
                  onClick={() => setModal("save")}
                >
                  <span className={`status-dot ${storageOk ? "" : "orange"}`} />
                  {storageOk ? "Saved on this device" : "Export your progress"}
                </button>
                <span className="topbar-separator" />
                <span className="top-streak">
                  <Flame size={17} />
                  <strong>{stats.streak}</strong>
                  <span>day streak</span>
                </span>
                <button
                  className="help-button"
                  onClick={() => setModal("about")}
                  aria-label="How Flagg works"
                >
                  <CircleHelp size={19} />
                </button>
              </div>
            </header>
            <main className="main-content">
              {page === "learn"
                ? renderOverview()
                : page === "library"
                  ? renderLibrary()
                  : renderProgress()}
            </main>
          </div>
        </div>
      )}
      {modal === "settings" && (
        <Modal title="Make yourself at home" onClose={() => setModal(null)}>
          <p className="modal-intro">
            A routine that fits your life is a routine that sticks.
          </p>
          <div className="setting-section">
            <h3>Your daily goal</h3>
            <p>How many flags would you like to practice each day?</p>
            <div className="goal-options">
              {[5, 10, 20, 30].map((n) => (
                <button
                  className={
                    progress.settings.dailyGoal === n ? "selected" : ""
                  }
                  aria-pressed={progress.settings.dailyGoal === n}
                  onClick={() =>
                    setProgress((p) => ({
                      ...p,
                      settings: { ...p.settings, dailyGoal: n },
                    }))
                  }
                  key={n}
                >
                  <strong>{n}</strong>
                  <span>
                    {n === 5
                      ? "Easy does it"
                      : n === 10
                        ? "A little daily"
                        : n === 20
                          ? "Feeling curious"
                          : "All in"}
                  </span>
                  {progress.settings.dailyGoal === n && <Check size={13} />}
                </button>
              ))}
            </div>
          </div>
          <div className="setting-toggle">
            <div>
              <h3>Little sounds of encouragement</h3>
              <p>Gentle feedback when you answer a flag.</p>
            </div>
            <button
              role="switch"
              aria-checked={progress.settings.sound}
              aria-label="Answer sounds"
              className={`toggle ${progress.settings.sound ? "on" : ""}`}
              onClick={() =>
                setProgress((p) => ({
                  ...p,
                  settings: { ...p.settings, sound: !p.settings.sound },
                }))
              }
            >
              <i />
            </button>
          </div>
          <div className="privacy-note">
            <ShieldCheck size={19} />
            <p>
              No accounts. No tracking. Your journey lives in your browser.
              Export a save file to keep a backup or move devices.
            </p>
          </div>
          <div className="modal-actions">
            <button className="danger-text" onClick={() => setModal("reset")}>
              Reset my progress
            </button>
            <Button
              className="button-dark"
              onClick={() => {
                setModal(null);
                setToast("Your preferences are saved. Make it your own.");
              }}
            >
              All set <Check size={16} />
            </Button>
          </div>
        </Modal>
      )}
      {modal === "save" && (
        <Modal
          title="Your journey. Yours to keep."
          onClose={() => {
            setModal(null);
            setImportCandidate(null);
            setImportError("");
          }}
        >
          <p className="modal-intro">
            Your progress saves automatically on this device. A save file lets
            you take it anywhere.
          </p>
          <div className="save-summary">
            <span className="explorer-avatar">
              <Compass size={24} />
            </span>
            <div>
              <h3>Your explorer passport</h3>
              <p>
                {stats.seen} flags discovered · {stats.xp} XP · Level{" "}
                {stats.level}
              </p>
            </div>
            <ShieldCheck size={20} />
          </div>
          <button className="save-action" onClick={downloadSave}>
            <span>
              <Download size={21} />
            </span>
            <div>
              <h3>Export your progress</h3>
              <p>Download a Flagg save file as a backup.</p>
            </div>
            <ArrowUpRight size={18} />
          </button>
          <button
            className="save-action"
            onClick={() => importInput.current?.click()}
          >
            <span>
              <Upload size={21} />
            </span>
            <div>
              <h3>Restore a save file</h3>
              <p>Pick up where you left off on another device.</p>
            </div>
            <ArrowUpRight size={18} />
          </button>
          <input
            type="file"
            accept="application/json,.json"
            hidden
            ref={importInput}
            onChange={readSave}
          />
          {importError && (
            <p className="form-error" role="alert">
              {importError}
            </p>
          )}
          {importCandidate && (
            <div className="import-confirm">
              <h3>Your passport is ready to restore</h3>
              <p>
                This save has {Object.keys(importCandidate.cards).length}{" "}
                discovered flags and {importCandidate.xp} XP. Restoring replaces
                the progress currently on this device.
              </p>
              <div>
                <Button
                  className="button-outline"
                  onClick={() => setImportCandidate(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="button-dark"
                  onClick={() => {
                    setProgress(importCandidate);
                    setImportCandidate(null);
                    setModal(null);
                    setToast("Welcome back. Your journey has been restored.");
                  }}
                >
                  Restore this progress
                </Button>
              </div>
            </div>
          )}
          <div className="privacy-note">
            <ShieldCheck size={18} />
            <p>
              Your save file contains only your learning progress and
              preferences. Keep it somewhere safe.
            </p>
          </div>
        </Modal>
      )}
      {modal === "challenge" && (
        <Modal
          title="A little friendly challenge?"
          onClose={() => setModal(null)}
        >
          <p className="modal-intro">
            Put your knowledge to the test. Expect a mix of familiar flags and
            new discoveries.
          </p>
          <label className="challenge-region">
            <span>Choose your corner of the world</span>
            <select
              value={challengeRegion}
              onChange={(e) => setChallengeRegion(e.target.value)}
            >
              <option>All regions</option>
              {REGIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <button
            className="challenge-option"
            onClick={() => startSession("challenge", challengeRegion)}
          >
            <span className="challenge-icon sage">
              <Globe2 size={25} />
            </span>
            <div>
              <h3>The world tour</h3>
              <p>
                {Math.min(
                  20,
                  countries.filter(
                    (c) =>
                      challengeRegion === "All regions" ||
                      c.continent === challengeRegion,
                  ).length,
                )}{" "}
                flags. No clock. Just you and your memory.
              </p>
              <span>TAKE YOUR TIME</span>
            </div>
            <ArrowRight size={19} />
          </button>
          <button
            className="challenge-option"
            onClick={() => startSession("challenge", challengeRegion, true)}
          >
            <span className="challenge-icon peach">
              <Timer size={25} />
            </span>
            <div>
              <h3>The one-minute adventure</h3>
              <p>How many can you recognize in 60 seconds?</p>
              <span>BEAT THE CLOCK</span>
            </div>
            <ArrowRight size={19} />
          </button>
          <p className="fine-print">
            All answers count toward your learning progress. Even the tricky
            ones.
          </p>
        </Modal>
      )}
      {modal === "about" && (
        <Modal
          title="A little science. A lot of discovery."
          onClose={() => setModal(null)}
        >
          <p className="modal-intro">
            Flagg helps you learn all 195 country flags, a few memorable minutes
            at a time.
          </p>
          <div className="about-step">
            <span>01</span>
            <div>
              <h3>Make a connection</h3>
              <p>
                Meet new flags in short study rounds. Notice the colors,
                symbols, and a little clue that makes each one memorable.
              </p>
            </div>
          </div>
          <div className="about-step">
            <span>02</span>
            <div>
              <h3>Give your memory a little work</h3>
              <p>
                Recall quizzes help knowledge stick. Similar-looking flags make
                you look closely, and feedback explains what to notice.
              </p>
            </div>
          </div>
          <div className="about-step">
            <span>03</span>
            <div>
              <h3>Come back at the right time</h3>
              <p>
                Smart review spaces out familiar flags and brings tricky ones
                back sooner. Three consecutive correct answers across spaced
                reviews unlock mastery.
              </p>
            </div>
          </div>
          <Button
            className="button-dark full-width"
            onClick={() => setModal(null)}
          >
            A little more world awaits <ArrowRight size={17} />
          </Button>
          <p className="data-attribution">
            Country data:{" "}
            <a
              href="https://github.com/mledoze/countries"
              target="_blank"
              rel="noreferrer"
            >
              mledoze/countries
            </a>{" "}
            (ODbL 1.0). Flag artwork:{" "}
            <a
              href="https://github.com/lipis/flag-icons"
              target="_blank"
              rel="noreferrer"
            >
              flag-icons
            </a>{" "}
            (MIT).
          </p>
        </Modal>
      )}
      {modal === "reset" && (
        <Modal title="A fresh start?" onClose={() => setModal("settings")}>
          <p className="modal-intro">
            This will clear all learning progress and preferences on this
            device. Export a save file first if you’d like to keep this journey.
          </p>
          <div className="modal-actions">
            <Button
              className="button-outline"
              onClick={() => setModal("settings")}
            >
              Keep my progress
            </Button>
            <Button
              className="button-danger"
              onClick={() => {
                setProgress(createProgress());
                setModal(null);
                setToast("A fresh page. A whole world ahead.");
              }}
            >
              Reset progress
            </Button>
          </div>
        </Modal>
      )}
      {modal === "exit" && (
        <Modal title="Take a little breather?" onClose={() => setModal(null)}>
          <p className="modal-intro">
            Every answer you’ve already given is saved. You can start a fresh
            session whenever you’re ready.
          </p>
          <div className="modal-actions">
            <Button className="button-outline" onClick={() => setModal(null)}>
              Keep exploring
            </Button>
            <Button
              className="button-dark"
              onClick={() => {
                setSession(null);
                setModal(null);
              }}
            >
              Back to my journey
            </Button>
          </div>
        </Modal>
      )}
      {detail && (
        <Modal title="A little closer look" onClose={() => setDetail(null)}>
          <div className="detail-flag">
            <FlagImage code={detail.code} name={detail.name} />
          </div>
          <div className="country-detail-heading">
            <div>
              <h2>{detail.name}</h2>
              <p>
                {detail.continent} <span>·</span> {detail.capital}
              </p>
            </div>
            <span
              className={`country-status ${getCountryStatus(progress, detail.code)}`}
            >
              {STATUS_LABELS[getCountryStatus(progress, detail.code)]}
            </span>
          </div>
          <div className="memory-note">
            <Lightbulb size={20} />
            <div>
              <h3>A little way to remember</h3>
              <p>{detail.flagHint}</p>
            </div>
          </div>
          {progress.cards[detail.code] && (
            <div className="detail-stats">
              <span>
                <strong>{progress.cards[detail.code].attempts}</strong> attempts
              </span>
              <span>
                <strong>{progress.cards[detail.code].correct}</strong> correct
              </span>
              <span>
                <strong>{progress.cards[detail.code].consecutive}</strong> in a
                row
              </span>
            </div>
          )}
          {progress.cards[detail.code] && (
            <div className="review-schedule">
              <RotateCcw size={15} />
              <span>
                {progress.cards[detail.code].dueAt <= Date.now()
                  ? "Ready for a little refresh now"
                  : `Next spaced review: ${new Date(progress.cards[detail.code].dueAt).toLocaleDateString("en", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}`}
                <small>
                  Early practice is welcome. Mastery grows across spaced
                  reviews.
                </small>
              </span>
            </div>
          )}
          <Button
            className="button-dark full-width"
            onClick={() => startSession("review", undefined, false, [detail])}
          >
            Practice this flag <ArrowRight size={16} />
          </Button>
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          {toast}
          <button
            aria-label="Dismiss notification"
            onClick={() => setToast("")}
          >
            <X size={15} />
          </button>
        </div>
      )}
    </>
  );
}
function Stat({
  icon,
  label,
  value,
  foot,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  foot: ReactNode;
}) {
  return (
    <div className="stat-card">
      <div className="stat-label">
        {label}
        <span>{icon}</span>
      </div>
      <div className="stat-number">{value}</div>
      <div className="stat-foot">{foot}</div>
    </div>
  );
}
function PageFooter() {
  return (
    <footer className="page-footer">
      <span>
        <Flag size={12} /> A little more world, every day.
      </span>
      <span>
        Built for curious minds. <span className="footer-star">✧</span>
      </span>
    </footer>
  );
}
export default App;
