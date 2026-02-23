# jsFun v2

Interactive coding exercise platform for students with limited internet access.
Built for classroom environments using Verdaccio (offline npm) + Gitea (local git).

## Quick Start

```bash
npm run setup          # Install deps, prompt for student name
npm run setup-admin    # Set admin password (teacher)
npm start              # Launch on http://localhost:3000
```

For development (hot reload):
```bash
npm run dev            # Vite frontend on :5173
npm run dev:server     # Express API on :3001 (in second terminal)
```

## Architecture

| Layer | Tool |
|-------|------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS (no component library) |
| State | Redux Toolkit |
| Routing | React Router v6 |
| Editor | CodeMirror 6 |
| Server | Express (CommonJS) |
| Tests | Vitest + Playwright |

## Data Separation

**Critical:** Student data is gitignored and survives `git pull`.

```
exercises/collections/     ← per-collection exercise files (authoring format)
exercises/categories.json  ← category tree
exercises/exercises.json   ← merged file (built from collections, git-tracked)
user-data/progress.json    ← gitignored (student data safe)
user-data/solutions/       ← gitignored (individual solution files)
admin.config.json          ← gitignored (bcrypt password hash)
```

## npm Scripts

| Script | Purpose |
|--------|---------|
| `npm run setup` | First-time student setup |
| `npm run setup-admin` | Set/reset admin password |
| `npm run dev` | Start Vite dev server |
| `npm run dev:server` | Start Express API in dev mode |
| `npm run build` | Build for production |
| `npm run build:exercises` | Merge collection files into exercises.json |
| `npm start` | Run production server |
| `npm run push` | Sync progress → commit → push |
| `npm test` | Run unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run lint` | Lint source |
| `npm run format` | Format source |

## Exercise Types

- **JS** — Test runner function evaluated client-side
- **HTML** — DOM assertion tests on rendered markup
- **CSS** — Computed style checks in hidden iframe
- **HTML+CSS** — Combined HTML and CSS editors with both test types

## Tier System

| Tier | Name | Description |
|------|------|-------------|
| I | Spark | Full skeleton provided |
| II | Foundations | Function signature only |
| III | Builder | Partial skeleton |
| IV | Architect | Comment prompts only |
| V | Mastercraft | Empty editor |

## Adding Exercises

Option 1 — Admin panel: navigate to `/admin`, log in, fill out the form.

Option 2 — Edit a collection file in `exercises/collections/`, then run `npm run build:exercises` to merge.

---

<!-- PROGRESS_START -->

## 📊 Progress Report

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
