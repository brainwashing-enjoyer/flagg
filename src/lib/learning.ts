import { countries, type Country } from "../data/countries";

export const STORAGE_KEY = "flagg.progress.v1";
export const RECOVERY_STORAGE_KEY = `${STORAGE_KEY}.recovery`;
const DAY = 86_400_000;
const MAX_COUNT = 1_000_000_000;

export interface CardProgress {
  attempts: number;
  correct: number;
  consecutive: number;
  /** Days until the next scheduled review. */
  interval: number;
  dueAt: number;
  lastSeen: number;
}

export interface Progress {
  version: 1;
  cards: Record<string, CardProgress>;
  days: Record<string, { answers: number; correct: number; xp: number }>;
  xp: number;
  settings: { dailyGoal: number; sound: boolean };
}

export type CountryStatus = "new" | "learning" | "review" | "mastered";
export interface SessionOptions {
  continent?: string;
  size?: number;
  mode?: "learn" | "review" | "challenge";
}

export function createProgress(): Progress {
  return {
    version: 1,
    cards: {},
    days: {},
    xp: 0,
    settings: { dailyGoal: 10, sound: false },
  };
}

/** Local calendar dates keep a late evening session on the learner's actual day. */
export function dayKey(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function isMastered(card?: CardProgress): boolean {
  return Boolean(card && card.consecutive >= 3 && card.interval >= 6);
}

export function getCountryStatus(
  progress: Progress,
  code: string,
  now = new Date(),
): CountryStatus {
  const card = progress.cards[code];
  if (!card) return "new";
  if (isMastered(card)) return "mastered";
  return card.dueAt <= now.getTime() ? "review" : "learning";
}

/** Retrieval is rewarded; errors shorten the interval instead of erasing history. */
export function recordAnswer(
  progress: Progress,
  code: string,
  correct: boolean,
  now = new Date(),
): Progress {
  if (!countries.some((country) => country.code === code))
    throw new Error("Unknown country.");
  const previous = progress.cards[code];
  const earlyPractice = Boolean(
    correct &&
    previous &&
    previous.consecutive > 0 &&
    previous.dueAt > now.getTime(),
  );
  const consecutive = !correct
    ? 0
    : earlyPractice
      ? previous!.consecutive
      : (previous?.consecutive ?? 0) + 1;
  const interval = !correct
    ? 10 / (24 * 60)
    : earlyPractice
      ? previous!.interval
      : consecutive === 1
        ? 1
        : consecutive === 2
          ? 3
          : Math.min(365, Math.max(7, (previous?.interval ?? 3) * 2.4));
  const gainedXp = correct ? 10 + (consecutive >= 3 ? 5 : 0) : 2;
  const key = dayKey(now);
  const day = progress.days[key] ?? { answers: 0, correct: 0, xp: 0 };
  return {
    ...progress,
    cards: {
      ...progress.cards,
      [code]: {
        attempts: (previous?.attempts ?? 0) + 1,
        correct: (previous?.correct ?? 0) + Number(correct),
        consecutive,
        interval,
        dueAt: earlyPractice ? previous!.dueAt : now.getTime() + interval * DAY,
        lastSeen: now.getTime(),
      },
    },
    days: {
      ...progress.days,
      [key]: {
        answers: day.answers + 1,
        correct: day.correct + Number(correct),
        xp: day.xp + gainedXp,
      },
    },
    xp: progress.xp + gainedXp,
  };
}

function shuffled<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Due and weak memories come first; new cards enter in small, manageable batches. */
export function buildSession(
  progress: Progress,
  options: SessionOptions = {},
  now = new Date(),
): Country[] {
  const size = Math.min(50, Math.max(1, Math.floor(options.size ?? 10)));
  const pool = countries.filter(
    (country) =>
      !options.continent ||
      options.continent === "All" ||
      options.continent === "All regions" ||
      country.continent === options.continent,
  );
  if (options.mode === "challenge") return shuffled(pool).slice(0, size);
  const known = pool.filter((country) => progress.cards[country.code]);
  const ranked = shuffled(known).sort((a, b) => {
    const ac = progress.cards[a.code];
    const bc = progress.cards[b.code];
    const aDue = ac.dueAt <= now.getTime();
    const bDue = bc.dueAt <= now.getTime();
    if (aDue !== bDue) return aDue ? -1 : 1;
    if (aDue && bDue) {
      const weakness = ac.correct / ac.attempts - bc.correct / bc.attempts;
      if (Math.abs(weakness) > 0.01) return weakness;
    }
    return ac.dueAt - bc.dueAt;
  });
  if (options.mode === "review") return ranked.slice(0, size);
  const due = ranked.filter(
    (country) => progress.cards[country.code].dueAt <= now.getTime(),
  );
  const fresh = shuffled(
    pool.filter((country) => !progress.cards[country.code]),
  );
  const selected = due.slice(0, Math.ceil(size * 0.6));
  selected.push(...fresh.slice(0, size - selected.length));
  for (const country of ranked) {
    if (selected.length >= size) break;
    if (!selected.some((item) => item.code === country.code))
      selected.push(country);
  }
  return selected;
}

// These flag families produce useful discrimination practice rather than arbitrary trivia.
const confusionGroups = [
  ["id", "mc", "pl", "sg"],
  ["ie", "ci", "it", "mx"],
  ["ro", "td", "ad", "md"],
  ["nl", "lu", "ru", "rs", "sk", "si"],
  ["au", "nz", "fj", "tv"],
  ["us", "my", "lr", "gr"],
  ["no", "is", "dk", "se", "fi"],
  ["ae", "kw", "jo", "ps", "sd"],
  ["ml", "gn", "sn", "cm"],
  ["gh", "bo", "et", "bj"],
  ["qa", "bh"],
  ["bd", "jp", "pw"],
  ["co", "ec", "ve"],
  ["eg", "iq", "sy", "ye"],
  ["gb", "ge", "mt", "ch"],
  ["ne", "in", "hu", "tj"],
];

export function getChoices(country: Country, count = 4): Country[] {
  const family =
    confusionGroups.find((group) => group.includes(country.code)) ?? [];
  const close = shuffled(
    countries.filter(
      (item) => item.code !== country.code && family.includes(item.code),
    ),
  );
  const nearby = shuffled(
    countries.filter(
      (item) =>
        item.code !== country.code &&
        item.continent === country.continent &&
        !family.includes(item.code),
    ),
  );
  const others = shuffled(
    countries.filter(
      (item) =>
        item.code !== country.code &&
        item.continent !== country.continent &&
        !family.includes(item.code),
    ),
  );
  return shuffled(
    [country, ...close, ...nearby, ...others].slice(
      0,
      Math.max(2, Math.min(8, count)),
    ),
  );
}

export function getStats(progress: Progress, now = new Date()) {
  const cards = Object.values(progress.cards);
  const today = progress.days[dayKey(now)];
  let streak = 0;
  const cursor = new Date(now);
  cursor.setHours(12, 0, 0, 0);
  if (!today?.answers) cursor.setDate(cursor.getDate() - 1);
  while (progress.days[dayKey(cursor)]?.answers) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  const totalAnswers = cards.reduce((sum, card) => sum + card.attempts, 0);
  const correctAnswers = cards.reduce((sum, card) => sum + card.correct, 0);
  const mastered = cards.filter(isMastered).length;
  return {
    seen: cards.length,
    learning: cards.length - mastered,
    mastered,
    due: cards.filter((card) => card.dueAt <= now.getTime()).length,
    xp: progress.xp,
    level: Math.floor(Math.sqrt(progress.xp / 100)) + 1,
    streak,
    todayAnswers: today?.answers ?? 0,
    dailyGoal: progress.settings.dailyGoal,
    accuracy: totalAnswers
      ? Math.round((correctAnswers / totalAnswers) * 100)
      : 0,
    totalAnswers,
    correctAnswers,
  };
}

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function bounded(
  value: unknown,
  min = 0,
  max = MAX_COUNT,
  integer = true,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= min &&
    value <= max &&
    (!integer || Number.isInteger(value))
  );
}

/** Parse into a fresh trusted shape, never merge an untrusted save into live state. */
export function importProgress(json: string): Progress {
  if (json.length > 4_000_000) throw new Error("This save file is too large.");
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    throw new Error("This is not a valid JSON save file.");
  }
  if (!object(raw) || raw.version !== 1)
    throw new Error(
      "This save file uses an unsupported format. Please choose a Flagg version 1 save.",
    );
  if (
    !object(raw.cards) ||
    !object(raw.days) ||
    !object(raw.settings) ||
    !bounded(raw.xp)
  )
    throw new Error("This save file is missing valid progress data.");
  if (
    !bounded(raw.settings.dailyGoal, 1, 100) ||
    typeof raw.settings.sound !== "boolean"
  )
    throw new Error("This save file has invalid learning settings.");
  const result = createProgress();
  result.settings = {
    dailyGoal: raw.settings.dailyGoal,
    sound: raw.settings.sound,
  };
  result.xp = raw.xp;
  const validCodes = new Set(countries.map((country) => country.code));
  for (const [code, value] of Object.entries(raw.cards)) {
    if (
      !validCodes.has(code) ||
      !object(value) ||
      !bounded(value.attempts, 1) ||
      !bounded(value.correct, 0, value.attempts) ||
      !bounded(value.consecutive, 0, value.correct) ||
      !bounded(value.interval, 0, 365, false) ||
      !bounded(value.dueAt, 0, 8.64e15, false) ||
      !bounded(value.lastSeen, 0, 8.64e15, false) ||
      value.dueAt < value.lastSeen
    ) {
      throw new Error("This save file has invalid country progress.");
    }
    result.cards[code] = {
      attempts: value.attempts,
      correct: value.correct,
      consecutive: value.consecutive,
      interval: value.interval,
      dueAt: value.dueAt,
      lastSeen: value.lastSeen,
    };
  }
  for (const [key, value] of Object.entries(raw.days)) {
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(key) ||
      Number.isNaN(Date.parse(`${key}T12:00:00Z`)) ||
      new Date(`${key}T12:00:00Z`).toISOString().slice(0, 10) !== key ||
      !object(value) ||
      !bounded(value.answers, 1) ||
      !bounded(value.correct, 0, value.answers) ||
      !bounded(value.xp)
    ) {
      throw new Error("This save file has invalid activity history.");
    }
    result.days[key] = {
      answers: value.answers,
      correct: value.correct,
      xp: value.xp,
    };
  }
  const cardAnswers = Object.values(result.cards).reduce(
    (sum, card) => sum + card.attempts,
    0,
  );
  const cardCorrect = Object.values(result.cards).reduce(
    (sum, card) => sum + card.correct,
    0,
  );
  const dayAnswers = Object.values(result.days).reduce(
    (sum, day) => sum + day.answers,
    0,
  );
  const dayCorrect = Object.values(result.days).reduce(
    (sum, day) => sum + day.correct,
    0,
  );
  const dayXp = Object.values(result.days).reduce(
    (sum, day) => sum + day.xp,
    0,
  );
  if (
    cardAnswers !== dayAnswers ||
    cardCorrect !== dayCorrect ||
    dayXp !== result.xp
  )
    throw new Error("This save file has inconsistent progress totals.");
  return result;
}

export function exportProgress(progress: Progress): string {
  return JSON.stringify(
    { ...progress, exportedAt: new Date().toISOString(), app: "Flagg" },
    null,
    2,
  );
}

export function loadProgress(): Progress {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
    return stored ? importProgress(stored) : createProgress();
  } catch {
    // Keep the original bytes recoverable before the app persists a fresh state.
    if (stored !== null) {
      try {
        if (localStorage.getItem(RECOVERY_STORAGE_KEY) === null)
          localStorage.setItem(RECOVERY_STORAGE_KEY, stored);
      } catch {
        /* Browsers may deny writes or have no free storage. */
      }
    }
    return createProgress();
  }
}

/** False lets the UI warn about private-mode/full-storage failures while play continues. */
export function saveProgress(progress: Progress): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
