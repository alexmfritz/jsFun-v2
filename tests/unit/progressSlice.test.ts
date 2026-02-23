import { describe, it, expect } from 'vitest';
import progressReducer, {
  setStudentName,
  recordFailedAttempt,
  recordPassedAttempt,
  hashCode,
  selectIsComplete,
  selectUniqueAttempts,
  selectSavedSolution,
  selectIsDuplicateCode,
  selectCompletedCount,
  selectAttempts,
  fetchProgress,
  saveSolution,
  markComplete,
  incrementAttempt,
  resetExercise,
} from '../../src/features/progressSlice';
import { ProgressState } from '../../src/types';

const makeInitial = (overrides: Partial<ProgressState> = {}): ProgressState => ({
  studentName: '',
  completedExercises: {},
  savedSolutions: {},
  attempts: {},
  uniqueAttempts: {},
  failedCodeHashes: {},
  createdAt: '',
  lastUpdated: undefined,
  loading: false,
  error: null,
  ...overrides,
});

// ─── hashCode ──────────────────────────────────────────────────────────────────

describe('hashCode', () => {
  it('returns consistent hash for same input', () => {
    expect(hashCode('hello world')).toBe(hashCode('hello world'));
  });

  it('returns different hashes for different inputs', () => {
    expect(hashCode('hello')).not.toBe(hashCode('world'));
  });

  it('returns a string', () => {
    expect(typeof hashCode('test')).toBe('string');
  });
});

// ─── Sync reducers ─────────────────────────────────────────────────────────────

describe('setStudentName', () => {
  it('sets the student name', () => {
    const state = progressReducer(makeInitial(), setStudentName('Alex'));
    expect(state.studentName).toBe('Alex');
  });
});

describe('recordFailedAttempt', () => {
  it('adds hash and increments uniqueAttempts on first failure', () => {
    const state = progressReducer(
      makeInitial(),
      recordFailedAttempt({ exerciseId: 1, code: 'const x = 1;' })
    );
    expect(state.failedCodeHashes['1']).toHaveLength(1);
    expect(state.uniqueAttempts['1']).toBe(1);
  });

  it('increments uniqueAttempts for different code', () => {
    let state = progressReducer(
      makeInitial(),
      recordFailedAttempt({ exerciseId: 1, code: 'attempt 1' })
    );
    state = progressReducer(
      state,
      recordFailedAttempt({ exerciseId: 1, code: 'attempt 2' })
    );
    expect(state.failedCodeHashes['1']).toHaveLength(2);
    expect(state.uniqueAttempts['1']).toBe(2);
  });

  it('does NOT increment uniqueAttempts for duplicate code', () => {
    let state = progressReducer(
      makeInitial(),
      recordFailedAttempt({ exerciseId: 1, code: 'same code' })
    );
    state = progressReducer(
      state,
      recordFailedAttempt({ exerciseId: 1, code: 'same code' })
    );
    expect(state.failedCodeHashes['1']).toHaveLength(1);
    expect(state.uniqueAttempts['1']).toBe(1);
  });

  it('trims whitespace before hashing', () => {
    let state = progressReducer(
      makeInitial(),
      recordFailedAttempt({ exerciseId: 1, code: '  code  ' })
    );
    state = progressReducer(
      state,
      recordFailedAttempt({ exerciseId: 1, code: 'code' })
    );
    // Trimmed versions are the same so it should only count once
    expect(state.uniqueAttempts['1']).toBe(1);
  });
});

describe('recordPassedAttempt', () => {
  it('increments uniqueAttempts', () => {
    const state = progressReducer(
      makeInitial(),
      recordPassedAttempt({ exerciseId: 5 })
    );
    expect(state.uniqueAttempts['5']).toBe(1);
  });

  it('increments from existing count', () => {
    const initial = makeInitial({ uniqueAttempts: { '5': 3 } });
    const state = progressReducer(initial, recordPassedAttempt({ exerciseId: 5 }));
    expect(state.uniqueAttempts['5']).toBe(4);
  });
});

// ─── Extra reducers (async thunks) ─────────────────────────────────────────────

describe('fetchProgress.fulfilled', () => {
  it('merges server data into state', () => {
    const action = {
      type: fetchProgress.fulfilled.type,
      payload: {
        studentName: 'Taylor',
        completedExercises: { '1': { completedAt: '2024-01-01', attempts: 3 } },
        savedSolutions: { '1': 'code here' },
        attempts: { '1': 5 },
        createdAt: '2024-01-01',
      },
    };
    const state = progressReducer(makeInitial(), action);
    expect(state.studentName).toBe('Taylor');
    expect(state.completedExercises['1'].attempts).toBe(3);
    expect(state.savedSolutions['1']).toBe('code here');
    expect(state.loading).toBe(false);
  });
});

describe('fetchProgress.pending', () => {
  it('sets loading true', () => {
    const action = { type: fetchProgress.pending.type };
    const state = progressReducer(makeInitial(), action);
    expect(state.loading).toBe(true);
  });
});

describe('fetchProgress.rejected', () => {
  it('sets error message', () => {
    const action = {
      type: fetchProgress.rejected.type,
      error: { message: 'Network error' },
    };
    const state = progressReducer(makeInitial(), action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Network error');
  });
});

describe('saveSolution.fulfilled', () => {
  it('stores saved solution', () => {
    const action = {
      type: saveSolution.fulfilled.type,
      payload: { exerciseId: 42, code: 'function greet() {}' },
    };
    const state = progressReducer(makeInitial(), action);
    expect(state.savedSolutions['42']).toBe('function greet() {}');
    expect(state.lastUpdated).toBeTruthy();
  });
});

describe('markComplete.fulfilled', () => {
  it('stores completion record', () => {
    const action = {
      type: markComplete.fulfilled.type,
      payload: { exerciseId: 7, attempts: 2, completedAt: '2024-06-15T12:00:00Z' },
    };
    const state = progressReducer(makeInitial(), action);
    expect(state.completedExercises['7']).toEqual({
      completedAt: '2024-06-15T12:00:00Z',
      attempts: 2,
    });
    expect(state.lastUpdated).toBeTruthy();
  });
});

describe('incrementAttempt.fulfilled', () => {
  it('increments attempt counter from zero', () => {
    const action = { type: incrementAttempt.fulfilled.type, payload: 10 };
    const state = progressReducer(makeInitial(), action);
    expect(state.attempts['10']).toBe(1);
  });

  it('increments from existing count', () => {
    const initial = makeInitial({ attempts: { '10': 3 } });
    const action = { type: incrementAttempt.fulfilled.type, payload: 10 };
    const state = progressReducer(initial, action);
    expect(state.attempts['10']).toBe(4);
  });
});

describe('resetExercise.fulfilled', () => {
  it('clears all 5 maps for the exercise', () => {
    const initial = makeInitial({
      completedExercises: { '1': { completedAt: '2024-01-01', attempts: 3 } },
      savedSolutions: { '1': 'code' },
      attempts: { '1': 5 },
      uniqueAttempts: { '1': 4 },
      failedCodeHashes: { '1': ['abc', 'def'] },
    });
    const action = { type: resetExercise.fulfilled.type, payload: 1 };
    const state = progressReducer(initial, action);
    expect(state.completedExercises['1']).toBeUndefined();
    expect(state.savedSolutions['1']).toBeUndefined();
    expect(state.attempts['1']).toBeUndefined();
    expect(state.uniqueAttempts['1']).toBeUndefined();
    expect(state.failedCodeHashes['1']).toBeUndefined();
    expect(state.lastUpdated).toBeTruthy();
  });

  it('does not affect other exercises', () => {
    const initial = makeInitial({
      completedExercises: {
        '1': { completedAt: '2024-01-01', attempts: 3 },
        '2': { completedAt: '2024-02-01', attempts: 1 },
      },
      savedSolutions: { '1': 'code1', '2': 'code2' },
    });
    const action = { type: resetExercise.fulfilled.type, payload: 1 };
    const state = progressReducer(initial, action);
    expect(state.completedExercises['2']).toBeTruthy();
    expect(state.savedSolutions['2']).toBe('code2');
  });
});

// ─── Selectors ──────────────────────────────────────────────────────────────────

describe('selectors', () => {
  const stateWith = (overrides: Partial<ProgressState>) => ({
    progress: makeInitial(overrides),
  });

  it('selectIsComplete returns true when exercise is completed', () => {
    const state = stateWith({
      completedExercises: { '1': { completedAt: '2024-01-01', attempts: 1 } },
    });
    expect(selectIsComplete(1)(state)).toBe(true);
  });

  it('selectIsComplete returns false when exercise is not completed', () => {
    expect(selectIsComplete(99)(stateWith({}))).toBe(false);
  });

  it('selectUniqueAttempts returns count', () => {
    const state = stateWith({ uniqueAttempts: { '5': 7 } });
    expect(selectUniqueAttempts(5)(state)).toBe(7);
  });

  it('selectUniqueAttempts returns 0 for unknown exercise', () => {
    expect(selectUniqueAttempts(99)(stateWith({}))).toBe(0);
  });

  it('selectAttempts returns count', () => {
    const state = stateWith({ attempts: { '3': 4 } });
    expect(selectAttempts(3)(state)).toBe(4);
  });

  it('selectSavedSolution returns saved code', () => {
    const state = stateWith({ savedSolutions: { '1': 'function foo() {}' } });
    expect(selectSavedSolution(1)(state)).toBe('function foo() {}');
  });

  it('selectSavedSolution returns null for unsaved exercise', () => {
    expect(selectSavedSolution(99)(stateWith({}))).toBeNull();
  });

  it('selectCompletedCount returns count of completed exercises', () => {
    const state = stateWith({
      completedExercises: {
        '1': { completedAt: '2024-01-01', attempts: 1 },
        '2': { completedAt: '2024-01-02', attempts: 2 },
      },
    });
    expect(selectCompletedCount(state)).toBe(2);
  });

  it('selectIsDuplicateCode detects duplicate', () => {
    const code = 'function test() {}';
    const hash = hashCode(code.trim());
    const state = stateWith({ failedCodeHashes: { '1': [hash] } });
    expect(selectIsDuplicateCode(1, code)(state)).toBe(true);
  });

  it('selectIsDuplicateCode returns false for new code', () => {
    const state = stateWith({ failedCodeHashes: { '1': ['oldhash'] } });
    expect(selectIsDuplicateCode(1, 'brand new code')(state)).toBe(false);
  });

  it('selectIsDuplicateCode returns false when no hashes exist', () => {
    expect(selectIsDuplicateCode(1, 'anything')(stateWith({}))).toBe(false);
  });
});
