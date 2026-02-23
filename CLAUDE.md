# CLAUDE.md — jsFun v2

Project context for AI-assisted development.

## What This Is

Interactive coding exercise platform for incarcerated students with limited/no internet access. Deployed on an offline classroom network using Verdaccio (npm registry) + Gitea (git hosting). Each student clones their own copy, works locally, and pushes progress to Gitea where teachers review via the web UI.

**This is a proof-of-concept.** The goal is to validate the platform design, exercise format, and pedagogical approach before building a production version.

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Frontend | React 18 + TypeScript | Strong typing, component model |
| Bundler | Vite 5 | Fast HMR, built-in proxy |
| State | Redux Toolkit | Predictable state, async thunks |
| Routing | React Router v6 | SPA navigation |
| Editor | CodeMirror 6 | Extensible, accessible code editor |
| Styling | Tailwind CSS + CSS variables | Utility-first with theme support |
| Server | Express (CommonJS) | Simple file-based API |
| Testing | Vitest + Playwright + Testing Library | Unit/component/E2E coverage |
| Linting | ESLint 9 (flat config) + Prettier | Code quality |

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin login + exercise creation
│   ├── browse/         # Exercise browsing, cards, filters
│   ├── dashboard/      # Progress stats, score cards
│   ├── exercise/       # Exercise view, editor, test runner, hints
│   └── shared/         # Header, ErrorBoundary, Toast, Tutorial, etc.
├── features/           # Redux slices (exercises, progress, ui, admin) + store
├── runners/            # JS/HTML/CSS test execution (Web Workers, iframes)
├── types/              # TypeScript interfaces, constants, tier/type metadata
├── hooks/              # Custom hooks (useTutorial)
├── utils/              # Utility functions, celebration messages
├── App.tsx             # Root component, routing
├── main.tsx            # Entry point
└── index.css           # Theme variables, base styles, CodeMirror overrides

exercises/
├── categories.json     # Category tree (12 topics, 45+ subtopics)
├── collections/        # Per-collection exercise files (authoring format)
│   ├── <id>.json       # Visible collection: metadata + exercises
│   ├── _meta.json      # Hidden collection metadata (ID groupings)
│   └── _uncollected.json # Exercises not in any visible collection
└── exercises.json      # Merged output (built from collections, read at runtime)

server/index.cjs        # Express API (CommonJS, file-based JSON storage)
scripts/                # Build, setup, and utility scripts
tests/                  # Unit, component, and E2E tests
```

## Key Commands

```bash
npm run dev              # Vite dev server (:5173)
npm run dev:server       # Express API (:3001, run in second terminal)
npm start                # Production server (:3000, serves dist/)
npm test                 # Vitest unit/component tests
npm run test:e2e         # Playwright E2E tests
npm run lint             # ESLint (flat config)
npm run build:exercises  # Merge collection files → exercises.json
npm run sync-progress    # Update README with progress stats
```

## Exercise Data Model

Exercises are authored in per-collection JSON files under `exercises/collections/`. The build script (`scripts/build-exercises.cjs`) merges them into `exercises/exercises.json` which the app reads at runtime.

### Exercise Schema

```typescript
interface Exercise {
  id: number;              // Unique ID (auto-increment)
  title: string;
  type: 'js' | 'html' | 'css' | 'html-css';
  tier: 1 | 2 | 3 | 4 | 5;
  category: string[];      // Path: ["js-fundamentals", "operators"]
  tags: string[];
  description: string;     // One-liner for browse cards
  instructions: string;    // Full problem statement (supports markdown-lite)
  starterCode: string;     // Template code (empty string for Tier 5)
  solution: string;        // Reference solution
  testRunner: string;      // JS: function-as-string. HTML/CSS: empty string
  testCases?: TestCase[];  // HTML/CSS: DOM assertion objects
  providedHtml?: string;   // CSS exercises: HTML to render
  hints?: string[];        // 0-3 progressive hints
  resources: Resource[];   // Reference links
  solutionGate?: number;   // Override default (10) unique attempts to unlock solution
}
```

### Exercise Types

- **JS**: `testRunner` is an arrow function string `(code) => [...]` that returns test results. Executed in a Web Worker with 5s timeout.
- **HTML**: `testCases` are DOM assertion objects. Rendered in a sandboxed iframe.
- **CSS**: `testCases` check computed styles. `providedHtml` is the markup to style.
- **HTML+CSS**: Combined editors, both HTML assertions and CSS style checks.

### Tier System (Scaffolding)

| Tier | Name | Scaffolding Level |
|------|------|-------------------|
| 1 | Spark | Full skeleton provided, fill in blanks |
| 2 | Foundations | Function signature only |
| 3 | Builder | Partial skeleton with structure hints |
| 4 | Architect | Comment prompts only |
| 5 | Mastercraft | Empty editor, no scaffolding |

### Hint/Solution Gating

- Hints unlock at 3, 6, 9 **unique** attempts (duplicate code doesn't count)
- Solution unlocks at 10 unique attempts (or custom `solutionGate`)
- Duplicate detection uses djb2 hash of submitted code

## Collection File Format

Each visible collection is a JSON file in `exercises/collections/`:

```json
{
  "id": "collection-slug",
  "name": "Display Name",
  "description": "What this collection covers",
  "exerciseIds": [1, 2, 3],     // Full list of IDs (may cross-reference other collections)
  "exercises": [ ... ],          // Exercise objects this file "owns"
  "color": "#hex",               // Optional
  "source": "Attribution Name",  // Optional
  "license": "MIT"               // Optional
}
```

**Ownership rule**: Each exercise is defined in exactly one collection file. If a collection references exercises from another collection, those IDs appear in `exerciseIds` but not in `exercises`.

Run `npm run build:exercises` after editing any collection file.

## Adding New Exercises

1. Choose or create a collection file in `exercises/collections/`
2. Add the exercise object to the `exercises` array with a unique `id` (use the next available integer)
3. Add the `id` to the `exerciseIds` array
4. Run `npm run build:exercises` to merge
5. Restart the server to pick up changes

For new collections, create `exercises/collections/<slug>.json` with the format above. Add the collection to the build by convention — the build script auto-discovers all non-`_` prefixed JSON files.

## Data Separation (Critical)

Student data is **gitignored** and survives `git pull`:
- `user-data/progress.json` — completion status, attempt counts, saved code
- `user-data/solutions/` — individual solution files
- `admin.config.json` — bcrypt password hash

Exercise data is **git-tracked** (teacher manages):
- `exercises/` — all exercise and collection files

This separation allows teachers to push exercise updates without overwriting student progress.

## Server Architecture

Express server (`server/index.cjs`) in CommonJS. Reads `.env` for port configuration.

**API Endpoints:**
- `GET /api/exercises` — all exercise data (from exercises.json)
- `GET /api/progress` — student progress
- `POST /api/progress/solution` — auto-save code
- `POST /api/progress/complete` — mark exercise complete
- `POST /api/progress/attempt` — increment attempt count
- `POST /api/progress/reset` — reset exercise progress
- `POST /api/admin/login` — admin authentication (bcrypt, rate-limited)
- `POST /api/admin/exercises` — add exercise (requires admin password)

## Environment Configuration

Copy `.env.example` to `.env` to customize ports:
- `PORT` — production server (default: 3000)
- `VITE_DEV_PORT` — Vite dev server (default: 5173)
- `VITE_API_PORT` — Express API in dev mode (default: 3001)

## Testing Conventions

- **Unit tests**: `tests/unit/` — Redux slices, utilities, runners
- **Component tests**: `tests/components/` — React components with Testing Library
- **E2E tests**: `tests/e2e/` — Playwright browser tests
- **Test setup**: `tests/setup.ts` imports `@testing-library/jest-dom`
- All tests use Vitest globals (`describe`, `it`, `expect` — no imports needed)
- Components are tested with Redux store mocking via `configureStore`

Run `npm test` before committing. All 410 tests should pass.

## Styling Conventions

- **Theme**: 3 themes via CSS variables (dark default, light, high-contrast)
- **Colors**: Use `var(--text-primary)`, `var(--bg-surface)`, etc. — never hardcode colors
- **Fonts**: System font stacks — body uses monospace, headings use 'Lexend' with sans-serif fallback
- **Layout**: Tailwind utilities + inline styles for theme variables
- **No component library** — all UI is custom

## Design Principles

1. **Offline-first**: No CDN dependencies, no external API calls, self-contained
2. **Student data safety**: Gitignored user-data survives updates
3. **Progressive difficulty**: 5-tier scaffolding system
4. **Earned help**: Hints and solutions gate behind genuine attempts
5. **Accessible**: Skip links, ARIA labels, keyboard navigation, high-contrast theme
6. **Simple deployment**: `npm install && npm start` — no database, no Docker

## Common Pitfalls

- **Exercise IDs must be globally unique** across all collection files
- **`testRunner` for JS exercises** is an arrow function string, not a raw function — it gets `eval()`'d
- **HTML/CSS exercises use `testCases`**, not `testRunner` — the test runner string should be `""`
- **The server is CommonJS** (`index.cjs`) — it can't use ESM imports
- **Git hooks**: The `postinstall` script installs a pre-commit hook that syncs progress to README. It may fail in worktrees (`.git` is a file, not a directory).
- **Collection ownership**: When splitting exercises across files, each exercise object must exist in exactly one file. Cross-references use `exerciseIds` only.
