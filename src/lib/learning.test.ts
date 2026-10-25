import { describe, expect, it, vi } from "vitest";
import { countries } from "../data/countries";
import {
  buildSession,
  createProgress,
  dayKey,
  exportProgress,
  getChoices,
  getCountryStatus,
  getStats,
  importProgress,
  recordAnswer,
  loadProgress,
  saveProgress,
  STORAGE_KEY,
  RECOVERY_STORAGE_KEY,
} from "./learning";

const now = new Date(2026, 5, 10, 12);
const tomorrow = new Date(2026, 5, 11, 12);
const code = "jp";

describe("adaptive learning", () => {
  it("grows intervals with successful retrieval, then schedules an early retry after an error", () => {
    const initial = createProgress();
    const first = recordAnswer(initial, code, true, now);
    expect(initial.cards).toEqual({});
    expect(first.cards[code].interval).toBe(1);
    const second = recordAnswer(first, code, true, tomorrow);
    expect(second.cards[code].interval).toBe(3);
    const third = recordAnswer(second, code, true, new Date(2026, 5, 14, 12));
    expect(third.cards[code].interval).toBeGreaterThanOrEqual(7);
    expect(getCountryStatus(third, code, now)).toBe("mastered");
    const missed = recordAnswer(third, code, false, new Date(2026, 5, 22, 12));
    expect(missed.cards[code].consecutive).toBe(0);
    expect(missed.cards[code].attempts).toBe(4);
    expect(missed.cards[code].correct).toBe(3);
    expect(missed.cards[code].dueAt - missed.cards[code].lastSeen).toBeCloseTo(
      600_000,
    );
    expect(getCountryStatus(missed, code, new Date(2026, 5, 22, 12, 11))).toBe(
      "review",
    );
  });

  it("does not advance mastery or postpone the review when practicing before a review is due", () => {
    const first = recordAnswer(createProgress(), code, true, now);
    const earlyTime = new Date(2026, 5, 10, 13);
    const second = recordAnswer(first, code, true, earlyTime);
    const third = recordAnswer(second, code, true, new Date(2026, 5, 10, 14));
    expect(third.cards[code]).toMatchObject({
      attempts: 3,
      correct: 3,
      consecutive: 1,
      interval: 1,
      dueAt: first.cards[code].dueAt,
    });
    expect(getCountryStatus(third, code, earlyTime)).toBe("learning");
    expect(third.cards[code].lastSeen).toBeGreaterThan(
      first.cards[code].lastSeen,
    );
    expect(importProgress(exportProgress(third))).toEqual(third);
    const dueReview = recordAnswer(third, code, true, tomorrow);
    expect(dueReview.cards[code].consecutive).toBe(2);
    const nextReview = recordAnswer(
      dueReview,
      code,
      true,
      new Date(2026, 5, 14, 12),
    );
    expect(getCountryStatus(nextReview, code)).toBe("mastered");
  });

  it("combines due weak cards and new countries, applying a continent filter", () => {
    let progress = recordAnswer(createProgress(), "jp", false, now);
    progress = recordAnswer(progress, "fr", true, now);
    const session = buildSession(
      progress,
      { continent: "Asia", size: 10 },
      tomorrow,
    );
    expect(session).toHaveLength(10);
    expect(session.every((country) => country.continent === "Asia")).toBe(true);
    expect(new Set(session.map((country) => country.code)).size).toBe(10);
    expect(session[0].code).toBe("jp");
    expect(
      buildSession(progress, { mode: "review" }, tomorrow).map(
        (country) => country.code,
      ),
    ).toEqual(["jp", "fr"]);
    expect(buildSession(createProgress(), { mode: "review" }, now)).toEqual([]);
  });

  it("tracks local day goals, accuracy, XP and a streak including yesterday", () => {
    let progress = recordAnswer(createProgress(), "jp", true, now);
    progress = recordAnswer(progress, "fr", false, now);
    const sameDay = getStats(progress, now);
    expect(sameDay).toMatchObject({
      seen: 2,
      totalAnswers: 2,
      correctAnswers: 1,
      accuracy: 50,
      todayAnswers: 2,
      streak: 1,
      xp: 12,
    });
    expect(getStats(progress, tomorrow).streak).toBe(1);
    expect(getStats(progress, new Date(2026, 5, 12, 12)).streak).toBe(0);
    progress = recordAnswer(progress, "jp", true, tomorrow);
    expect(getStats(progress, tomorrow).streak).toBe(2);
    expect(progress.days[dayKey(tomorrow)].answers).toBe(1);
  });

  it("returns unique answer choices including the right country and useful similar flags", () => {
    const ireland = countries.find((country) => country.code === "ie")!;
    const choices = getChoices(ireland);
    expect(choices).toHaveLength(4);
    expect(new Set(choices.map((country) => country.code)).size).toBe(4);
    expect(choices).toContain(ireland);
    expect(choices.map((country) => country.code)).toContain("ci");
  });
});

describe("save files", () => {
  it("preserves an unreadable browser save before fresh progress is persisted", () => {
    const corrupt = "{broken save with recoverable bytes";
    const storage = new Map([[STORAGE_KEY, corrupt]]);
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
    });
    try {
      const progress = loadProgress();
      expect(progress).toEqual(createProgress());
      expect(storage.get(RECOVERY_STORAGE_KEY)).toBe(corrupt);
      expect(saveProgress(progress)).toBe(true);
      expect(importProgress(storage.get(STORAGE_KEY)!)).toEqual(progress);
      expect(storage.get(RECOVERY_STORAGE_KEY)).toBe(corrupt);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("round-trips country progress, settings and history", () => {
    const progress = recordAnswer(createProgress(), code, true, now);
    progress.settings.dailyGoal = 20;
    expect(importProgress(exportProgress(progress))).toEqual(progress);
  });

  it("rejects unsupported files, NaN-equivalent data, unknown countries and inconsistent totals", () => {
    expect(() => importProgress("not json")).toThrow("JSON");
    expect(() => importProgress('{"version":2}')).toThrow("unsupported");
    const invalid = recordAnswer(createProgress(), code, true, now);
    invalid.cards[code].attempts = -1;
    expect(() => importProgress(JSON.stringify(invalid))).toThrow(
      "country progress",
    );
    const unknown = createProgress();
    unknown.cards.zz = {
      attempts: 1,
      correct: 1,
      consecutive: 1,
      interval: 1,
      dueAt: now.getTime(),
      lastSeen: now.getTime(),
    };
    expect(() => importProgress(JSON.stringify(unknown))).toThrow(
      "country progress",
    );
    const inconsistent = recordAnswer(createProgress(), code, true, now);
    inconsistent.xp = 200;
    expect(() => importProgress(JSON.stringify(inconsistent))).toThrow(
      "inconsistent",
    );
    const badDate = recordAnswer(createProgress(), code, true, now);
    badDate.days["2026-02-31"] = badDate.days[dayKey(now)];
    delete badDate.days[dayKey(now)];
    expect(() => importProgress(JSON.stringify(badDate))).toThrow(
      "activity history",
    );
  });
});
