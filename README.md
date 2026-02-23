<div align="center">

# jsFun v2

**An interactive coding exercise platform built for classrooms without internet.**

610 exercises across JavaScript, HTML, and CSS — with a built-in code editor, instant test feedback, and progress tracking. Designed for students in offline environments where every tool needs to work without a network connection.

[![Tests](https://img.shields.io/badge/tests-410%20passing-34d399)](tests/) [![Exercises](https://img.shields.io/badge/exercises-610-818cf8)](exercises/) [![License](https://img.shields.io/badge/license-MIT-60a5fa)](#)

</div>

---

## Why This Exists

Some classrooms don't have internet. Students in correctional education programs often work on air-gapped networks with no access to CodePen, freeCodeCamp, or any browser-based coding tool. **jsFun** fills that gap — a fully self-contained platform that runs from `npm start` with zero external dependencies at runtime.

This is a **proof-of-concept** built to validate the platform design, exercise format, and pedagogical approach before investing in a production version. The goal is to answer one question: *can incarcerated students learn to code with a tool like this?*

## How It Works: Instructor to Student

jsFun is designed around an offline classroom where the instructor manages a local network and students each work on their own machine.

### Instructor Setup

The instructor maintains a local server running [Gitea](https://gitea.io/) (self-hosted git) and [Verdaccio](https://verdaccio.org/) (offline npm registry). This is the backbone — no outside internet required.

1. **Publish the package** to the local Verdaccio registry so students can install it
2. **Run `npm run setup-admin`** to set a password that protects the admin panel
3. **Push the repo** to Gitea so each student can clone their own copy

The admin panel (`/admin`) lets instructors add new exercises on the fly through a form — no JSON editing required. This is intentional: if a student is stuck on a concept, the instructor can create a targeted exercise during class and have it available immediately.

### Student Workflow

1. Clone the repo from Gitea: `git clone http://gitea-server/instructor/jsfun.git`
2. Run `npm run setup` — installs dependencies and prompts for their name
3. Run `npm start` — opens the platform at `http://localhost:3000`
4. Browse exercises, write code, press `Ctrl+Enter` to test
5. Run `npm run push` when ready to share progress

That last command is key — it syncs their completion stats into the README (the progress report at the bottom of this file), commits, and pushes to Gitea. The instructor can then review every student's progress through Gitea's web UI without needing to visit each machine.

### The Data Separation Trick

Student data (`user-data/`) is **gitignored**. Exercise data (`exercises/`) is **git-tracked**. This means:

- The instructor can `git push` new exercises and students `git pull` to receive them — **without losing any student progress**
- Each student's solutions, attempt counts, and completion status stay local and safe
- The only thing that flows upstream is the README progress report

```
exercises/                    git-tracked (instructor manages)
  collections/                Exercise source files (per-collection JSON)
  categories.json             Category tree (12 topics, 45+ subtopics)
  exercises.json              Merged output (built from collections)

user-data/                    gitignored (student data stays safe)
  progress.json               Completion status, attempt counts, saved code
  solutions/                  Individual solution files

admin.config.json             gitignored (bcrypt password hash)
```

## Features

- **Code editor** powered by CodeMirror 6 with syntax highlighting, auto-indent, and keyboard shortcuts
- **Instant test feedback** — press `Ctrl+Enter` to run tests in a sandboxed Web Worker (JS) or iframe (HTML/CSS)
- **Progressive hints** that unlock after 3, 6, and 9 unique attempts — solutions unlock after 10
- **5-tier difficulty system** from guided fill-in-the-blank to empty editor
- **Dark, light, and high-contrast themes** with full keyboard navigation and ARIA support
- **Offline-first** — no CDN, no API calls, no external dependencies at runtime
- **Auto-save** — code saves as you type, progress persists across sessions
- **Admin panel** for teachers to add exercises during class without touching JSON files
- **Progress dashboard** with completion stats by tier, type, topic, and collection
- **Guided tutorial** for first-time users with a spotlight walkthrough
- **Duplicate detection** — resubmitting the same code doesn't count as a new attempt (djb2 hash)
- **Error boundaries** — if a component crashes, students see a recovery UI instead of a white screen

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| **Frontend** | React 18 + TypeScript | Strong typing catches bugs before they reach students who can't Google the error |
| **Bundler** | Vite 5 | Fast HMR for development, clean production builds |
| **State** | Redux Toolkit | Predictable state management with async thunks for API calls |
| **Routing** | React Router v6 | SPA navigation between browse, exercise, dashboard, and admin views |
| **Editor** | CodeMirror 6 | Extensible, accessible code editor with syntax highlighting and keybindings |
| **Styling** | Tailwind CSS + CSS custom properties | Utility-first layout with theme variables — no component library, all custom UI |
| **Server** | Express (CommonJS) | Simple file-based JSON API — no database, no ORM, no migrations |
| **Testing** | Vitest + Testing Library + Playwright | 410 unit/component tests + E2E browser tests |
| **Linting** | ESLint 9 (flat config) + Prettier | Consistent code quality across the project |

### Why These Choices

The stack is deliberately **boring and self-contained**. Every dependency ships in `node_modules` — there are no runtime network requests, no CDN links, no fonts loaded from Google. The Express server reads and writes flat JSON files instead of a database because `npm install && npm start` needs to be the entire setup process. Students and instructors shouldn't need to configure Postgres or run Docker.

CodeMirror 6 was chosen over Monaco (VS Code's editor) because it's lighter, more accessible out of the box, and doesn't require web workers for syntax highlighting — important when you're running on older hardware in a constrained environment.

## Exercise Library

> **610 exercises** organized across 12 topics, 8 curated collections, and 5 difficulty tiers.

| Collection | Exercises | Focus |
|------------|:---------:|-------|
| Default Curriculum | 148 | Core JS fundamentals, data structures, functions |
| CSS Modern Toolkit | 40 | Flexbox, grid, selectors, responsive design |
| Exercism | 54 | Algorithm challenges adapted for offline use |
| Interview Classics | 55 | Common whiteboard problems |
| The Odin Project | 29 | Web development foundations |
| Rithm Interview Prep | 45 | Technical interview patterns |
| RPG Questline | 45 | Gamified exercises with a fantasy narrative |
| Turing Foundations | 35 | Bootcamp-style fundamentals |

### Difficulty Tiers

| Tier | Name | What you get |
|:----:|------|--------------|
| I | **Spark** | Full skeleton with blanks to fill in |
| II | **Foundations** | Function signature provided |
| III | **Builder** | Partial structure with hints in comments |
| IV | **Architect** | Just comment prompts — you design the approach |
| V | **Mastercraft** | Empty editor — build everything from scratch |

### Exercise Types

| Type | How it works |
|------|-------------|
| **JS** | Your code is evaluated by a test runner function in a sandboxed Web Worker with a 5-second timeout |
| **HTML** | Your markup is parsed into a detached DOM and tested with assertion queries (exists, textContains, hasClass, etc.) |
| **CSS** | Your styles are injected into a hidden iframe and validated against computed style assertions |
| **HTML+CSS** | Dual editors — both HTML structure and CSS styling are tested together |

## What's Working

- Full exercise platform with browse, solve, and dashboard views
- All 4 exercise types (JS, HTML, CSS, HTML+CSS) with sandboxed test execution
- Progressive hint/solution gating that rewards genuine effort over brute force
- 3 accessible themes with keyboard navigation throughout
- Admin panel for on-the-fly exercise creation
- Auto-save, progress tracking, and the `npm run push` workflow for progress sharing
- 410 tests passing across unit, component, and E2E layers
- Clean production build under 800KB gzipped

## Known Limitations

- **Single-user per clone** — each `git clone` is one student's workspace. There are no user accounts or authentication beyond the admin password.
- **No real-time sync** — students push progress manually with `npm run push`. There's no live dashboard for instructors to watch in real time.
- **File-based storage** — the JSON flat-file approach works for a proof-of-concept but wouldn't scale to hundreds of concurrent users.
- **No exercise versioning** — if an exercise is edited after a student has started it, their saved code may not match the updated instructions.
- **Limited error reporting** — when a student's JS code crashes, the error message comes from a sandboxed context and can be cryptic.

## Future Considerations

These are ideas validated by this proof-of-concept that would shape a production version:

- **Multi-user server** with real authentication, so one classroom server can handle all students without individual clones
- **Instructor dashboard** with live progress visibility across the class — who's stuck, who's ahead, where the class clusters
- **Exercise versioning and diffing** so updates don't break in-progress work
- **Peer code review** — students review each other's solutions after completing an exercise
- **Custom collection builder** for instructors to curate exercise sets for specific lessons or skill levels
- **Offline-first PWA** so students could potentially work on tablets or Chromebooks without Node.js
- **Analytics and learning insights** — which exercises have the highest failure rates, where students spend the most time, common mistake patterns

## Quick Start

```bash
npm run setup          # Install dependencies + prompt for student name
npm run setup-admin    # Set the admin password (teachers only)
npm start              # Launch at http://localhost:3000
```

For development with hot reload:

```bash
npm run dev            # Vite frontend on :5173
npm run dev:server     # Express API on :3001 (separate terminal)
```

## Scripts Reference

| Command | What it does |
|---------|-------------|
| `npm start` | Production server on `:3000` |
| `npm run dev` | Vite dev server with HMR |
| `npm run dev:server` | Express API in dev mode |
| `npm test` | Run all 410 unit/component tests |
| `npm run test:e2e` | Run Playwright browser tests |
| `npm run build` | Production build |
| `npm run build:exercises` | Merge collection files into `exercises.json` |
| `npm run setup` | First-time student onboarding |
| `npm run setup-admin` | Set or reset admin password |
| `npm run push` | Sync progress to README, commit, and push |
| `npm run lint` | ESLint (flat config) |
| `npm run format` | Prettier |

## Adding Exercises

**Via the admin panel:** Navigate to `/admin`, log in, fill out the form. The exercise is appended to `exercises.json` immediately — no restart needed.

**Via collection files:** Add an exercise object to a JSON file in `exercises/collections/`, then run `npm run build:exercises` to merge. This is the preferred workflow for bulk additions or importing from external sources.

## Project Structure

```
src/
  components/
    admin/       Login form + exercise creation
    browse/      Exercise cards, search, filters, category navigation
    dashboard/   Progress stats, score cards, tier/type breakdowns
    exercise/    Code editor, test runner, hints, solution reveal
    shared/      Header, Toast, ErrorBoundary, Tutorial, HelpModal
  features/      Redux slices (exercises, progress, ui, admin)
  runners/       JS/HTML/CSS test execution (Web Workers + iframes)
  hooks/         useTutorial
  utils/         Helpers, celebration messages
  types/         TypeScript interfaces, tier/type metadata

server/          Express API (file-based JSON storage)
scripts/         Setup, build, validation, and import utilities
tests/           Unit, component, and E2E tests
exercises/       Exercise data and collection files
```

---

<!-- PROGRESS_START -->

## Progress Report

**Student:** Unknown
**Updated:** 2/21/2026, 1:05:06 PM
**Started:** Invalid Date

### Overall

**0 / 610 exercises complete (0%)**

`[░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 0%`

### By Tier

| Tier | Name | Done | Total | % |
|------|------|-----:|------:|--:|
| 1 | Spark | 0 | 77 | 0% |
| 2 | Foundations | 0 | 221 | 0% |
| 3 | Builder | 0 | 183 | 0% |
| 4 | Architect | 0 | 101 | 0% |
| 5 | Mastercraft | 0 | 28 | 0% |

### By Type

| Type | Done | Total | % |
|------|-----:|------:|--:|
| JS | 0 | 469 | 0% |
| HTML | 0 | 20 | 0% |
| CSS | 0 | 101 | 0% |
| HTML-CSS | 0 | 20 | 0% |

### By Collection

| Collection | Done | Total | % |
|------------|-----:|------:|--:|
| CSS Modern Toolkit | 0 | 40 | 0% |
| Default Curriculum | 0 | 148 | 0% |
| Exercism | 0 | 54 | 0% |
| Interview Classics | 0 | 55 | 0% |
| The Odin Project | 0 | 29 | 0% |
| Rithm Interview Prep | 0 | 45 | 0% |
| RPG Questline: Swords & Sorcery | 0 | 45 | 0% |
| Turing Foundations | 0 | 35 | 0% |

### By Topic

| Topic | Done | Total | % |
|-------|-----:|------:|--:|
| JS Fundamentals | 0 | 135 | 0% |
| Data Structures | 0 | 154 | 0% |
| Functions | 0 | 32 | 0% |
| ES6+ | 0 | 41 | 0% |
| HTML | 0 | 24 | 0% |
| CSS | 0 | 117 | 0% |
| Syntax Translation | 0 | 16 | 0% |
| Algorithms | 0 | 56 | 0% |
| Regex | 0 | 10 | 0% |
| DOM Manipulation | 0 | 9 | 0% |
| Testing | 0 | 8 | 0% |
| Web APIs | 0 | 8 | 0% |

<!-- PROGRESS_END -->
