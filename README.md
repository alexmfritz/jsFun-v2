<div align="center">

# jsFun v2

**An interactive coding exercise platform built for classrooms without internet.**

610 exercises across JavaScript, HTML, and CSS — with a built-in code editor, instant test feedback, and progress tracking. Designed for students in offline environments where every tool needs to work without a network connection.

[![Tests](https://img.shields.io/badge/tests-410%20passing-34d399)](tests/) [![Exercises](https://img.shields.io/badge/exercises-610-818cf8)](exercises/) [![License](https://img.shields.io/badge/license-MIT-60a5fa)](#)

</div>

---

## Why This Exists

Some classrooms don't have internet. Students in correctional education programs often work on air-gapped networks with no access to CodePen, freeCodeCamp, or any browser-based coding tool. **jsFun** fills that gap — a fully self-contained platform that runs from `npm start` with zero external dependencies at runtime.

Each student clones their own copy, works at their own pace, and pushes progress to a local Gitea server where teachers can review work through a web UI.

## Features

- **Code editor** powered by CodeMirror 6 with syntax highlighting, auto-indent, and keyboard shortcuts
- **Instant test feedback** — press `Ctrl+Enter` to run tests in a sandboxed Web Worker (JS) or iframe (HTML/CSS)
- **Progressive hints** that unlock after 3, 6, and 9 unique attempts — solutions unlock after 10
- **5-tier difficulty system** from guided fill-in-the-blank to empty editor
- **Dark, light, and high-contrast themes** with full keyboard navigation
- **Offline-first** — no CDN, no API calls, no external dependencies
- **Auto-save** — code saves as you type, progress persists across sessions
- **Admin panel** for teachers to add exercises without touching JSON files
- **Progress dashboard** with completion stats by tier, type, topic, and collection
- **Guided tutorial** for first-time users with spotlight walkthrough

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
| **JS** | Your code is evaluated by a test runner function in a sandboxed Web Worker |
| **HTML** | Your markup is rendered in a detached DOM and tested with assertion queries |
| **CSS** | Your styles are applied in a hidden iframe and checked with computed style assertions |
| **HTML+CSS** | Dual editors — both HTML structure and CSS styling are tested together |

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

## Tech Stack

| | |
|---|---|
| **Frontend** | React 18, TypeScript, Vite 5 |
| **Styling** | Tailwind CSS + CSS custom properties (no component library) |
| **State** | Redux Toolkit |
| **Editor** | CodeMirror 6 |
| **Server** | Express (CommonJS, file-based JSON storage) |
| **Testing** | Vitest (410 unit/component tests) + Playwright (E2E) |

## How Data Works

Student progress is **gitignored** — it survives `git pull` so teachers can push exercise updates without wiping anyone's work.

```
exercises/
  collections/         Exercise source files (per-collection JSON)
  categories.json      Category tree (12 topics, 45+ subtopics)
  exercises.json       Merged output (built from collections, git-tracked)

user-data/             ** gitignored **
  progress.json        Completion status, attempt counts, saved code
  solutions/           Individual solution files

admin.config.json      ** gitignored ** (bcrypt password hash)
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

**Via the admin panel:** Navigate to `/admin`, log in, fill out the form. The exercise is appended to `exercises.json` immediately.

**Via collection files:** Add an exercise object to a JSON file in `exercises/collections/`, then run `npm run build:exercises` to merge. This is the preferred workflow for bulk additions.

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
