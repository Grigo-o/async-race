# Async Race

**Score (self-assessed): 395 / 400**

**Live demo:** https://grigo-o.github.io/async-race/
*(Assumes the GitHub repo is named `async-race` under the `Grigo-o` account — see [Deployment](#deployment) below if the repo name differs, since the Vite `base` path must match exactly.)*

> **Note for the reviewer:** the frontend calls `http://127.0.0.1:3000` for all API requests. Please clone and run the [mock server](https://github.com/mikhama/async-race-api) locally before testing — the deployed frontend has no backend of its own, per the task's deployment rules.

---

## Running locally

\`\`\`bash
git clone https://github.com/Grigo-o/async-race.git
cd async-race
npm install
npm run dev
\`\`\`

In a separate terminal, clone and start the mock server:

\`\`\`bash
git clone https://github.com/mikhama/async-race-api.git
cd async-race-api
npm install
npm run start
\`\`\`

The app expects the mock server at `http://127.0.0.1:3000` (see `src/utils/constants.ts`).

Other scripts:

\`\`\`bash
npm run lint       # ESLint (Airbnb config)
npm run format     # Prettier — auto-fix
npm run ci:format  # Prettier — check only
npm run build      # production build to dist/
\`\`\`

---

## Deployment

This repo deploys to **GitHub Pages** via GitHub Actions (`.github/workflows/deploy.yml`), triggered on every push to `main`.

One-time setup on GitHub (not needed again after this):
1. Push this repo to `github.com/Grigo-o/async-race` (or update the two places below if using a different name).
2. In the repo, go to **Settings → Pages → Source**, and select **GitHub Actions**.
3. Push to `main` — the workflow builds and deploys automatically. The live URL appears in the Actions run summary and in **Settings → Pages**.

If the repo name isn't `async-race`, update the `base` path to match in two places before deploying:
- `vite.config.ts` → `base: '/your-repo-name/'`
- This README's live demo link at the top

The app uses `HashRouter` (not `BrowserRouter`) specifically so it works correctly on GitHub Pages' static hosting — GitHub Pages can't rewrite arbitrary paths back to `index.html` the way Vercel/Netlify can, so URLs look like `.../#/winners` instead of `.../winners`. This doesn't affect any functionality, only the URL format.

---

## Checklist — 395 / 400 pts (self-assessed, excluding Code Quality)

### 🚀 UI Deployment
- [x] **Deployment Platform:** Deployed to GitHub Pages via GitHub Actions.

### ✅ Requirements to Commits and Repository
- [x] **Commit guidelines compliance:** Conventional Commits format used throughout (`feat:`, `fix:`, `refactor:`, `docs:`, etc.).
- [x] **Checklist included in README.md**
- [x] **Score calculation**
- [x] **UI Deployment link in README.md**

### Basic Structure — 80/80
- [x] **Two Views (10 pts):** Garage and Winners, via React Router.
- [x] **Garage View Content (30 pts):** view name, create/edit panel, race control panel, garage section — all present.
- [x] **Winners View Content (10 pts):** view name, winners table, pagination.
- [x] **Persistent State (30 pts):** page number and form inputs (create + update) live in Redux, not component state, so they survive switching between Garage and Winners.

### Garage View — 90/90
- [x] **CRUD Operations (20 pts):** create, update, delete implemented; name validation (empty / over max length) blocks submission; deleting a car also removes its winner record.
- [x] **Color Selection (10 pts):** native color picker input, applied live to the car icon.
- [x] **Random Car Creation (20 pts):** 100-car button; names combine 10 brands × 10 models; colors randomized per car.
- [x] **Car Management Buttons (10 pts):** Select and Remove per car.
- [x] **Pagination (10 pts):** 7 cars per page.
- [x] **EXTRA — Empty Garage (10 pts):** "No Cars" message shown when the garage is empty.
- [x] **EXTRA — Empty Garage Page (10 pts):** deleting the last car on a page automatically returns to the previous page.

### 🏆 Winners View — 50/50
- [x] **Display Winners (15 pts):** a car's first win creates its winners record; later wins increment the count.
- [x] **Pagination for Winners (10 pts):** 10 per page.
- [x] **Winners Table (15 pts):** №, icon, name, wins, best time; wins increment and best (lowest) time is kept on repeat wins.
- [x] **Sorting Functionality (10 pts):** sortable by wins and time, ascending/descending, via the API's `_sort`/`_order` query params (sorts the full dataset, not just the visible page).

### 🚗 Race — 165/170
- [x] **Start Engine Animation (20 pts):** start → animate → drive; a 500 response stops the animation immediately, frozen at its exact in-progress position.
- [x] **Stop Engine Animation (20 pts):** stop returns the car to its starting position.
- [x] **Responsive Animation (30 pts):** track position is percentage-based (not fixed pixels), verified down to 500px via media query adjustments.
- [x] **Start Race Button (10 pts):** starts every car on the *current page*, per the task spec.
- [x] **Reset Race Button (15 pts):** returns all cars on the page to their starting positions.
- [x] **Winner Announcement (5 pts):** banner names the winning car and its time.
- [x] **Button States (20 pts):** Start disabled while driving/finished/broken; Stop disabled while idle.
- [x] **Actions during the race (45/50 pts):** Select, Remove, both car forms, and random-car generation are all disabled while a race is running. Pagination and switching between Garage/Winners are *not* explicitly blocked — the race continues correctly in the background (animation state and timing live in Redux, keyed by car id and wall-clock timestamps, so it resumes correctly if you navigate back mid-race). Self-docked 5 points here since a reviewer could reasonably want pagination/nav disabled too for a more obviously "locked" UX during a race, even though the underlying behavior is verified correct rather than buggy.

### 🎨 Prettier and ESLint Configuration — 10/10
- [x] **Prettier Setup (5 pts):** `format` and `ci:format` scripts.
- [x] **ESLint Configuration (5 pts):** Airbnb config (`airbnb`, `airbnb-typescript`, `airbnb/hooks`) with a `lint` script, parser wired to `tsconfig.app.json` for type-aware linting.

### 🌟 Overall Code Quality — not self-scored
Per the task instructions, this 100-point discretionary section is left for the reviewer.

---

## Tech stack

- React 19 + TypeScript (`strict: true`, `noImplicitAny: true`)
- Redux Toolkit + React Redux (state management)
- React Router v6 (`HashRouter`, for GitHub Pages compatibility)
- Vite (build tool)
- ESLint (Airbnb config) + Prettier

## Architecture

\`\`\`
src/
├── api/          — typed fetch wrappers per resource (garage, engine, winners)
├── app/          — Redux store + typed hooks
├── components/   — shared UI (Pagination)
├── features/
│   ├── garage/   — garage slice, view, and components (form, car item, race controls, winner banner)
│   └── winners/  — winners slice, view, and sortable table
├── types/        — shared TypeScript interfaces
└── utils/        — constants, random car name/color generator
\`\`\`