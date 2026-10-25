# Flagg

A thoughtful, local-first web app for learning the flags of all 195 countries: the 193 United Nations members plus Palestine and Vatican City.

## Develop

Requires Node.js 22.12+ (verified on Node 24).

```sh
npm ci
npm run dev
```

Vite listens on port 5173. No API keys, account, database, or environment variables are needed. All flags and fonts are bundled locally.

```sh
npm run build       # TypeScript checks and production build in dist/
npm run preview     # Serve that production build
npm test            # Learning, scheduling, and save-validation tests
npm run test:e2e    # Full browser journeys
```

Browser tests use system Chromium at `/usr/bin/chromium`. Set `CHROMIUM_PATH` to another Chromium installation if needed. Playwright starts the development server if one is not running.

## Learning design

- **Meet, then recall:** short study cards introduce new flags and memory cues, followed by shuffled recognition practice.
- **Spaced repetition:** a first correct retrieval schedules a one-day review, followed by three-day and seven-day intervals. Further successful reviews expand the interval, up to a year. Mistakes schedule a ten-minute retry.
- **Honest mastery:** three consecutive successful _scheduled_ retrievals mark a flag mastered. Practicing early updates answer history but cannot shortcut the spaced mastery schedule.
- **Adaptive sessions:** due and weaker flags take priority; new material enters in manageable batches. The first lessons emphasize twenty familiar foundational flags.
- **Discrimination:** visually similar flags appear together in quiz options to encourage attention to distinguishing features.
- **Personal rhythm:** choose a daily goal, focus on a continent, review familiar flags, or try an untimed or sixty-second world challenge.
- **Milestones:** exploration, mastery, regional progress, recent activity, streaks, and XP reflect real answers. There is no fabricated starting progress.

## Progress and saves

Progress is stored under `flagg.progress.v1` in localStorage after each answer or preference change. Export a JSON save from **Save & restore** to back up or move to another browser. Import validates schema, country codes, dates, bounds, and consistent totals, and requires confirmation before replacing current progress. A corrupt browser save is preserved at `flagg.progress.v1.recovery` before a fresh journey is created. Browser storage failure leaves practice usable and shows a reminder to export.

Clearing browser data removes the local save. There is no cloud synchronization or account system. New sessions begin on reload; completed answers remain saved even when a lesson is interrupted. Dates and streaks use the learner’s local calendar.

## Structure

- `src/App.tsx`: dashboard, atlas, study and recall, challenges, preferences, save dialogs.
- `src/lib/learning.ts`: framework-independent scheduling, statistics, persistence, save validation.
- `src/data/countries.ts`: country metadata and individual flag memory cues.
- `src/components/WorldIllustration.tsx`: original responsive SVG dashboard illustration.
- `public/flags/`: local SVG flag artwork and its license.
- `tests/app.spec.ts`: browser integration and keyboard/mobile regressions.

## Data and attribution

Country metadata is adapted from [mledoze/countries](https://github.com/mledoze/countries), licensed under [Open Database License 1.0](https://opendatacommons.org/licenses/odbl/1-0/). The adapted country database in `src/data/countries.ts` is made available under the same license. Learning hints are written for this application. See `DATA-LICENSE.md`.

Flag SVGs are from [flag-icons](https://github.com/lipis/flag-icons), MIT licensed; its license is retained in `public/flags/LICENSE`. Fonts are DM Sans and Manrope via Fontsource, under SIL Open Font License 1.1 (licenses retained in their installed packages). Interface icons are Lucide, ISC licensed.

Transcontinental countries are assigned one region for consistent study queues. Flag designs and political recognition can change; the Afghanistan asset is the republic-era tricolor and its learning note explicitly explains the distinction. Syria uses the green-white-black design with three red stars. Flags are educational identifiers rather than claims about recognition.
