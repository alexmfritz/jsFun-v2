import { render, RenderOptions } from '@testing-library/react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import exercisesReducer from '../../src/features/exercisesSlice';
import progressReducer from '../../src/features/progressSlice';
import uiReducer from '../../src/features/uiSlice';
import adminReducer from '../../src/features/adminSlice';
import type { RootState } from '../../src/features/store';
import type { Exercise, Collection, Category } from '../../src/types';
import type { ReactElement } from 'react';

// ─── Test data factories ─────────────────────────────────────────────────────

/** Create a minimal exercise with sensible defaults. Override any field. */
export function makeExercise(overrides: Partial<Exercise> = {}): Exercise {
  return {
    id: 1,
    title: 'Test Exercise',
    type: 'js',
    tier: 1,
    category: ['js-fundamentals'],
    tags: ['arrays'],
    description: 'A test exercise',
    instructions: '## Instructions\n\nWrite a function.',
    starterCode: 'function solve() {}',
    solution: 'function solve() { return 42; }',
    testRunner: '() => [{ pass: true, description: "passes" }]',
    resources: [],
    ...overrides,
  };
}

/** Create a minimal collection with sensible defaults. */
export function makeCollection(overrides: Partial<Collection> = {}): Collection {
  return {
    id: 'test-collection',
    name: 'Test Collection',
    description: 'A test collection',
    exerciseIds: [1, 2, 3],
    ...overrides,
  };
}

// ─── Store factory ───────────────────────────────────────────────────────────

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Default initial state for each slice (mirrors slice initialState) */
const DEFAULT_STATE: RootState = {
  exercises: { exercises: [], categories: {}, collections: [], loading: false, error: null },
  progress: {
    studentName: '', completedExercises: {}, savedSolutions: {}, attempts: {},
    uniqueAttempts: {}, failedCodeHashes: {}, createdAt: '', lastUpdated: undefined,
    loading: false, error: null,
  },
  ui: {
    theme: 'dark', browseFilter: { search: '', tags: [], tier: null, collectionId: null, categoryPath: [] },
    activeView: 'browse', toast: null, saveStatus: 'idle', showHelpModal: false, statusSort: 'default', serverReachable: true,
  },
  admin: { isAuthenticated: false, error: null },
};

/** Deep merge two objects (source wins for leaf values). */
function deepMerge<T extends Record<string, unknown>>(target: T, source: DeepPartial<T>): T {
  const result = { ...target };
  for (const key of Object.keys(source) as (keyof T)[]) {
    const sv = source[key];
    const tv = target[key];
    if (sv && typeof sv === 'object' && !Array.isArray(sv) && tv && typeof tv === 'object' && !Array.isArray(tv)) {
      result[key] = deepMerge(tv as Record<string, unknown>, sv as DeepPartial<Record<string, unknown>>) as T[keyof T];
    } else if (sv !== undefined) {
      result[key] = sv as T[keyof T];
    }
  }
  return result;
}

/** Create a test store with optional preloaded state overrides (deep-merged). */
export function createTestStore(preloadedState?: DeepPartial<RootState>): EnhancedStore {
  const merged = preloadedState
    ? deepMerge(DEFAULT_STATE, preloadedState)
    : DEFAULT_STATE;
  return configureStore({
    reducer: {
      exercises: exercisesReducer,
      progress: progressReducer,
      ui: uiReducer,
      admin: adminReducer,
    },
    preloadedState: merged,
  });
}

// ─── Render helpers ──────────────────────────────────────────────────────────

interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: DeepPartial<RootState>;
  store?: EnhancedStore;
  /** Initial route entries for MemoryRouter (default: ['/']) */
  route?: string;
}

/**
 * Render a component wrapped with Redux Provider and React Router MemoryRouter.
 * Returns the render result plus the store for state assertions.
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = createTestStore(preloadedState),
    route = '/',
    ...renderOptions
  }: RenderWithProvidersOptions = {},
) {
  const result = render(ui, {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    ),
    ...renderOptions,
  });

  return { ...result, store };
}
