import { test, expect, type Page } from "@playwright/test";
import { countries } from "../src/data/countries";

async function correctAnswer(page: Page) {
  const src = await page.locator(".quiz-flag-card img").getAttribute("src");
  const country = countries.find((c) => src === `/flags/${c.code}.svg`)!;
  await page
    .locator(".answer-option")
    .filter({ has: page.getByText(country.name, { exact: true }) })
    .click();
  await expect(page.locator(".answer-feedback")).toContainText("That’s right");
}

async function oneFlag(page: Page, country = "Japan") {
  await page.getByRole("button", { name: /Flag library/ }).click();
  await page.getByRole("textbox", { name: "Search countries" }).fill(country);
  await page
    .locator(".country-card")
    .filter({ has: page.getByRole("heading", { name: country, exact: true }) })
    .click();
  await page.getByRole("button", { name: "Practice this flag" }).click();
  await correctAnswer(page);
  await page.getByRole("button", { name: "See how you did" }).click();
  await expect(page.locator(".results-stats")).toContainText("+10");
  await page
    .getByRole("button", { name: "Back to my journey", exact: true })
    .click();
}

test("fresh dashboard and complete local flag library support search, region filtering, and study detail", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  const missing: string[] = [];
  page.on("response", (r) => {
    if (r.status() >= 400) missing.push(r.url());
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Your world is getting bigger." }),
  ).toBeVisible();
  await expect(page.locator(".stat-card").first()).toContainText("0 / 195");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "/tmp/flagg-dashboard.png", fullPage: true });
  await page.getByRole("button", { name: /Flag library/ }).click();
  await expect(page.locator(".country-card")).toHaveCount(195);
  await page
    .getByRole("combobox", { name: "Filter by region" })
    .selectOption("Africa");
  await expect(page.locator(".country-card")).toHaveCount(54);
  await page
    .getByRole("combobox", { name: "Filter by region" })
    .selectOption("All regions");
  await page.getByRole("textbox", { name: "Search countries" }).fill("Tokyo");
  await expect(page.locator(".country-card")).toHaveCount(1);
  await page.locator(".country-card").click();
  await expect(page.getByRole("dialog")).toContainText("Japan");
  await expect(page.getByRole("dialog")).toContainText("Tokyo");
  await expect(page.getByRole("dialog")).toContainText(
    "A little way to remember",
  );
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page
    .getByRole("textbox", { name: "Search countries" })
    .fill("no-such-country");
  await expect(
    page.getByRole("heading", { name: "No flags found" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".country-card")).toHaveCount(195);
  expect(errors).toEqual([]);
  expect(missing).toEqual([]);
});

test("a complete study and recall session persists meaningful learning statistics", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Start learning", exact: true })
    .click();
  for (let i = 0; i < 10; i++) {
    await expect(
      page.getByRole("heading", { name: /Say hello to/ }),
    ).toBeVisible();
    await expect(page.locator(".session-progress-top")).toContainText(
      `${i + 1} of 10 to discover`,
    );
    await page.locator(".study-action button").click();
  }
  for (let i = 0; i < 10; i++) {
    await expect(
      page.getByRole("heading", { name: "Which country flies this flag?" }),
    ).toBeVisible();
    await correctAnswer(page);
    await page
      .getByRole("button", {
        name: i === 9 ? "See how you did" : "Next flag",
        exact: true,
      })
      .click();
  }
  await expect(
    page.getByRole("heading", { name: "Look at you, world explorer." }),
  ).toBeVisible();
  await expect(page.locator(".results-stats")).toContainText("+100");
  await expect(page.locator(".results-stats")).toContainText("100%");
  await page
    .getByRole("button", { name: "Back to my journey", exact: true })
    .click();
  await page.reload();
  await expect(page.locator(".stat-card").first()).toContainText("10 / 195");
  await expect(page.locator(".stat-card").nth(2)).toContainText("100%");
  await expect(page.locator(".goal-ring")).toContainText("10 / 10");
  await page.getByRole("button", { name: "My progress", exact: true }).click();
  await expect(page.locator(".milestone.achieved")).toHaveCount(1);
  const save = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("flagg.progress.v1")!),
  );
  expect(Object.keys(save.cards)).toHaveLength(10);
  expect(save.xp).toBe(100);
  expect(
    Object.values(save.cards).every(
      (c: any) => c.attempts === 1 && c.correct === 1,
    ),
  ).toBe(true);
});

test("savefile export, validated import, and explicit replacement work end to end", async ({
  page,
}) => {
  await page.goto("/");
  await oneFlag(page);
  await page
    .getByRole("button", { name: "Save & restore", exact: true })
    .click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /Export your progress/ }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^flagg-save-.*\.json$/);
  const downloadedPath = await download.path();
  expect(downloadedPath).toBeTruthy();
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "invalid.json",
      mimeType: "application/json",
      buffer: Buffer.from('{"version":1}'),
    });
  await expect(page.getByRole("alert")).toContainText("missing valid progress");
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "fresh.json",
      mimeType: "application/json",
      buffer: Buffer.from(
        JSON.stringify({
          version: 1,
          cards: {},
          days: {},
          xp: 0,
          settings: { dailyGoal: 5, sound: true },
        }),
      ),
    });
  await expect(
    page.getByRole("heading", { name: "Your passport is ready to restore" }),
  ).toBeVisible();
  const before = await page.evaluate(
    () => JSON.parse(localStorage.getItem("flagg.progress.v1")!).xp,
  );
  expect(before).toBe(10);
  await page
    .getByRole("button", { name: "Restore this progress", exact: true })
    .click();
  await page.reload();
  await expect(page.locator(".stat-card").first()).toContainText("0 / 195");
  await page
    .getByRole("button", { name: "Save & restore", exact: true })
    .click();
  await page.locator("input[type=file]").setInputFiles(downloadedPath!);
  await expect(page.locator(".import-confirm")).toContainText(
    "1 discovered flags and 10 XP",
  );
  await page
    .getByRole("button", { name: "Restore this progress", exact: true })
    .click();
  await page.reload();
  await expect(page.locator(".stat-card").first()).toContainText("1 / 195");
});

test("preferences persist and reset is confirmed rather than immediate", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Your preferences", exact: true })
    .click();
  await page
    .locator(".goal-options button")
    .filter({ has: page.getByText("20", { exact: true }) })
    .click();
  await page.getByRole("switch", { name: "Answer sounds" }).click();
  await expect(
    page.getByRole("switch", { name: "Answer sounds" }),
  ).toBeChecked();
  await page.getByRole("button", { name: "All set", exact: true }).click();
  await page.reload();
  await expect(page.locator(".goal-ring")).toContainText("0 / 20");
  await page
    .getByRole("button", { name: "Your preferences", exact: true })
    .click();
  await expect(
    page.getByRole("switch", { name: "Answer sounds" }),
  ).toBeChecked();
  await page
    .getByRole("button", { name: "Reset my progress", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("A fresh start?");
  await page
    .getByRole("button", { name: "Keep my progress", exact: true })
    .click();
  await expect(
    page.getByRole("switch", { name: "Answer sounds" }),
  ).toBeChecked();
  await page
    .getByRole("button", { name: "Reset my progress", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reset progress", exact: true })
    .click();
  await expect(page.locator(".goal-ring")).toContainText("0 / 10");
});

test("timed challenge expires and wrong answers yield useful feedback", async ({
  page,
}) => {
  await page.clock.install();
  await page.goto("/");
  await page
    .getByRole("button", { name: "Challenge mode", exact: true })
    .click();
  await page.getByRole("button", { name: /The one-minute adventure/ }).click();
  const src = await page.locator(".quiz-flag-card img").getAttribute("src");
  const country = countries.find((c) => src === `/flags/${c.code}.svg`)!;
  const wrong = page
    .locator(".answer-option")
    .filter({ hasNot: page.getByText(country.name, { exact: true }) })
    .first();
  await wrong.click();
  await expect(page.locator(".answer-feedback")).toContainText(
    `this is ${country.name}`,
  );
  await page.getByRole("button", { name: "Next flag", exact: true }).click();
  await page.clock.runFor(61_000);
  await expect(page.locator(".session-complete")).toBeVisible();
  await expect(page.locator(".results-stats")).toContainText("+2");
  await expect(page.locator(".mistake-recap")).toContainText(country.name);
});

test("mobile dashboard, navigation, library, and quiz fit a 390px screen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "/tmp/flagg-mobile.png", fullPage: true });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  await page.getByRole("button", { name: /Flag library/ }).click();
  await expect(
    page.getByRole("textbox", { name: "Search countries" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.getByRole("textbox", { name: "Search countries" }).fill("Japan");
  await page.locator(".country-card").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Practice this flag" }).click();
  await correctAnswer(page);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
  await page.getByRole("button", { name: "See how you did" }).click();
  await expect(page.locator(".session-complete")).toBeVisible();
});

test("keyboard activation respects session controls and modal focus stays contained", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Start learning", exact: true })
    .click();
  await page.getByRole("button", { name: "End session", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("dialog", { name: "Take a little breather?" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Back to my journey", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Save & restore", exact: true })
    .click();
  await page.getByRole("button", { name: /Restore a save file/ }).focus();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Close dialog", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("button", { name: /Restore a save file/ }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Save & restore", exact: true }),
  ).toBeFocused();
});

test("an invalid new import clears the previous pending restore candidate", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Save & restore", exact: true })
    .click();
  const fileInput = page.locator("input[type=file]");
  await fileInput.setInputFiles({
    name: "valid.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        version: 1,
        cards: {},
        days: {},
        xp: 0,
        settings: { dailyGoal: 5, sound: true },
      }),
    ),
  });
  await expect(
    page.getByRole("button", { name: "Restore this progress", exact: true }),
  ).toBeVisible();
  await fileInput.setInputFiles({
    name: "invalid.json",
    mimeType: "application/json",
    buffer: Buffer.from("not json"),
  });
  await expect(page.getByRole("alert")).toContainText("not a valid JSON");
  await expect(
    page.getByRole("button", { name: "Restore this progress", exact: true }),
  ).not.toBeVisible();
  expect(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("flagg.progress.v1")!).settings
          .dailyGoal,
    ),
  ).toBe(10);
});

test("closed mobile navigation never receives invisible keyboard focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Open navigation", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: /Flag library/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: /Flag library/ }).click();
  await page.getByRole("textbox", { name: "Search countries" }).focus();
  await page.keyboard.press("Shift+Tab");
  const focused = await page.evaluate(() => {
    const el = document.activeElement as HTMLElement;
    const rect = el.getBoundingClientRect();
    return {
      inSidebar: !!el.closest(".sidebar"),
      x: rect.x,
      right: rect.right,
    };
  });
  expect(focused.inSidebar).toBe(false);
  expect(focused.x).toBeGreaterThanOrEqual(0);
  expect(focused.right).toBeLessThanOrEqual(390);
});
